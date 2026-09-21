---
name: story-and-experience
description: "Chuyển nghiệp vụ thành story map, acceptance criteria, user journeys, UI/UX flows và trạng thái màn hình có thể kiểm chứng."
hide: true
---

# Stories và trải nghiệm

Đọc `skill://product-workflow/references/contract.md` trước; nếu URI chưa khám phá, đọc `.agents/skills/product-workflow/references/contract.md`.

## Đầu vào và phạm vi

Scope cần thiết kế; mục tiêu, actors/quyền, business rules và G1/revision; glossary; trải nghiệm/design system đã có. Đọc nguồn để lấy dữ kiện, không bắt người dùng nhập lại.

Thiếu rule ảnh hưởng hành vi thì đưa câu hỏi cụ thể về discovery. Vẫn có thể phác thảo phần độc lập nhưng ghi `draft`; không lấp rule bằng một màn hình tùy ý hoặc tự xác nhận G1.

## 1. Lập story map theo hành trình

- Xác định actor và kết quả họ muốn đạt, entry/exit, các hoạt động chính theo thứ tự trải nghiệm.
- Đặt stories dưới từng hoạt động; nhóm theo phạm vi phát hành và giá trị, không theo frontend/backend/database.
- Epic diễn tả capability/kết quả; module diễn tả ranh giới giải pháp. Không ép hai khái niệm thành một.
- Chia nhỏ thành các luồng tính năng hoàn chỉnh từ đầu đến cuối (end-to-end), có thể chạy thử và demo được. Phần việc nền tảng kỹ thuật vẫn có thể tách riêng thành enabler, nhưng cần chỉ rõ story hoặc rủi ro mà nó giải quyết.
- Không tự bỏ stories khỏi phạm vi đã duyệt. Đề xuất cắt scope phải có giá trị bị mất và người quyết định.

Mẫu story map:

| Actor/journey | Hoạt động | Story ID | Kết quả người dùng | Rule nguồn | Scope/release đề xuất | Câu hỏi chặn |
|---|---|---|---|---|---|---|

## 2. Viết User Story theo chuẩn và quy ước định danh

### 2.0. Quy ước định danh Epic & User Story
- **Epic ID & Tên Epic/Module:** Kế thừa từ G1; đặt tên theo mục `Quy ước tên Epic/Module` trong `skill://product-workflow/references/records.md`.
- **User Story ID:** Sử dụng tiền tố `US` kèm số thứ tự 2 chữ số: `US01`, `US02`, `US03`... Mỗi User Story là một chức năng hoàn chỉnh từ góc nhìn người dùng.
- **Cấu trúc User Story bắt buộc:**
  ```text
  [US-ID] Là [Tên Actor / Nhóm người dùng], tôi muốn [hành động / tính năng cần thực hiện] để [mục đích / giá trị nghiệp vụ mang lại].
  ```
  *Ví dụ:* `US01: Là nhân viên bán hàng, tôi muốn tìm kiếm điện thoại theo tên hoặc mã để nhanh chóng tìm được sản phẩm cần bán cho khách.`

Mỗi story có:
- ID ổn định (`USxx`), liên kết Epic (`EPxx`), actor, nhu cầu và giá trị; link mục tiêu/rule nguồn.
- Scope và ngoài phạm vi; tiền/hậu điều kiện.
- Acceptance criteria quan sát được, gồm biên, lỗi và quyền liên quan.
- Dữ liệu cần, flow/screen references, câu hỏi chưa giải quyết.
- Điều kiện demo/kiểm chứng; không điền implementation trước khi thiết kế giải pháp.
Mẫu AC:

```text
Given [trạng thái, vai trò và dữ liệu đầu vào liên quan]
When [hành động hoặc sự kiện]
Then [kết quả và trạng thái quan sát được]
And [không tạo tác dụng phụ trái rule, nếu đây là yêu cầu]
```

Không để AC chỉ là “API trả 200”, “giao diện đẹp” hoặc “không có lỗi”. Không thêm tính năng retry/undo/offline mặc định; chỉ đặc tả khi rule hoặc flow cần.

