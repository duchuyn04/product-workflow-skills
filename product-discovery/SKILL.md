---
name: product-discovery
description: "Phỏng vấn nghiệp vụ chuyên sâu, xác định mục tiêu, actors, quy tắc domain, dữ liệu, ngoại lệ và phạm vi trước khi chốt stories hoặc thay đổi yêu cầu."
hide: true
disable-model-invocation: true
---

# Product discovery

Đọc `skill://product-workflow/references/contract.md` trước; nếu URI chưa được khám phá hoặc harness không hỗ trợ `skill://` (như Claude Code), đọc `<skills-dir>/product-workflow/references/contract.md`; `<skills-dir>` là thư mục cha của skill này (`.claude/skills/`, `.agents/skills/` hoặc bản toàn cục); tên công cụ quy đổi theo `<skills-dir>/product-workflow/references/harness.md`. Đây là bước chuyên gia, không tự mở một workflow bao trùm khác.

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

### 1. Khảo sát Quy mô dự án qua `ask` & Phân rã theo độ lớn nhỏ (Tránh cầu toàn / Over-engineering)
Đọc codebase, tài liệu, schema và các quyết định sẵn có trước khi hỏi; không bắt người dùng trả lời lại các dữ kiện đã có. CẤM TỰ Ý ĐOÁN NGHIỆP VỤ khi thiếu các quyết định kinh doanh cốt lõi.

#### A. Bước bắt buộc số 0: Khảo sát Quy mô mong muốn qua `ask` (Tránh cầu toàn)
Ngay sau khi biết tên hoặc ý tưởng dự án, nếu người dùng chưa chỉ định rõ quy mô và mức độ đầu tư trong yêu cầu ban đầu, **AI BẮT BUỘC PHẢI GỌI CÔNG CỤ `ask` ĐẦU TIÊN** để người dùng chọn quy mô mong muốn:

```text
ask(questions=[{
  "id": "project_scale_selection",
  "question": "Bạn muốn định hình dự án này ở quy mô nào để tôi thiết kế bộ câu hỏi case study và phạm vi phù hợp nhất (tránh cầu toàn quá mức hoặc thiếu sót cốt lõi)?",
  "options": [
    {"label": "1. MVP Tinh gọn (Proof of Concept / Đồ án / Khảo sát thị trường)", "description": "Tập trung duy nhất vào 1 luồng giá trị cốt lõi, phỏng vấn nhanh 5–15 case study then chốt, không hỏi các bài toán phức tạp của Enterprise."},
    {"label": "2. Hệ thống Hoàn chỉnh Vừa (SME / Cửa hàng / Web kinh doanh thật)", "description": "Có đầy đủ Auth, CRUD, thanh toán cơ bản, phân quyền User/Admin; phỏng vấn kỹ về tiền bạc, dữ liệu và luồng lỗi cơ bản."},
    {"label": "3. Nền tảng Lớn / Enterprise / Multi-tenant SaaS", "description": "Hệ thống phức tạp, nhiều phân hệ, tải cao; bắt buộc phân rã phân hệ trước và phỏng vấn đào sâu toàn diện mọi ngóc ngách 6 trụ cột Core."}
  ],
  "recommended": 0
}])
```

**Mục đích cốt lõi — Chống bệnh cầu toàn (Over-engineering):**
- *Tránh bẫy cầu toàn quá mức:* Không thể đem tiêu chuẩn phỏng vấn của ngân hàng/hệ thống Enterprise (như distributed locking, đối soát kế toán đa chi nhánh, disaster recovery, microservices...) ra để tra khảo một dự án MVP tinh gọn, đồ án sinh viên hay website cửa hàng nhỏ. Điều đó làm người dùng kiệt sức và đi chệch mục tiêu.
- *Tránh bẫy hời hợt:* Ngược lại, nếu người dùng chọn Nền tảng lớn / Production thật, AI không được phép làm qua loa vài ba câu rồi vội chốt brief.

