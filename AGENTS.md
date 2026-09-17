# Quy tắc bắt buộc của Product Workflow (Tối ưu cho Oh My Pi)

Hệ thống tuân thủ nguyên tắc kiểm soát chất lượng nghiêm ngặt (Hard-Gate System) kết hợp sức mạnh native của **Oh My Pi (OMP)**: công cụ `ask`, quy trình `plan`, lưu trữ tài liệu vật lý theo module (`docs/workflow/`), và điều phối `subagents` (`task` tool).

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

## 2. Các nguyên tắc cốt lõi: Quy mô, Phỏng vấn, Minh bạch Stack & Docs-First

### A. Nhận diện quy mô & Phỏng vấn nghiệp vụ (Cổng G1)
- **CẤM TỰ Ý ĐOÁN NGHIỆP VỤ HOẶC HỎI VỤN VẶT NGAY TỪ ĐẦU.**
- **Bước 1 - Nhận diện quy mô & Phân rã phân hệ (Module Catalogue):**
  Ngay khi người dùng nêu ý tưởng dự án:
  1. Đánh giá quy mô: Micro (1–2 màn hình), Vừa (3–5 phân hệ), hay Lớn/Nền tảng (6–10+ phân hệ).
  2. Đề xuất dự thảo danh mục các phân hệ độc lập (ví dụ: Auth & Phân quyền, Danh mục & Sản phẩm, Giỏ hàng & Thanh toán, Quản lý kho, Dashboard Admin...).
  3. **Dùng `ask` để người dùng xác nhận/chỉnh sửa danh sách phân hệ** và chọn phân hệ ưu tiên làm trước (MVP).
- **Bước 2 - Phỏng vấn chuyên sâu theo Vòng lặp Case Study tối đa 50 câu hỏi/module:**
  Chỉ phỏng vấn cho đúng phân hệ được chọn làm trước, kết hợp `wayfinder`, `grilling` và `domain-modeling`:
  - **CẤM PHỎNG VẤN HỜI HỢT HOẶC DỪNG SỚM:** Phải đào sâu toàn diện các góc khuất, quy tắc nghiệp vụ, lỗi biên, tranh chấp dữ liệu và tích hợp của phân hệ.
  - **Tối đa 50 câu hỏi case study cho 1 phân hệ:** AI chia thành các đợt hỏi (mỗi đợt 3–5 câu trắc nghiệm qua `ask`). Mỗi câu là một tình huống cụ thể (stress-testing scenario) có số liệu, actors, xung đột logic và phương án khuyến nghị.
  - **Hiển thị bộ đếm tiến độ minh bạch:** Luôn ghi rõ `[Tiến độ: Đã hỏi X/50 câu cho phân hệ <Tên>]`.
  - **Quyền quyết định thuộc về người dùng qua `ask`:** Sau mỗi đợt, AI bắt buộc gọi `ask` đưa ra 2 lựa chọn:
    1. *Tiếp tục đào sâu Case Study tiếp theo* (tiếp tục đào sâu các kịch bản ngoại lệ, lỗi biên cho đến tối đa 50 câu).
    2. *Đồng ý chấp nhận & Chốt Business Brief* (dừng phỏng vấn ngay lập tức để chốt tài liệu).
  - **Làm sắc bén ngôn ngữ Domain (Sharpen Fuzzy Language):** Bắt bẻ ngay các từ ngữ mơ hồ ("tài khoản" ──► Khách vãng lai vs Thành viên đăng ký; "hủy" ──► Hủy trước thanh toán vs Hủy có hoàn tiền).
  - **Tự tra cứu sự thật:** AI tự động tìm kiếm codebase, tài liệu API đối tác (Stripe, VNPay, OAuth...); chỉ hỏi người dùng những **Quyết định nghiệp vụ (Decisions & Tradeoffs)**.
