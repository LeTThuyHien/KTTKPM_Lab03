// Singleton Pattern: Library singleton managing books

export type Genre = 'Fiction' | 'Non-Fiction' | 'Science' | 'History' | 'Fantasy' | 'Other';

export class Book {
  constructor(
    public id: string,
    public title: string,
    public author: string,
    public genre: Genre,
    public available: boolean = true
  ) {}
}

export class Library {
  private static instance: Library | null = null;
  private books: Map<string, Book> = new Map();

  // Private constructor prevents direct instantiation
  private constructor() {}

  // Global access point to the single instance
  static getInstance(): Library {
    if (!Library.instance) {
      Library.instance = new Library();
    }
    return Library.instance;
  }

  // Add a new book to the library
  addBook(book: Book): void {
    if (this.books.has(book.id)) {
      // Book already exists — ignore or handle as needed
      return;
    }
    this.books.set(book.id, book);
  }

  // Remove a book from the library
  removeBook(id: string): boolean {
    return this.books.delete(id);
  }

  // List available (not borrowed) books
  listAvailable(): Book[] {
    return Array.from(this.books.values()).filter(b => b.available);
  }

  // Return all books
  getAllBooks(): Book[] {
    return Array.from(this.books.values());
  }

  // Find by id
  findById(id: string): Book | undefined {
    return this.books.get(id);
  }

  // Borrow a book (mark unavailable)
  borrow(id: string): boolean {
    const b = this.books.get(id);
    if (!b || !b.available) return false;
    b.available = false;
    return true;
  }

  // Return a borrowed book (mark available)
  returnBook(id: string): boolean {
    const b = this.books.get(id);
    if (!b || b.available) return false;
    b.available = true;
    return true;
  }
}
