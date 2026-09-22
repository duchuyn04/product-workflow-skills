---
name: delivery-inspection
description: "Đối chiếu Product Backlog Markdown, Roadmap và ma trận tiến độ local/Jira; kiểm chứng AC, Story Points hoàn tất, checkbox Done và điều kiện release theo bằng chứng áp dụng."
hide: true
---

# Theo dõi, nghiệm thu và cải tiến

Đọc `skill://product-workflow/references/contract.md` trước; nếu URI chưa khám phá, đọc `.agents/skills/product-workflow/references/contract.md`.

## 1. Xác định câu hỏi và độ phủ nguồn

Người dùng muốn xem tiến độ, tick task/tính năng, đánh giá release hay xử lý thay đổi? Đọc `product-backlog.md` theo đường dẫn trong chỉ mục (mặc định `docs/workflow/product-backlog.md`), `roadmap.md`, xác định scope/release, nguồn trạng thái local/Jira và thời điểm dữ liệu. Đọc module catalogue, AC, approvals/revisions, canonical task records (mục checklist trong `roadmap.md` hoặc task cards tương ứng) và evidence áp dụng liên quan.

Ở chế độ local, dùng hồ sơ Markdown và evidence mới nhất để tổng hợp, không yêu cầu Jira. Ở chế độ Jira, thiếu kết nối/quyền thì ghi `chưa xác minh`, không tự chuyển sang local hoặc báo board live. Không dừng phân tích độc lập chỉ vì thiếu một nguồn.

Phân biệt: không có công việc, không đọc được công việc, dữ liệu chưa lấy đủ trang và snapshot cũ. Thiếu quyền không được biến thành “không có blocker”. Không tuyên bố toàn dự án xanh nếu coverage chưa đủ.

## 2. Board công việc hằng ngày

Đọc board/workflow/mapping thật nếu có. Đề xuất góc nhìn: sprint hiện tại, có thể nhận, của tôi, blocked, chờ review và theo module. Hiển thị key, mục tiêu, owner, trạng thái, blocker và evidence cần; không chỉ màu.

Xem board là thao tác đọc. Tạo filter/view mới, sửa issue hoặc assignee cần quyền riêng; không tự chỉnh workflow Jira. Task đang hiển thị Ready vẫn cần đọc fresh và kiểm tra trước claim trong `task-execution`.

### Product Backlog và điểm theo tính năng

Đọc mục `Product Backlog dạng ma trận` và `Bảng Lộ trình Multi-Sprint (Multi-Sprint Roadmap)` trong `skill://product-workflow/references/records.md` để dùng cùng công thức với planning/execution. Đối chiếu từng hàng với scope, stories/AC, canonical task records (task cards hoặc checklist entries trên roadmap), evidence áp dụng và review; báo riêng `Tính năng Done`, `SP hoàn tất`, `AC đạt`, kèm số tính năng thiếu ước lượng hoặc chưa chốt AC.

Không tính AC đạt theo số tasks đã xong hoặc số tests pass; không tích tính năng chỉ vì tất cả tasks Done. `N/N` AC nhưng chưa đủ review/kiểm chứng tích hợp vẫn `[ ]`, chưa cộng SP hoàn tất. Canceled, unknown, evidence mất hiệu lực và scope rỗng xử lý theo mẫu shared, không làm đẹp số liệu.

Yêu cầu xem tiến độ chỉ cho phép đọc và báo bất nhất. Khi người dùng yêu cầu cập nhật/tích hoàn thành, hoặc đây là bước nghiệm thu trong scope thực thi đã ủy quyền, agent điều phối ghi các hàng có đủ nguồn, tổng điểm và thời điểm đối chiếu; giữ rõ giới hạn của phần chưa xác minh. Không tự publish Jira.

## 3. Xác định nghĩa vụ của từng ô ma trận

Hàng lấy từ module catalogue của scope đã duyệt, kể cả module chưa có task. Cột: Nghiệp vụ; Stories/UX; Hợp đồng/kiến trúc; Triển khai; Kiểm chứng; Phát hành.

Với mỗi module/giai đoạn, liệt kê các nghĩa vụ đầu ra có nguồn và links: rule/flow cần duyệt, contract revision, issue AC, evidence hoặc release requirement. Tái dùng mẫu `skill://product-workflow/references/records.md` nếu cần ghi rõ nghĩa vụ.

Không tạo sáu issue giả cho mọi story chỉ để lấp bảng. Một artifact dùng chung có thể chứng minh nghĩa vụ của nhiều modules nhưng không đếm nhân đôi thành số lượng công việc hoàn thành.

