# Quy tắc bắt buộc của Product Workflow (Tối ưu cho Oh My Pi)

Hệ thống tuân thủ nguyên tắc kiểm soát chất lượng nghiêm ngặt (Hard-Gate System) kết hợp sức mạnh native của **Oh My Pi (OMP)**: công cụ `ask`, quy trình `plan`, lưu trữ tài liệu vật lý (`docs/workflow/`), và điều phối `subagents` (`task` tool).

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

## 2. Ba nguyên tắc cốt lõi: Phỏng vấn, Minh bạch Stack & Docs-First

### A. Phỏng vấn nghiệp vụ thích ứng theo quy mô (Cổng G1)
- **CẤM TỰ SUY ĐOÁN NGHIỆP VỤ:** Tuyệt đối không tự ý quyết định luồng nghiệp vụ thay cho người dùng rồi bắt họ duyệt một bản tóm tắt có sẵn.
- **Chiến lược phỏng vấn theo quy mô dự án:**
  - *Dự án nhỏ / Tính năng đơn lẻ:* 1 vòng phỏng vấn (3–5 câu hỏi trọng tâm qua `ask`) ──► Chốt brief.
  - *Dự án lớn / Nền tảng phức tạp (E-commerce, SaaS, ERP, Portal...):*
    1. **Phân rã phân hệ trước (Decomposition First):** Không dồn hàng chục hay cả trăm câu hỏi vào một lượt gây kiệt sức cho người dùng. AI trước tiên giúp người dùng định vị bức tranh tổng thể và phân rã thành các phân hệ/module độc lập (ví dụ: Auth & Phân quyền, Danh mục & Sản phẩm, Giỏ hàng & Thanh toán, Quản lý kho, Dashboard...).
    2. **Phỏng vấn cuốn chiếu nhiều vòng (Multi-Round Thematic Deep-Dive):** Chọn phân hệ ưu tiên làm trước, phỏng vấn sâu qua nhiều lượt (mỗi lượt 3–5 câu hỏi cùng chủ đề qua `ask`), đào sâu lần lượt:
       - Luồng người dùng chính (Happy path & Actors).
       - Quy tắc nghiệp vụ cốt lõi (Business rules, invariants & calculations).
       - Trường hợp ngoại lệ & lỗi biên (Edge cases, permissions, concurrency, errors).
       - Tích hợp & phi chức năng (Third-party APIs, SLA, bảo mật).
       *Tổng số câu hỏi phỏng vấn có thể lên tới hàng chục đến hàng trăm câu qua nhiều lượt trao đổi, tuyệt đối không bị giới hạn cơ học.*
    3. **Giảm tải nhận thức qua `ask`:** Đưa ra các kịch bản thực tế kèm các phương án lựa chọn (A, B, C) để người dùng bấm chọn nhanh, tránh bắt người dùng gõ văn bản quá dài.
    4. **Kiểm soát điểm dừng:** Sau mỗi vòng, AI dùng `ask` hỏi: *"Bạn có muốn phỏng vấn sâu tiếp về [chủ đề tiếp theo] không, hay thông tin đã đủ để chốt Business Brief cho phần này?"*
- Sau khi người dùng xác nhận đã đủ thông tin phỏng vấn, AI mới tổng hợp và ghi ra file tài liệu.

### B. Minh bạch Tech Stack (Cổng G3)
- **CẤM TỰ Ý CHỌN TECH STACK TRONG ĐẦU:** Không được tự mặc định công nghệ (như tự chọn React, Vite, Express, SQLite...) mà không hỏi ý kiến người dùng.
- **Đề xuất và hỏi qua `ask`:** Đưa ra 2–3 phương án công nghệ khả thi kèm ưu/nhược điểm (tradeoffs), sau đó dùng công cụ `ask` để người dùng chủ động chọn stack.
- Sau khi người dùng chọn xong tech stack mới tiến hành thiết kế chi tiết Database Schema, API Contracts và ADR.

### C. Nguyên tắc Docs-First: Bắt buộc ghi file tài liệu vật lý ra `docs/workflow/`
- **CẤM CHỈ NÓI SUÔNG TRONG CHAT:** Mọi tài liệu thiết kế nếu chỉ in ra cửa sổ chat sẽ bị trôi mất ngữ cảnh và người dùng không có gì để lưu trữ, đọc lại.
- **Tự động ghi file vật lý (`write` tool) tại mỗi cổng:**
  - Cổng G1: Tạo file `docs/workflow/specs/<feature>-brief.md`
  - Cổng G2: Tạo file `docs/workflow/specs/<feature>-stories.md`
  - Cổng G3: Tạo file `docs/workflow/architecture/<feature>-design.md`
  - Cổng G4: Tạo file `docs/workflow/plans/<feature>-plan.md`
- Sau khi ghi file, thông báo đường dẫn file đã tạo để người dùng mở trong IDE đọc lại và dùng công cụ `ask` để xác nhận duyệt cổng.

---

## 3. Chiến lược thực thi: Hỏi người dùng chọn Subagents qua `ask`

