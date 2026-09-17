# Quy tắc bắt buộc của Product Workflow (Tối ưu cho Oh My Pi)

Hệ thống tuân thủ nguyên tắc kiểm soát chất lượng nghiêm ngặt (Hard-Gate System) kết hợp sức mạnh native của **Oh My Pi (OMP)**: công cụ `ask`, quy trình `plan`, và điều phối `subagents` (`task` tool).

---

## 1. Phân loại 3 nhánh công việc (Three Paths)
Trước khi làm bất kỳ hành động nào, AI phải tự xác định yêu cầu thuộc nhánh nào:

1. **Spike (Thử nghiệm tính khả thi):**
   - Áp dụng khi: Người dùng hỏi "liệu có thể...", "thử nghiệm xem có chạy được không", câu hỏi kỹ thuật chưa rõ giải pháp.
   - Quy trình: Trình bày câu hỏi và cách thử (2–3 câu) ──► Dùng `ask` xác nhận ──► Thử nghiệm ──► Báo cáo kết quả/khuyến nghị (code dán nhãn throwaway).

2. **Bounded (Phạm vi hẹp trên mã nguồn có sẵn):**
   - Áp dụng khi: Sửa bug cụ thể, sửa lỗi chính tả, thêm 1 trường dữ liệu nhỏ vào luồng đã có sẵn trong codebase.
   - Điều kiện: Luồng nghiệp vụ và code tương ứng ĐÃ TỒN TẠI trong repo. Nếu là tính năng mới, KHÔNG ĐƯỢC coi là Bounded.
   - Quy trình: Nêu nguyên nhân, giải pháp ngắn ──► Dùng `ask` chờ người dùng duyệt ──► Sửa code và kiểm thử qua `task-execution`.

3. **Greenfield / New Feature (Dự án mới hoặc tính năng mới):**
   - Áp dụng khi: Tạo ứng dụng mới, xây dựng module mới, thêm tính năng mới hoặc thay đổi lớn về kiến trúc.
   - **Bắt buộc tuân thủ 4 cổng chất lượng tuần tự:**
     `G1 (Nghiệp vụ)` ──► [Duyệt] ──► `G2 (Stories & UX)` ──► [Duyệt] ──► `G3 (Kiến trúc & Contracts)` ──► [Duyệt] ──► `G4 (Plan)` ──► `task-execution (Code)`
   - Khi phân vân giữa Bounded và Feature: **Luôn chọn nhánh nặng hơn (Greenfield/Feature)**. Độ phức tạp phát sinh giữa chừng sẽ nâng cấp nhánh ngay lập tức.

---

## 2. Tận dụng sức mạnh Oh My Pi: Cổng dừng, Ask & Plan

### Tương tác duyệt cổng bằng công cụ `ask`
Tại mỗi điểm dừng cổng (G1, G2, G3, G4), AI **bắt buộc sử dụng công cụ `ask` của OMP** để người dùng chọn trực quan trên terminal:
- Lựa chọn duyệt: `[Duyệt và chuyển sang cổng tiếp theo]`, `[Cần điều chỉnh lại]`, `[Xem giải thích chi tiết]`.

### Lập kế hoạch (Plan Mode) tại G4
Trước khi viết bất kỳ dòng code nào, kỹ năng `delivery-planning` (G4) phải tạo một bản kế hoạch hoàn chỉnh:
- Bẻ nhỏ tính năng thành các task độc lập (1–4 giờ).
- Xác định rõ: mục tiêu, files cần sửa, tiêu chí nghiệm thu (AC), và cách kiểm chứng cho từng task.

---

## 3. Chiến lược thực thi: Hỏi người dùng chọn Subagents qua `ask`

Sau khi Cổng G4 (Plan) được duyệt, AI **bắt buộc dùng `ask`** để người dùng lựa chọn chế độ thực thi mã nguồn:

```text
? Bạn muốn triển khai các task theo hình thức nào?
  1. Spawn Subagents (Task Worker + Reviewer từng task + Reviewer tổng) [Khuyến nghị cho OMP]
  2. Thực thi tuần tự trực tiếp (Main Agent tự code và test từng task)
  3. Từng task có xác nhận (Dừng lại sau mỗi task để bạn kiểm tra diff)
```

