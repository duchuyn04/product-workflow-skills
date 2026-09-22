# Mẫu hồ sơ dùng chung

Đây là mẫu để agent điền khi người dùng yêu cầu tạo/lưu hồ sơ. Không tạo sẵn hồ sơ dự án chỉ vì đọc file này. Đọc `skill://product-workflow/references/contract.md` trước. Nếu URI chưa được khám phá, đọc `.agents/skills/product-workflow/references/contract.md`.

Dùng quy ước tài liệu đã có. Nếu chưa có, đề xuất `docs/workflow/project.md` và `docs/workflow/checkpoint.md`, chốt nơi lưu một lần. Tài liệu chi tiết ở nơi phù hợp, chỉ mục chứa links; không nhét toàn dự án vào một file. Bảng dưới mô tả trường cần điền, không phải dữ liệu thật.

## Quy ước tên Epic/Module

Tên hiển thị Epic/module bắt đầu bằng **Quản lý + [thực thể/nghiệp vụ]**, ví dụ `Quản lý sản phẩm`, `Quản lý hóa đơn`, `Quản lý báo cáo`. Story/task dùng hành động cụ thể như `Thêm sản phẩm`, không ép tiền tố này lên tên thao tác hay identifier trong code. Giữ ID hiện có khi đổi tên; Epic và module vẫn là hai khái niệm khác nhau.
## Quy ước đặt tên Sprint

Tên Sprint và cấu trúc thư mục kế hoạch bắt buộc gắn liền với Module / phân hệ:
- **Tên hiển thị Sprint (Display Name):** Bắt buộc tuân theo công thức **`[Tên Module] + Sprint [X]`** (hoặc `[Tên Module] + sprint [X]`), ví dụ: `Quản lý abc + sprint 1`, `Quản lý sản phẩm + Sprint 1`, `Quản lý đơn hàng + Sprint 2`. Tuyệt đối cấm đặt tên Sprint trơ trọi chỉ có số như `Sprint 1`, `Sprint 2` mà không gắn tên module.
- **Thư mục lưu trữ kế hoạch (`plans/`):** Tên thư mục kế hoạch sprint trong `docs/workflow/plans/` bắt buộc chuẩn hóa từ tên module và sprint thành slug (kebab-case): **`docs/workflow/plans/<module-slug>-sprint-<X>/`** (ví dụ: `docs/workflow/plans/quan-ly-abc-sprint-1/`, `docs/workflow/plans/quan-ly-san-pham-sprint-1/`). Tuyệt đối cấm tạo thư mục trơ trọi `plans/sprint-1/` hay `plans/sprint-X/`.
- **Cấu trúc bên trong thư mục Sprint:**
  - File lộ trình chính: `docs/workflow/plans/<module-slug>-sprint-<X>/roadmap.md`.
  - Nhóm 1 người (Solo Dev): lưu task cards trong `docs/workflow/plans/<module-slug>-sprint-<X>/tasks/task-XX-<slug>.md`.
  - Nhóm ≥ 2 người: phân chia folder theo vai trò/chuyên môn: `docs/workflow/plans/<module-slug>-sprint-<X>/backend/task-XX-<slug>.md`, `.../frontend/task-XX-<slug>.md`, `.../qa/task-XX-<slug>.md` (hoặc theo track: `.../track-1-core/`).


## Chỉ mục dự án

| Trường | Cách điền |
|---|---|
| Dự án và Product Goal | Danh tính dự án; kết quả có thể đo, nguồn xác nhận |
| Scope/release hiện tại | Phạm vi đã duyệt, ngoài phạm vi, revision baseline |
| Vai trò | PO, nghiệp vụ, UX, kỹ thuật, Developers, Scrum Master theo khai báo thật; chưa rõ ghi chưa chỉ định |
| Hồ sơ nghiệp vụ | Link business brief/rules/glossary hiện có; không chép thành bản khác |
| Stories/UX | Links story map, flow/screen catalogue và người duyệt |
| Giải pháp | Links ADR, module catalogue, data/API contracts, NFR |
| Jira | Trạng thái chưa kết nối/read-only/read-write đã xác minh; project/board và thời điểm kiểm tra nếu có |
| Quality policy | Link DoD, yêu cầu review, kiểm chứng, chính sách release |
| Tổ chức công việc | Nhịp sprint, WIP, capacity theo đội xác nhận, không tự đặt |
| Product Backlog | Đường dẫn ma trận, scope/release, nguồn trạng thái local hoặc Jira và thời điểm đối chiếu |
| Checkpoint | Link điểm tiếp tục |