## 4. Tính trạng thái từ dữ kiện

Thứ tự đánh giá ô:
1. Không có phạm vi/nghĩa vụ xác định → `Chưa xác định`; không coi 0/0 là Đạt.
2. Toàn bộ nghĩa vụ được xác nhận không áp dụng, có lý do → `N/A`; nghĩa vụ bỏ scope phải có quyết định, không âm thầm đổi mẫu số.
3. Thiếu nguồn, quyền hoặc freshness → gắn lớp `unknown/partial/stale`, không kết luận Đạt từ phần nhìn thấy.
4. Revision đầu vào thay đổi ảnh hưởng approval/evidence → `Cần duyệt lại` cho phần ảnh hưởng, giữ links lịch sử.
5. Có nghĩa vụ chưa đạt bị hard blocker → `Bị chặn`; vẫn hiển thị số phần đạt/đang làm nếu xác định được.
6. Mọi nghĩa vụ áp dụng đạt với evidence/approval đúng revision → `Đạt`. Tiêu chí kiểm chứng dựa trên bằng chứng áp dụng (applicable evidence only): không đòi hỏi browser evidence cho các thay đổi non-UI (backend, service, logic, DB, migration, CLI) mà dùng bằng chứng kiểm thử logic/API/DB/integration tương ứng; với UI (`ui_changed = true`) thì yêu cầu browser evidence hoặc xác nhận `not-run`; với file sơ đồ HTML/SVG thì bắt buộc quality gate Browser Native tự động đạt.
7. Có công việc/bằng chứng tiến triển nhưng chưa đủ → `Đang làm`; nếu chưa bắt đầu nghĩa vụ nào → `Chưa bắt đầu`.

Cảnh báo dữ liệu là chiều riêng, không che mất trạng thái biết được. Nếu vừa blocked vừa cần duyệt lại, hiển thị lý do cả hai trong drill-down, không xóa blocker vì chỉ có một nhãn chính.

Canceled không đóng góp vào Done. Tập task rỗng không phải hoàn thành. Epic/module chỉ được kết luận đạt scope khi nghĩa vụ tích hợp đạt, không lấy phép đếm subtasks thay cho AC.

Mẫu trả kết quả:

```text
Scope/release: [nguồn đã xác minh]
Dữ liệu: [thời điểm đọc, phạm vi được quyền xem, giới hạn]
```

| Module | Nghiệp vụ | Stories/UX | Hợp đồng | Triển khai | Kiểm chứng | Phát hành | Blocker/nguồn |
|---|---|---|---|---|---|---|---|

Mỗi ô có trạng thái và links hoặc danh sách drill-down ngay dưới bảng: nghĩa vụ, phần thiếu, issue/artifact, revision và owner gỡ chặn đã biết. Không tự gán owner. Trình bày bằng chữ cùng ký hiệu nếu dùng màu; bảo đảm vẫn đọc được khi không có màu.

Không lấy phần trăm số tasks làm “% sản phẩm hoàn thành” hoặc dự báo ngày xong nếu không có cơ sở. Luôn ghi phạm vi; module đạt scope hiện tại không có nghĩa xong vĩnh viễn.

## 5. Yêu cầu tick Done

Kiểm tra DoD/AC, review và bằng chứng đúng revision tích hợp. Code xong, một test pass hoặc PR merge riêng lẻ chưa đủ nếu còn nghĩa vụ khác.

Ở chế độ local, nếu đủ DoD và được ủy quyền cập nhật, ghi `[x]` vào hàng tính năng, liên kết evidence và tính lại tổng theo mẫu shared; thiếu điều kiện thì giữ `[ ]` và ghi phần còn thiếu. Canonical task record (mục checklist trong `roadmap.md` hoặc task card tương ứng) phải phản ánh đúng kết quả, không có checkbox tự cấp quyền nghiệm thu. Ở chế độ Jira, chuyển qua `task-execution` để dùng transition thật; chỉ phản ánh Done sau khi có xác nhận và đủ evidence. Thiếu quyền/kết nối thì ghi Jira chưa đổi.

Nếu Jira đã Done nhưng chưa chứng minh DoD: hiển thị “Jira: Done; kiểm chứng: chưa đủ” cùng phần thiếu. Không tự certify, reopen hay sửa lịch sử bên ngoài quyền được cấp.

### Kiểm tra evidence review hai trục

