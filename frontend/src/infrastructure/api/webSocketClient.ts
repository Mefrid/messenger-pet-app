import {
  WebSocketIncomingType,
  type IWebSocketClient,
  type WebSocketIncomingTypesPayload,
  type WebSocketOutgoingType,
  type WebSocketOutgoingTypesPayload,
} from '@/application/ports/webSocketClient'
import { useUsersStore } from '../storages/useUsersStore'
import { useChatMessagesStore } from '../storages/useChatMessagesStore'
import { createChatMessage } from '@/domain/chatMessage'
import { playNotificationSound } from '../shared/utils/playNotificationSound'
import { useChatsStore } from '../storages/useChatsStore'

type WebSocketSubscribersStore = Partial<{
  [T in WebSocketIncomingType]: ((payload: WebSocketIncomingTypesPayload[T]) => void)[]
}>

class WebSocketClient implements IWebSocketClient {
  private webSocket: WebSocket | undefined
  private subscribersStore: WebSocketSubscribersStore = {}
  private isConnecting = false

  connect(accessToken: string) {
    if (this.isConnecting) {
      return
    }

    this.isConnecting = true
    this.close()
    this.webSocket = new WebSocket(`ws://${import.meta.env.VITE_HOST}/?token=${accessToken}`)

    this.webSocket.addEventListener('open', () => {
      console.log('Connected to server')
      this.isConnecting = false
    })

    this.webSocket.addEventListener('close', (closeEvent) => {
      if (closeEvent.reason === 'Unauthorized') {
        console.error('Cant authorize to websocket server', closeEvent)
      } else {
        console.log('Disconnected from server', closeEvent)
      }
      this.isConnecting = false
    })

    this.webSocket.addEventListener('error', (error) => {
      console.log('Websocket error: ', error)
    })

    this.webSocket.addEventListener('message', (event) => {
      this.handleIncomingEvent(event)
    })
  }

  isConnected() {
    return !!this.webSocket && this.webSocket.readyState === WebSocket.OPEN
  }

  close() {
    this.webSocket?.close()
  }

  subscribe<T extends WebSocketIncomingType>(
    event: T,
    handler: (payload: WebSocketIncomingTypesPayload[T]) => void,
  ) {
    if (!this.subscribersStore[event]) {
      this.subscribersStore[event] = []
    }
    this.subscribersStore[event].push(handler)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleIncomingEvent(event: any) {
    const data = JSON.parse(event.data)
    if (!data['type']) {
      console.error('Type must be specified in WebSocket event')
      return
    }

    const type = data['type'] as WebSocketIncomingType
    const payload = data['payload']
    const subscribers = this.subscribersStore[type]

    if (!subscribers) {
      console.warn(`No subscribers were found for message of type "${type}"`)
      return
    }

    for (const handler of subscribers) {
      handler(payload)
    }
  }

  sendMessage<T extends WebSocketOutgoingType>(type: T, payload: WebSocketOutgoingTypesPayload[T]) {
    this.webSocket?.send(
      JSON.stringify({
        type,
        payload,
      }),
    )
  }
}

export const wsc = new WebSocketClient()

wsc.subscribe(WebSocketIncomingType.ReceivedChatMessage, (payload) => {
  const usersStore = useUsersStore()
  const chatMessagesStore = useChatMessagesStore()

  const { chatMessage: chatMessageDetailed } = payload

  const chatMessage = createChatMessage(
    chatMessageDetailed.id,
    chatMessageDetailed.chatId,
    chatMessageDetailed.sender.id,
    new Date(chatMessageDetailed.timestamp),
    chatMessageDetailed.textContent,
  )

  usersStore.addUser(chatMessageDetailed.sender)
  chatMessagesStore.addMessageToChat(chatMessage.chatId, chatMessage)
  playNotificationSound()
})

wsc.subscribe(WebSocketIncomingType.UserPresenceChanged, (payload) => {
  const usersStore = useUsersStore()

  const { userId, status } = payload

  const user = usersStore.getUser(userId)
  if (!user) {
    return
  }

  usersStore.updateUser(userId, {
    ...user,
    online: status === 'online',
  })
})

const handleTyping = (payload: { userId: string; chatId: string }, typing: boolean) => {
  const chatsStore = useChatsStore()

  const { userId, chatId } = payload

  chatsStore.updateTyping(userId, chatId, typing)
}

wsc.subscribe(WebSocketIncomingType.StartTyping, (payload) => handleTyping(payload, true))
wsc.subscribe(WebSocketIncomingType.StoppedTyping, (payload) => handleTyping(payload, false))