## Sổ artifact và quyết định

| ID | Phạm vi | Loại | Đường dẫn/nguồn | Revision | Trạng thái gate | Người duyệt | Tham chiếu xác nhận |
|---|---|---|---|---|---|---|---|

Chỉ thêm artifact thật. ID dùng nhất quán với quy ước sẵn có; nếu chưa có, các tiền tố `BR` (rule), `ST` (story), `FL` (flow), `ADR`, `MOD` (module) có thể dùng sau khi thống nhất. Đừng đổi ID khi đổi tiêu đề.

Quyết định khó đảo ngược ghi: bối cảnh → phương án → lựa chọn đã duyệt → lý do/đánh đổi → ảnh hưởng → điều kiện xem xét lại. Không dùng `approved` khi chỉ là AI đề xuất.

## Câu hỏi mở

| ID | Câu hỏi/mâu thuẫn | Nguồn | Ảnh hưởng | Người trả lời | Chặn scope/gate nào | Trạng thái |
|---|---|---|---|---|---|---|

Phân biệt giả thuyết có thể thử nghiệm và quyết định phải có người có thẩm quyền. “Chưa biết” có owner và ảnh hưởng tốt hơn câu trả lời bịa.

## Checkpoint tiếp tục phiên

Chỉ ghi con trỏ và sự kiện có bằng chứng:
- Dự án, scope/release và chế độ đang làm.
- Yêu cầu hiện tại; phần vừa hoàn tất và output link/revision.
- Gate đang chờ; người quyết định và nguồn xác nhận nếu đã duyệt.
- Artifacts cần đọc tiếp; revision đã đọc lần cuối.
- Issue keys đang theo và thời điểm dữ liệu Jira; nếu chưa kết nối ghi rõ.
- Blockers/câu hỏi mở và người gỡ chặn.
- Next action cụ thể; điều kiện/quyền còn thiếu.
- Công việc chưa publish/chưa đồng bộ và lý do; không giả rằng đã lưu external.

Khi mở lại, so sánh nguồn thật; không lấy trạng thái owner/Done trong checkpoint làm hiện tại. Hai người cùng cập nhật file thì giải quyết xung đột nguồn trước khi ghi, không dùng ghi đè cuối cùng làm quyết định chung.

## Product Backlog dạng ma trận

Khi workflow được phép lưu, agent tạo/cập nhật `docs/workflow/product-backlog.md` trong dự án đích, hoặc backlog tương đương đã có. Đây là mẫu cho agent sử dụng, không phải yêu cầu tạo backlog trong repo chứa skills.

Phần đầu file ghi Product Goal, scope/release, nguồn trạng thái (`local` hoặc `Jira`), nguồn duyệt phạm vi và thời điểm đối chiếu. Dùng một hàng cho mỗi tính năng có thể nghiệm thu; ID ổn định xuyên suốt brief, stories và hồ sơ task. Một tính năng thuộc nhiều module vẫn chỉ được tính điểm một lần.

| Rank | ID | Epic / Phân hệ | Tính năng | Actors / Story | Ưu tiên | Story Points | AC đạt/tổng | Trạng thái | Hoàn thành | Tasks / Bằng chứng |
|---|---|---|---|---|---|---|---|---|---|---|

Các ô chứa links thật tới stories, task cards và evidence; không chép toàn bộ chi tiết task vào ma trận. Để bảng đọc được trong Markdown thông thường, dùng chữ cho trạng thái và ký hiệu `[ ]` / `[x]` cho hoàn thành. Checkbox trong ô bảng có thể chỉ hiện văn bản; agent sửa nội dung file, không phụ thuộc widget bấm được.