Với Feature hoặc Risky Bounded (ảnh hưởng contract/interface, security/quyền, dữ liệu/migration hoặc nhiều module), yêu cầu Review Input Packet đúng baseline/owned areas và Review Output có hai phần riêng `standards`/`spec`. Cả hai verdict phải đạt; missing input, trạng thái `blocked` hoặc finding ảnh hưởng chưa được sửa và review lại phải giữ task ở Review/Blocked. Accepted exception chỉ hợp lệ khi có nguồn và người có thẩm quyền theo policy dự án.

Hợp nhất nghĩa vụ review: Báo cáo review chuẩn hai trục (Standards & Spec) ở đúng scope và revision thỏa mãn cả yêu cầu code-review và review task, không đòi hỏi lặp lại nếu cùng scope và revision. Tái sử dụng kết quả review cùng revision của các task con; Reviewer Tổng chỉ nghiệm thu diff tích hợp, shared contracts, cross-module AC và kiểm thử tích hợp/regression. Chỉ re-review lại phần việc trước đó nếu có thay đổi mang ý nghĩa ảnh hưởng (meaningful changes). Finding chưa giải quyết là blocker ngăn tick `[x]`.

Docs-only và Bounded cục bộ rủi ro thấp tiếp tục policy review hiện hữu. Review pass không thay AC/checks hoặc Browser Native evidence bắt buộc (với UI/diagram); kiểm tra từng nghĩa vụ độc lập trước khi ghi `[x]`.

### Kiểm chứng Giao diện Web trên Browser Native trước khi Tick Done

#### 1. File sơ đồ HTML/SVG: kiểm thử bắt buộc
Đối với mọi task có thay đổi trong `docs/workflow/diagrams/*.html`:
- Không chờ người dùng chọn và không cho phép bỏ qua. Agent phải tự động mở file bằng `browser.open`, chờ `document.fonts.ready` cùng hai animation frames, rồi kiểm tra DOM/SVG thật.
- Evidence bắt buộc gồm kết quả đo font (`getBBox()`/`getComputedTextLength()`), overflow/padding node, connector edge attachment, label gap 6–10px, khoảng cách connector song song tối thiểu 12px và screenshot.
- Nếu Browser Native trả `failed` hoặc không khởi chạy được (`not-run`), giữ trạng thái chưa hoàn tất và không tick `[x]`. Chỉ tick Done khi quality gate đạt trên revision tích hợp.
- `ask` chỉ được dùng sau quality gate nếu người dùng muốn xem preview trực quan.

#### 2. Giao diện Web khác
Đối với Frontend/UI/component không phải file sơ đồ, AI vẫn dùng `ask` để xin ý kiến trước khi mở Browser Native:
```text
ask(questions=[{
  "id": "browser_inspect_option",
  "question": "Tính năng web đã hoàn thành. Bạn có muốn kích hoạt Engine Browser Native để kiểm thử trực quan trước khi nghiệm thu không?",
  "options": [
    {"label": "Mở Browser Native để kiểm thử", "description": "Render, đối chiếu AC, kiểm tra console và chụp screenshot."},
    {"label": "Bỏ qua kiểm thử browser", "description": "Chỉ áp dụng cho giao diện không phải file sơ đồ."},
    {"label": "Chạy kiểm thử ngầm", "description": "Chụp screenshot ngầm để lưu vào evidence."}
  ],
  "recommended": 0
}])
```

Đối với các task non-UI (backend, service, logic, database, migration, CLI), tuyệt đối không ép buộc hay đòi hỏi Browser Native evidence; chỉ cần bằng chứng kiểm thử logic/API/DB/integration tương ứng.

## 6. Release readiness và vận hành

Done và Released tách biệt. Đánh giá theo scope:
- Revision/artifact tích hợp và AC/DoD đã đạt.
- Cấu hình/secrets qua cơ chế an toàn; không in secrets vào báo cáo.
- Migration, rollback/recovery và backup nếu thay đổi có yêu cầu đó.
- Quyền triển khai, người vận hành, smoke checks và điều kiện dừng/rollback.
- Metrics/logs cần theo dõi theo NFR và trách nhiệm xử lý sự cố.

Chỉ đánh giá không có nghĩa được deploy. Hỏi quyền rõ trước thao tác production hoặc ghi dữ liệu thật. Sau release, dùng evidence deployment/smoke đúng revision rồi mới ghi trạng thái phát hành; phản hồi/lỗi quay về backlog để ưu tiên.

## 7. Quy trình Kết thúc Sprint: Sprint Review, Retrospective và Kích hoạt Sprint kế tiếp