- **Bước 3 - Điểm dừng & Hoàn thành dứt điểm từng phân hệ trước khi sang G2:**
  Khi người dùng chọn *"Đồng ý chấp nhận"* (hoặc khi chạm trần 50 câu hỏi), AI mới tổng hợp thành file `docs/workflow/specs/<tên-phân-hệ>-brief.md`, dùng `ask` để xin duyệt Cổng G1, sau đó mới chuyển phân hệ đó sang G2 (Stories & UX). Tuyệt đối không nhảy sang G2 khi phân hệ chưa đạt G1.
### B. Minh bạch Tech Stack (Cổng G3)
- **CẤM TỰ Ý CHỌN TECH STACK TRONG ĐẦU:** Không được tự mặc định công nghệ (như tự chọn React, Vite, Express, SQLite...) mà không hỏi ý kiến người dùng.
- **Đề xuất và hỏi qua `ask`:** Đưa ra 2–3 phương án công nghệ khả thi kèm ưu/nhược điểm (tradeoffs), sau đó dùng công cụ `ask` để người dùng chủ động chọn stack.
- Sau khi người dùng chọn xong tech stack mới tiến hành thiết kế chi tiết Database Schema, API Contracts và ADR.

### C. Nguyên tắc Docs-First & Cấu trúc Task chia nhỏ (Cổng G4)
- **CẤM CHỈ NÓI SUÔNG TRONG CHAT:** Mọi tài liệu thiết kế phải được lưu thành file vật lý trong `docs/workflow/`.
- **CẤM DỒN TẤT CẢ TASKS VÀO 1 FILE `.MD` DUY NHẤT:** Việc gom 30–50 tasks vào 1 file làm phình to context, gây xung đột Git merge khi làm việc nhóm và khiến Subagents không thể nhận việc độc lập.
- **Bắt buộc tổ chức tài liệu và tasks theo cấu trúc phân rã (Modular Structure):**
  ```text
  docs/workflow/
  ├── product-backlog.md                           # Ma trận tính năng, SP, AC và hoàn thành
  ├── specs/
  │   ├── <tên-phân-hệ>-brief.md                     # Tài liệu nghiệp vụ G1
  │   └── <tên-phân-hệ>-stories.md                   # User Stories & UX G2
  ├── architecture/
  │   └── <tên-phân-hệ>-design.md                    # Tech Stack, Schema, API G3
  ├── diagrams/
  │   └── <tên-sơ-đồ>.html                           # Sơ đồ HTML/SVG (dùng diagram-design)
  └── plans/<tên-phân-hệ-hoặc-sprint>/
      ├── roadmap.md                                 # Bản đồ tổng quan, Kanban & Dependency
      └── tasks/
          ├── task-01-<slug>.md                      # Task Card độc lập cho Subagent/Dev
          ├── task-02-<slug>.md
          └── task-03-<slug>.md
  ```
- **Mỗi file `task-XX-<slug>.md` là một Task Card tự chứa (Self-contained):**
  Chứa đầy đủ: Task ID, ID tính năng/story/AC, Phân hệ, Mục tiêu, Files cụ thể cần tạo/sửa, Tiêu chí nghiệm thu, Cách kiểm chứng, Trạng thái và liên kết evidence.
  Khi phân công cho Subagent Worker, truyền task card cùng scope được giao; worker đọc các nguồn liên kết cần thiết, không cần toàn bộ lịch sử chat.
- **Product Backlog:** Agent phải tạo/cập nhật ma trận Markdown trong dự án đích khi workflow được phép lưu. Dùng mẫu và công thức duy nhất ở `skill://product-workflow/references/records.md`, mục `Product Backlog dạng ma trận`; không tạo backlog mẫu trong repo chứa skills chỉ vì người dùng yêu cầu sửa skills.
  - Mỗi hàng là một tính năng: ID, phân hệ, ưu tiên, Story Points đã duyệt, AC đạt/tổng, trạng thái, `[ ]` / `[x]` và links stories/tasks/evidence. Task cards vẫn tách riêng.
  - G1 đã duyệt ghi phạm vi; G2 đã duyệt liên kết AC; G4 liên kết tasks và SP. Không tự gán SP chưa duyệt hoặc tính duyệt thiết kế thành AC đạt.
  - Sau mỗi kết quả thực thi, agent điều phối cập nhật điểm và tổng quan. Chỉ tích `[x]` khi đủ AC, review bắt buộc và kiểm chứng tích hợp; khi evidence mất hiệu lực thì bỏ tích phần ảnh hưởng và tính lại điểm.
  - Không có nguồn chính khác thì dùng local; nếu đã chọn Jira thì Markdown phản ánh Jira/evidence, không tự chuyển nguồn khi mất kết nối. Chỉ người điều phối ghi file tổng, không để workers cùng sửa.

