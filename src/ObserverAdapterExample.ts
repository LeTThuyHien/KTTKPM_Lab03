// Observer and Adapter examples combined

// Observer (Stock / Investor)
interface Observer<T = any> {
  update(subject: T): void;
}

interface Subject<T = any> {
  attach(o: Observer<T>): void;
  detach(o: Observer<T>): void;
  notify(): void;
}

class Stock implements Subject<Stock> {
  private observers: Observer<Stock>[] = [];
  constructor(public symbol: string, private _price: number) {}

  get price() { return this._price; }
  set price(p: number) {
    this._price = p;
    this.notify();
  }

  attach(o: Observer<Stock>) { this.observers.push(o); }
  detach(o: Observer<Stock>) { this.observers = this.observers.filter(x => x !== o); }
  notify() { this.observers.forEach(o => o.update(this)); }
}

class Investor implements Observer<Stock> {
  constructor(private name: string) {}
  update(subject: Stock) {
    console.log(`${this.name} nhận thông báo: ${subject.symbol} = ${subject.price}`);
  }
}

// Observer (Task / TeamMember)
class Task implements Subject<Task> {
  private observers: Observer<Task>[] = [];
  constructor(public id: string, private _state: string) {}

  get state() { return this._state; }
  set state(s: string) {
    this._state = s;
    this.notify();
  }

  attach(o: Observer<Task>) { this.observers.push(o); }
  detach(o: Observer<Task>) { this.observers = this.observers.filter(x => x !== o); }
  notify() { this.observers.forEach(o => o.update(this)); }
}

class TeamMember implements Observer<Task> {
  constructor(private name: string) {}
  update(task: Task) {
    console.log(`${this.name} nhận cập nhật: Task ${task.id} trạng thái = ${task.state}`);
  }
}

// Adapter (XML <-> JSON)
class XmlProvider {
  constructor(private xml: string) {}
  getXml() { return this.xml; }
}

interface JsonService {
  sendJson(data: any): void;
}

class XmlToJsonAdapter implements JsonService {
  constructor(private provider: XmlProvider) {}
  sendJson(_data: any): void {
    const xml = this.provider.getXml();
    const obj = XmlToJsonAdapter.simpleXmlToObj(xml);
    console.log('Adapter gửi JSON:', JSON.stringify(obj));
  }
  static simpleXmlToObj(xml: string): any {
    // Rất đơn giản cho ví dụ: giả sử format: <root><k>v</k></root>
    const res: any = {};
    const tagRe = /<([^>]+)>([^<]*)<\/\1>/g;
    let m;
    while ((m = tagRe.exec(xml)) !== null) {
      res[m[1]] = m[2];
    }
    return res;
  }
}

// Test
// Stock
const s = new Stock('ABC', 100);
const inv1 = new Investor('Anna');
const inv2 = new Investor('Bob');
s.attach(inv1); s.attach(inv2);
s.price = 110;

// Task
const t = new Task('T1', 'Open');
const tm1 = new TeamMember('Lan');
const tm2 = new TeamMember('Minh');
t.attach(tm1); t.attach(tm2);
t.state = 'In Progress';

// Adapter
const xml = '<root><name>John</name><age>30</age></root>';
const provider = new XmlProvider(xml);
const adapter = new XmlToJsonAdapter(provider);
adapter.sendJson(null);
