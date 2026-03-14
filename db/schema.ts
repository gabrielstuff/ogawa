import { integer, text, sqliteTable } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

export const settings = sqliteTable('settings', {
  id: integer('id').primaryKey(),
  key: text('key').notNull().unique(),
  value: text('value').notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
})

export const tags = sqliteTable('tags', {
  id: integer('id').primaryKey(),
  name: text('name').notNull().unique(),
  color: text('color').default('#6366f1'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
})

export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey(),
  name: text('name').notNull().unique(),
  downloadPath: text('download_path'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
})

export const feeds = sqliteTable('feeds', {
  id: integer('id').primaryKey(),
  url: text('url').notNull().unique(),
  title: text('title'),
  lastUpdated: integer('last_updated', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
})

export const feedItems = sqliteTable('feed_items', {
  id: integer('id').primaryKey(),
  feedId: integer('feed_id').references(() => feeds.id),
  guid: text('guid'),
  title: text('title'),
  link: text('link'),
  pubDate: integer('pub_date', { mode: 'timestamp' }),
  torrentUrl: text('torrent_url'),
  downloaded: integer('downloaded', { mode: 'boolean' }).default(false),
})

export const torrentTags = sqliteTable('torrent_tags', {
  id: integer('id').primaryKey(),
  torrentHash: text('torrent_hash').notNull(),
  tagId: integer('tag_id').references(() => tags.id),
})

export type Settings = typeof settings.$inferSelect
export type Tag = typeof tags.$inferSelect
export type Category = typeof categories.$inferSelect
export type Feed = typeof feeds.$inferSelect
export type FeedItem = typeof feedItems.$inferSelect
