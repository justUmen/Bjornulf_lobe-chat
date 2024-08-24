/* eslint-disable sort-keys-fix/sort-keys-fix  */
import { boolean, integer, pgTable, text, unique, uniqueIndex, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';

import { idGenerator, randomSlug } from '../../utils/idGenerator';
import { createdAt, updatedAt } from './_helpers';
import { users } from './user';

//  ======= sessionGroups ======= //

export const sessionGroups = pgTable(
  'session_groups',
  {
    id: text('id')
      .$defaultFn(() => idGenerator('sessionGroups'))
      .primaryKey(),
    name: text('name').notNull(),
    sort: integer('sort'),

    userId: text('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),

    clientId: text('client_id'),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => ({
    clientIdUnique: unique('session_group_client_id_user_unique').on(table.clientId, table.userId),
  }),
);

export const insertSessionGroupSchema = createInsertSchema(sessionGroups);

export type NewSessionGroup = typeof sessionGroups.$inferInsert;
export type SessionGroupItem = typeof sessionGroups.$inferSelect;

//  ======= sessions ======= //

export const sessions = pgTable(
  'sessions',
  {
    id: text('id')
      .$defaultFn(() => idGenerator('sessions'))
      .primaryKey(),
    slug: varchar('slug', { length: 100 })
      .notNull()
      .$defaultFn(() => randomSlug()),
    title: text('title'),
    description: text('description'),
    avatar: text('avatar'),
    backgroundColor: text('background_color'),

    type: text('type', { enum: ['agent', 'group'] }).default('agent'),

    userId: text('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    groupId: text('group_id').references(() => sessionGroups.id, { onDelete: 'set null' }),
    clientId: text('client_id'),
    pinned: boolean('pinned').default(false),

    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => ({
    slugUserIdUnique: uniqueIndex('slug_user_id_unique').on(t.slug, t.userId),

    clientIdUnique: unique('sessions_client_id_user_id_unique').on(t.clientId, t.userId),
  }),
);

export const insertSessionSchema = createInsertSchema(sessions);
// export const selectSessionSchema = createSelectSchema(sessions);

export type NewSession = typeof sessions.$inferInsert;
export type SessionItem = typeof sessions.$inferSelect;
