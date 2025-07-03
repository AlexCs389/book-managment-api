import { numeric, pgTable, serial, text } from 'drizzle-orm/pg-core';

export const booksTable = pgTable('books', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  author: text('author').notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
});
