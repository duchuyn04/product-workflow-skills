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
### 2. Kỹ thuật phỏng vấn đào sâu theo Wayfinding Map & Case Study (Học hỏi từ Matt Pocock)

Với phân hệ đang được chọn, AI tiến hành phỏng vấn sâu qua từng vòng chủ đề, kết hợp sức mạnh từ 3 kỹ thuật của Matt Pocock: `wayfinder` (Bản đồ khai phá), `grilling` (Phỏng vấn đào sâu) và `domain-modeling` (Làm sắc bén thuật ngữ):

#### A. Bản đồ Khai phá Nghiệp vụ (Wayfinding Map) & Quản lý Sương mù (Fog of War)
Thay vì để dự án rơi vào cảnh mù mịt hoặc hỏi tràn lan, AI chia lộ trình phỏng vấn phân hệ thành 4 vùng nhận thức:
1. **Đích đến (Destination):** Xác định rõ mục tiêu cuối cùng của Cổng G1: Hoàn thành bản Business Brief chuẩn xác cho phân hệ đang phỏng vấn, sẵn sàng chuyển giao cho G2 (User Stories & UX).
2. **Quyết định đã chốt (Decisions So Far):** Ghi nhận có hệ thống các quyết định nghiệp vụ đã chốt qua từng vòng case study. Đây là nền tảng vững chắc để mở khóa các câu hỏi tiếp theo.
3. **Mặt trận câu hỏi (The Frontier):** Chỉ hỏi 3–5 câu hỏi/case study mà các tiền đề của nó đã được giải quyết ở *Decisions So Far*. Tuyệt đối không hỏi trước những câu hỏi mà điều kiện tiên quyết chưa được chốt.
4. **Vùng sương mù (Not Yet Specified / Fog of War):** Những bài toán phức tạp (đối soát hoa hồng, tranh chấp khiếu nại, đồng bộ hệ thống cũ...) chưa đủ sắc bén sẽ tạm giữ trong sương mù. Khi Frontier tiến tới, sương mù tan dần và chúng mới "tốt nghiệp" thành câu hỏi cụ thể.
5. **Ngoài phạm vi (Out of Scope):** Chủ động nhận diện và gạt bỏ những tính năng người dùng đã từ chối để bảo vệ dự án khỏi phình to phạm vi (scope creep).

#### B. Tự tra cứu sự thật (Finding facts is AI's job, never the user's)
- AI tự động khai thác codebase, schema cơ sở dữ liệu hiện có, tài liệu API công khai của bên thứ ba (Stripe, VNPay, OAuth, Firebase...) hoặc thư viện kỹ thuật.
- **TUYỆT ĐỐI KHÔNG HỎI NGƯỜI DÙNG** những thông tin kỹ thuật mà AI có thể tự tra cứu được. Chỉ hỏi người dùng những **Quyết định nghiệp vụ (Decisions & Tradeoffs)** qua các Case Study thực tế.

#### C. CẤM HỎI CHUNG CHUNG TRỪU TƯỢNG — Bắt buộc dùng Case Study cụ thể (Concrete Scenarios)
- **Sai lầm bị cấm:** Hỏi những câu vu vơ, chung chung như: *"Hệ thống xử lý thanh toán thế nào?"*, *"Quy tắc của bạn là gì?"*, *"Có những lỗi nào có thể xảy ra?"*.
- **Bắt buộc đưa Case Study thực tế (Stress-testing Scenarios):**
  Tạo ra các kịch bản va chạm thực tế có bối cảnh, số liệu, actors và xung đột nghiệp vụ rõ ràng:
  - *Ví dụ Case Study Đặt hàng & Khuyến mãi:* *"Khách hàng A đặt đơn 500.000đ, áp mã giảm giá 50.000đ (điều kiện đơn từ 400.000đ). Đơn gồm 2 món. Sau đó người bán hết món 1 (200.000đ) và muốn hủy món 1. Giá trị đơn giảm còn 300.000đ (< 400.000đ). Hệ thống sẽ: A. Hủy toàn bộ voucher 50k (khách trả 300k)? B. Giữ voucher theo tỷ lệ (khách trả 270k)? C. Không cho phép hủy 1 phần, bắt buộc hủy cả đơn?"*
  - *Ví dụ Case Study Tranh chấp kho:* *"Mặt hàng chỉ còn 1 cái cuối cùng. Khách 1 đang ở bước thanh toán chưa nhập OTP, khách 2 cũng bấm mua. Hệ thống sẽ khóa tạm 15 phút (Reservation lock) cho khách 1 hay ai thanh toán trước thì được (First-paid-first-served)?"*