### D. Thay thế hoàn toàn Mermaid bằng kỹ năng `diagram-design`
- **CẤM DÙNG MERMAID (mermaid code blocks):** Cú pháp Mermaid thường xuyên bị lỗi hiển thị, vỡ layout và không render đồng nhất.
- **Sử dụng `skill://diagram-design` cho mọi nhu cầu vẽ sơ đồ:**
  - Sơ đồ kiến trúc (Architecture), thực thể dữ liệu (ER / DB Schema), luồng gọi API (Sequence), hành trình người dùng (User Journey / Story Map), máy trạng thái (State Machine), luồng dữ liệu (Data Flow).
  - Xuất thành các file HTML / SVG độc lập chất lượng cao lưu vào thư mục `docs/workflow/diagrams/<tên-sơ-đồ>.html`.
  - Nhúng hoặc liên kết file sơ đồ vào các tài liệu tương ứng trong `docs/workflow/specs/` và `docs/workflow/architecture/`.

### E. Tích hợp Engine Browser Native: Tinh chỉnh Sơ đồ & Đề xuất Test Web
- **1. Sửa mũi tên & Font chữ trong Diagram bằng Engine Browser Native:**
  - Khi tạo sơ đồ HTML/SVG qua `skill://diagram-design`, AI kích hoạt Engine Browser Native (Chromium) để evaluate DOM thực tế:
    - **Font chữ & Bounding Box:** Đợi web font nạp xong (`document.fonts.ready`), dùng `getBBox()` và `getComputedTextLength()` đo chính xác độ dài chữ thực tế (đặc biệt là tiếng Việt có dấu). Tự động nới rộng hộp node nếu chữ tràn ra ngoài (overflow), đảm bảo padding tối thiểu 16px.
    - **Tọa độ mũi tên & Chống đè:** Tự động nắn lại tọa độ kết nối `(x1, y1)` và `(x2, y2)` của connector để bám khít vào mép hộp node sau khi đổi kích thước, không đâm xuyên vào thân hộp. Đảm bảo nhãn mũi tên cách đường stroke tối thiểu 6–10px, không đè lên mũi tên và các đường song song cách nhau ≥ 12px.
    - **Visual Confirmation:** Chụp ảnh màn hình ngầm (`tab.screenshot()`) để AI tự kiểm tra trực quan layout trước khi bàn giao file sơ đồ.
- **2. Đề xuất kiểm thử Web trên Browser Native qua `ask`:**
  - Đối với mọi task liên quan đến giao diện Web (Frontend UI, component, hoặc sau khi tạo sơ đồ HTML):
  - **CẤM TỰ Ý MỞ BROWSER LÀM PHIỀN HOẶC BỎ QUA KIỂM THỬ GIAO DIỆN:** AI bắt buộc phải gọi công cụ `ask` để hỏi người dùng có muốn mở Engine Browser Native để test web không:
    ```text
    ask(questions=[{
      "id": "browser_test_option",
      "question": "Tôi đã hoàn thành giao diện/sơ đồ web. Bạn có muốn kích hoạt Engine Browser Native để mở và kiểm thử trực quan trên trình duyệt không?",
      "options": [
        {"label": "Mở Browser Native để kiểm thử", "description": "Tự động khởi chạy Chromium, tải trang web/sơ đồ và kiểm tra giao diện trực quan."},
        {"label": "Bỏ qua kiểm thử browser", "description": "Chỉ kiểm tra mã nguồn và unit tests trong terminal."},
        {"label": "Chạy kiểm thử ngầm (Headless Screenshot)", "description": "Chụp ảnh màn hình ngầm để kiểm tra lỗi layout mà không mở cửa sổ tương tác."}
      ],
      "recommended": 0
    }])
    ```
  - Nếu người dùng chọn mở Browser Native: AI dùng `browser.open` kết nối tới local dev server hoặc file HTML, tương tác với các nút bấm/form, kiểm tra console logs, chụp ảnh màn hình và báo cáo cho người dùng.

