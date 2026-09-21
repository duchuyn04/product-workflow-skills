---
name: delivery-planning
description: "Lập Product Backlog, dependency và sprint theo capacity; dùng checklist cho việc nhỏ, task cards cho việc lớn hoặc bàn giao độc lập, giữ AC và evidence."
hide: true
---

# Lập kế hoạch giao hàng

Đọc `skill://product-workflow/references/contract.md` trước; nếu URI chưa khám phá, đọc `.agents/skills/product-workflow/references/contract.md`.

## Đầu vào

Product Goal/scope được duyệt; stories/AC/flows; module map, contracts/revisions và quyết định giải pháp; backlog hiện có nếu đọc được; capacity/kỹ năng/reviewer và nhịp sprint do đội khai báo. Phần chưa biết ghi rõ, không tự gán người, story points hoặc số sprint.

## 1. Chuỗi giá trị Backlog và Lựa chọn thứ tự theo Dependency

### 1.0. Từ backlog đến thực thi

Liên kết actors, Epic và stories trong backlog chính → Sprint Planning → scope sprint được chọn → tasks cần thiết → board theo workflow thực tế. Mẫu và quy ước tên Epic/Module nằm trong `skill://product-workflow/references/records.md`; không sao chép mẫu thành backlog thứ hai.

### 1.1. Khảo sát quy mô nhóm thực tế qua `ask` (Bắt buộc trước khi chia task)

Trước khi phân rã task hoặc sắp xếp lịch trình, AI **BẮT BUỘC PHẢI GỌI CÔNG CỤ `ask`** để hỏi rõ quy mô đội ngũ thực tế:
```text
ask(questions=[{
  "id": "team_size_and_capacity",
  "question": "Nhóm thực hiện dự án/sprint này hiện có bao nhiêu người để tôi phân chia tasks theo folder và bố trí các luồng làm song song phù hợp?",
  "options": [
    {"label": "1 người (Solo Dev / Fullstack)", "description": "Tối ưu luồng làm tuần tự, gom task theo phase/module để tránh phân mảnh file."},
    {"label": "2–3 người (Nhóm nhỏ / Core Squad)", "description": "Phân chia folder theo chuyên môn (Frontend, Backend, QA) và bóc tách các luồng song song."},
    {"label": "4–6 người (Nhóm vừa / Agile Squad)", "description": "Tổ chức folder theo từng thành viên/vai trò, tối đa hóa các luồng làm việc độc lập song song."},
    {"label": "Khác (Nhập số lượng cụ thể)", "description": "Người dùng tự nhập số lượng thành viên thực tế của nhóm."}
  ],
  "recommended": 1
}])
```
Không tự suy diễn số người, không gán bừa capacity từ ví dụ. Số lượng người thực tế là cơ sở bắt buộc để quyết định: (1) Cấu trúc folder chứa tasks; (2) Số lượng luồng làm việc song song (Parallel Tracks); (3) Điểm hội tụ tích hợp (Sync Checkpoints).

### 1.2. Năm tiêu chí Sprint Planning
Sau khi có số lượng người, AI xem xét 5 tiêu chí:
1. **Priority:** Mức ưu tiên nghiệp vụ do PO xác nhận; Rank là thứ tự backlog, không phải Priority.
2. **Sizing:** SP khi đội sử dụng và đã duyệt, hoặc cách ước lượng hiện hữu. Chưa ước lượng ghi rõ; không tự áp Fibonacci.
3. **Dependencies:** Đầu ra cụ thể cần có. Có thể chọn prerequisite và downstream cùng sprint nếu có kế hoạch thực hiện/tích hợp khả thi; downstream chỉ được bắt đầu khi prerequisite thực sự thỏa.
4. **Sprint Goal:** Kết quả có giá trị, tập trung và kiểm chứng được.
5. **Capacity:** Năng lực, kỹ năng và thời gian thực tế của đội ngũ đã xác nhận ở bước 1.1.

