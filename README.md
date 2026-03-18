# Hệ thống quản lý thư viện — hướng dẫn và kết quả

Mục tiêu
- Xây dựng ví dụ minh họa các Design Pattern: Singleton, Factory Method, Strategy, Observer, Decorator.
- Cung cấp mã nguồn và demo để chạy từng phần.

Các file chính trong `src/`
- `LibrarySystem.ts` — triển khai tổng hợp: Singleton (LibrarySystem), Factory (BookFactory), Strategy (SearchBy*), Observer (Subscriber), Decorator (Loan + decorators). Có phần demo ở cuối file.
- `LibrarySingleton.ts` — ví dụ riêng về Singleton (Book, Library) — dùng khi cần module đơn giản.
- `CompositePattern.ts` — ví dụ Composite (Folder/File) có test nhỏ.
- `ObserverAdapterExample.ts` — ví dụ Observer (stock, task) và Adapter (XML→JSON) có test.
- `AdapterPattern.puml`, `ObserverPattern.puml` — sơ đồ PlantUML.
- `img/` — một số hình sơ đồ đã xuất.

Chuẩn bị (PowerShell)
1. Mở terminal trong thư mục dự án:
   cd T:\LeThiThuyHien_22708291
2. Cài phụ thuộc dev (nếu chưa cài):
   npm install

Chạy demo (PowerShell)
- Chạy demo thư viện tổng hợp (Singleton + Factory + Strategy + Observer + Decorator):
  npx ts-node src/LibrarySystem.ts

- Chạy demo Observer + Adapter (cổ phiếu, task, chuyển XML→JSON):
  npx ts-node src/ObserverAdapterExample.ts

- Chạy demo Composite pattern:
  npx ts-node src/CompositePattern.ts

Ghi chú build
- Biên dịch TypeScript: npx tsc
- Chạy file đã biên dịch (JS): node dist/YourFile.js

Kết quả mong đợi (tóm tắt)
- `LibrarySystem.ts`:
  - In thông báo khi có sách mới (new_book), khi mượn (borrowed) và trả (returned) — do Observer gửi tới subscribers.
  - Liệt kê sách có sẵn trước và sau khi mượn/trả.
  - Tìm kiếm hoạt động với Strategy (SearchByTitle/Author/Genre).
  - Khi mượn bằng Loan decorator sẽ in thông tin mở rộng (extend/special edition) rồi thực hiện borrow/return.

- `ObserverAdapterExample.ts`:
  - Khi thay đổi `Stock.price` các `Investor` đã đăng ký nhận thông báo.
  - Khi thay đổi `Task.state` các `TeamMember` nhận cập nhật.
  - `XmlToJsonAdapter` chuyển XML đơn giản thành JSON và in ra.

- `CompositePattern.ts`:
  - In cấu trúc thư mục/tập tin theo dạng đệ quy (Folder + File).