---

## 3. Chiến lược thực thi: Hỏi người dùng chọn Subagents qua `ask`

Sau khi Cổng G4 (Plan & Tasks) được duyệt, AI **bắt buộc dùng `ask`** để người dùng lựa chọn chế độ thực thi mã nguồn:

```text
? Bạn muốn triển khai các task theo hình thức nào?
  1. Spawn Subagents (Task Worker + Reviewer từng task + Reviewer tổng) [Khuyến nghị cho OMP]
  2. Thực thi tuần tự trực tiếp (Main Agent tự code và test từng task)
  3. Từng task có xác nhận (Dừng lại sau mỗi task để bạn kiểm tra diff)
```

### Quy trình mô hình Subagents 3 tầng:
1. **Tầng 1 - Task Worker (Subagent):**
   - Main Agent dispatch subagent worker (qua công cụ `task`), truyền **đúng file `tasks/task-XX-<slug>.md`**.
   - Worker thực thi đúng phạm vi, ghi evidence và bàn giao task ở trạng thái Review, không tự tích Done. Agent điều phối chạy kiểm chứng trên bản tích hợp; workers không cùng sửa ma trận chung.
2. **Tầng 2 - Task Reviewer (Subagent từng task):**
   - Ngay khi Worker hoàn thành, Main Agent dispatch subagent reviewer (agent role `reviewer`).
   - Reviewer kiểm tra diff của task đối chiếu với file `task-XX-<slug>.md`:
     - *Spec Compliance:* Có đáp ứng đúng AC không? Có code thừa ngoài phạm vi không?
     - *Code Quality:* Mã nguồn có sạch, đúng quy ước dự án và không làm vỡ logic cũ không?
   - Nếu phát hiện vấn đề: Yêu cầu Worker sửa lại và review lại. Agent điều phối chỉ đánh dấu task Done khi đủ DoD, rồi cập nhật roadmap và điểm AC liên quan; không tự tích tính năng.
3. **Tầng 3 - Reviewer Tổng (Final Reviewer sau khi xong toàn bộ tasks):**
   - Sau khi workers bàn giao và review từng task đạt, nghiệm thu tích hợp; không chờ tính năng được đánh dấu Done mới kiểm chứng.
   - Quét toàn bộ git diff của cả phân hệ/tính năng.
   - Đối chiếu kết quả kiểm thử tích hợp/regression do agent điều phối chạy trên revision tích hợp.
   - Đối chiếu với Definition of Done (DoD) và đánh giá độ sẵn sàng phát hành.
   - Agent điều phối cập nhật checkbox tính năng và tổng điểm trong Product Backlog theo kết quả nghiệm thu, rồi báo người dùng đường dẫn và phần còn thiếu.

---

## 4. Bảng nhận diện suy nghĩ bao biện (Red Flags Table)
Nếu AI xuất hiện bất kỳ suy nghĩ nào dưới đây, **PHẢI DỪNG LẠI NGAY LẬP TỨC**:

| Suy nghĩ bao biện của AI | Sự thật / Lệnh cấm bắt buộc |
|---|---|
| *"Tôi tự suy đoán nghiệp vụ hoặc hỏi vụn vặt ngay mà không phân rã phân hệ."* | **SAI.** Phải đánh giá quy mô, đề xuất danh mục phân hệ và dùng `ask` chốt phân hệ làm trước. |
| *"Tôi gom hết 40 tasks vào 1 file plan.md duy nhất cho tiện."* | **SAI.** Gây xung đột Git và vỡ context. Phải chia thành file task độc lập trong thư mục `tasks/`. |
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
