import { api } from 'encore.dev/api';
import { Book, CreateBookPayload } from './books.types';
import { bookRepository } from './books.repository';

export const createBook = api(
  { expose: true, method: 'POST', path: '/books' },
  async (params: CreateBookPayload): Promise<Book> => {
    return bookRepository.create(params);
  },
);
