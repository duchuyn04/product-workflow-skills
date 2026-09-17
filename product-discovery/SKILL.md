---
name: product-discovery
description: "Phỏng vấn nghiệp vụ chuyên sâu, xác định mục tiêu, actors, quy tắc domain, dữ liệu, ngoại lệ và phạm vi trước khi chốt stories hoặc thay đổi yêu cầu."
hide: true
---

# Product discovery

Đọc `skill://product-workflow/references/contract.md` trước; nếu URI chưa được khám phá, đọc `.agents/skills/product-workflow/references/contract.md`. Đây là bước chuyên gia, không tự mở một workflow bao trùm khác.

## Đầu vào

Yêu cầu hiện tại, dự án/scope, tài liệu và quyết định đã có, người hiểu nghiệp vụ, mục tiêu/ràng buộc đã biết. Nếu được yêu cầu tiếp tục, đọc checkpoint và các nguồn được trỏ tới, không bắt đầu một bảng hỏi mới từ đầu.

## Quy trình phỏng vấn

### 1. Lập bản đồ điều đã biết

Đọc nguồn liên quan, ưu tiên lời xác nhận của người dùng và hồ sơ hiện hành. Lập bốn nhóm: đã xác nhận, giả thuyết, câu hỏi mở, ngoài phạm vi. Ghi nguồn/revision; tài liệu nhiều trang không có nghĩa nghiệp vụ đã được duyệt.

Nếu hai nguồn mâu thuẫn, nêu quyết định đang xung đột và ảnh hưởng; hỏi người có trách nhiệm. Không tự chọn câu trả lời thuận tiện cho implementation.

### 2. Hỏi theo rủi ro, không theo số trang

Mỗi lượt 2–3 câu cùng chủ đề, kèm lý do cần biết và phương án/tradeoff khi có. Đợi câu trả lời trước khi đặc tả phần phụ thuộc. Không hỏi lại dữ kiện đọc được; không tự tạo business rule từ best practice chung.

Bao phủ các chiều sau theo mức liên quan:

| Chiều | Cần làm rõ | Ví dụ câu hỏi |
|---|---|---|
| Giá trị | Vấn đề, cách xử lý hiện tại, mục tiêu, cách đo và baseline | Kết quả nào chứng minh quy trình mới tốt hơn? |
| Tác nhân | Người dùng chính/phụ, vận hành, người duyệt, hệ thống ngoài | Ai thực hiện, ai được xem và ai có quyền thay đổi? |
| Quy trình | Trigger, tiền điều kiện, bước xử lý, handoff, kết quả | Khi bước này thất bại thì ai tiếp tục công việc? |
| Domain | Thuật ngữ, thực thể, quan hệ, trạng thái, invariants/cách tính | Hai trạng thái này khác nhau ở quyền hoặc hành vi nào? |
| Dữ liệu | Nguồn, sở hữu, chất lượng, sửa/xóa, lưu trữ và audit | Khi dữ liệu nguồn bị sửa hoặc xóa thì kết quả cũ xử lý ra sao? |
| Ngoại lệ | Dữ liệu thiếu/sai/trùng, hủy, quá hạn, retry, đồng thời | Hai người sửa cùng lúc hoặc gửi cùng yêu cầu hai lần thì sao? |
| Tích hợp | Đầu vào/ra, SLA thực tế, lỗi bên ngoài và cách phục hồi | Nếu nhà cung cấp không trả lời thì người dùng thấy gì? |
| Phi chức năng | Bảo mật, privacy, accessibility, tải/độ trễ, ngân sách, vận hành | Mức tải/độ trễ nào là yêu cầu thật và đo trong điều kiện nào? |
| Phạm vi | Bắt buộc, sau này, không làm, rủi ro chưa biết | Điều gì có thể bỏ mà vẫn đạt mục tiêu của lần phát hành này? |

Không tự đặt số SLA, retention, deadline, ngân sách hoặc yêu cầu pháp lý. Yêu cầu pháp lý cần nguồn/đơn vị có thẩm quyền; AI không đóng vai xác nhận tuân thủ.

### 3. Mô hình hóa bằng ví dụ cụ thể

