// Library system combining Singleton, Factory Method, Strategy, Observer, Decorator patterns

type Genre = 'Fiction' | 'Non-Fiction' | 'Science' | 'History' | 'Fantasy' | 'Other';

// ===== Book hierarchy (Factory Method will create these) =====
abstract class BookItem {
  constructor(
    public id: string,
    public title: string,
    public author: string,
    public genre: Genre,
    public available: boolean = true
  ) {}
}

class PaperBook extends BookItem {
  constructor(id: string, title: string, author: string, genre: Genre, public pages: number) {
    super(id, title, author, genre);
  }
}

class EBook extends BookItem {
  constructor(id: string, title: string, author: string, genre: Genre, public fileSizeMB: number) {
    super(id, title, author, genre);
  }
}

class AudioBook extends BookItem {
  constructor(id: string, title: string, author: string, genre: Genre, public lengthMin: number) {
    super(id, title, author, genre);
  }
}

// ===== Factory Method =====
interface IBookFactory {
  create(type: 'paper' | 'ebook' | 'audio', id: string, title: string, author: string, genre: Genre, extra: number): BookItem;
}

class BookFactory implements IBookFactory {
  create(type: 'paper' | 'ebook' | 'audio', id: string, title: string, author: string, genre: Genre, extra: number): BookItem {
    switch (type) {
      case 'paper': return new PaperBook(id, title, author, genre, Math.floor(extra));
      case 'ebook': return new EBook(id, title, author, genre, extra);
      case 'audio': return new AudioBook(id, title, author, genre, Math.floor(extra));
      default: throw new Error('Unknown book type');
    }
  }
}

// ===== Strategy Pattern for searching =====
interface SearchStrategy {
  search(catalog: BookItem[], query: string): BookItem[];
}

class SearchByTitle implements SearchStrategy {
  search(catalog: BookItem[], query: string) {
    return catalog.filter(b => b.title.toLowerCase().includes(query.toLowerCase()));
  }
}

class SearchByAuthor implements SearchStrategy {
  search(catalog: BookItem[], query: string) {
    return catalog.filter(b => b.author.toLowerCase().includes(query.toLowerCase()));
  }
}

class SearchByGenre implements SearchStrategy {
  search(catalog: BookItem[], query: string) {
    return catalog.filter(b => b.genre.toLowerCase().includes(query.toLowerCase()));
  }
}

// ===== Observer Pattern for notifications =====
interface Subscriber {
  update(event: string, book?: BookItem): void;
}

class UserSubscriber implements Subscriber {
  constructor(private name: string) {}
  update(event: string, book?: BookItem) {
    const b = book ? `${book.title} (${book.id})` : '';
    console.log(`[Notify] ${this.name} received ${event} ${b}`);
  }
}

class StaffSubscriber implements Subscriber {
  constructor(private name: string) {}
  update(event: string, book?: BookItem) {
    const b = book ? `${book.title} (${book.id})` : '';
    console.log(`[StaffNotify] ${this.name} received ${event} ${b}`);
  }
}

// ===== Library Singleton that composes everything =====
class LibrarySystem {
  private static instance: LibrarySystem | null = null;
  private books: Map<string, BookItem> = new Map();
  private subscribers: Subscriber[] = [];

  // optional: default search strategy
  private defaultSearchStrategy: SearchStrategy = new SearchByTitle();

  private constructor() {}

  static getInstance(): LibrarySystem {
    if (!LibrarySystem.instance) LibrarySystem.instance = new LibrarySystem();
    return LibrarySystem.instance;
  }

  // Observer methods
  attach(sub: Subscriber) { this.subscribers.push(sub); }
  detach(sub: Subscriber) { this.subscribers = this.subscribers.filter(s => s !== sub); }
  private notify(event: string, book?: BookItem) { this.subscribers.forEach(s => s.update(event, book)); }