Đây là bảng backlog chính, bao gồm góc nhìn Epic–Story–Actor qua links tới stories/ma trận quyền. Rank là thứ tự do PO chốt, khác mức Priority; chưa chốt ghi `—`. Có thể nhóm theo Epic hoặc sắp theo Rank để xem cùng dữ liệu, không lưu thêm bảng chỉnh tay cạnh tranh. Epic là nhóm, không là hàng cộng điểm thứ hai. Roadmap chỉ liên kết ID được chọn, Goal và dependencies; không sao chép actors, priority, SP hoặc trạng thái từng story.

### Điểm và điều kiện đánh dấu

- Story Points (SP) là ước lượng độ lớn do đội duyệt trước khi làm. AI được đề xuất nhưng chưa duyệt thì cột SP ghi `—`; đề xuất và nguồn duyệt nằm ở tài liệu liên kết. Không quy đổi SP thành giờ hoặc điểm chất lượng.
- Mỗi AC có ID ổn định và nội dung đã duyệt. `AC đạt/tổng` đếm số AC có evidence pass còn hiệu lực trên tổng AC áp dụng, không đếm số test cases hay số tasks. Một AC được nhiều tasks chứng minh vẫn chỉ tính một lần.
- Chưa chốt AC thì ghi `Chưa xác định`; có AC đã chốt nhưng chưa kiểm chứng thì ghi `0/N`. Tổng bằng 0 không đủ để kết luận Done. AC failed, not-run, unknown hoặc evidence sai revision không được tính đạt.
- `[x]` chỉ khi toàn bộ AC áp dụng đạt, review bắt buộc và kiểm chứng tích hợp đáp ứng DoD. SP chưa ước lượng không chặn nghiệm thu. `N/N` nhưng thiếu review vẫn `[ ]`, trạng thái `Review`, SP hoàn tất bằng 0.
- Ở chế độ local, agent điều phối cập nhật trạng thái dựa trên evidence. Ở chế độ Jira, cột trạng thái phản ánh issue thật; `[x]` còn cần transition Done đã xác nhận. Jira Done nhưng evidence thiếu thì giữ trạng thái Jira, ghi bất nhất và `[ ]`, không tự reopen issue.
- Khi test lại thất bại hoặc thay đổi làm evidence mất hiệu lực, bỏ tích phần ảnh hưởng, trừ điểm AC/SP hoàn tất tương ứng và ghi lý do; giữ bằng chứng lịch sử. Không mặc định mọi thay đổi revision vô hiệu toàn bộ backlog.
- Tính năng hủy/bỏ scope không được tích Done. Chỉ đổi phạm vi, mẫu số AC hoặc SP khi có quyết định được duyệt; ghi thay đổi và nguồn xác nhận, không xóa hàng để tăng tỷ lệ.

### Tổng quan theo scope

Hiển thị riêng ba chỉ số:
1. `Tính năng Done: D/F`: F là các tính năng trong scope hiện tại; D là số hàng đủ điều kiện `[x]`.
2. `SP hoàn tất: S_done/S_total`: chỉ cộng SP đã duyệt, mỗi tính năng một lần. S_done chỉ cộng khi hàng đủ điều kiện `[x]`; không nhân SP với tỷ lệ AC. Nêu số tính năng chưa ước lượng, kể cả đã Done. Không có ước lượng thì ghi `Chưa ước lượng`, không diễn giải 0/0 thành hoàn tất.
3. `AC đạt: A_pass/A_total`: tổng AC áp dụng đã xác định; nêu số tính năng chưa chốt AC để không che độ phủ thiếu. Nếu chưa có AC áp dụng thì ghi `Chưa xác định`.

Không gọi tỷ lệ SP/AC là phần trăm sản phẩm hoàn thành hoặc dùng để chấm năng suất cá nhân. Phạm vi rỗng ghi `Chưa có tính năng trong scope`, không báo 100%.