Với mỗi quy trình cốt lõi, đi qua một happy path và các ngoại lệ có khả năng đổi thiết kế. Dùng dữ liệu giả không nhạy cảm để minh họa, đánh dấu là ví dụ. Chỉ ra actor, dữ liệu, trạng thái trước/sau, quyền và đầu ra từng bước.

Thử phản ví dụ cho rule: rỗng, biên, lặp, đồng thời, hết quyền hoặc thay đổi trạng thái. Không biến mọi phản ví dụ thành feature; hỏi nó nằm trong scope hay chỉ là rủi ro cần ghi.

### 4. Tổng hợp để người dùng sửa được

Trình từng phần ngắn, không đổ một PRD dài trước khi xác nhận hiểu đúng. Sửa kết luận theo phản hồi, giữ lịch sử quyết định quan trọng. Nếu được phép lưu, cập nhật nguồn hiện hữu; chỉ tạo file mới khi nó có trách nhiệm riêng.

## Đầu ra: business brief

- Product Goal: kết quả, người hưởng lợi, thước đo và nguồn dữ liệu đo; phần chưa biết ghi rõ.
- Stakeholders/actors và ma trận quyền theo hành động/dữ liệu.
- Glossary: thuật ngữ, định nghĩa domain, ví dụ và từ dễ nhầm.
- As-is/to-be: luồng, trigger, tiền/hậu điều kiện, handoff và ngoại lệ.
- Business rules có ID, phạm vi áp dụng, nguồn xác nhận, ví dụ và phản ví dụ.
- Dữ liệu/lifecycle và yêu cầu phi chức năng có điều kiện kiểm chứng.
- In-scope/out-of-scope và giả thuyết cần kiểm chứng.
- Câu hỏi mở: owner, ảnh hưởng, quyết định/gate đang bị chặn.

Mẫu rule:

| ID | Quy tắc | Điều kiện áp dụng | Kết quả quan sát | Ngoại lệ | Nguồn/revision | Tình trạng xác nhận |
|---|---|---|---|---|---|---|

Mẫu luồng nghiệp vụ:

| Bước | Actor | Trigger/đầu vào | Hành động | Trạng thái/đầu ra | Rule | Khi thất bại |
|---|---|---|---|---|---|---|

## Gate G1 và điều kiện dừng (Hard-Stop)

G1 đạt khi người phụ trách nghiệp vụ xác nhận mục tiêu và phạm vi, quy tắc của phần tính năng sắp làm đã đủ rõ ràng, và các câu hỏi còn mở không gây tắc nghẽn phần việc đó. Ghi đúng phiên bản và phạm vi duyệt.

**Quy tắc dừng lượt bắt buộc:** Sau khi trình bày xong Business Brief và Business Rules, AI phải **DỪNG TIN NHẮN** hoặc gọi công cụ `ask` của Oh My Pi: *"Tôi đã tóm tắt mục tiêu và quy tắc nghiệp vụ (Cổng G1). Bạn có đồng ý duyệt nội dung này để chuyển sang thiết kế User Stories & UX (Cổng G2) không?"* (các tùy chọn: `Duyệt và tiếp tục`, `Cần điều chỉnh`, `Giải thích thêm`).

Đủ G1 thì chuyển đề xuất sang `story-and-experience` (G2). Đây là bước tiếp theo DUY NHẤT; tuyệt đối không nhảy cóc sang kiến trúc (G3) hay viết code (`task-execution`). Không tự chọn giải pháp kỹ thuật trong discovery.

## Thay đổi và tiếp tục

Khi rule đổi, ghi delta so với revision đã duyệt; liệt kê stories/flows/contracts cần xem lại nếu đã có liên kết. Không xóa lịch sử hoặc kéo toàn dự án về Draft. Bàn giao cho `delivery-inspection` để đánh giá tác động liên ngành khi cần.

Kết thúc bằng: kết luận đã xác nhận, điều chưa rõ, G1 của scope hiện tại và bước tiếp theo. Lưu checkpoint theo hợp đồng nếu được phép; không tạo backlog Jira hoặc code ở bước này.