#### D. Làm sắc bén ngôn ngữ Domain (Sharpen Fuzzy Language)
Khi người dùng dùng các từ ngữ mơ hồ hoặc nhập nhằng ngữ nghĩa, AI phải bắt bẻ và đề xuất thuật ngữ chuẩn xác ngay lập tức:
- *"Bạn nói 'người dùng'/'khách' — hệ thống phân biệt Khách vãng lai (Guest) hay bắt buộc đăng ký tài khoản (Member)?"*
- *"Bạn nói 'hủy đơn' — là Hủy khi chưa thanh toán (Abandon), Hủy sau khi đã trừ tiền cần hoàn trả (Cancel & Refund), hay Hủy khi hàng đang trên đường giao (Return)?"*
- *"Bạn nói 'duyệt' — là hệ thống tự duyệt theo rule hay cần Admin thao tác thủ công?"*

#### E. Giảm tải nhận thức qua câu hỏi trắc nghiệm `ask` kèm Phương án Khuyến nghị
Mỗi lượt trao đổi chỉ gồm **3–5 câu hỏi trắc nghiệm qua `ask`**, mỗi câu đều có phương án khuyến nghị (Recommended) chuẩn công nghiệp:
```text
ask(questions=[{
  "id": "scenario_partial_cancellation",
  "question": "[Case Study - Hủy đơn một phần]: Khách đặt 2 món (500k) áp mã giảm 50k (đơn tối thiểu 400k). Shop hết 1 món (200k) muốn hủy. Khi giá trị đơn giảm còn 300k, hệ thống xử lý voucher thế nào?",
  "options": [
    {"label": "Giữ voucher tính theo tỷ lệ giá trị món còn lại", "description": "Khách vẫn được giảm tỷ lệ tương ứng, trải nghiệm khách hàng tốt nhất (Khuyên dùng)."},
    {"label": "Thu hồi toàn bộ voucher vì đơn < 400k", "description": "Bảo vệ chặt chẽ ngân sách marketing của shop nhưng có thể gây khiếu nại."},
    {"label": "Không cho hủy một phần, hủy toàn bộ đơn", "description": "Đơn giản hóa nghiệp vụ kế toán nhưng giảm tỷ lệ chuyển đổi."}
  ],
  "recommended": 0
}])
```

#### F. Hoàn thành dứt điểm từng phân hệ trước khi chuyển sang Cổng G2
- AI phỏng vấn sâu qua từng chủ đề của phân hệ cho đến khi **toàn bộ sương mù tan biến và mặt trận câu hỏi trống (Frontier rỗng)**.
- Sau mỗi vòng, AI dùng `ask` hỏi: *"Bạn có muốn đào sâu thêm case study nào khác của phân hệ [Tên Phân Hệ] không, hay đã đủ để chốt Business Brief?"*.
- Khi người dùng xác nhận đã đủ thông tin, AI xuất file `docs/workflow/specs/<tên-phân-hệ>-brief.md`, dừng tin nhắn và gọi `ask` để xin duyệt Cổng G1.
- **Tuyệt đối không nhảy sang Cổng G2 (Stories & UX) khi phân hệ hiện tại chưa đạt G1 với đầy đủ case study cụ thể.**
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