### 2.1. Phân tách Tư duy Test Scenario (What to test) từ User Stories
Mỗi User Story cần Test Scenarios theo AC và rủi ro thực tế. Xem xét các góc độ dưới đây, chỉ ghi nhánh áp dụng; không tạo tình huống giả để đủ loại:
1. **Happy Path Scenario:** Người dùng thực hiện luồng chính trong điều kiện lý tưởng.
2. **Negative / Rejection Scenario:** Dữ liệu sai, nhập thiếu, trùng lặp hoặc vi phạm điều kiện nghiệp vụ.
3. **Boundary / Edge Case Scenario:** Giá trị tại biên (0, min, max, độ dài chuỗi tối đa/tối thiểu).
4. **Security / Permission Scenario:** Thao tác khi chưa đăng nhập, token hết hạn, hoặc truy cập ngoài quyền hạn.
5. **Failure / Recovery Scenario:** Mất kết nối, timeout, thao tác lặp hoặc người dùng bấm hủy giữa chừng.

Test Scenarios là đầu vào để G4 xác định kiểm chứng trong hồ sơ task (checklist hoặc card), không bắt một file test plan riêng.

### 2.2. Ma trận Actor–Story

Lập và lưu một lần theo mục `Bảng Ma trận User (Actor) và User Story` trong `skill://product-workflow/references/records.md`. Phân biệt actor thực hiện với bên hưởng lợi, dẫn chiếu rule quyền có nguồn. Kiểm tra story thiếu actor/trigger hoặc quyền bất thường; ma trận là đầu vào cho kiểm chứng quyền ở G3/G4. Backlog chính liên kết ma trận này, không chép thành bảng độc lập khác.


## 3. Thiết kế flow trước chi tiết trang trí

Cho mỗi story/journey:
1. Chọn điểm vào và quyền truy cập; xác định điều kiện chuyển từng bước.
2. Chỉ rõ dữ liệu nhập, validation, hành động, kết quả và nơi đi tiếp.
3. Thêm nhánh thất bại hoặc từ chối quyền có ý nghĩa; phân biệt hệ thống lỗi, dữ liệu không hợp lệ và chưa có dữ liệu.
4. Xét hủy, quay lại, thao tác lặp, tải lại trang, dữ liệu cũ, thay đổi quyền hoặc thực hiện đồng thời nếu ảnh hưởng nghiệp vụ.
5. Chọn phản hồi phù hợp: inline, toast, dialog hay trang riêng theo mức độ lỗi và khả năng phục hồi; nêu tradeoff nếu cần người dùng chọn.

Mẫu flow:

| Flow ID/bước | Actor | Màn hình/trạng thái | Hành động | Điều kiện | Kết quả/điểm đến | Rule/AC | Lỗi và phục hồi |
|---|---|---|---|---|---|---|---|

Không coi mỗi flow là một màn hình hoặc mỗi màn hình là một story.

## 4. Danh mục màn hình và trạng thái

Với mỗi màn hình/component thuộc scope, ghi:
- Mục đích, vị trí trong journey, phân cấp nội dung và thao tác chính/phụ.
- Vai trò/quyền, nguồn dữ liệu và dữ liệu nhạy cảm cần bảo vệ.
- Input/validation; loading, disabled, empty, error, success theo điều kiện thực tế.
- Retry/recovery hoặc bước hỗ trợ khi không thể tự phục hồi.
- Responsive, focus/keyboard, labels, error announcements và contrast theo yêu cầu accessibility đã chốt.
- Wireframe/mockup reference và revision nếu có; phân biệt đề xuất hình ảnh với UI đã dựng.

Tái sử dụng design system/component hiện có. Không chọn style, font hay brand mới khi repo đã có quy ước. Những lựa chọn UX có tradeoff đáng kể phải hỏi người dùng, không ngầm chọn.

## 5. Walkthrough và kiểm tra liên kết

Đi thử trên bảng flow, sơ đồ hoặc wireframe hiện hữu với dữ liệu mẫu được ghi nhãn:
- Happy path đạt mục tiêu và hậu điều kiện.
- Một failure path quan trọng có phản hồi/phục hồi rõ.
- Một denied path không lộ dữ liệu hoặc thao tác ngoài quyền.
- Biên/concurrency nếu rule quy định.