Ví dụ số liệu minh họa, không phải tiến độ thật: ba tính năng có SP 3, 5, 8; AC đạt lần lượt 3/3, 2/4, 0/3; chỉ tính năng đầu đủ DoD. Tổng quan là `1/3 tính năng Done · 3/16 SP hoàn tất · 5/10 AC đạt`. Nếu tính năng đầu còn chờ review, kết quả là `0/3 · 0/16 · 5/10`.

### Ghi nhận và phối hợp

- G1 đã duyệt: ghi tính năng/phân hệ/phạm vi đã xác nhận; SP `—`, AC `Chưa xác định`, hoàn thành `[ ]`. Không tự bịa chi tiết phần chưa discovery.
- G2 đã duyệt: liên kết stories và AC có ID; xác định tổng AC. Việc duyệt thiết kế không tạo điểm kiểm chứng.
- G4: `delivery-planning` liên kết roadmap và hồ sơ task (checklist hoặc card), dependencies, ưu tiên và SP được duyệt. Không cộng thêm SP của tasks vào SP của tính năng.
- Thực thi: `task-execution` cập nhật hồ sơ task và bằng chứng; agent điều phối đối chiếu lại hàng tính năng, tổng điểm và thời điểm sau mỗi kết quả. `delivery-inspection` kiểm tra điều kiện `[x]` và bất nhất.
- Khi nhiều người/agent làm việc, chỉ người điều phối được chỉ định ghi ma trận chung trong đợt đó. Đọc phiên bản mới nhất trước khi ghi; nếu có thay đổi từ phiên khác, đối chiếu nguồn và giải quyết xung đột, không ghi đè mù. Xem ma trận chỉ là thao tác đọc.

## Bản nháp task chưa publish

- ID nháp ổn định; ghi rõ **chưa có Jira key, chưa publish**.
- Story/epic/module và scope liên quan.
- Hành vi/giá trị giao được; không thuộc phạm vi.
- AC kiểm chứng được và input/contracts đúng revision.
- Hard blockers: ID/đầu ra cần có, lý do; external blocker và owner nếu có.
- Kỹ năng cần; ứng viên nhận việc chỉ là đề xuất.
- Rủi ro/xung đột thay đổi; điểm tích hợp và cách kiểm chứng.

Không gán Jira status/assignee thật cho bản nháp. Khi được phép publish, dùng mapping/hierarchy thật và keys API trả về; giữ ID nháp để đối chiếu tránh trùng.

## Bằng chứng nghiệm thu

| AC/nghĩa vụ | Phạm vi | Revision tích hợp | Môi trường | Cách kiểm tra | Kết quả | Link/output | Reviewer nếu bắt buộc |
|---|---|---|---|---|---|---|---|

Ghi cả failed/not-run/unknown, không chỉ pass. Test ở nhánh riêng không thay bằng chứng revision tích hợp. Không dùng ảnh chụp hoặc log của phiên bản cũ chứng nhận phiên bản mới.

## Nghĩa vụ cho ma trận

| Module | Scope | Giai đoạn | Nghĩa vụ đầu ra | Artifact/issue/evidence | Revision kỳ vọng | Approval cần | N/A và lý do nếu có |
|---|---|---|---|---|---|---|---|

Danh mục module và nghĩa vụ phải có nguồn trước khi tính tiến độ. Thiếu nghĩa vụ là chưa xác định, không phải 0/0 đạt. Ma trận giai đoạn tổng hợp từ nghĩa vụ và nguồn local/Jira/evidence; checkbox Product Backlog tuân theo mục `Product Backlog dạng ma trận`, không thay thế bằng chứng nghiệm thu.

## Bảng Ma trận User (Actor) và User Story

Lưu một lần trong tài liệu stories của phân hệ; backlog liên kết tới đây. Dùng actors và IDs của dự án, không sao chép vai trò từ ví dụ bán hàng.

| Story ID / Epic | User Story | Actor A | Actor B | Rule/quyền nguồn |
|---|---|---|---|---|
| [ID/link] | [Hành động và giá trị] | [Quan hệ] | [Quan hệ] | [Link rule] |

