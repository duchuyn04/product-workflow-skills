---
name: product-discovery
description: "Phỏng vấn nghiệp vụ chuyên sâu, xác định mục tiêu, actors, quy tắc domain, dữ liệu, ngoại lệ và phạm vi trước khi chốt stories hoặc thay đổi yêu cầu."
hide: true
---

# Product discovery

Đọc `skill://product-workflow/references/contract.md` trước; nếu URI chưa được khám phá, đọc `.agents/skills/product-workflow/references/contract.md`. Đây là bước chuyên gia, không tự mở một workflow bao trùm khác.

## Đầu vào

Yêu cầu hiện tại, dự án/scope, tài liệu và quyết định đã có, người hiểu nghiệp vụ, mục tiêu/ràng buộc đã biết. Nếu được yêu cầu tiếp tục, đọc checkpoint và các nguồn được trỏ tới, không bắt đầu một bảng hỏi mới từ đầu.

## Quy trình phỏng vấn nghiệp vụ (Bắt buộc dùng `ask`)

### 1. Đánh giá quy mô & Phân rã trước khi hỏi
CẤM TỰ Ý ĐOÁN NGHIỆP VỤ rồi đưa ra bản tóm tắt có sẵn. AI phải đánh giá quy mô bài toán:
- **Nếu là tính năng nhỏ / đơn lẻ:** Tiến hành 1 vòng phỏng vấn (3–5 câu hỏi trọng tâm qua `ask`) ──► Chốt brief.
- **Nếu là dự án lớn / nền tảng phức tạp (Website hoàn chỉnh, SaaS, E-commerce, ERP...):**
  - **Tuyệt đối không dồn hàng chục hay hàng trăm câu hỏi vào một lượt.**
  - **Phân rã thành các phân hệ trước (Decomposition First):** Cùng người dùng vạch ra bức tranh toàn cảnh và phân rã thành danh mục các phân hệ độc lập (ví dụ: Auth & Phân quyền, Danh mục & Sản phẩm, Đặt hàng & Thanh toán, Quản lý kho, Quản trị Admin...).
  - **Bắt buộc dùng `ask` để duyệt Danh mục phân hệ & chọn phân hệ làm trước (MVP):**
    ```text
    ask(questions=[{
      "id": "module_catalogue_approval",
      "question": "Dự án có quy mô [Vừa/Lớn], tôi đề xuất phân rã thành các phân hệ sau. Bạn có đồng ý với danh mục này và muốn bắt đầu với phân hệ nào?",
      "options": [
        {"label": "Duyệt danh mục và bắt đầu với Phân hệ 1 (MVP)", "description": "Tập trung phỏng vấn nghiệp vụ cho phân hệ cốt lõi trước."},
        {"label": "Cần điều chỉnh danh mục phân hệ", "description": "Thêm, bớt hoặc gộp các phân hệ trước khi phỏng vấn."},
        {"label": "Chọn phân hệ khác để bắt đầu", "description": "Ưu tiên một phân hệ khác làm trước."}
      ],
      "recommended": 0
    }])
    ```
  - Chỉ sau khi người dùng chốt danh mục và chọn phân hệ, AI mới bắt đầu phỏng vấn cho đúng phân hệ đó.
### 2. Phỏng vấn cuốn chiếu nhiều vòng (Multi-Round Thematic Deep-Dive)
Với mỗi phân hệ, AI tiến hành phỏng vấn sâu qua **nhiều vòng (nhiều lượt trao đổi)**, mỗi lượt tập trung vào một chủ đề:
1. *Vòng 1 - Luồng người dùng chính:* Happy path, triggers, các bước thao tác, dữ liệu nhập và kết quả mong muốn.
2. *Vòng 2 - Quy tắc nghiệp vụ cốt lõi:* Công thức tính toán, trạng thái dữ liệu, điều kiện ràng buộc (invariants).
3. *Vòng 3 - Xử lý ngoại lệ & lỗi biên:* Trùng lặp dữ liệu, thao tác đồng thời, mất kết nối, người dùng nhập sai, hết quyền hạn.
4. *Vòng 4 - Tích hợp & phi chức năng:* Dịch vụ bên thứ ba (cổng thanh toán, vận chuyển, email), giới hạn SLA, bảo mật.

*Tổng số câu hỏi có thể lên tới hàng chục đến hàng trăm câu hỏi qua nhiều lượt trao đổi, đào sâu chi tiết từng góc cạnh của website.*

