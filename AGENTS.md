# Quy tắc cốt lõi Product Workflow (Hard-Gate System)

Áp dụng cho Agent thực hiện công việc triển khai sản phẩm trong dự án này.

**Phạm vi:** Phân loại nhánh và duyệt cổng khi yêu cầu có triển khai hoặc thay đổi hành vi sản phẩm. Hỏi đáp, giải thích, review chỉ đọc và chỉnh tài liệu thuần túy không cần G1–G4; vẫn đọc skill liên quan. Tài liệu đặc tả một tính năng mới vẫn thuộc quy trình Feature. Yêu cầu hỗn hợp: chỉ áp dụng cổng cho phần triển khai.

Trước khi sửa source, tests, cấu hình, dependencies hoặc migrations, đọc nội dung `skill://product-workflow` (fallback `.agents/skills/product-workflow/SKILL.md`); Glob không thay cho đọc skill. Thiếu skill hoặc chưa có duyệt đúng nhánh thì dừng trước thao tác ghi, kể cả shell/subagent.

---

## 1. Lệnh cấm tuyệt đối (Hard-Stops)
- **DUYỆT TRƯỚC KHI CODE:** Nhánh Feature phải được người dùng duyệt rõ ràng G1, G2, G3 và hoàn thành G4 trước khi tạo/sửa mã nguồn hoặc database migration. Spike và Bounded theo cơ chế duyệt riêng ở mục 2, không bắt buộc qua G1–G3.
- **DỪNG LẠI Ở MỖI CỔNG (One Gate per Turn):** Trình bày xong một cổng thì xin duyệt và chờ người dùng phản hồi trước khi chuyển bước. Dùng `ask` nếu có; nếu không, hỏi trong chat rồi dừng. “OK” chỉ duyệt cổng vừa trình bày.
- **DOCS-FIRST:** Mọi tài liệu thiết kế phải lưu thành file vật lý trong `docs/workflow/` (specs, architecture, plans, diagrams), cấm chỉ in ra chat.
- **BẢO VỆ CODE CŨ (BROWNFIELD):** Không tự ý refactor lan man, không xóa code cũ ngoài phạm vi task, luôn bảo đảm regression tests.
- **SƠ ĐỒ & GIAO DIỆN:** Đọc `diagram-design` để vẽ sơ đồ, không dùng Mermaid code blocks. Kiểm thử mọi diagram HTML/SVG qua Engine Browser Native hoặc công cụ browser tương đương trước khi bàn giao. Nếu không có browser, báo rõ phần chưa kiểm chứng và khả năng còn thiếu; không đánh dấu nghiệm thu hoàn tất.
- **CHECKPOINT GIAO DIỆN WEB:** Sau khi thêm hoặc sửa chức năng làm thay đổi giao diện web người dùng nhìn thấy/tương tác, phải gọi `ask` để người dùng chọn cách kiểm thử bằng OMP Browser Native trước khi báo hoàn thành. Chỉ bỏ qua câu hỏi khi người dùng đã chọn rõ cách kiểm thử cho đúng scope; chọn bỏ qua phải ghi `not-run`, không được tuyên bố đã kiểm chứng trực quan. Diagram HTML/SVG vẫn tự động kiểm thử theo quy tắc riêng.

---

## 2. Phân loại 3 nhánh công việc theo Bán kính ảnh hưởng (Blast Radius)
Với yêu cầu thuộc phạm vi triển khai ở trên, phân loại dựa trên bán kính ảnh hưởng và mức độ bất định:
1. **Spike (Thử nghiệm tính khả thi):** Trình bày câu hỏi và cách thử (2–3 câu) ──► Xin duyệt và chờ phản hồi ──► Thử nghiệm (mã nguồn dán nhãn throwaway).
2. **Bounded (Sửa lỗi hoặc Cải tiến nhỏ cục bộ):**
   - Áp dụng khi: Sửa lỗi (bug fix), cải tiến nhỏ (minor enhancement/tweak), thêm field/prop/flag, chỉnh style/validation/copy trong phạm vi 1–2 file/module sẵn có; không đổi kiến trúc cốt lõi, không tạo bảng/thực thể DB mới, không đổi public contracts diện rộng.
   - Quy trình: Trong chat thông thường, trình bày **Đề xuất sửa lỗi (Bounded)** (hoặc đề xuất cải tiến) gồm phạm vi, nguyên nhân/mục đích, thay đổi dự kiến theo file/symbol, ngoài phạm vi/rủi ro và cách kiểm chứng ──► Sau đó mới gọi `ask` xin duyệt và chờ phản hồi ──► Sửa đúng phạm vi và kiểm thử qua `task-execution`. Thẻ `ask` chỉ ghi nhận quyết định, không phải nơi duy nhất chứa kế hoạch.