### 1.3. Chọn thứ tự dựa trên giá trị và dependency
- Tìm walking skeleton: một đường hẹp end-to-end tạo giá trị cốt lõi và kiểm chứng được trên môi trường phù hợp.
- Xác định enablers bắt buộc và rủi ro cần spike. Không làm toàn bộ “nền tảng dùng chung” trước mọi giá trị.
- Ưu tiên đề xuất theo giá trị, rủi ro và việc được mở khóa; Product Owner quyết định thứ tự backlog.
- Không đợi hoàn tất một module nếu task tiếp theo chỉ cần một đầu ra/hợp đồng cụ thể đã sẵn sàng.
- Phạm vi xa chỉ cần đủ để nhìn dependency/rủi ro; chi tiết hóa sâu phần sắp làm, không tạo hàng trăm task giả chính xác.
## 2. Phân rã tính năng và chia task bàn giao được

Mỗi story cần mang lại một luồng hoạt động hoàn chỉnh từ đầu đến cuối (end-to-end) để có thể kiểm chứng độc lập. Task kỹ thuật có thể chia theo chuyên môn để hỗ trợ story, nhưng việc hoàn thành riêng từng task kỹ thuật chưa đủ để kết luận story đã xong.

### 2.1. Checklist phạm vi, không chia tầng máy móc

Đọc `Checklist phạm vi kỹ thuật` trong `skill://product-workflow/references/records.md`. Chỉ tạo tasks có đầu ra kiểm chứng hoặc bàn giao rõ; một task có thể bao trùm UI, logic và kiểm thử. Các phần không đổi chỉ liên kết tài liệu đã có.

### 2.2. Tổ chức cấu trúc Task theo Folder dựa trên Team Size

Căn cứ vào số lượng thành viên đã xác nhận ở bước 1.1, AI **BẮT BUỘC TỔ CHỨC CẤU TRÚC TASK THEO FOLDER RÕ RÀNG**:
- **Nếu nhóm 1 người (Solo Dev):** Lưu task cards trong `tasks/sprint-X/` (hoặc `tasks/solo/task-XX-<slug>.md`), sắp xếp theo luồng tuần tự (phase/step), không chia vụn gây phân mảnh file.
- **Nếu nhóm ≥ 2 người (Nhóm nhỏ hoặc Squad):** **BẮT BUỘC PHÂN CHIA THÀNH CÁC FOLDER CON** theo vai trò chuyên môn hoặc phân công thành viên để tránh xung đột vùng ghi (write conflict) và phân định quyền sở hữu:
  - `tasks/sprint-X/backend/task-XX-<slug>.md` (DB, Migration, API, Business Services)
  - `tasks/sprint-X/frontend/task-XX-<slug>.md` (Components, Pages, State Management, Mock Integration)
  - `tasks/sprint-X/qa/task-XX-<slug>.md` (Test Fixtures, Integration Tests, E2E Scenarios)
  *(hoặc chia theo track độc lập: `tasks/track-1-core/`, `tasks/track-2-ui/`...)*
- **Cấu trúc nội dung mỗi task card:** Bắt buộc có Task ID chuẩn (`TASK-01`, `TASK-02`...), Tiêu đề, Folder & Role/Owner dự kiến, Prerequisites, Checklist hành động, Acceptance Criteria (Given-When-Then), và Lệnh kiểm chứng độc lập.

## 3. Xây dựng Ma trận Ràng buộc giữa các tasks (Task Dependency Matrix)

Cạnh A → B nghĩa là B cần đầu ra cụ thể của A. Phân biệt `blocks` với `related`; không biến mọi quan hệ tham khảo thành chuỗi tuần tự.

AI **BẮT BUỘC PHẢI XUẤT BẢNG MA TRẬN RÀNG BUỘC (TASK DEPENDENCY MATRIX)** trong file roadmap và trình bày trực quan tại Cổng G4:

| Task ID | Tên Task | Folder / Role | Hard Prerequisites (Phải xong trước) | Blocking (Chặn task nào tiếp theo) | Shared-Write Areas (Vùng code chung) |
|---|---|---|---|---|---|
| `TASK-01` | Tạo DB Schema & Migration | `tasks/backend/` | Không (Bắt đầu ngay tại T0) | Chặn `TASK-02`, `TASK-03` | `db/migrations/`, `src/models/` |
| `TASK-02` | Viết REST API & Logic | `tasks/backend/` | Cần `TASK-01` xong | Chặn `TASK-04` | `src/api/`, `src/services/` |
| `TASK-03` | Dựng UI Components & Mock API | `tasks/frontend/` | Không (Dùng Mock Contract từ G3) | Chặn `TASK-04` | `src/views/`, `src/components/` |
| `TASK-04` | Tích hợp Frontend với API thật | `tasks/frontend/` | Cần `TASK-02` và `TASK-03` xong | Chặn `TASK-05` | `src/services/api-client.ts` |
| `TASK-05` | Viết E2E Integration Tests | `tasks/qa/` | Cần `TASK-04` xong | Không (Nghiệm thu cuối) | `tests/e2e/` |

1. Liệt kê rõ nodes, hard prerequisites và blockers bên ngoài.
2. Phát hiện chu trình (cycles) và gỡ bỏ trước khi lập kế hoạch.
3. Phân định rõ candidate frontier (những task thỏa prerequisites có thể nhận việc ngay).

## 4. Phân phối Luồng làm song song (Parallel Workstreams / Tracks)

Dựa trên số lượng người trong nhóm đã khảo sát tại bước 1.1, AI **BẮT BUỘC LẬP BẢNG PHÂN PHỐI LUỒNG LÀM SONG SONG**:

| Luồng song song (Track) | Thành viên / Role | Tasks thực thi tại thời điểm T0 | Tasks tiếp theo sau khi mở khóa | Điểm hội tụ (Sync Checkpoint) |
|---|---|---|---|---|
| **Track A (Song song)** | Dev Backend | `TASK-01` (DB Schema) → `TASK-02` (API) | `TASK-06` (Webhook background job) | **Checkpoint T1:** Bàn giao API thật cho Frontend |
| **Track B (Song song)** | Dev Frontend | `TASK-03` (UI layout với Mock Contract) | `TASK-04` (Tích hợp API thật) | **Checkpoint T1:** Nhận API thật từ Track A để tích hợp |
| **Track C (Song song)** | QA / Tester | `TASK-07` (Viết Test Data & Fixtures) | `TASK-05` (Chạy Integration/E2E test) | **Checkpoint T2:** Nghiệm thu toàn bộ luồng trước Demo |

*Quy tắc điều phối song song:*
- Tại thời điểm bắt đầu (T0), chỉ những task không có Hard Prerequisites mới được chạy đồng thời.
- Nếu hai task cùng sửa chung một khu vực code (Shared-write areas) hoặc thay đổi schema, chúng **CẤM CHẠY SONG SONG** mà phải tuần tự hóa hoặc có người làm chủ tích hợp.
- Nêu rõ thời điểm và điều kiện hội tụ (Sync Checkpoint) để các thành viên ghép nối mã nguồn an toàn.

## 5. Chuẩn bị backlog và sprint theo Scrum

### 5.1. Một backlog, nhiều góc nhìn

Dùng `Product Backlog dạng ma trận` trong `skill://product-workflow/references/records.md`. Backlog chính giữ Rank, Epic/story, links actors, priority, SP và trạng thái; roadmap chỉ liên kết scope được chọn, không chứa bản sao bảng backlog. Giữ tên Epic/Module theo mục `Quy ước tên Epic/Module`.

### 5.2. Kế hoạch sprint

Lập sprint sắp làm đủ sâu để giao và kiểm chứng. Chỉ dùng mẫu `Bảng Lộ trình Multi-Sprint (Multi-Sprint Roadmap)` trong reference khi cần dự báo nhiều sprint; không tự lập ba sprint hay gán velocity từ ví dụ.