#### B. Khớp độ sâu case study với quy mô dự án đã chọn
Quy mô đã chọn là thước đo bắt buộc để AI tự động điều chỉnh độ sâu:
- **Với quy mô 1 (MVP Tinh gọn):**
  - **TRÁNH CẦU TOÀN:** Tuyệt đối KHÔNG hỏi các bài toán phức tạp của Enterprise (không hỏi phân tán dữ liệu, không hỏi đối soát hoa hồng nhiều tầng, không hỏi phân quyền 10 cấp...).
  - **TẬP TRUNG CORE CỦA MVP:** Chỉ hỏi các kịch bản va chạm thực tế của luồng chính (đặt hàng thế nào, thanh toán fail xử lý sao, ai có quyền sửa/xóa). Phỏng vấn súc tích trong 5–15 câu hỏi case study then chốt là đủ tiêu chuẩn để chốt brief.
- **Với quy mô 2 (Hệ thống Hoàn chỉnh Vừa):**
  - Phỏng vấn sâu vào quy tắc nghiệp vụ vận hành thực tế: Máy trạng thái, tính tiền/khuyến mãi, phân quyền nhân viên vs quản trị, xử lý lỗi giao dịch và dữ liệu nhập sai.
- **Với quy mô 3 (Nền tảng Lớn / Enterprise / Multi-tenant SaaS):**
    - Tuyệt đối không dồn quá nhiều câu hỏi vào một lượt làm người dùng quá tải.
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
- **Xin tài liệu thật ngay đợt hỏi đầu:** Đề nghị người dùng cung cấp những gì đang dùng để vận hành: file Excel/sổ theo dõi, mẫu phiếu/biểu mẫu, hóa đơn/chứng từ, báo cáo hiện có, văn bản quy trình hoặc quy định nội bộ. Đọc kỹ trước khi hỏi tiếp; một tài liệu thật thường trả lời được nhiều câu hỏi về dữ liệu, trạng thái và quy tắc. Không có tài liệu thì ghi nhận và tiếp tục phỏng vấn, không chặn discovery.
- **Ghi nguồn xác nhận cho từng quy tắc:** Mỗi rule trong brief ghi `Tình trạng xác nhận` là một trong: `người dùng xác nhận`, `tài liệu <tên tài liệu>`, `AI suy luận – cần xác nhận`, hoặc `cần <vai trò> xác nhận` khi người đang trả lời không phải người có thẩm quyền về nghiệp vụ đó (ví dụ kế toán, quản lý kho). Rule `AI suy luận – cần xác nhận` là giả định mở, không được tính là đã rõ.

#### C. Đưa Case Study thực tế tập trung vào Hệ thống Cốt lõi (System Core)
- **Bắt buộc tự sinh câu hỏi Case Study:** AI chủ động đóng vai trò chuyên gia phân tích nghiệp vụ, tự tạo các câu hỏi kịch bản va chạm thực tế (concrete scenarios) bám sát độ lớn nhỏ và đặc thù domain của dự án.
- **Tránh câu hỏi trừu tượng, chung chung:** Cấm các câu hỏi sáo rỗng như *"Quy tắc của bạn là gì?"*, *"Bạn muốn hệ thống chạy thế nào?"*.
- **TẬP TRUNG 100% VÀO NHỮNG THỨ CHÍNH (CORE) CỦA HỆ THỐNG — TUYỆT ĐỐI KHÔNG HỎI LAN MAN:**
  - *Không hỏi lan man:* Cấm hỏi chi tiết râu ria giao diện/style/màu sắc (thuộc G2), cấm hỏi cấu hình hạ tầng kỹ thuật AI tự tra cứu được (thuộc G3), cấm hỏi những chuyện ngoài lề không mang tính quyết định vận hành.
  - *Hỏi trọng tâm vào 6 Trụ cột Cốt lõi (System Core):*
    1. **Vòng đời & Máy trạng thái (State Machine & Entity Lifecycle):** Mọi trạng thái có thể có của thực thể cốt lõi (Order, Payment, Inventory, User, Ticket, Contract...), trigger chuyển trạng thái, điều kiện tiên quyết, ai có quyền chuyển, trạng thái nào là điểm cuối (terminal) và khả năng rollback/hủy bỏ.
    2. **Quy tắc Tài chính, Số liệu & Bất biến Domain (Money, Math & Invariants):** Công thức tính tiền, thuế, phí vận chuyển, khuyến mãi/voucher lồng nhau, hoàn tiền một phần vs toàn phần, làm tròn số thập phân, và các bất biến dữ liệu tuyệt đối không được vi phạm (ví dụ: tồn kho không âm, tổng tiền chi tiết phải khớp tổng hóa đơn).
    3. **Xử lý Đồng thời & Tranh chấp dữ liệu (Concurrency, Race Conditions & Locking):** Xử lý khi nhiều tác nhân cùng thao tác trên một tài nguyên hữu hạn tại cùng một thời điểm (2 người cùng tranh mua suất hàng cuối cùng, cùng chỉnh sửa 1 hồ sơ, thanh toán đồng thời từ 2 thiết bị).
    4. **Ranh giới Phân quyền & Cô lập dữ liệu (Permission Boundaries & Access Control):** Ma trận quyền chi tiết theo vai trò (Actor nào được xem, tạo, sửa, xóa, duyệt những trường dữ liệu nào); dữ liệu có bị cô lập theo chi nhánh, phòng ban, tenant hay không; cơ chế phê duyệt nhiều cấp.
    5. **Ngoại lệ, Sự cố & Luồng lỗi (Edge Cases, Failure Modes & Compensation):** Kịch bản khi có sự cố phát sinh: Thanh toán cổng bên thứ ba thành công nhưng webhook mất kết nối; đối tác vận chuyển hủy đơn giữa chừng; giao dịch đang ghi thì đứt quãng — cách bù trừ dữ liệu (compensation flow) như thế nào.
    6. **Ràng buộc Tích hợp & Nguồn sự thật (Integration Boundaries & Source of Truth):** Khi kết nối bên thứ ba hoặc hệ thống hiện hữu, hệ thống nào nắm quyền quyết định (Single Source of Truth), đồng bộ thời gian thực hay định kỳ, xử lý sai lệch số liệu ra sao.

