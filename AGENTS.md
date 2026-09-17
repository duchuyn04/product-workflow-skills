# Quy tắc cốt lõi Product Workflow (Hard-Gate System)

Hệ thống kiểm soát chất lượng nghiêm ngặt dành cho AI Agent. Mọi Agent bắt buộc tuân thủ:

---

## 1. Lệnh cấm tuyệt đối (Hard-Stops)
- **CẤM VIẾT CODE TRƯỚC KHI DUYỆT G1, G2, G3:** Không tự ý tạo file mã nguồn, backend/frontend, database migration khi nghiệp vụ và thiết kế chưa được người dùng duyệt rõ ràng.
- **DỪNG LẠI Ở MỖI CỔNG (One Gate per Turn):** Trình bày xong một cổng thì bắt buộc dừng tin nhắn, dùng `ask` để xin duyệt trước khi chuyển sang bước tiếp theo.
- **DOCS-FIRST:** Mọi tài liệu thiết kế phải lưu thành file vật lý trong `docs/workflow/` (specs, architecture, plans, diagrams), cấm chỉ in ra chat.
- **BẢO VỆ CODE CŨ (BROWNFIELD):** Không tự ý refactor lan man, không xóa code cũ ngoài phạm vi task, luôn bảo đảm regression tests.
- **SƠ ĐỒ & GIAO DIỆN:** Cấm dùng Mermaid code blocks (dùng `skill://diagram-design`). Mọi diagram HTML/SVG bắt buộc tự động kiểm thử qua Engine Browser Native trước khi bàn giao.

---

## 2. Phân loại 3 nhánh công việc (Three Paths)
Trước khi hành động, AI phải tự xác định yêu cầu thuộc nhánh nào:
1. **Spike (Thử nghiệm tính khả thi):** Trình bày câu hỏi và cách thử (2–3 câu) ──► Dừng xin duyệt qua `ask` ──► Thử nghiệm (mã nguồn dán nhãn throwaway).
2. **Bounded (Code cũ / Sửa lỗi nhỏ):** Nêu nguyên nhân gốc rễ và giải pháp ngắn trong chat ──► Dừng xin duyệt qua `ask` ──► Sửa đúng file và kiểm thử qua `task-execution`.
3. **Greenfield / New Feature:** Bắt buộc tuân thủ 4 cổng chất lượng tuần tự:
   `G1 (Nghiệp vụ)` ──► [Duyệt] ──► `G2 (Stories & UX)` ──► [Duyệt] ──► `G3 (Kiến trúc & Contracts)` ──► [Duyệt] ──► `G4 (Tasks)` ──► `task-execution (Code)`
   *Khi phân vân giữa Bounded và Feature: Luôn chọn nhánh nặng hơn (Feature).*

---

## 3. Bảng nhận diện suy nghĩ bao biện (Red Flags)
DỪNG LẠI NGAY LẬP TỨC nếu có suy nghĩ sau:
| Suy nghĩ bao biện của AI | Sự thật / Lệnh cấm bắt buộc |
|---|---|
| *"Tôi tự đoán nghiệp vụ hoặc hỏi vụn vặt ngay."* | **SAI.** Đọc `product-discovery`, phân rã phân hệ và phỏng vấn case study chuyên sâu. |
| *"Tôi chốt stack rồi nên tôi code luôn."* | **SAI.** Đọc `solution-design`, phải có schema chi tiết và API contracts lưu vào docs trước khi code. |
| *"Tôi gom hết 40 tasks vào 1 file plan duy nhất."* | **SAI.** Đọc `delivery-planning`, chia thành các task cards độc lập trong `tasks/task-XX.md`. |
| *"Tôi vừa trình bày vừa tạo file code luôn."* | **SAI.** Vi phạm cổng. Phải lưu tài liệu vào `docs/`, dùng `ask` chờ người dùng duyệt. |
| *"Người dùng nói 'OK' là tôi được code hết."* | **SAI.** 'OK' chỉ là duyệt cho cổng vừa xong. Tuần tự chuyển cổng tiếp theo. |

---

## 4. Bản đồ điều phối chuyên gia (Pointers over Payloads)
AI chủ động đọc kỹ năng tương ứng qua công cụ `read` trước khi thực hiện từng cổng:
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