*Quy tắc Scrum:*
- Product Backlog: PO sắp thứ tự theo Product Goal; refinement diễn ra liên tục.
- Sizing: Developers thực hiện; AI có thể nêu rủi ro/đề xuất, không cam kết thời lượng thay đội. Story points không bắt buộc.
- Sprint Planning: Thống nhất Sprint Goal → chọn User Stories theo 5 tiêu chí (Priority, SP, Dependency, Goal, Capacity).
- Sprint có độ dài cố định không quá một tháng; kế thừa nhịp đội đã chọn, hỏi khi chưa có và quyết định kế hoạch cần nó.
- Daily Scrum: Developers kiểm tra tiến độ hướng Sprint Goal; summary của AI chỉ là đầu vào.
- Review: Kiểm tra Increment đạt DoD và demo cho stakeholders.
- Retrospective: Rút kinh nghiệm, cải tiến quy trình cho Sprint tiếp theo.
- Chưa Done cuối sprint: Quay lại backlog để cân nhắc, không tự đưa sang sprint sau như cam kết mới.

Mẫu sprint proposal: Goal → mục được chọn đề xuất → capacity/rủi ro → dependency/nhóm song song → kế hoạch review/tích hợp/demo → câu hỏi cần đội quyết định.

AI không thay PO/Developers/Scrum Master. Scope thay đổi trong sprint phải phối hợp với PO và bảo vệ Sprint Goal; Review không là cổng bắt buộc để release.

## 6. Publish chỉ khi được phép và Cấu trúc Jira

### 6.1. Hierarchy và trạng thái thực tế

Đọc hierarchy project trước khi ánh xạ Epic, Story, Task/Sub-task; không mặc định Task là con của Story. Board có thể hiển thị To Do → In Progress → Testing → Done, nhưng phải ánh xạ vào workflow thật và giữ nghĩa vụ Review/Verification theo hợp đồng chung. Nằm trong To Do hoặc trong sprint chưa phải bằng chứng Ready; chỉ Done khi đủ AC/DoD và evidence.

### 6.2. Nguyên tắc xuất bản và Đồng bộ hóa
Ở chế độ local: tạo/cập nhật backlog và hồ sơ task theo `skill://product-workflow/references/records.md`; dùng trạng thái nội bộ có nguồn, không bịa Jira key/assignee. Chỉ mục chuẩn bị publish mới cần nhãn chưa publish. Mất kết nối Jira không tự chuyển sang local.

Có Jira: đọc project/board/hierarchy/fields/link types/permissions thực tế; đối chiếu backlog để tránh trùng. Trình breakdown và ảnh hưởng; lấy phê duyệt publish khi chưa được ủy quyền. Tạo theo dependency để liên kết keys thật, chỉ báo thành công sau output xác nhận. Timeout sau ghi phải đối chiếu, không tạo lại mù.

Quyền publish issue không bao gồm start/close sprint, sửa schema hay assign người khác. Không tự thay parent issue chỉ vì đã tạo subtasks.

## Product Backlog theo tính năng

Đọc mục `Product Backlog dạng ma trận` trong `skill://product-workflow/references/records.md`; dùng đúng cột, công thức và điều kiện `[x]` ở đó. Khi lập kế hoạch được phép lưu, bắt buộc tạo/cập nhật `docs/workflow/product-backlog.md` hoặc backlog tương đương đã có:
- Đối chiếu scope/brief/stories đã duyệt; mỗi tính năng một ID ổn định và một hàng, không biến mỗi task kỹ thuật thành một tính năng để cộng điểm.
- Liên kết AC và hồ sơ task bằng ID/đường dẫn hoặc anchor thật. Scope chưa được đặc tả vẫn hiện thiếu dữ kiện, không bịa AC hoặc task.
- Ghi ưu tiên và Story Points theo quyết định của đội. Chưa có SP được duyệt thì giữ `—`, không tự gán giờ hoặc Fibonacci. Chưa chạy kiểm chứng thì không ghi AC đạt.
- Tổng hợp riêng tính năng Done, SP hoàn tất và AC đạt; chỉ rõ phần chưa ước lượng/chưa chốt AC. Không cộng SP của tasks lần nữa vào tính năng.
- Chỉ định người điều phối cập nhật ma trận trong phạm vi đã được ủy quyền; workers ghi task cards, không cùng sửa file tổng.