Ghi rõ quan hệ: thực hiện, hưởng lợi, hoặc chưa xác định. Chỉ đánh dấu quyền thực hiện khi có rule được xác nhận; nhu cầu/hưởng lợi không tự cấp quyền. Story tự động ghi trigger và bên hưởng lợi, không bắt tạo actor thao tác giả.

## Bảng Lộ trình Multi-Sprint (Multi-Sprint Roadmap)

Chỉ lập nhiều sprint khi người dùng cần dự báo và có capacity/nhịp sprint do đội xác nhận; sprint xa là dự báo, không cam kết. Dùng ngay roadmap hiện hữu:

| Sprint | Sprint Goal | Story IDs liên kết backlog | Capacity/nguồn | Tổng SP đã duyệt / số mục chưa ước lượng | Dependency/rủi ro | Quyết định |
|---|---|---|---|---|---|---|
| Quản lý abc + Sprint 1 | [Mục tiêu cốt lõi sprint] | [US01, US02] | [Capacity xác nhận] | [Tổng SP / chưa ước lượng] | [Rủi ro / Dependency] | [Quyết định] |

Tổng SP là số tổng hợp tại thời điểm đối chiếu, không nhập lại SP từng story. Chưa biết capacity thì ghi chưa xác định; không lấy 18–20 SP, hai tuần hay ba sprint từ ví dụ làm mặc định.

## Checklist phạm vi kỹ thuật

Xem xét UI, dữ liệu/DB, API, logic và kiểm chứng để tránh sót phần bị ảnh hưởng. Đây là checklist phạm vi, không phải năm task hoặc năm tầng bắt buộc. Chỉ mô tả phần áp dụng; có thể gộp UI/logic/test trong một task end-to-end. Không tạo schema/API/migration khi không có thay đổi tương ứng. Chọn kiểm chứng theo AC/rủi ro; không bắt Unit Test hoặc Browser Native cho mọi task.

## Hồ sơ task gọn và task card

Mỗi task có một nơi ghi chính thức. Việc nhỏ, cùng người thực hiện và tuần tự: dùng checklist có ID/anchor trong roadmap. Việc lớn, có đầu vào/đầu ra bàn giao riêng hoặc giao worker độc lập: dùng task card riêng trong `docs/workflow/plans/<module-slug>-sprint-<X>/` (theo folder vai trò chuyên môn); roadmap chỉ giữ link. Không tạo file cho mỗi thay đổi một dòng.

Checklist gọn vẫn cần: ID, mục tiêu/phạm vi, links story/AC, prerequisites, cách kiểm chứng, trạng thái và evidence đúng revision. Ví dụ cấu trúc để điền trong roadmap:

```markdown
### TASK-XX — [Mục tiêu]
- [ ] Trạng thái: Todo; owner chỉ ghi khi đã được xác nhận.
- Phạm vi / ngoài phạm vi: [...]
- Story / AC / contracts: [links và revision liên quan]
- Prerequisites / blocker: [ID, đầu ra cần hoặc không có]
- Kiểm chứng: [lệnh/thao tác, dữ liệu và kết quả mong đợi]
- Evidence / review: [revision tích hợp, môi trường, output, kết quả; chưa chạy ghi not-run]
```

Card độc lập dùng cùng trường trên, thêm read/write areas, inputs, rủi ro tích hợp và handoff đủ để người khác làm không cần chat gốc. Nếu test scenarios có nhiều nhánh cần bàn giao, thêm bảng test cases ngay trong card:

| Case / AC | Given | When | Then | Công cụ/lệnh | Kết quả / evidence |
|---|---|---|---|---|---|

Chỉ ghi cases có nghĩa với scope, không điền đủ mọi loại test cho đúng mẫu. Done vẫn theo AC/DoD, review và kiểm chứng tích hợp; checkbox không thay evidence. Ghi review/handoff/evidence trong hồ sơ này hoặc liên kết output có sẵn, không tạo thêm báo cáo riêng cho mỗi bước. Khi tách checklist thành card, chuyển nội dung và thay entry cũ bằng link để không giữ hai bản trạng thái.