So từng AC với flow và màn hình. Rule không được stories nào bao phủ phải được nêu; UI behavior không có nguồn thì hỏi có phải feature mới. Không tuyên bố đã test trình duyệt khi mới walkthrough tài liệu.
## 6. Tùy chọn Tạo bản Prototype Mockup tương tác (Interactive UI Mockup / Prototype)

Sau khi đã chốt danh mục màn hình, ma trận trạng thái và các luồng thao tác (UX Flows), người dùng thường có nhu cầu **bấm thử trực quan để hình dung toàn diện cách hệ thống vận hành** trước khi bắt tay vào thiết kế kiến trúc DB/API hoặc viết code.

### A. Quy tắc hỏi qua `ask` tại Cổng G2
Sau khi hoàn thành file đặc tả `docs/workflow/specs/<tên-phân-hệ>-stories.md`, AI **bắt buộc dùng công cụ `ask`** để hỏi người dùng xem có muốn tạo bản Prototype Mockup tương tác hay không:

```text
ask(questions=[{
  "id": "prototype_mockup_preference",
  "question": "Tôi đã hoàn thành đặc tả User Stories & các luồng UX. Bạn có muốn tôi tạo một bản Prototype Mockup tương tác (HTML/CSS/JS độc lập) để bạn bấm thử và hình dung cách hệ thống vận hành trước khi duyệt Cổng G2 không?",
  "options": [
    {"label": "Tạo bản Prototype Mockup tương tác (Khuyến nghị)", "description": "Tạo 1 file HTML mockup trực quan, click qua lại giữa các màn hình và test thử các trạng thái UI trên Browser Native."},
    {"label": "Bỏ qua Mockup và duyệt Cổng G2 luôn", "description": "Chấp thuận tài liệu Stories/UX và chuyển thẳng sang Cổng G3 (Thiết kế giải pháp kỹ thuật)."},
    {"label": "Cần điều chỉnh User Stories hoặc Luồng UX", "description": "Yêu cầu sửa đổi lại hành trình, tiêu chí nghiệm thu hoặc danh mục màn hình."}
  ],
  "recommended": 0
}])
```

### B. Tiêu chuẩn của bản Prototype Mockup tương tác
Nếu người dùng chọn **"Tạo bản Prototype Mockup tương tác"**:
- **Đường dẫn lưu file:** AI dùng công cụ `write` tạo file tại `docs/workflow/prototypes/<tên-phân-hệ>-mockup.html`.
- **Đặc tính kỹ thuật của Mockup:**
  1. *Độc lập (Self-contained):* Một file HTML duy nhất nhúng sẵn CSS (Tailwind CDN hoặc CSS hiện đại sạch sẽ) và JavaScript thuần, không đòi hỏi cài đặt backend server phức tạp.
  2. *Mô phỏng chân thực các màn hình:* Bao gồm thanh điều hướng (Navigation bar / Sidebar / Breadcrumbs) và các màn hình chính được liệt kê trong danh mục màn hình.
  3. *Tương tác click mượt mà:* Cho phép người dùng bấm chuyển đổi giữa các màn hình, chuyển tab, mở modal/dialog, submit form với dữ liệu mẫu (mock data thực tế).
  4. *Mô phỏng đầy đủ 4 trạng thái UI:* Có nút hoặc toggle để người dùng xem thử:
     - **Happy path:** Trạng thái thành công, có dữ liệu hiển thị đẹp.
     - **Loading state:** Hiệu ứng skeleton hoặc spinner khi đang xử lý.
     - **Empty state:** Giao diện khi chưa có bản ghi nào kèm nút kêu gọi hành động (CTA).
     - **Error state:** Thông báo lỗi validation hoặc lỗi hệ thống có hướng dẫn khắc phục.
- **Kiểm thử và Trải nghiệm trên Browser Native:**
  - AI kiểm thử bản mockup bằng Engine Browser Native (`browser.open` hoặc công cụ tương đương).
  - Trình bày đường dẫn file và mời người dùng mở xem qua trực quan.
  - Sau khi người dùng trải nghiệm xong bản mockup và đồng ý, AI mới chuyển sang bước duyệt Cổng G2 để chuyển giao sang Cổng G3.

## Đầu ra: Lưu file tài liệu User Stories & UX (Docs-First)

