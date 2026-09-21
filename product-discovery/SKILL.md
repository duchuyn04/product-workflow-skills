---
name: product-discovery
description: "Phỏng vấn nghiệp vụ chuyên sâu, xác định mục tiêu, actors, quy tắc domain, dữ liệu, ngoại lệ và phạm vi trước khi chốt stories hoặc thay đổi yêu cầu."
hide: true
---

# Product discovery

Đọc `skill://product-workflow/references/contract.md` trước; nếu URI chưa được khám phá, đọc `.agents/skills/product-workflow/references/contract.md`. Đây là bước chuyên gia, không tự mở một workflow bao trùm khác.

## Đầu vào

Yêu cầu hiện tại, dự án/scope, tài liệu và quyết định đã có, người hiểu nghiệp vụ, mục tiêu/ràng buộc đã biết. Nếu được yêu cầu tiếp tục, đọc checkpoint và các nguồn được trỏ tới, không bắt đầu một bảng hỏi mới từ đầu.

## 0. Các hình thức thu thập và Phân tích bài toán thực tế (Practical Requirements Analysis)

### A. 7 hình thức thu thập yêu cầu từ thực tế
Khi tiếp cận một bài toán mới hoặc dự án thực tế, AI chủ động nhận diện nguồn thông tin và áp dụng các hình thức thu thập phù hợp:
1. **Phỏng vấn khách hàng (Customer Interview):** Trao đổi trực tiếp để hiểu mong muốn, khó khăn và kỳ vọng của các bên liên quan.
2. **Họp với khách hàng (Client Meeting):** Họp làm việc định kỳ để thống nhất phạm vi, giải quyết xung đột ý kiến.
3. **Quan sát quy trình nghiệp vụ (Business Process Observation):** Đi thực tế, quan sát nhân viên thao tác hằng ngày để tìm điểm nghẽn (bottlenecks).
4. **Phiếu khảo sát (Survey / Questionnaire):** Thu thập ý kiến số đông người dùng cuối về mức độ hài lòng hoặc nhu cầu tính năng.
5. **Email / Tài liệu yêu cầu (Requirement Documents & Specs):** Đọc kỹ tài liệu mô tả, hợp đồng, RFP hoặc trao đổi qua email.
6. **Feedback từ hệ thống đang sử dụng (Legacy System Feedback):** Khai thác phản hồi, báo cáo lỗi hoặc bất cập của hệ thống hiện tại.
7. **Yêu cầu thay đổi / bổ sung chức năng (Change Requests):** Tiếp nhận yêu cầu mở rộng, cập nhật quy trình nghiệp vụ mới.

### B. Phân tích bài toán thực tế: Chuyển đổi As-Is sang To-Be
AI không chỉ ghi nhận yêu cầu rời rạc mà phải chuyển hóa thành bức tranh hệ thống:
1. **Nêu ra vấn đề thực tế (Hiện trạng - As-Is):** Chỉ rõ các khó khăn, bất cập trong cách vận hành hiện tại (ví dụ: quản lý thủ công bằng Excel và sổ sách dẫn đến sai lệch tồn kho, thất thoát đơn hàng, khó tra cứu lịch sử khách hàng, tính toán tiền/giảm giá chậm chạp, thiếu báo cáo tức thời).
2. **Đề xuất phương án công nghệ & Chuẩn hóa quy trình (Tương lai - To-Be):** Xây dựng hệ thống phần mềm xử lý tự động, chuẩn hóa dữ liệu tập trung, phân quyền vai trò minh bạch, tự động hóa tính tiền, trừ kho tức thời và xuất báo cáo tự động theo thời gian thực.

### C. Nhận diện nhóm User (Actors) và Phân rã Danh mục Epic ban đầu
Từ đoạn mô tả và phân tích nghiệp vụ, AI thực hiện hai nhiệm vụ nền tảng:
1. **Xác định các nhóm User (Actors) chính:** Liệt kê các đối tượng sẽ trực tiếp sử dụng hoặc tương tác với hệ thống (ví dụ trong hệ thống bán hàng: *Nhân viên bán hàng*, *Nhân viên kho*, *Quản lý cửa hàng*, *Khách hàng*).
2. **Phân rã thành Danh mục Epics (Nhóm chức năng lớn):** Gom các yêu cầu có cùng miền trách nhiệm thành từng Epic độc lập, gán mã chuẩn `EP01`, `EP02`, `EP03`...
   - Đặt tên hiển thị theo mục `Quy ước tên Epic/Module` trong `skill://product-workflow/references/records.md`.
   - Danh mục Epic này là cấu trúc gốc để phân rã thành User Stories tại Cổng G2 và quản lý trên Jira tại Cổng G4.
