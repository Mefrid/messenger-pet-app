import type { IChatDAO } from '../../application/ports/chatDAO.ts'
import type { IUserDAO } from '../../application/ports/userDAO.ts'
import { Chat, type ChatDetailedDTO, type ChatListDTO } from '../../domain/chat.ts'
import { type ChatMessageCreationDTO, ChatMessage } from '../../domain/chatMessage.ts'
import { ChatParticipant } from '../../domain/chatParticipant.ts'
import type { User, UserDTO } from '../../domain/user.ts'
import { pool } from '../infrastructure/database/db.ts'

export class ChatPostgresDAO implements IChatDAO {
  constructor(private readonly userDAO: IUserDAO) {}

  async createChat(
    currentUserId: User['id'],
    otherParticipantIds: User['id'][],
    type: Chat['type'],
  ): Promise<ChatDetailedDTO> {
    const client = await pool.connect()
    try {
      await client.query('BEGIN')
      const chatCreationResult = await client.query(
        `
              INSERT INTO chats (type)
              VALUES ($1)
              RETURNING id
            `,
        [type],
      )
      const chatId = chatCreationResult.rows[0].id as string

      const participantsValues: unknown[] = []
      const placeholders = [currentUserId, ...otherParticipantIds].map((participantId, index) => {
        const offset = index * 2

        participantsValues.push(chatId, participantId)

        return `($${offset + 1}, $${offset + 2})`
      })
      await client.query(
        `
              INSERT INTO chat_participants (chat_id, user_id)
              VALUES ${placeholders}
              RETURNING *
            `,
        participantsValues,
      )
      await client.query('COMMIT')
      client.release()

      const chat = (await this.findChat(chatId)) as ChatDetailedDTO

      return chat
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    }
  }

  async sendMessage(
    currentUserId: User['id'],
    messageDTO: ChatMessageCreationDTO,
    chatId: Chat['id'],
  ): Promise<ChatMessage> {
    const chatCreationResult = await pool.query(
      `
            INSERT INTO chat_messages (sender_id, chat_id, text_content)
            VALUES ($1, $2, $3)
            RETURNING *
          `,
      [currentUserId, chatId, messageDTO.textContent],
    )
    const message = this.mapChatMessage(chatCreationResult.rows[0])
    return message
  }

  async findDirectChatWithUser(
    currentUserId: User['id'],
    userId: User['id'],
  ): Promise<ChatDetailedDTO | null> {
    const chatResult = await pool.query(
      `
      SELECT c.id, c.type, JSON_AGG(u.*) AS participants
      FROM chats c
      JOIN chat_participants cp ON cp.chat_id = c.id
      JOIN users u ON u.id = cp.user_id
      WHERE cp.user_id IN ($1, $2)
      GROUP BY c.id
      HAVING COUNT(DISTINCT cp.user_id) = 2;
      `,
      [currentUserId, userId],
    )

    if (chatResult.rowCount === 0) {
      return null
    }

    const chat = await this.mapChatToDetailedDTO(chatResult.rows[0])
    return chat
  }

  async findChat(chatId: string): Promise<ChatDetailedDTO | null> {
    const chatResult = await pool.query(
      `
      SELECT c.id, c.type, JSON_AGG(u.*) AS participants
      FROM chats c
      JOIN chat_participants cp ON cp.chat_id = c.id
      JOIN users u ON u.id = cp.user_id
      WHERE c.id = $1
      GROUP BY c.id
      `,
      [chatId],
    )
    if (chatResult.rowCount === 0) {
      return null
    }

    const rawChat = chatResult.rows[0]
    const chatDetailedDTO = await this.mapChatToDetailedDTO(rawChat)

    return chatDetailedDTO
  }

  async findCurrentChats(currentUserId: User['id']): Promise<ChatListDTO[]> {
    const chatResult = await pool.query(
      `
      SELECT
        c.id,
        c.type,
        JSON_AGG(u.*) AS participants,
        lm.last_message
      FROM chats c

      JOIN chat_participants current_cp
        ON current_cp.chat_id = c.id AND current_cp.user_id = $1

      JOIN chat_participants cp
        ON cp.chat_id = c.id

      JOIN users u
        ON u.id = cp.user_id

      LEFT JOIN LATERAL (
        SELECT JSONB_BUILD_OBJECT(
          'id', cm.id,
          'sender_id', cm.sender_id,
          'chat_id', cm.chat_id,
          'timestamp', cm.timestamp,
          'text_content', cm.text_content
        ) AS last_message,
        cm.timestamp AS last_message_timestamp
        FROM chat_messages cm
        WHERE cm.chat_id = c.id
        ORDER BY cm.timestamp DESC
        LIMIT 1
      ) lm ON true

      GROUP BY
        c.id,
        c.type,
        lm.last_message,
		    last_message_timestamp

      ORDER BY lm.last_message_timestamp DESC NULLS LAST
      `,
      [currentUserId],
    )
    const chatsRaw = chatResult.rows
    const chats = this.mapChatToListDTO(chatsRaw)

    return chats
  }

  async getMessagesInChat(chatId: Chat['id']): Promise<ChatMessage[]> {
    const messagesResult = await pool.query(
      `
      SELECT * FROM chat_messages
      WHERE chat_id = $1
      ORDER BY timestamp DESC
      `,
      [chatId],
    )
    const messages = messagesResult.rows.map((rawMessage) => this.mapChatMessage(rawMessage))
    return messages
  }

  async findAllInterlocutors(userId: string): Promise<UserDTO[]> {
    const interlocutorsResult = await pool.query(
      `
      SELECT DISTINCT u.* from users u
      JOIN chat_participants cp on cp.user_id = u.id
      JOIN chat_participants current_cp on current_cp.chat_id = cp.chat_id
      WHERE current_cp.user_id = $1 AND u.id != $1
      `,
      [userId],
    )
    const interlocutors = interlocutorsResult.rows.map((interlocutorRaw) =>
      this.userDAO.mapToDTO(this.userDAO.mapUser(interlocutorRaw)),
    )
    return interlocutors
  }

  mapChat(rawChat: any, chatParticipants: ChatParticipant[]): Chat {
    return new Chat(rawChat.id, rawChat.type, chatParticipants)
  }

  mapChatToDetailedDTO(rawChat: any): ChatDetailedDTO {
    return {
      id: rawChat['id'],
      type: rawChat['type'],
      participants: rawChat['participants'].map((participant: any) =>
        this.userDAO.mapToDTO(this.userDAO.mapUser(participant)),
      ),
    }
  }

  mapChatToListDTO(rawChats: Array<any>): ChatListDTO[] {
    return rawChats.map((rawChat) => ({
      id: rawChat['id'],
      type: rawChat['type'],
      participants: rawChat['participants'].map((participantRaw: any) =>
        this.userDAO.mapToDTO(this.userDAO.mapUser(participantRaw)),
      ),
      ...(rawChat['last_message'] && {
        lastMessage: this.mapChatMessage(rawChat['last_message']),
      }),
    }))
  }

  mapChatParticipant(rawChatParticipant: any): ChatParticipant {
    return new ChatParticipant(rawChatParticipant.user_id, rawChatParticipant.joined)
  }

  mapChatMessage(rawChatMessage: any): ChatMessage {
    return new ChatMessage(
      rawChatMessage.id,
      rawChatMessage.sender_id,
      rawChatMessage.chat_id,
      rawChatMessage.timestamp,
      rawChatMessage.text_content,
    )
  }
}
