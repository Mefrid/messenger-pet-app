import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('chat_messages', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },

    sender_id: {
      type: 'uuid',
      notNull: true,
      references: 'users(id)',
      onDelete: 'RESTRICT',
    },

    chat_id: {
      type: 'uuid',
      notNull: true,
      references: 'chats(id)',
      onDelete: 'CASCADE',
    },

    timestamp: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('now()'),
    },

    text_content: {
      type: 'text',
      notNull: true,
    },
  })

  pgm.createIndex('chat_messages', ['chat_id', 'timestamp', 'id'])
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('chat_messages')
}