#### C.1. Danh sách phủ yêu cầu nghiệp vụ (Requirement Coverage Checklist)

6 trụ cột kiểm tra cơ chế vận hành của hệ thống, nhưng chưa phủ hết các loại yêu cầu nghiệp vụ. Song song với 6 trụ cột, AI phủ thêm 8 mục dưới đây, cũng bằng câu hỏi tình huống cụ thể (không hỏi chung chung kiểu *"Bạn có cần báo cáo không?"*, mà hỏi *"Cuối tháng quản lý cần xem những con số nào, lọc theo gì, có cần xuất Excel không?"*):

- **R1. Mục tiêu và chỉ số thành công:** Vấn đề kinh doanh cần giải quyết, ai hưởng lợi, và kết quả đo được sau khi dùng hệ thống (ví dụ: giảm sai lệch tồn kho, rút thời gian chốt sổ từ 3 ngày xuống 1 ngày).
- **R2. Ưu tiên phạm vi:** Xếp từng nhóm tính năng vào Bắt buộc / Nên có / Để sau; nhóm nào cắt được nếu thiếu thời gian.
- **R3. Báo cáo và thống kê:** Ai xem báo cáo gì, chỉ số và công thức, kỳ báo cáo, bộ lọc, định dạng xuất (Excel/PDF/in).
- **R4. Pháp lý và tuân thủ:** Chứng từ bắt buộc (hóa đơn, phiếu thu chi...), dữ liệu cá nhân và quyền riêng tư, thời hạn lưu trữ, quy định riêng của ngành.
- **R5. Lịch sử thay đổi:** Thao tác nào cần ghi vết ai làm, lúc nào, giá trị trước/sau; ai được xem lịch sử; lưu trong bao lâu.
- **R6. Dữ liệu hiện có và chuyển đổi:** Dữ liệu cũ đang nằm ở đâu (Excel, sổ sách, phần mềm cũ), có chuyển sang hệ thống mới không, khối lượng, ai làm sạch và đối chiếu sau khi chuyển.
- **R7. Thông báo:** Sự kiện nào cần báo cho ai, qua kênh nào (trong ứng dụng, email, SMS, Zalo...), có cần nhắc lại hoặc leo thang khi quá hạn không.
- **R8. Ràng buộc dự án và vận hành:** Hạn chót và ngân sách; giờ hoạt động và mức chấp nhận khi hệ thống ngừng; đào tạo người dùng; có chạy song song với cách làm cũ trong giai đoạn chuyển tiếp không.