### 7.1. Chu trình đóng Sprint chuẩn Scrum trên Jira
Khi một Sprint kết thúc, quy trình chuyển dịch tuần tự qua các bước:
```text
┌────────────────────────┐
│       JIRA BOARD       │ (TO DO → IN PROGRESS → TESTING → DONE)
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│     SPRINT REVIEW      │ (Demo Increment đạt DoD, nghiệm thu SP, phản hồi Stakeholders)
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│  SPRINT RETROSPECTIVE  │ (Đánh giá quy trình, đo lường Velocity thực tế, chọn Action Items)
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│      SPRINT KẾ TIẾP    │ (Lấy User Stories tiếp theo theo Rank từ Product Backlog)
└────────────────────────┘
```

### 7.2. Sprint Review (Nghiệm thu Increment và Đánh giá Sprint Goal)
1. **Demo Increment đạt DoD:** Đội ngũ trình bày sản phẩm hoạt động thực tế (working software) thỏa mãn Definition of Done, có đầy đủ bằng chứng kiểm thử tự động và visual evidence từ OMP Browser Native (chỉ áp dụng cho các phần có thay đổi UI/diagram; non-UI chứng minh bằng log kiểm thử/API thực tế).
2. **Đối chiếu Sprint Goal:** Dùng kế hoạch sprint hiện hữu đã chốt theo định dạng `[Tên Module] + Sprint [X]` tại `docs/workflow/plans/<module-slug>-sprint-<X>/roadmap.md`; không yêu cầu tạo lộ trình nhiều sprint để nghiệm thu một sprint.
3. **Thu thập phản hồi:** Tiếp nhận feedback từ Product Owner và Stakeholders để tạo các cải tiến hoặc stories mới đưa vào Product Backlog.
4. **Xử lý User Story chưa Done:** Những User Story chưa hoàn thành, chưa đủ DoD hoặc test thất bại **tuyệt đối không được tính điểm Story Point hoàn tất**. Chúng bắt buộc phải quay trở lại Product Backlog để PO tái đánh giá, sắp xếp lại Rank và cân nhắc đưa vào Sprint tiếp theo.
5. **Không ép tạo tài liệu độc lập:** Ghi nhận kết quả Sprint Review trực tiếp vào tài liệu hiện có (như `docs/workflow/checkpoint.md`, ghi chú Sprint trong `roadmap.md` hoặc backlog), không bắt buộc tạo thêm file báo cáo riêng biệt (standalone doc).

### 7.3. Sprint Retrospective (Cải tiến quy trình và Hiệu chỉnh Velocity)
1. **Đánh giá 3 câu hỏi cốt lõi:**
   - *What went well?* (Những điểm làm tốt cần duy trì: phối hợp, chất lượng code, kiểm thử).
   - *What could be improved?* (Những trở ngại, điểm nghẽn kỹ thuật hoặc quy trình cần khắc phục).
   - *Action items:* (Các hành động cải tiến cụ thể có người phụ trách và tiêu chí theo dõi).
2. **Velocity khi đội dùng SP:** Đối chiếu SP đã duyệt của stories đủ Done với dự báo và capacity thực tế; không tính điểm một phần hoặc tự gán SP để làm báo cáo. Đội không dùng SP thì giữ cách dự báo hiện hữu.
3. **Không đánh giá cá nhân & Không ép tạo tài liệu độc lập:** Tuyệt đối không dùng số commit hay số task để chấm điểm cá nhân. Ghi nhận action items và velocity trực tiếp vào checkpoint phiên hoặc `roadmap.md`, không tạo file báo cáo rời.

### 7.4. Kích hoạt Sprint kế tiếp và xử lý thay đổi phạm vi
- **Không tự động kích hoạt Sprint mới:** Start/close sprint hoặc ghi Jira cần quyền rõ ràng. Sprint kế tiếp phải được lập theo Goal, Priority, sizing, dependencies và capacity hiện tại; dự báo nhiều sprint không phải cam kết hoặc quyền kích hoạt.
- **Xử lý thay đổi phạm vi và yêu cầu:** Yêu cầu/rule/contract thay đổi: trace tới stories → flows → contracts/modules → tasks → evidence/approvals. Nêu delta, phạm vi bị ảnh hưởng, việc có thể tiếp tục và quyết định cần người phụ trách. Chỉ đánh dấu cần duyệt lại các phần thật sự bị ảnh hưởng, không reset toàn dự án.
Kết thúc: ma trận/đánh giá có nguồn, giới hạn xác minh, blocker có hành động tiếp theo; lưu checkpoint khi được phép. Không đổi trạng thái Jira chỉ để báo cáo trông đẹp hơn.