  // Book management
  addBook(book: BookItem) {
    if (this.books.has(book.id)) return;
    this.books.set(book.id, book);
    this.notify('new_book', book);
  }

  removeBook(id: string) { this.books.delete(id); }

  listAvailable(): BookItem[] { return Array.from(this.books.values()).filter(b => b.available); }

  getAllBooks(): BookItem[] { return Array.from(this.books.values()); }

  findById(id: string): BookItem | undefined { return this.books.get(id); }

  borrow(id: string): boolean {
    const b = this.books.get(id);
    if (!b || !b.available) return false;
    b.available = false;
    this.notify('borrowed', b);
    return true;
  }

  returnBook(id: string): boolean {
    const b = this.books.get(id);
    if (!b || b.available) return false;
    b.available = true;
    this.notify('returned', b);
    return true;
  }

  // Search using a strategy (if none provided, use default)
  search(query: string, strategy?: SearchStrategy): BookItem[] {
    const strat = strategy || this.defaultSearchStrategy;
    return strat.search(this.getAllBooks(), query);
  }
}

// ===== Decorator Pattern for Loan features =====
interface Loan {
  borrow(): boolean;
  return(): boolean;
}

class BasicLoan implements Loan {
  constructor(private lib: LibrarySystem, private bookId: string) {}
  borrow(): boolean { return this.lib.borrow(this.bookId); }
  return(): boolean { return this.lib.returnBook(this.bookId); }
}

abstract class LoanDecorator implements Loan {
  constructor(protected wrappee: Loan) {}
  borrow(): boolean { return this.wrappee.borrow(); }
  return(): boolean { return this.wrappee.return(); }
}

class ExtendLoanDecorator extends LoanDecorator {
  constructor(wrappee: Loan, private extraDays: number) { super(wrappee); }
  borrow(): boolean {
    console.log(`Applying extend loan: +${this.extraDays} days`);
    return super.borrow();
  }
}

class SpecialEditionDecorator extends LoanDecorator {
  constructor(wrappee: Loan, private note: string) { super(wrappee); }
  borrow(): boolean {
    console.log(`Requesting special edition: ${this.note}`);
    return super.borrow();
  }
}

// ===== Example usage (demo) =====
// This demo can be run with: npx ts-node src/LibrarySystem.ts
if (require && require.main === module) {
  const factory = new BookFactory();
  const lib = LibrarySystem.getInstance();

  // subscribers
  const userA = new UserSubscriber('User A');
  const staff1 = new StaffSubscriber('Staff 1');
  lib.attach(userA);
  lib.attach(staff1);

  // create books by factory
  const p = factory.create('paper', 'P100', 'The Hobbit', 'J.R.R. Tolkien', 'Fantasy', 310);
  const e = factory.create('ebook', 'E100', 'A Brief History of Time', 'Stephen Hawking', 'Science', 4.8);
  const a = factory.create('audio', 'A100', 'Sapiens', 'Yuval Noah Harari', 'History', 720);

  lib.addBook(p);
  lib.addBook(e);
  lib.addBook(a);

  console.log('\nAvailable books:', lib.listAvailable().map(b => `${b.title} [${b.id}]`));

  // search strategies
  console.log('\nSearch by author "Tolkien":', lib.search('Tolkien', new SearchByAuthor()).map(b => b.title));
  console.log('Search by genre "Science":', lib.search('Science', new SearchByGenre()).map(b => b.title));

  // borrow with decorator features
  const loan = new BasicLoan(lib, 'P100');
  const extendedLoan = new ExtendLoanDecorator(loan, 7);
  const specialLoan = new SpecialEditionDecorator(extendedLoan, 'large print');

  console.log('\nBorrowing P100 with decorators:');
  specialLoan.borrow();

  console.log('\nAvailable after borrow:', lib.listAvailable().map(b => b.title));

  console.log('\nReturning P100:');
  specialLoan.return();

  console.log('\nAvailable after return:', lib.listAvailable().map(b => b.title));
}