**Co giãn theo quy mô đã chọn ở bước 0:**
- **MVP Tinh gọn:** bắt buộc R1, R2, R8. Với R3–R7, chỉ hỏi nhanh một câu xác nhận có cần hay không; không cần thì ghi `N/A` kèm lý do, không đào sâu.
- **Hệ thống Vừa và Nền tảng Lớn:** cả R1–R8 phải có câu trả lời, hoặc `N/A` kèm lý do đã được người dùng xác nhận.

Mục nào lộ ra quyết định kỹ thuật (hạ tầng, công nghệ gửi thông báo, cách lưu trữ) thì chỉ chốt yêu cầu nghiệp vụ ở G1, phần giải pháp để G3.

#### D. Làm sắc bén ngôn ngữ Domain (Sharpen Fuzzy Language)
Khi người dùng dùng từ ngữ mơ hồ, AI làm rõ và đề xuất thuật ngữ chuẩn xác (ví dụ: phân biệt Guest vs Member, Abandon vs Cancel vs Return, hệ thống tự duyệt vs Admin duyệt thủ công).

#### E. Tiến hành phỏng vấn đào sâu nhiều đợt và điều kiện kết thúc discovery

- **XÓA BỎ HOÀN TOÀN MẶC ĐỊNH TỐI ĐA 50 CÂU — BUỘC HỎI HƠN 100 CÂU NẾU CẦN:**
  - Tuyệt đối không tự đặt ra bất kỳ trần số lượng câu hỏi cứng nhắc nào (như trần mặc định 50 câu).
  - Tùy thuộc vào quy mô và độ phức tạp của dự án, AI có thể và **BUỘC PHẢI hỏi từ vài chục đến hơn 100 câu hỏi** cho đến khi làm rõ toàn bộ nghiệp vụ cốt lõi đến từng chi tiết nhỏ nhất.
  - Số lượng câu hỏi không bị khống chế bởi bất kỳ con số trần nào, mà do mức độ sáng tỏ của nghiệp vụ quyết định.

- **LỆNH CẤM TUYỆT ĐỐI: NGHIÊM CẤM HỎI QUA LOA (ANTI-SUPERFICIAL HARD-STOP):**
  - **NGHIÊM CẤM TUYỆT ĐỐI** việc chỉ hỏi 2–3 câu qua loa, cưỡi ngựa xem hoa rồi vội vã kết luận và đòi "next" sang Cổng G1 hoặc G2.
  - Hành vi hỏi hời hợt, vội chốt khi các kịch bản va chạm thực tế chưa được giải quyết bị coi là vi phạm nghiêm trọng kỷ luật Product Workflow (Gate Violation). Mọi brief tạo ra từ phỏng vấn qua loa đều bị coi là vô giá trị và không đủ điều kiện xét duyệt G1.

- **Quy trình hỏi cuốn chiếu theo từng đợt qua `ask` (Iterative Multi-Turn Grilling):**
  - Để tránh làm người dùng quá tải, không dồn hàng chục câu hỏi vào một tin nhắn chat.
  - Chia phỏng vấn thành từng đợt cuốn chiếu qua công cụ `ask`: Mỗi đợt gồm 2–4 câu hỏi Case Study trọng tâm có phương án lựa chọn và phân tích tradeoff rõ ràng.
  - Khi người dùng trả lời một đợt: AI lập tức cập nhật vào *Decisions So Far*, phân tích tiếp các điểm còn mờ nhạt (Fog of War) theo 6 Trụ cột Cốt lõi và danh sách phủ R1–R8, và **tiếp tục mở đợt câu hỏi Case Study tiếp theo**.
  - Kiên trì lặp lại các đợt hỏi qua nhiều lượt trao đổi (có thể kéo dài 10, 20, 30+ đợt, tương ứng hơn 100 câu hỏi) cho đến khi không còn bất kỳ góc khuất nghiệp vụ nào.