3. **Greenfield / New Feature (Tính năng hoặc Phân hệ lớn):**
   - Áp dụng khi: Tạo mới ứng dụng/phân hệ/module từ đầu; thay đổi luồng nghiệp vụ cốt lõi; tạo bảng/entity DB mới; thiết kế lại API contract công khai cho nhiều bên; hoặc mức độ bất định cao cần phỏng vấn nghiệp vụ chuyên sâu.
   - Quy trình: Bắt buộc tuân thủ 4 cổng chất lượng tuần tự:
     `G1 (Nghiệp vụ)` ──► [Duyệt] ──► `G2 (Stories & UX)` ──► [Duyệt] ──► `G3 (Kiến trúc & Contracts)` ──► [Duyệt] ──► `G4 (Tasks)` ──► `task-execution (Code)`
   - *Nguyên tắc linh hoạt:* Mặc định ưu tiên Bounded cho các thay đổi cục bộ có giải pháp rõ ràng. Chỉ nâng cấp lên Feature khi phát hiện phạm vi phình to chạm vào kiến trúc mới, DB mới hoặc luồng nghiệp vụ chưa rõ.
---

## 3. Bảng nhận diện suy nghĩ bao biện (Red Flags)
Trong nhánh Feature, dừng và quay về bước tương ứng nếu có suy nghĩ sau:
| Suy nghĩ bao biện của AI | Sự thật / Lệnh cấm bắt buộc |
|---|---|
| *"Tôi tự đoán nghiệp vụ hoặc hỏi vụn vặt ngay."* | **SAI.** Đọc `product-discovery`, phân rã phân hệ và phỏng vấn case study chuyên sâu. |
| *"Tôi chốt stack rồi nên tôi code luôn."* | **SAI.** Đọc `solution-design`, phải có schema chi tiết và API contracts lưu vào docs trước khi code. |
| *"Tôi gom hết 40 tasks vào 1 file plan duy nhất."* | **SAI.** Đọc `delivery-planning`, chia thành các task cards độc lập trong `tasks/task-XX.md`. |
| *"Tôi vừa trình bày vừa tạo file code luôn."* | **SAI.** Vi phạm cổng. Phải lưu tài liệu vào `docs/`, dùng `ask` chờ người dùng duyệt. |
| *"Người dùng nói 'OK' là tôi được code hết."* | **SAI.** 'OK' chỉ là duyệt cho cổng vừa xong. Tuần tự chuyển cổng tiếp theo. |

---

## 4. Bản đồ điều phối chuyên gia (Pointers over Payloads)
Đọc skill phù hợp với tác vụ trước khi thực hiện; chỉ nạp nội dung chi tiết của skill cần dùng, không nạp toàn bộ bộ skills.

**Cách đọc theo môi trường:**
- Nếu hỗ trợ `skill://`, dùng công cụ đọc file để mở URI trong bảng.
- Nếu không hỗ trợ, tra danh sách skills hoặc cấu hình cài đặt của công cụ để tìm và đọc `SKILL.md` tương ứng. Trong repo này, đường dẫn là `<tên-skill>/SKILL.md`, tính từ thư mục gốc repo; không giả định đường dẫn này đúng ở dự án khác.
- Nếu không tìm thấy skill bắt buộc, báo rõ tên skill và vị trí đã kiểm tra; chỉ dừng phần phụ thuộc vào skill đó, không tự bịa nội dung thay thế.
- Bảng dưới là chỉ mục điều hướng. Quy trình chi tiết nằm trong từng skill; các quy tắc duyệt chung nằm ở mục 1–2.

| Giai đoạn / Mục tiêu | Đọc kỹ năng | Đầu ra chuẩn |
|---|---|---|
| Mới vào team, định hướng dự án có sẵn | `skill://project-guide` | Báo cáo hiện trạng codebase & conventions |
| Khởi động, điều phối tổng thể dự án | `skill://product-workflow` | Định tuyến tuần tự qua các cổng G1–G4 |
| Phỏng vấn nghiệp vụ chuyên sâu (Cổng G1) | `skill://product-discovery` | `docs/workflow/specs/<phân-hệ>-brief.md` |
| User Stories, UX flows & Test Scenarios (Cổng G2) | `skill://story-and-experience` | `docs/workflow/specs/<phân-hệ>-stories.md` |
| Tech Stack, Schema, API & ADR (Cổng G3) | `skill://solution-design` | `docs/workflow/architecture/<phân-hệ>-design.md` |
| Product Backlog, Task Cards & Test Cases (Cổng G4) | `skill://delivery-planning` | `roadmap.md` & `tasks/task-XX-<slug>.md` |
| Vẽ sơ đồ kiến trúc, DB, flows (thay Mermaid) | `skill://diagram-design` | `docs/workflow/diagrams/<sơ-đồ>.html` |
| Nhận việc, viết code, chạy Unit Test & Browser Native | `skill://task-execution` | Code, Unit tests, Browser evidence & DoD |
| Nghiệm thu, tính điểm Product Backlog & Release | `skill://delivery-inspection` | Chấm điểm AC, SP và tick `[x]` Product Backlog |