## Đầu ra: Lưu kế hoạch theo quy mô (Docs-First)

AI cập nhật roadmap của phân hệ/sprint tại `docs/workflow/plans/<phân-hệ-hoặc-sprint>/roadmap.md`. Nội dung bắt buộc bao gồm:
1. **Goal & Scope của Sprint:** Mục tiêu nghiệp vụ ngắn hạn kiểm chứng được.
2. **Quy mô nhóm đã khảo sát:** Số lượng thành viên thực tế và cách phân bổ vai trò.
3. **Cấu trúc Task Cards theo Folder:** Đường dẫn cụ thể tới từng file task card đã phân bổ theo folder vai trò/thành viên (ví dụ: `tasks/sprint-X/backend/task-01-...md`, `tasks/sprint-X/frontend/task-02-...md`).
4. **Bảng Ma trận Ràng buộc (Task Dependency Matrix):** Hiển thị rõ ràng buộc hard prerequisite, task bị chặn, và vùng code chung (Shared-write areas).
5. **Bảng Phân phối Luồng làm song song (Parallel Tracks):** Chỉ rõ các task làm song song tại T0, điều kiện mở khóa downstream, và điểm hội tụ (Sync Checkpoints).
6. **Phương án kiểm chứng & DoD:** Tiêu chí nghiệm thu và lệnh test độc lập.

*Lưu ý về sơ đồ Dependency:* Bảng Ma trận Ràng buộc dạng Markdown là bắt buộc. Nếu đồ thị phụ thuộc quá phức tạp (nhiều nhánh rẽ chéo), AI có thể vẽ thêm sơ đồ flowchart/dependency bằng HTML/SVG qua `skill://diagram-design` (`references/type-dependency.md`) và kiểm thử bằng Browser Native trước khi nhúng link vào roadmap.

## Gate G4 và bàn giao (Hard-Stop)

G4 chỉ đạt khi và chỉ khi:
1. AI đã gọi `ask` khảo sát số lượng thành viên trong nhóm tại bước 1.1.
2. Toàn bộ task cards đã được phân rã đầy đủ, lưu đúng cấu trúc folder tương ứng với quy mô nhóm.
3. Bảng Ma trận Ràng buộc và Bảng Luồng làm song song đã được trình bày rõ ràng trong `roadmap.md` và tóm tắt ra chat.
4. Người phụ trách phê duyệt kế hoạch qua công cụ `ask`.

**Quy tắc dừng lượt bắt buộc:** Sau khi lưu backlog và roadmap, AI phải **DỪNG TIN NHẮN** và gọi công cụ `ask` của Oh My Pi:

```text
ask(questions=[{
  "id": "gate_g4_approval",
  "question": "Tôi đã phân rã tasks theo folder dựa trên quy mô nhóm, lập Ma trận ràng buộc (Dependencies) và Phân phối luồng làm song song tại `docs/workflow/plans/<phân-hệ>/roadmap.md`. Bạn có duyệt kế hoạch này (Cổng G4) để chuẩn bị thực thi không?",
  "options": [
    {"label": "Duyệt và chọn phương thức thực thi", "description": "Chuyển sang bước chọn mô hình thực thi (Subagents hoặc Inline) dựa trên các luồng song song."},
    {"label": "Cần chỉnh sửa danh sách task / folder", "description": "Thêm, bớt, gộp hoặc phân bổ lại cấu trúc folder task."},
    {"label": "Xem giải thích ma trận phụ thuộc & luồng song song", "description": "Giải thích chi tiết thứ tự ưu tiên và các điểm hội tụ (Sync Checkpoints)."}
  ],
  "recommended": 0
}])
```

Chỉ sau khi người dùng phê duyệt kế hoạch, AI mới chuyển sang `task-execution` để bắt đầu lựa chọn mô hình thực thi (Spawn Subagents hay Inline) và phân công triển khai mã nguồn.