- **Điều kiện dừng phỏng vấn & chuyển Cổng G1:**
  - AI chỉ được dừng phỏng vấn khi VÀ CHỈ KHI:
    1. Số lượng và độ sâu case study đã tương xứng với độ lớn nhỏ của dự án mà người dùng đã chọn.
    2. Cả 6 Trụ cột Cốt lõi của hệ thống đều đã được định nghĩa chi tiết đến từng trường hợp biên (edge cases), hoặc được ghi `N/A` kèm lý do nếu phân hệ không có.
    3. Danh sách phủ R1–R8 đã được trả lời theo đúng mức của quy mô đã chọn (mục C.1).
    4. Không còn bất kỳ câu hỏi chặn (blocking questions) hoặc giả định mù mờ nào chưa được người dùng xác nhận.
  - Khi đã thực sự thỏa mãn các điều kiện trên, AI mới dừng hỏi, tổng hợp Business Brief hoàn chỉnh, dùng `write` lưu vào file vật lý `docs/workflow/specs/<tên-phân-hệ>-brief.md`, và gọi `ask` xin duyệt Cổng G1.
- **Dừng sớm không phải là Ready:** Nếu người dùng chủ động yêu cầu dừng sớm khi các case study cốt lõi vẫn chưa được làm rõ, AI ghi rõ các câu hỏi mở và blocker vào brief, đánh dấu trạng thái `draft` hoặc `awaiting-resolution`. Việc dừng sớm khi còn blocker KHÔNG được coi là approved readiness để chuyển sang G2. Muốn đi tiếp khi còn lỗ hổng, người phụ trách nghiệp vụ phải duyệt G1 kèm rủi ro theo điểm quyết định ở mục 3.C; dừng mà không duyệt thì brief vẫn là `draft`.
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
- Bảng phủ yêu cầu R1–R8 theo mẫu bên dưới.
- Danh mục tài liệu đã nhận từ người dùng (tên, nội dung chính, rule nào dựa vào), hoặc ghi rõ chưa nhận tài liệu nào.
- In-scope/out-of-scope và giả thuyết cần kiểm chứng.
- Câu hỏi mở: owner, ảnh hưởng, quyết định/gate đang bị chặn.
- Rủi ro đã chấp nhận tại G1 (chỉ khi người dùng duyệt G1 dù kiểm định còn `REVISE`, xem mục 3.C).

Mẫu rule:

| ID | Quy tắc | Điều kiện áp dụng | Kết quả quan sát | Ngoại lệ | Nguồn/revision | Tình trạng xác nhận |
|---|---|---|---|---|---|---|

Mẫu Bảng phủ yêu cầu R1–R8:

| Mục | Trạng thái (Đã rõ / N/A / Câu hỏi mở) | Tóm tắt quyết định hoặc lý do N/A | Rule / câu hỏi mở liên quan |
|---|---|---|---|

Mẫu luồng nghiệp vụ:

| Bước | Actor | Trigger/đầu vào | Hành động | Trạng thái/đầu ra | Rule | Khi thất bại |
|---|---|---|---|---|---|---|

## 3. Thẩm định chất lượng Cổng G1 bằng Subagent độc lập (G1 Discovery Quality Audit)

