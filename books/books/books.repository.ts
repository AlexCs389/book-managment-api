import db from '@/db';
import { booksTable } from '@/db/schema';
import { Book, CreateBookPayload } from './books.types';

export function createBookRepository() {
  const create = async (data: CreateBookPayload): Promise<Book> => {
    const bookPayload: typeof booksTable.$inferInsert = {
      title: data.title,
      author: data.author,
      price: data.price.toString(),
    };
    const [book] = await db.insert(booksTable).values(bookPayload).returning();
    return await Promise.resolve({
      ...book,
      price: Number(book.price),
    });
  }

  return {
    create,
  };
};

export const bookRepository = createBookRepository()