AI **BẮT BUỘC DÙNG CÔNG CỤ `write` TẠO HOẶC CẬP NHẬT FILE** tại đường dẫn:
`docs/workflow/specs/<tên-phân-hệ>-stories.md`

*Lưu ý cập nhật:* Khi bổ sung hoặc tinh chỉnh stories của phân hệ đã có, cập nhật trực tiếp vào file stories hiện hữu của phân hệ đó, không tạo thêm file tài liệu mới rời rạc cho mỗi thay đổi nhỏ.

Nội dung file bao gồm:
- Danh mục Epics (`EPxx`) và User Stories (`USxx`) chuẩn hóa theo mục `Quy ước tên Epic/Module` trong `skill://product-workflow/references/records.md`.
- **Bảng Ma trận User (Actor) và User Story:** Ánh xạ 2 chiều chi tiết toàn bộ User Stories với các nhóm Actors theo mẫu `Bảng Ma trận User (Actor) và User Story` trong `skill://product-workflow/references/records.md`.
- Story Map & User Journey Diagram: Sơ đồ trực quan chỉ bắt buộc khi hành trình người dùng có độ phức tạp cao, luồng đa bước mơ hồ hoặc khi người dùng yêu cầu rõ ràng; tái sử dụng sơ đồ hợp lệ đã có nếu trải nghiệm không đổi. Với phạm vi đơn giản, bảng story map và bảng mô tả luồng trong tài liệu là đủ. Khi tạo mới hoặc cập nhật sơ đồ: **CẤM DÙNG MERMAID**, bắt buộc dùng `skill://diagram-design` (`type-story-map.md`, `type-journey.md`, `type-flowchart.md`, `type-state.md`) tạo file HTML trong `docs/workflow/diagrams/`, chèn liên kết vào tài liệu và kiểm chứng hiển thị bằng browser-native.
- Chi tiết các User Stories kèm Acceptance Criteria quan sát được (chuẩn Given-When-Then).
- Test Scenarios cấp cao theo các nhánh Happy Path, Negative, Boundary, Security và Recovery áp dụng.
- Luồng thao tác chi tiết (Flow catalogue) và ma trận trạng thái UI (Loading, Empty, Error, Success).
- Liên kết tới file Prototype Mockup tương tác tại `docs/workflow/prototypes/<tên-phân-hệ>-mockup.html` (nếu người dùng đã chọn tạo).

## Gate G2 và bàn giao (Hard-Stop)

G2 hoàn thành khi người phụ trách sản phẩm hoặc UX duyệt phạm vi, tiêu chí nghiệm thu và luồng thao tác đúng phiên bản (kèm việc xem qua bản Prototype Mockup nếu có chọn tạo). Không cần chờ hoàn thiện toàn bộ giao diện của cả hệ thống mới bắt đầu làm phần tính năng đã đủ rõ ràng.

**Quy tắc dừng lượt bắt buộc:** Sau khi lưu file đặc tả stories (và tạo/kiểm thử prototype nếu người dùng chọn), AI phải **DỪNG TIN NHẮN** và gọi công cụ `ask` xin duyệt Cổng G2 trước khi chuyển sang G3.

Bàn giao cho `solution-design` (G3): stories/flows đã duyệt, bản mockup tương tác đã trải nghiệm (nếu có), yêu cầu dữ liệu/quyền/NFR, câu hỏi chặn và những quyết định UX ảnh hưởng kỹ thuật. Đây là bước tiếp theo DUY NHẤT; tuyệt đối không nhảy cóc sang `task-execution` để viết code ngay.

Khi G2 đã được người dùng duyệt, cập nhật hàng tính năng liên quan trong `docs/workflow/product-backlog.md` theo `skill://product-workflow/references/records.md`: giữ ID tính năng, liên kết story và các AC có ID ổn định, xác định tổng AC áp dụng. AC mới chưa kiểm chứng không có điểm đạt; duyệt stories không được tích hoàn thành. Nếu thay AC đã có, đánh giá lại evidence phần ảnh hưởng và ghi quyết định thay mẫu số, không tự giữ điểm cũ.

Khi tiếp tục/đổi rule, chỉ xét stories/flows liên quan và đánh dấu approval bị ảnh hưởng cần duyệt lại. Lưu links và next action theo hợp đồng, không chép toàn bộ tài liệu vào checkpoint.