Để triệt tiêu hoàn toàn nguy cơ LLM phỏng vấn làm việc hời hợt, chỉ hỏi vài ba câu case study chiếu lệ rồi tự ý chốt brief để nhảy sang Cổng G2, hệ thống **bắt buộc kích hoạt một Subagent thẩm định độc lập** đóng vai "Người phản biện khắt khe" (Strict Auditor / Devil's Advocate) trước khi bất kỳ đề xuất duyệt G1 nào được gửi tới người dùng.

### A. Thời điểm kích hoạt & Cách dispatch Subagent
Sau khi AI hoàn thành soạn thảo hoặc cập nhật Business Brief tại `docs/workflow/specs/<tên-phân-hệ>-brief.md`, **TRƯỚC KHI** gọi `ask` xin người dùng duyệt G1:
- AI bắt buộc gọi công cụ `task` để kích hoạt Subagent kiểm định (ưu tiên agent `reviewer`):
  ```json
  {
    "context": "# Goal\nThẩm định độc lập chất lượng Business Brief Cổng G1, ngăn chặn tình trạng hỏi case study hời hợt hoặc nhảy cóc sang G2.\n# Constraints\nĐóng vai Strict Domain Auditor / Devil's Advocate, đánh giá không khoan nhượng theo Rubric 5 tiêu chí, 6 Trụ cột Cốt lõi (System Core) và danh sách phủ yêu cầu R1–R8. Không chấp nhận câu trả lời chung chung hoặc brief thiếu case study thực chiến.",
    "tasks": [{
      "name": "AuditG1Discovery",
      "agent": "reviewer",
      "task": "# Target\nFile tài liệu: docs/workflow/specs/<tên-phân-hệ>-brief.md\nĐộ lớn nhỏ dự án: [MVP | Vừa | Lớn / Enterprise] (theo lựa chọn của người dùng).\n\n# Change\nĐọc file brief và rà soát toàn bộ chuỗi phỏng vấn case study, đối chiếu với Rubric Thẩm định G1:\n1. Scale Fit: Số lượng và độ sâu case study có tương xứng với quy mô đã chọn không? Có dấu hiệu hỏi lướt qua 2–3 câu không?\n2. 6 Trụ cột Core: State Machine, Money/Math Invariants, Concurrency, Permissions, Edge Cases & Compensations, Integration Source of Truth có được giải quyết chi tiết tới từng trường hợp biên không?\n3. Concreteness: Các quy tắc có xuất phát từ kịch bản va chạm thực tế (số liệu, actors, xung đột) hay là lý thuyết trừu tượng?\n4. Zero Blind Spots: Còn góc khuất, giả định ngầm hay blocker nào chưa được xác nhận không? Rule ghi `AI suy luận – cần xác nhận` có bị tính như đã rõ không?\n5. Requirement Coverage: Bảng phủ R1–R8 có đủ theo quy mô không (MVP bắt buộc R1, R2, R8; Vừa/Lớn đủ cả 8)? Mỗi N/A có lý do được người dùng xác nhận không?\n\n# Acceptance\nTrả về báo cáo thẩm định chuẩn với Verdict: PASS hoặc REVISE kèm bảng điểm và danh sách case study bắt buộc phải hỏi tiếp nếu REVISE."
    }]
  }
  ```
- *Fallback khi môi trường không hỗ trợ spawn subagent:* AI tự chạy một vòng cô lập (Isolated Auditor Pass) đóng vai kiểm toán viên độc lập, áp dụng 100% tiêu chí Rubric bên dưới và in rõ báo cáo kiểm định trước khi xem xét G1.

### B. Rubric Thẩm định G1 (Discovery Audit Rubric)
Subagent đánh giá theo 5 tiêu chí bắt buộc:

| Tiêu chí | Trọng số | Điều kiện ĐẠT (PASS) | Dấu hiệu KHÔNG ĐẠT (FAIL / REVISE) |
|---|---|---|---|
| **1. Độ tương xứng quy mô (Scale Fit)** | Bắt buộc | Số lượng và độ sâu case study khớp với quy mô đã chọn. MVP có tối thiểu 10–15 tình huống cốt lõi; Dự án Vừa/Lớn có chuỗi case study sâu (hàng chục đến hơn 100 câu hỏi cuốn chiếu) bao quát toàn bộ phân hệ. | Hỏi lướt qua 2–3 câu; dự án lớn nhưng chỉ hỏi vài câu đơn giản rồi vội vã chốt brief. |
| **2. Độ phủ 6 Trụ cột Core** | Bắt buộc | Cả 6 trụ cột (State machine, Money/Math, Concurrency, Permissions, Failure modes, Integration) đều có quy tắc rõ ràng kèm điều kiện biên (hoặc giải trình rõ lý do N/A nếu phân hệ không có). | Bỏ qua xử lý đồng thời, không có kịch bản khi webhook/bên thứ ba lỗi, thiếu ma trận phân quyền chi tiết, trạng thái entity mập mờ. |
| **3. Tính thực chiến (Concreteness)** | Bắt buộc | Quy tắc nghiệp vụ bắt nguồn từ kịch bản va chạm thực tế (có số liệu giả định, bối cảnh, xung đột và tradeoffs cụ thể). | Quy tắc viết chung chung, sáo rỗng (*"hệ thống sẽ tự động xử lý hợp lý"*, *"admin có toàn quyền"*). |
| **4. Điểm mù & Blocker (Zero Blind Spots)** | Bắt buộc | Không còn giả định ngầm; các câu hỏi mở được ghi nhận rõ owner và không làm tắc nghẽn luồng chính. | Còn nhiều giả định do AI tự suy diễn mà chưa có xác nhận của người dùng; rule `AI suy luận – cần xác nhận` bị tính như đã rõ. |
| **5. Phủ yêu cầu nghiệp vụ (Requirement Coverage)** | Bắt buộc | Bảng phủ R1–R8 đủ theo quy mô: MVP có R1, R2, R8 rõ ràng và R3–R7 đã xác nhận cần/không cần; Vừa/Lớn có đủ R1–R8. Mỗi `N/A` có lý do được người dùng xác nhận. | Thiếu bảng phủ; không có mục tiêu đo được; bỏ trống báo cáo, pháp lý hoặc dữ liệu cũ ở dự án Vừa/Lớn; `N/A` không có lý do hoặc do AI tự quyết. |

### C. Xử lý kết luận của Subagent (Verdict Handling)

Subagent là người kiểm định để khuyến nghị, không phải người phê duyệt. Quyết định G1 thuộc người phụ trách nghiệp vụ.

- **Trường hợp kết luận là `REVISE` (Chưa đạt / Cần đào sâu thêm):**
  - Mặc định chưa gọi `ask` trình duyệt G1 và chưa chuyển sang G2.
  - AI đọc kỹ danh sách "Lỗ hổng nghiệp vụ" (Domain Holes) và các kịch bản Case Study bổ sung do Subagent chỉ định.
  - AI quay lại phỏng vấn người dùng: Lập tức tạo đợt `ask` tiếp theo mang các Case Study đó ra hỏi người dùng để làm rõ.
  - Khi người dùng trả lời, AI cập nhật lại brief và kích hoạt Subagent thẩm định lại.
  - AI không tự gợi ý duyệt vượt kết luận `REVISE` trước vòng kiểm định thứ 3, trừ khi người dùng hỏi.

- **Điểm quyết định của người dùng:** Khi vẫn là `REVISE` sau **3 vòng kiểm định**, hoặc bất cứ lúc nào người dùng chủ động muốn duyệt dù còn `REVISE`:
  1. Trình bày trong chat danh sách lỗ hổng còn lại: nội dung, ảnh hưởng nếu để nguyên, và lỗ hổng nào chặn luồng nghiệp vụ chính.
  2. Sau đó mới gọi `ask` với các lựa chọn: `[Tiếp tục phỏng vấn]` (Recommended), `[Duyệt G1, chấp nhận rủi ro]`, `[Dừng, giữ brief ở draft]`.
  3. Chọn tiếp tục thì quay lại vòng phỏng vấn và kiểm định; sau mỗi 3 vòng `REVISE` tiếp theo lại đưa điểm quyết định này.
  4. Chọn dừng thì brief giữ trạng thái `draft`, ghi lỗ hổng vào câu hỏi mở; không chuyển sang G2.
  5. Chọn `Duyệt G1, chấp nhận rủi ro` thì ghi vào brief mục **"Rủi ro đã chấp nhận tại G1"**: từng lỗ hổng, ảnh hưởng, người chấp nhận (người đã chọn trong chat), revision của brief, và cổng phải giải quyết trước đó (ví dụ `trước G3`, `trước story US05`). Mỗi lỗ hổng đồng thời vào danh sách câu hỏi mở có owner để G2/G3 xử lý. Trạng thái G1 là `approved`; báo cáo kiểm định cuối cùng vẫn được lưu nguyên kết luận `REVISE`.

- **Trường hợp kết luận là `PASS` (Đạt chuẩn chất lượng):**
  - AI ghi nhận bảng tóm tắt kết quả audit vào cuối file brief `docs/workflow/specs/<tên-phân-hệ>-brief.md` (mục `Discovery Quality Audit`).
  - **LÚC NÀY AI MỚI ĐƯỢC PHÉP DỪNG TIN NHẮN** và gọi công cụ `ask` xin người dùng duyệt Cổng G1.

## Gate G1 và điều kiện dừng (Hard-Stop)

G1 đạt khi và chỉ khi thỏa mãn đồng thời 2 điều kiện:
1. **Subagent Audit đã chạy và có kết luận:** Hoặc `PASS` (bộ case study không bị hời hợt, tương xứng với quy mô dự án và bao phủ trọn vẹn 6 Trụ cột Cốt lõi và danh sách phủ yêu cầu R1–R8 theo quy mô), hoặc `REVISE` đã đi qua điểm quyết định ở mục C và người dùng chọn `[Duyệt G1, chấp nhận rủi ro]` với mục "Rủi ro đã chấp nhận tại G1" đã ghi vào brief.
2. **Người dùng phê duyệt rõ ràng:** Người phụ trách nghiệp vụ bấm chọn duyệt qua công cụ `ask`.

**Lệnh cấm duyệt vội (Anti-Bypass Hard-Stop):**
- Tuyệt đối cấm trình duyệt G1 khi Subagent Reviewer chưa chạy.
- Cấm trình duyệt G1 khi kết luận mới nhất là `REVISE`, trừ khi đi qua điểm quyết định ở mục C. Không được giấu, rút gọn hoặc diễn giải nhẹ đi danh sách lỗ hổng khi trình bày.
- Brief không có báo cáo kiểm định, hoặc duyệt kèm rủi ro mà không có mục "Rủi ro đã chấp nhận tại G1", bị coi là vi phạm kỷ luật cổng, không có giá trị bàn giao cho Cổng G2 (`story-and-experience`).

**Quy tắc dừng lượt bắt buộc:** Sau khi Subagent xác nhận `PASS` và file `docs/workflow/specs/<tên-phân-hệ>-brief.md` đã được lưu, AI phải **DỪNG TIN NHẮN** và gọi công cụ `ask` của Oh My Pi:
- Câu hỏi: *"Subagent Audit đã xác nhận brief đạt chuẩn PASS. Tôi đã hoàn thành Business Brief tại `docs/workflow/specs/<tên-phân-hệ>-brief.md`. Bạn có duyệt tài liệu này (Cổng G1) để chuyển sang thiết kế User Stories & UX (Cổng G2) không?"*
- Tùy chọn: `[Duyệt và tiếp tục]` (Recommended), `[Cần điều chỉnh quy tắc]`, `[Xem giải thích chi tiết]`.

Trường hợp duyệt kèm rủi ro, lựa chọn `[Duyệt G1, chấp nhận rủi ro]` ở điểm quyết định chính là câu trả lời duyệt G1; không hỏi lại lần thứ hai. Trước khi gọi `ask` ở điểm quyết định, brief phải được lưu với báo cáo kiểm định mới nhất; sau khi người dùng chọn, ghi mục "Rủi ro đã chấp nhận tại G1" rồi mới chuyển sang G2.

Đủ G1 thì chuyển đề xuất sang `story-and-experience` (G2). Đây là bước tiếp theo DUY NHẤT; tuyệt đối không nhảy cóc sang kiến trúc (G3) hay viết code (`task-execution`). Không tự chọn giải pháp kỹ thuật trong discovery.

Khi G1 được người dùng duyệt và workflow được phép lưu, tạo/cập nhật hàng tính năng trong `docs/workflow/product-backlog.md` (hoặc backlog hiện hữu) theo mẫu `skill://product-workflow/references/records.md`. Ghi ID ổn định, module, scope và liên kết brief; ưu tiên chưa chốt ghi chưa xác định, SP `—`, AC `Chưa xác định`, hoàn thành `[ ]`. Đây là danh mục phạm vi, không phải task triển khai hay quyền publish Jira. Không tự thêm tính năng từ ví dụ phân hệ.

## Thay đổi và tiếp tục

Khi rule đổi, ghi delta so với revision đã duyệt; liệt kê stories/flows/contracts cần xem lại nếu đã có liên kết. Không xóa lịch sử hoặc kéo toàn dự án về Draft. Bàn giao cho `delivery-inspection` để đánh giá tác động liên ngành khi cần.

Kết thúc bằng: kết luận đã xác nhận, điều chưa rõ, G1 của scope hiện tại và bước tiếp theo. Lưu checkpoint theo hợp đồng nếu được phép; không tạo backlog Jira hoặc code ở bước này.