Sau khi Cổng G4 (Plan) được duyệt, AI **bắt buộc dùng `ask`** để người dùng lựa chọn chế độ thực thi mã nguồn:

```text
? Bạn muốn triển khai các task theo hình thức nào?
  1. Spawn Subagents (Task Worker + Reviewer từng task + Reviewer tổng) [Khuyến nghị cho OMP]
  2. Thực thi tuần tự trực tiếp (Main Agent tự code và test từng task)
  3. Từng task có xác nhận (Dừng lại sau mỗi task để bạn kiểm tra diff)
```

### Quy trình mô hình Subagents 3 tầng:
1. **Tầng 1 - Task Worker (Subagent):**
   - Main Agent dispatch subagent worker (qua công cụ `task`) nhận một task cụ thể từ file plan trong `docs/workflow/plans/`.
   - Worker thực thi mã nguồn đúng phạm vi, chạy unit test / smoke test, và xuất bằng chứng hoàn thành (evidence).
2. **Tầng 2 - Task Reviewer (Subagent từng task):**
   - Ngay khi Worker hoàn thành, Main Agent dispatch subagent reviewer (agent role `reviewer`).
   - Reviewer kiểm tra diff của task:
     - *Spec Compliance:* Có đáp ứng đúng AC không? Có code thừa ngoài phạm vi không?
     - *Code Quality:* Mã nguồn có sạch, đúng quy ước dự án và không làm vỡ logic cũ không?
   - Nếu phát hiện vấn đề: Yêu cầu Worker sửa lại và review lại. Khi đạt thì đánh dấu task hoàn thành.
3. **Tầng 3 - Reviewer Tổng (Final Reviewer sau khi xong toàn bộ tasks):**
   - Sau khi tất cả các task đã hoàn tất, Main Agent dispatch Subagent Reviewer Tổng thể.
   - Quét toàn bộ git diff của cả tính năng/module.
   - Chạy test tích hợp toàn diện (integration test / regression test).
   - Đối chiếu với Definition of Done (DoD) và đánh giá độ sẵn sàng phát hành.
   - Báo cáo kết quả nghiệm thu cuối cùng cho người dùng.

---

## 4. Bảng nhận diện suy nghĩ bao biện (Red Flags Table)
Nếu AI xuất hiện bất kỳ suy nghĩ nào dưới đây, **PHẢI DỪNG LẠI NGAY LẬP TỨC**:

| Suy nghĩ bao biện của AI | Sự thật / Lệnh cấm bắt buộc |
|---|---|
| *"Tôi tự suy đoán nghiệp vụ rồi tóm tắt bảo người dùng duyệt cho nhanh."* | **SAI.** Đó là tự biên tự diễn. Phải dùng `ask` phỏng vấn người dùng ít nhất 2–3 câu hỏi cốt lõi trước. |
| *"Tôi tự chọn React + SQLite luôn, không cần hỏi tech stack."* | **SAI.** Phải đề xuất 2–3 phương án stack kèm ưu/nhược điểm và dùng `ask` để người dùng lựa chọn. |
| *"Tôi in tài liệu ra tin nhắn chat là đủ, không cần tạo file làm gì."* | **SAI.** Bắt buộc ghi file Markdown vào `docs/workflow/` để người dùng có tài liệu lưu trữ, đọc lại trong IDE. |
| *"Tôi đã chốt tech stack, giờ tôi code luôn backend."* | **SAI.** Chốt stack mới chỉ là 10% của G3. Phải có Business Rules (G1), Stories/AC (G2), Schema chi tiết và API Contracts (G3) lưu vào docs trước khi code. |
| *"Tính năng này đơn giản/quen thuộc, không cần làm spec hay stories."* | **SAI.** Càng tính năng đơn giản càng dễ hiểu lầm nghiệp vụ. Đơn giản nghĩa là tài liệu ngắn gọn, không có nghĩa là được bỏ qua cổng. |
| *"Tôi vừa trình bày thiết kế vừa tạo file mã nguồn luôn để tiết kiệm thời gian."* | **SAI.** Vừa trình bày vừa gõ code là vi phạm cổng. Phải lưu tài liệu vào `docs/`, dùng `ask` để người dùng duyệt trước. |
| *"Người dùng nói 'OK', nghĩa là tôi được quyền code toàn bộ ứng dụng."* | **SAI.** "OK" chỉ là phê duyệt cho cổng vừa trình bày ngay trước đó. Cần chuyển sang cổng tiếp theo tuần tự, không nhảy cóc sang code. |

---

## 5. Điều phối chuyên gia
- Người mới vào dự án hoặc chưa rõ bối cảnh: đọc `skill://project-guide`.
- Yêu cầu nghiệp vụ, tính năng, kiến trúc: đọc `skill://product-workflow` để định tuyến tuần tự.
- `task-execution` có trách nhiệm kiểm tra cổng (Gate Check), dùng `ask` hỏi lựa chọn subagents và **từ chối viết code** nếu chưa có xác nhận đạt G1, G2, G3.