### 3. Kỹ thuật giảm tải nhận thức qua công cụ `ask`
Để người dùng không bị mệt mỏi khi phải trả lời nhiều câu hỏi:
- AI đưa ra câu hỏi dạng trắc nghiệm với các phương án lựa chọn A, B, C cụ thể qua `ask`, nêu rõ tình huống và gợi ý phương án chuẩn công nghiệp.
- Người dùng chỉ cần bấm chọn phương án phù hợp.
- Sau mỗi vòng phỏng vấn, AI dùng `ask` hỏi: *"Bạn có muốn phỏng vấn sâu tiếp về [chủ đề tiếp theo] không, hay thông tin đã đủ để chốt Business Brief cho phân hệ này?"*
- Chỉ khi người dùng xác nhận đã đủ thông tin, AI mới bắt đầu tổng hợp thành tài liệu Business Brief.
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

## Đầu ra: Lưu file tài liệu vật lý (Docs-First)

AI **BẮT BUỘC DÙNG CÔNG CỤ `write` TẠO FILE THẬT** tại đường dẫn:
`docs/workflow/specs/<tên-tính-năng>-brief.md`

Nội dung file bao gồm:
- Stakeholders/actors và ma trận quyền theo hành động/dữ liệu.
- Glossary: thuật ngữ, định nghĩa domain, ví dụ và từ dễ nhầm.
- As-is/to-be: luồng, trigger, tiền/hậu điều kiện, handoff và ngoại lệ. Sơ đồ quy trình nghiệp vụ: **CẤM DÙNG MERMAID**, bắt buộc dùng `skill://diagram-design` (`type-process.md` hoặc `type-flowchart.md`) tạo file `docs/workflow/diagrams/<tên-tính-năng>-process.html` và chèn liên kết vào tài liệu.
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

G1 đạt khi người phụ trách nghiệp vụ xác nhận mục tiêu và phạm vi, quy tắc của phần tính năng sắp làm đã đủ rõ ràng, và các câu hỏi còn mở không gây tắc nghẽn phần việc đó.

**Quy tắc dừng lượt bắt buộc:** Sau khi dùng công cụ `write` lưu file `docs/workflow/specs/<tên-tính-năng>-brief.md`, AI phải **DỪNG TIN NHẮN** và gọi công cụ `ask` của Oh My Pi:
- Câu hỏi: *"Tôi đã phỏng vấn và ghi lại Business Brief tại `docs/workflow/specs/<tên-tính-năng>-brief.md`. Bạn có duyệt tài liệu này (Cổng G1) để chuyển sang thiết kế User Stories & UX (Cổng G2) không?"*
- Tùy chọn: `[Duyệt và tiếp tục]` (Recommended), `[Cần điều chỉnh quy tắc]`, `[Xem giải thích chi tiết]`.

Đủ G1 thì chuyển đề xuất sang `story-and-experience` (G2). Đây là bước tiếp theo DUY NHẤT; tuyệt đối không nhảy cóc sang kiến trúc (G3) hay viết code (`task-execution`). Không tự chọn giải pháp kỹ thuật trong discovery.

Khi G1 được người dùng duyệt và workflow được phép lưu, tạo/cập nhật hàng tính năng trong `docs/workflow/product-backlog.md` (hoặc backlog hiện hữu) theo mẫu `skill://product-workflow/references/records.md`. Ghi ID ổn định, module, scope và liên kết brief; ưu tiên chưa chốt ghi chưa xác định, SP `—`, AC `Chưa xác định`, hoàn thành `[ ]`. Đây là danh mục phạm vi, không phải task triển khai hay quyền publish Jira. Không tự thêm tính năng từ ví dụ phân hệ.

## Thay đổi và tiếp tục

Khi rule đổi, ghi delta so với revision đã duyệt; liệt kê stories/flows/contracts cần xem lại nếu đã có liên kết. Không xóa lịch sử hoặc kéo toàn dự án về Draft. Bàn giao cho `delivery-inspection` để đánh giá tác động liên ngành khi cần.

Kết thúc bằng: kết luận đã xác nhận, điều chưa rõ, G1 của scope hiện tại và bước tiếp theo. Lưu checkpoint theo hợp đồng nếu được phép; không tạo backlog Jira hoặc code ở bước này.
