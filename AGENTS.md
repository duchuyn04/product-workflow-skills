# Quy tắc bắt buộc của Product Workflow

Hệ thống tuân thủ nguyên tắc kiểm soát chất lượng nghiêm ngặt (Hard-Gate System). Mọi AI Agent hoạt động trong dự án bắt buộc phải tuân thủ hướng dẫn dưới đây.

---

## 1. Phân loại 3 nhánh công việc (Three Paths)
Trước khi làm bất kỳ hành động nào, AI phải tự xác định yêu cầu thuộc nhánh nào:

1. **Spike (Thử nghiệm tính khả thi):**
   - Áp dụng khi: Người dùng hỏi "liệu có thể...", "thử nghiệm xem có chạy được không", câu hỏi kỹ thuật chưa rõ giải pháp.
   - Quy trình: Trình bày câu hỏi và cách thử (2–3 câu) ──► Dừng lại lấy xác nhận ──► Tiến hành thử nghiệm ──► Báo cáo kết quả/khuyến nghị. Mã nguồn tạo ra trong spike được dán nhãn là bản nháp/bỏ đi (throwaway).

2. **Bounded (Phạm vi hẹp trên mã nguồn có sẵn):**
   - Áp dụng khi: Sửa bug cụ thể, sửa lỗi chính tả, thêm 1 trường dữ liệu nhỏ vào luồng đã có sẵn trong codebase.
   - Điều kiện: Luồng nghiệp vụ và code tương ứng ĐÃ TỒN TẠI trong repo. Nếu là tính năng mới hoặc chưa có luồng tương tự, KHÔNG ĐƯỢC coi là Bounded.
   - Quy trình: Nêu nguyên nhân, tóm tắt giải pháp ngắn gọn trong chat ──► **DỪNG LẠI chờ người dùng duyệt** ──► Sau khi người dùng đồng ý mới sửa code và kiểm thử qua `task-execution`.

3. **Greenfield / New Feature (Dự án mới hoặc tính năng mới):**
   - Áp dụng khi: Tạo ứng dụng mới, xây dựng module mới, thêm tính năng mới hoặc thay đổi lớn về kiến trúc.
   - **Bắt buộc tuân thủ 4 cổng chất lượng tuần tự:**
     `G1 (Nghiệp vụ)` ──► [Duyệt] ──► `G2 (Stories & UX)` ──► [Duyệt] ──► `G3 (Kiến trúc & Contracts)` ──► [Duyệt] ──► `G4 (Tasks)` ──► `task-execution (Code)`
   - Khi phân vân giữa Bounded và Feature: **Luôn chọn nhánh nặng hơn (Greenfield/Feature)**. Độ phức tạp phát sinh giữa chừng sẽ nâng cấp nhánh ngay lập tức, không bao giờ được tự ý hạ cấp quy trình.

---

## 2. Quy tắc cổng cứng (Hard-Gate & Hard-Stop Policy)
- **TUYỆT ĐỐI KHÔNG VIẾT CODE TRƯỚC KHI DUYỆT G1, G2, G3:** Cấm tự ý tạo file mã nguồn, sinh code backend/frontend, tạo database migration hoặc cài đặt dependencies khi các cổng trước chưa được người dùng phê duyệt rõ ràng.
- **Dừng lại ở mỗi cổng (One Gate per Turn):** Mỗi lượt trả lời chỉ thực hiện đúng một cổng. Trình bày xong kết quả của cổng đó thì **BẮT BUỘC DỪNG TIN NHẮN** để xin ý kiến phản hồi hoặc phê duyệt từ người dùng.
- **Nghiêm cấm vừa trình bày vừa viết code trong cùng một lượt:** Trình bày thiết kế và gọi công cụ tạo file trong cùng một tin nhắn bị coi là hành vi đốt cháy giai đoạn.

---

## 3. Bảng nhận diện suy nghĩ bao biện (Red Flags Table)
Nếu AI xuất hiện bất kỳ suy nghĩ nào dưới đây, **PHẢI DỪNG LẠI NGAY LẬP TỨC**:

| Suy nghĩ bao biện của AI | Sự thật / Lệnh cấm bắt buộc |
|---|---|
| *"Tôi đã chốt tech stack (React + SQLite), giờ tôi code luôn backend."* | **SAI.** Chốt tech stack mới chỉ là 10% của G3. Phải có Business Rules (G1), User Stories/AC (G2), Database Schema chi tiết và API Contracts (G3) được duyệt trước khi code. |
| *"Tính năng này đơn giản/quen thuộc, không cần làm spec hay stories."* | **SAI.** Càng tính năng đơn giản càng dễ hiểu lầm nghiệp vụ. Đơn giản nghĩa là tài liệu ngắn gọn, không có nghĩa là được bỏ qua cổng. |
| *"Tôi vừa trình bày thiết kế vừa tạo file mã nguồn luôn để tiết kiệm thời gian."* | **SAI.** Vừa trình bày vừa gõ code là vi phạm cổng. Phải dừng lại chờ người dùng nói "Duyệt" mới được làm bước tiếp theo. |
| *"Người dùng nói 'OK', nghĩa là tôi được quyền code toàn bộ ứng dụng."* | **SAI.** "OK" chỉ là phê duyệt cho cổng vừa trình bày ngay trước đó. Cần chuyển sang cổng tiếp theo tuần tự, không nhảy cóc sang code. |
| *"Tôi code trước rồi bổ sung tài liệu/test sau."* | **SAI.** Mọi quyết định và thiết kế phải đi trước mã nguồn. Code không có spec/stories là code phế phẩm. |
| *"Người dùng đang giục cần gấp, tôi nhảy vào code luôn."* | **SAI.** Càng gấp càng phải làm đúng từ đầu để không mất công đập đi xây lại. Tóm tắt nhanh G1–G3 trong 1–2 đoạn rồi xin duyệt trước khi gõ code. |

---

## 4. Điều phối chuyên gia
- Người mới vào dự án hoặc chưa rõ bối cảnh: đọc `skill://project-guide`.
- Yêu cầu nghiệp vụ, tính năng, kiến trúc: đọc `skill://product-workflow` để định tuyến tuần tự.
- `task-execution` có trách nhiệm kiểm tra cổng (Gate Check) và **từ chối viết code** nếu chưa có xác nhận đạt G1, G2, G3.