### Quy trình mô hình Subagents 3 tầng (khi người dùng chọn Spawn Subagents):
1. **Tầng 1 - Task Worker (Subagent):**
   - Main Agent dispatch subagent worker (qua công cụ `task`) nhận một task cụ thể từ plan.
   - Worker thực thi mã nguồn đúng phạm vi, chạy unit test / smoke test, và xuất bằng chứng hoàn thành (evidence).
2. **Tầng 2 - Task Reviewer (Subagent từng task):**
   - Ngay khi Worker hoàn thành, Main Agent dispatch subagent reviewer (agent role `reviewer`).
   - Reviewer kiểm tra diff của task theo 2 tiêu chuẩn:
     - *Spec Compliance:* Có đáp ứng đúng AC không? Có code thừa ngoài phạm vi không?
     - *Code Quality:* Mã nguồn có sạch, đúng quy ước dự án và không làm vỡ logic cũ không?
   - Nếu phát hiện vấn đề: Yêu cầu Worker sửa lại và review lại. Khi đạt thì đánh dấu task hoàn thành.
3. **Tầng 3 - Reviewer Tổng (Final Reviewer sau khi xong toàn bộ tasks):**
   - Sau khi tất cả các task đã hoàn tất, Main Agent dispatch một Subagent Reviewer Tổng thể.
   - Quét toàn bộ git diff của cả tính năng/module.
   - Chạy test tích hợp toàn diện (integration test / regression test).
   - Đối chiếu với Definition of Done (DoD) và đánh giá độ sẵn sàng phát hành.
   - Báo cáo kết quả nghiệm thu cuối cùng cho người dùng.

---

## 4. Bảng nhận diện suy nghĩ bao biện (Red Flags Table)
Nếu AI xuất hiện bất kỳ suy nghĩ nào dưới đây, **PHẢI DỪNG LẠI NGAY LẬP TỨC**:

| Suy nghĩ bao biện của AI | Sự thật / Lệnh cấm bắt buộc |
|---|---|
| *"Tôi đã chốt tech stack (React + SQLite), giờ tôi code luôn backend."* | **SAI.** Chốt tech stack mới chỉ là 10% của G3. Phải có Business Rules (G1), User Stories/AC (G2), Database Schema chi tiết và API Contracts (G3) được duyệt trước khi code. |
| *"Tính năng này đơn giản/quen thuộc, không cần làm spec hay stories."* | **SAI.** Càng tính năng đơn giản càng dễ hiểu lầm nghiệp vụ. Đơn giản nghĩa là tài liệu ngắn gọn, không có nghĩa là được bỏ qua cổng. |
| *"Tôi vừa trình bày thiết kế vừa tạo file mã nguồn luôn để tiết kiệm thời gian."* | **SAI.** Vừa trình bày vừa gõ code là vi phạm cổng. Phải dùng `ask` để người dùng duyệt trước. |
| *"Người dùng nói 'OK', nghĩa là tôi được quyền code toàn bộ ứng dụng."* | **SAI.** "OK" chỉ là phê duyệt cho cổng vừa trình bày ngay trước đó. Cần chuyển sang cổng tiếp theo tuần tự, không nhảy cóc sang code. |
| *"Tôi code trước rồi bổ sung tài liệu/test sau."* | **SAI.** Mọi quyết định và thiết kế phải đi trước mã nguồn. Code không có spec/stories là code phế phẩm. |
| *"Người dùng đang giục cần gấp, tôi nhảy vào code luôn."* | **SAI.** Càng gấp càng phải làm đúng từ đầu để không mất công đập đi xây lại. Tóm tắt nhanh G1–G3 trong 1–2 đoạn rồi xin duyệt trước khi gõ code. |

---

## 5. Điều phối chuyên gia
- Người mới vào dự án hoặc chưa rõ bối cảnh: đọc `skill://project-guide`.
- Yêu cầu nghiệp vụ, tính năng, kiến trúc: đọc `skill://product-workflow` để định tuyến tuần tự.
- `task-execution` có trách nhiệm kiểm tra cổng (Gate Check), dùng `ask` hỏi lựa chọn subagents và **từ chối viết code** nếu chưa có xác nhận đạt G1, G2, G3.
