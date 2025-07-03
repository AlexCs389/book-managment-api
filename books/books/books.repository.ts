import { eq } from 'drizzle-orm';
import { APIError, ErrCode } from 'encore.dev/api';
import db from '@/db';
import { booksTable } from '@/db/schema';
import { Book, CreateBookPayload, UpdateBookPayload } from './books.types';

export function createBookRepository() {
  const all = async (): Promise<Book[]> => {
    try {
      const books = await db.select().from(booksTable);
      return books.map((book) => ({
        ...book,
        price: Number(book.price),
      }));
    } catch (error) {
      const e = error as Error;
      throw APIError.internal(e.message);
    }
  }

  const find = async (id: number): Promise<Book> => {
    try {
      const [book] = await db
      .select()
      .from(booksTable)
      .where(eq(booksTable.id, id))
      .limit(1);

      if (!book) {
        throw APIError.notFound('Book not found');
      }

      return {
        ...book,
        price: Number(book.price),
      };
    } catch (error) {
      const e = error as Error;
      throw APIError.internal(e.message);
    }
  }

  const create = async ({ title, author, price }: CreateBookPayload): Promise<Book> => {
    try {
      const [book] = await db
      .insert(booksTable)
      .values({ title, author, price: price.toString() })
      .returning();

      return await Promise.resolve({
        ...book,
        price: Number(book.price),
      });
    } catch (error) {
      const e = error as Error;
      throw APIError.internal(e.message);
    }
  }

  const update = async (id: number, { title, author, price }: UpdateBookPayload): Promise<Book> => {
    try {
      await find(id);

      const [book] = await db
        .update(booksTable)
        .set({ title, author, price: price.toString() })
        .where(eq(booksTable.id, id))
        .returning();

      return await Promise.resolve({
        ...book,
        price: Number(book.price),
      });
    } catch (error) {
      const e = error as Error;
      throw APIError.internal(e.message);
    }
  }

  const destroy = async (id: number): Promise<void> => {
    try {
      await find(id);
      await db.delete(booksTable).where(eq(booksTable.id, id));
    } catch (error) {
      const e = error as Error;
      throw APIError.internal(e.message);
    }
  }

  return {
    all,
    find,
    create,
    update,
    destroy,
  };
};

export const bookRepository = createBookRepository()
