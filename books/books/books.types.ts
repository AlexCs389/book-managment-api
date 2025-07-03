export interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
}

export interface CreateBookPayload {
  title: string;
  author: string;
  price: number;
}

export interface UpdateBookPayload {
  title: string;
  author: string;
  price: number;
}
