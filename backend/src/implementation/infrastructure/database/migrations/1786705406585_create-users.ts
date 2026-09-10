import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('users', {
    id: {
      type: 'uuid',
      primaryKey: true,
      notNull: true,
      default: pgm.func('gen_random_uuid()'),
    },

    login: {
      type: 'text',
      notNull: true,
      unique: true,
    },

    name: {
      type: 'text',
      notNull: true,
    },

    surname: {
      type: 'text',
      notNull: true,
    },

    birth_date: {
      type: 'date',
    },

    avatar_url: {
      type: 'text',
      notNull: true,
    },

    password_hash: {
      type: 'text',
      notNull: true,
    },

    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  })
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('users')
}