## Quy trình phỏng vấn nghiệp vụ (Bắt buộc dùng `ask`)

### 1. Đánh giá quy mô & Phân rã trước khi hỏi
Đọc codebase, tài liệu, schema và các quyết định sẵn có trước khi hỏi; không bắt người dùng trả lời lại các dữ kiện đã có. CẤM TỰ Ý ĐOÁN NGHIỆP VỤ khi thiếu các quyết định kinh doanh cốt lõi. AI đánh giá quy mô bài toán:
- **Nếu là phạm vi đơn giản / tính năng nhỏ / đã có tài liệu đủ rõ:** Chỉ hỏi các quyết định nghiệp vụ còn thiếu (nếu có), không tạo phỏng vấn nhân tạo kéo dài ──► Chốt brief.
- **Nếu là dự án lớn / nền tảng phức tạp (Website hoàn chỉnh, SaaS, E-commerce, ERP...):**
  - Tuyệt đối không dồn quá nhiều câu hỏi vào một lượt.
  - **Phân rã thành các phân hệ trước (Decomposition First):** Cùng người dùng vạch ra bức tranh toàn cảnh và phân rã thành danh mục các phân hệ/module độc lập, tuân thủ quy ước `Quản lý + ...`.
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
3. **Mặt trận câu hỏi (The Frontier):** Chỉ hỏi quyết định còn thiếu có tiền đề đã rõ trong *Decisions So Far*. Có nhiều câu thì gom một đợt nhỏ; còn một câu thì chỉ hỏi một câu.
4. **Vùng sương mù (Not Yet Specified / Fog of War):** Những bài toán phức tạp (đối soát hoa hồng, tranh chấp khiếu nại, đồng bộ hệ thống cũ...) chưa đủ sắc bén sẽ tạm giữ trong sương mù. Khi Frontier tiến tới, sương mù tan dần và chúng mới "tốt nghiệp" thành câu hỏi cụ thể.
5. **Ngoài phạm vi (Out of Scope):** Chủ động nhận diện và gạt bỏ những tính năng người dùng đã từ chối để bảo vệ dự án khỏi phình to phạm vi (scope creep).

#### B. Tự tra cứu sự thật (Finding facts is AI's job, never the user's)
- AI tự động khai thác codebase, schema cơ sở dữ liệu hiện có, tài liệu API công khai của bên thứ ba (Stripe, VNPay, OAuth, Firebase...) hoặc thư viện kỹ thuật.
- **TUYỆT ĐỐI KHÔNG HỎI NGƯỜI DÙNG** những thông tin kỹ thuật mà AI có thể tự tra cứu được. Chỉ hỏi người dùng những **Quyết định nghiệp vụ (Decisions & Tradeoffs)** qua các Case Study thực tế.

#### C. Đưa Case Study thực tế có trọng tâm (Concrete Scenarios)
- Tránh câu hỏi trừu tượng, chung chung (*"Quy tắc của bạn là gì?"*).
- Đưa kịch bản va chạm thực tế ngắn gọn có bối cảnh, số liệu, actors và xung đột nghiệp vụ cụ thể để người dùng ra quyết định (ví dụ: xử lý khuyến mãi khi hủy 1 phần đơn hàng, hoặc chính sách giữ hàng khi tranh chấp kho tồn cuối cùng).

#### D. Làm sắc bén ngôn ngữ Domain (Sharpen Fuzzy Language)
Khi người dùng dùng từ ngữ mơ hồ, AI làm rõ và đề xuất thuật ngữ chuẩn xác (ví dụ: phân biệt Guest vs Member, Abandon vs Cancel vs Return, hệ thống tự duyệt vs Admin duyệt thủ công).

#### E. Tiến hành phỏng vấn có trọng tâm và điều kiện kết thúc discovery
- Phỏng vấn qua `ask` theo chủ đề/rủi ro áp dụng: luồng chính, ràng buộc, đồng thời, tích hợp, quyền và vòng đời dữ liệu. Số câu theo quyết định còn thiếu, không theo quota.
- **Điều kiện dừng phỏng vấn:** Khi các thông tin về phạm vi (scope), mục tiêu (goals), actors, quy tắc cốt lõi (rules) và ràng buộc dữ liệu của phần việc sắp làm đã đủ rõ ràng, và không còn câu hỏi chặn (blocking questions).
- Khi đủ điều kiện, AI dừng phỏng vấn ngay, tổng hợp Business Brief, lưu/cập nhật file và gọi `ask` xin duyệt Cổng G1.
- **Dừng sớm không phải là Ready:** Nếu người dùng chủ động yêu cầu dừng sớm khi vẫn còn câu hỏi chặn hoặc quy tắc cốt lõi chưa rõ, AI ghi rõ các câu hỏi mở và blocker vào tài liệu brief, đánh dấu trạng thái `draft` hoặc `awaiting-resolution`. Việc dừng sớm khi còn blocker KHÔNG được coi là approved readiness để chuyển sang G2.
## Đầu ra: Lưu file tài liệu vật lý (Docs-First)

