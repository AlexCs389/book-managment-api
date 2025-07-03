import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getBooks, createBook, updateBook, deleteBook } from './books.controller';
import { bookRepository } from './books.repository';
import { Book, CreateBookPayload, UpdateBookPayload } from './books.types';
import { APIError } from 'encore.dev/api';

vi.mock('./books.repository', () => ({
  bookRepository: {
    all: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    destroy: vi.fn(),
  },
}));

const mockBookRepository = vi.mocked(bookRepository);

describe('Books Controller', () => {
  const mockBook: Book = {
    id: 1,
    title: 'El Señor de los Anillos',
    author: 'J.R.R. Tolkien',
    price: 29.99,
  };

  const mockCreatePayload: CreateBookPayload = {
    title: 'El Hobbit',
    author: 'J.R.R. Tolkien',
    price: 19.99,
  };

  const mockUpdatePayload: UpdateBookPayload = {
    title: 'El Hobbit - Edición Especial',
    author: 'J.R.R. Tolkien',
    price: 24.99,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('getBooks', () => {
    it('debería retornar una lista de libros', async () => {
      const mockBooks = [mockBook, { ...mockBook, id: 2, title: 'El Hobbit' }];
      mockBookRepository.all.mockResolvedValue(mockBooks);

      const result = await getBooks();

      expect(mockBookRepository.all).toHaveBeenCalledOnce();
      expect(result).toEqual({ books: mockBooks });
    });

    it('debería retornar una lista vacía cuando no hay libros', async () => {
      mockBookRepository.all.mockResolvedValue([]);

      const result = await getBooks();

      expect(mockBookRepository.all).toHaveBeenCalledOnce();
      expect(result).toEqual({ books: [] });
    });

    it('debería propagar errores del repositorio', async () => {
      const error = new Error('Error de base de datos');
      mockBookRepository.all.mockRejectedValue(error);

      await expect(getBooks()).rejects.toThrow('Error de base de datos');
      expect(mockBookRepository.all).toHaveBeenCalledOnce();
    });
  });

  describe('createBook', () => {
    it('debería crear un libro exitosamente', async () => {
      const newBook: Book = { ...mockBook, ...mockCreatePayload };
      mockBookRepository.create.mockResolvedValue(newBook);

      const result = await createBook(mockCreatePayload);

      expect(mockBookRepository.create).toHaveBeenCalledWith(mockCreatePayload);
      expect(result).toEqual(newBook);
    });

    it('debería propagar errores del repositorio', async () => {
      const error = new Error('Error al crear libro');
      mockBookRepository.create.mockRejectedValue(error);

      await expect(createBook(mockCreatePayload)).rejects.toThrow('Error al crear libro');
      expect(mockBookRepository.create).toHaveBeenCalledWith(mockCreatePayload);
    });

    it('debería validar que se pasen todos los campos requeridos', async () => {
      const incompletePayload = { title: 'Libro sin autor' } as CreateBookPayload;

      mockBookRepository.create.mockRejectedValue(new Error('Campos requeridos faltantes'));

      await expect(createBook(incompletePayload)).rejects.toThrow('Campos requeridos faltantes');
    });
  });

  describe('updateBook', () => {
    it('debería actualizar un libro exitosamente', async () => {
      const updatedBook: Book = { ...mockBook, ...mockUpdatePayload };
      mockBookRepository.update.mockResolvedValue(updatedBook);

      const result = await updateBook({ id: 1, ...mockUpdatePayload });

      expect(mockBookRepository.update).toHaveBeenCalledWith(1, mockUpdatePayload);
      expect(result).toEqual(updatedBook);
    });

    it('debería propagar errores del repositorio', async () => {
      const error = new Error('Error al actualizar libro');
      mockBookRepository.update.mockRejectedValue(error);

      await expect(updateBook({ id: 1, ...mockUpdatePayload })).rejects.toThrow('Error al actualizar libro');
      expect(mockBookRepository.update).toHaveBeenCalledWith(1, mockUpdatePayload);
    });

    it('debería manejar el caso cuando el libro no existe', async () => {
      const notFoundError = APIError.notFound('Book not found');
      mockBookRepository.update.mockRejectedValue(notFoundError);

      await expect(updateBook({ id: 999, ...mockUpdatePayload })).rejects.toThrow();
      expect(mockBookRepository.update).toHaveBeenCalledWith(999, mockUpdatePayload);
    });
  });

  describe('deleteBook', () => {
    it('debería eliminar un libro exitosamente', async () => {
      mockBookRepository.destroy.mockResolvedValue(undefined);

      const result = await deleteBook({ id: 1 });

      expect(mockBookRepository.destroy).toHaveBeenCalledWith(1);
      expect(result).toBeUndefined();
    });

    it('debería propagar errores del repositorio', async () => {
      const error = new Error('Error al eliminar libro');
      mockBookRepository.destroy.mockRejectedValue(error);

      await expect(deleteBook({ id: 1 })).rejects.toThrow('Error al eliminar libro');
      expect(mockBookRepository.destroy).toHaveBeenCalledWith(1);
    });

    it('debería manejar el caso cuando el libro no existe', async () => {
      const notFoundError = APIError.notFound('Book not found');
      mockBookRepository.destroy.mockRejectedValue(notFoundError);

      await expect(deleteBook({ id: 999 })).rejects.toThrow();
      expect(mockBookRepository.destroy).toHaveBeenCalledWith(999);
    });
  });
});
