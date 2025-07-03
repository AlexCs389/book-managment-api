import { api } from 'encore.dev/api';
import { Book, CreateBookPayload, UpdateBookPayload } from './books.types';
import { bookRepository } from './books.repository';

export const getBooks = api(
  { expose: true, method: 'GET', path: '/books' },
  async (): Promise<{ books: Book[] }> => {
    const books = await bookRepository.all();
    return { books };
  },
);

export const createBook = api(
  { expose: true, method: 'POST', path: '/books' },
  async (params: CreateBookPayload): Promise<Book> => {
    return bookRepository.create(params);
  },
);

export const updateBook = api(
  { expose: true, method: 'PUT', path: '/books/:id' },
  async ({ id, ...params }: UpdateBookPayload & { id: number }): Promise<Book> => {
    return bookRepository.update(id, params);
  },
);

export const deleteBook = api(
  { expose: true, method: 'DELETE', path: '/books/:id' },
  async ({ id }: { id: number }): Promise<void> => {
    return bookRepository.destroy(id);
  },
);