AI **BẮT BUỘC DÙNG CÔNG CỤ `write` TẠO HOẶC CẬP NHẬT FILE** tại đường dẫn:
`docs/workflow/specs/<tên-phân-hệ>-brief.md`

*Lưu ý cập nhật:* Khi bổ sung hoặc tinh chỉnh phạm vi của phân hệ đã có, cập nhật trực tiếp vào file brief hiện hữu của phân hệ đó, không tạo thêm file tài liệu mới rời rạc cho mỗi thay đổi nhỏ.

Nội dung file bao gồm:
- Stakeholders/actors chính và ma trận quyền theo hành động/dữ liệu.
- Danh mục Epics khởi tạo (`EP01`, `EP02`,...) theo mục `Quy ước tên Epic/Module` trong `skill://product-workflow/references/records.md`.
- Bảng phân tích hiện trạng và mục tiêu (As-Is vs To-Be): từ vấn đề thực tế đến giải pháp công nghệ chuẩn hóa.
- Glossary: thuật ngữ, định nghĩa domain, ví dụ và từ dễ nhầm.
- As-is/to-be: luồng, trigger, tiền/hậu điều kiện, handoff và ngoại lệ. Sơ đồ quy trình nghiệp vụ: Chỉ bắt buộc khi quy trình có độ phức tạp cao, nhiều luồng rẽ nhánh/ngoại lệ hoặc khi người dùng yêu cầu rõ ràng; tái sử dụng sơ đồ hợp lệ đã có nếu quy trình không đổi. Với luồng nghiệp vụ đơn giản hoặc tuần tự, mô tả bảng luồng nghiệp vụ trong tài liệu là đủ. Khi tạo mới hoặc cập nhật sơ đồ: **CẤM DÙNG MERMAID**, bắt buộc dùng `skill://diagram-design` (`type-process.md` hoặc `type-flowchart.md`) tạo file `docs/workflow/diagrams/<tên-phân-hệ>-process.html`, chèn liên kết vào tài liệu và kiểm chứng hiển thị bằng browser-native.
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

**Quy tắc dừng lượt bắt buộc:** Sau khi dùng công cụ `write` lưu hoặc cập nhật file `docs/workflow/specs/<tên-phân-hệ>-brief.md`, AI phải **DỪNG TIN NHẮN** và gọi công cụ `ask` của Oh My Pi:
- Câu hỏi: *"Tôi đã hoàn thành Business Brief tại `docs/workflow/specs/<tên-phân-hệ>-brief.md`. Bạn có duyệt tài liệu này (Cổng G1) để chuyển sang thiết kế User Stories & UX (Cổng G2) không?"*
- Tùy chọn: `[Duyệt và tiếp tục]` (Recommended), `[Cần điều chỉnh quy tắc]`, `[Xem giải thích chi tiết]`.

Đủ G1 thì chuyển đề xuất sang `story-and-experience` (G2). Đây là bước tiếp theo DUY NHẤT; tuyệt đối không nhảy cóc sang kiến trúc (G3) hay viết code (`task-execution`). Không tự chọn giải pháp kỹ thuật trong discovery.

Khi G1 được người dùng duyệt và workflow được phép lưu, tạo/cập nhật hàng tính năng trong `docs/workflow/product-backlog.md` (hoặc backlog hiện hữu) theo mẫu `skill://product-workflow/references/records.md`. Ghi ID ổn định, module, scope và liên kết brief; ưu tiên chưa chốt ghi chưa xác định, SP `—`, AC `Chưa xác định`, hoàn thành `[ ]`. Đây là danh mục phạm vi, không phải task triển khai hay quyền publish Jira. Không tự thêm tính năng từ ví dụ phân hệ.

## Thay đổi và tiếp tục

Khi rule đổi, ghi delta so với revision đã duyệt; liệt kê stories/flows/contracts cần xem lại nếu đã có liên kết. Không xóa lịch sử hoặc kéo toàn dự án về Draft. Bàn giao cho `delivery-inspection` để đánh giá tác động liên ngành khi cần.

Kết thúc bằng: kết luận đã xác nhận, điều chưa rõ, G1 của scope hiện tại và bước tiếp theo. Lưu checkpoint theo hợp đồng nếu được phép; không tạo backlog Jira hoặc code ở bước này.
