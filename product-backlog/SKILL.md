---
name: product-backlog
description: "Cổng G2: tách yêu cầu đã duyệt thành User Stories có acceptance criteria, lập ma trận Actor–Story, đề xuất Priority, Story Point và Rank, xuất Product Backlog theo Epic và theo Rank."
hide: true
disable-model-invocation: true
---

# Product backlog (G2 Stories & Backlog)

Đọc `skill://product-workflow/references/contract.md` và `skill://product-workflow/references/records.md` trước. Nếu harness không hỗ trợ `skill://` (như Claude Code), đọc `<skills-dir>/product-workflow/references/`; `<skills-dir>` là thư mục cha của skill này (`.claude/skills/`, `.agents/skills/` hoặc bản toàn cục). Tên công cụ quy đổi theo `<skills-dir>/product-workflow/references/harness.md`.

## Đầu vào

- Brief G1 đã duyệt: actors, danh mục Epic, rules, R2.
- Hoặc danh sách story/backlog người dùng có sẵn. Khi đó chuẩn hóa theo mẫu và chỉ hỏi phần thiếu.

Brief chưa duyệt thì quay về G1. Thiếu rule ảnh hưởng tới story thì ghi câu hỏi mở. Không tự chọn thay người dùng.

## 1. Tách yêu cầu thành User Stories

Với từng Epic, lần lượt biến mỗi "yêu cầu xác định được" thành một hoặc nhiều story:

```text
USxx – <Tên ngắn>: Là <actor>, tôi muốn <hành động> để <giá trị>.
```

- Mỗi story là một chức năng người dùng thấy được và demo được. Không tách story theo tầng kỹ thuật (UI, API, DB); đó là việc của task ở G3.
- Việc hệ thống tự làm được viết `Là hệ thống, tôi muốn … để …`, ghi rõ sự kiện kích hoạt (ví dụ: tự trừ tồn kho sau khi thanh toán).
- Kiểm tra INVEST: độc lập, thương lượng được, có giá trị, ước lượng được, đủ nhỏ, kiểm thử được.
- Story quá lớn (> 13 SP hoặc gồm nhiều hành động) phải tách, ví dụ "Quản lý khách hàng" tách thành Thêm / Sửa / Tìm kiếm / Xem lịch sử mua hàng.
- Không tự thêm chức năng ngoài brief. Thấy thiếu thì đề xuất và hỏi.
- Ghi dependency giữa các story ngay trong story (ví dụ `Phụ thuộc: US04`). Đây là đầu vào cho Rank và sprint.

## 2. Acceptance Criteria

Mỗi story có 2–5 AC dạng Given / When / Then:
- Có ít nhất một luồng thành công, và luồng từ chối hoặc lỗi quan trọng nếu có.
- Dẫn chiếu rule `BRxx` liên quan.
- Kết quả phải quan sát được. Không viết AC kiểu "giao diện đẹp", "chạy nhanh", "không lỗi".

## 3. Ma trận Actor–Story

Lập theo mẫu trong `records.md`: cột là actors trong brief, `✓` khi actor thực hiện hoặc dùng trực tiếp story. Dựa vào rule quyền; nhu cầu hay hưởng lợi gián tiếp không tự cho quyền.

Story `Là hệ thống` không có actor thực hiện: ghi `(tự động)` ở ô User Story, để trống các cột actor, và ghi actor kích hoạt ở trường `Phụ thuộc` hoặc mô tả (ví dụ: chạy khi NV bán hàng xác nhận thanh toán).

Rà ma trận: story thường không có actor nào, actor không có story nào, hoặc quyền bất thường (ví dụ khách hàng được sửa giá). Ghi câu hỏi nếu thấy.

## 4. Priority, Story Point, Rank

AI đề xuất cả ba, ghi `(đề xuất)`, người dùng chốt.

- **Priority** (`Highest` / `High` / `Medium` / `Low`): lấy từ R2.
  - `Highest`: Bắt buộc, và thiếu nó thì luồng giá trị chính không chạy được (đăng nhập, tạo đơn, thanh toán).
  - `High`: Bắt buộc nhưng luồng chính vẫn demo được khi chưa có.
  - `Medium`: Nên có.
  - `Low`: Để sau.
- **Story Point** (`1, 2, 3, 5, 8, 13`):
  1. Chọn một story đơn giản, dễ hiểu làm mốc 3 SP (ví dụ "Thêm sản phẩm": một form, một bảng).
  2. So từng story với mốc theo độ phức tạp, số rule, số màn hình, rủi ro. Không quy ra giờ.
  3. Nếu nhóm đã có cách ước lượng riêng thì dùng cách đó.
- **Rank** (1…N, không trùng): thứ tự xây dựng. Xét Priority, giá trị, và dependency: story nền (đăng nhập, dữ liệu gốc) đứng trước story dùng nó, dù Priority của story sau cao hơn. Ghi rõ trong tóm tắt rằng Rank khác Priority.

Khi đề xuất, trình bày bảng Rank ngắn kèm lý do cho các vị trí không hiển nhiên. Có thể dùng `ask` để người dùng chọn giữa hai phương án xếp hạng nếu có đánh đổi thật.

## 5. Lưu

1. `docs/workflow/specs/<du-an>-stories.md`: stories theo Epic, AC, ma trận Actor–Story. Theo mẫu `G2 — Stories` trong `records.md`.
2. `docs/workflow/product-backlog.md`: góc nhìn theo Epic (kèm cột actor), góc nhìn theo Rank, tổng hợp SP theo Epic. Theo mẫu `G2 — Product Backlog`. Cột `Sprint` để `—`.

Đã có file thì cập nhật tại chỗ, giữ ID cũ.

## 6. Xin duyệt G2

1. Tóm tắt trong chat: số story theo Epic, tổng SP, 10 story đầu theo Rank, story có câu hỏi mở, các chỗ Rank khác Priority.
   - Nếu R8 đã cho số người và hạn chót, ước lượng thô số sprint cần (`tổng SP ÷ velocity dự kiến`). Nếu vượt hạn chót, nói luôn ở G2 để người dùng cân nhắc hạ Priority hoặc cắt story trước khi duyệt. Con số chính thức vẫn chốt ở G3.
2. Gọi `ask` duyệt G2 với ba lựa chọn `Duyệt và tiếp tục` / `Cần điều chỉnh` / `Hỏi thêm chi tiết`, rồi dừng lượt.

Người dùng sửa Priority/SP/Rank thì cập nhật cả hai góc nhìn trong backlog cho khớp. Duyệt xong thì bỏ nhãn `(đề xuất)` và ghi `approved`. Bước tiếp theo duy nhất là `sprint-planning` (G3).

Khi thêm story sau này: dùng ID tiếp theo, chèn vào Rank, cập nhật tổng. Nếu đã có sprint plan thì báo sprint nào có thể bị ảnh hưởng để G3 lập lại.
