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

### 1.1. Năm tiêu chí Sprint Planning

Không lấy máy móc các dòng đầu backlog. Xem xét:
1. **Priority:** Mức ưu tiên nghiệp vụ do PO xác nhận; Rank là thứ tự backlog, không phải Priority.
2. **Sizing:** SP khi đội sử dụng và đã duyệt, hoặc cách ước lượng hiện hữu. Chưa ước lượng ghi rõ; không tự áp Fibonacci.
3. **Dependencies:** Đầu ra cụ thể cần có. Có thể chọn prerequisite và downstream cùng sprint nếu có kế hoạch thực hiện/tích hợp khả thi; downstream chỉ được bắt đầu khi prerequisite thực sự thỏa.
4. **Sprint Goal:** Kết quả có giá trị, tập trung và kiểm chứng được.
5. **Capacity:** Năng lực, kỹ năng và thời gian thực tế của đội; không suy từ ví dụ bán hàng hoặc số AI agents. Vượt capacity thì đề xuất giảm/dời scope mà vẫn bảo vệ Goal, để đội quyết định.

### 1.2. Chọn thứ tự dựa trên giá trị và dependency
- Tìm walking skeleton: một đường hẹp end-to-end tạo giá trị cốt lõi và kiểm chứng được trên môi trường phù hợp.
- Xác định enablers bắt buộc và rủi ro cần spike. Không làm toàn bộ “nền tảng dùng chung” trước mọi giá trị.
- Ưu tiên đề xuất theo giá trị, rủi ro và việc được mở khóa; Product Owner quyết định thứ tự backlog.
- Không đợi hoàn tất một module nếu task tiếp theo chỉ cần một đầu ra/hợp đồng cụ thể đã sẵn sàng.
- Phạm vi xa chỉ cần đủ để nhìn dependency/rủi ro; chi tiết hóa sâu phần sắp làm, không tạo hàng trăm task giả chính xác.
## 2. Phân rã tính năng và chia task bàn giao được

Mỗi story cần mang lại một luồng hoạt động hoàn chỉnh từ đầu đến cuối (end-to-end) để có thể kiểm chứng độc lập. Task kỹ thuật có thể chia theo chuyên môn để hỗ trợ story, nhưng việc hoàn thành riêng từng task kỹ thuật chưa đủ để kết luận story đã xong.

### 2.1. Checklist phạm vi, không chia tầng máy móc

Đọc `Checklist phạm vi kỹ thuật` trong `skill://product-workflow/references/records.md`. Chỉ tạo tasks có đầu ra kiểm chứng hoặc bàn giao rõ; một task có thể bao trùm UI, logic và kiểm thử. Các phần không đổi chỉ liên kết tài liệu đã có.

### 2.2. Chọn hồ sơ task

Áp dụng mục `Hồ sơ task gọn và task card` trong cùng reference: checklist trong roadmap cho việc nhỏ, cùng người làm tuần tự; card riêng cho việc lớn hoặc bàn giao độc lập. Cả hai giữ ID, scope/AC, prerequisites, kiểm chứng và evidence. Khi giao nhiều workers, tách card cho vùng ghi độc lập; agent điều phối là người ghi roadmap/backlog.

Task quá lớn để giao/kiểm chứng rõ thì chia; đừng chia mỗi thay đổi một dòng thành issue. Jira có thể dùng Sub-task hoặc linked issue; đọc hierarchy thật, không giả Story chứa Task mặc định.

## 3. Xây dependency graph

Cạnh A → B nghĩa B cần đầu ra cụ thể của A. Phân biệt `blocks` với `related`; không biến mọi quan hệ tham khảo thành chuỗi tuần tự.

1. Liệt kê nodes, hard prerequisites và blockers bên ngoài.
2. Kiểm tra dangling references/thiếu quyền; chưa đọc được blocker là unknown, không phải Done.
3. Phát hiện chu trình; nêu chu trình và contract/phạm vi cần tách để gỡ. Không xuất lịch khả thi khi còn cycle chặn scope.
4. Tìm candidate frontier: task đủ Ready, prerequisites thỏa, không blocker ngoài, chưa có owner và nằm trong scope thực thi được chọn.
5. Phân biệt graph kế hoạch tương lai với frontier hiện tại từ dữ liệu mới. Dự báo A xong không phải bằng chứng B đang Ready.

Không mặc định prerequisite phải là cả module Done. Nếu chỉ cần duyệt contract, mô hình hóa đầu ra duyệt đó rõ ràng thay vì bỏ dependency của integration thật.

## 4. Xếp nhóm song song

Trong frontier, kiểm tra từng cặp:
- Có dependency trực tiếp/gián tiếp chưa thỏa không?
- Có cùng sửa schema/migration, API, shared component, build/deployment hoặc tài nguyên khác không?
- Dù khác file, có thay invariants/semantics mà task kia đang dựa vào không?
- Contracts đã thống nhất revision chưa; mocks chỉ hỗ trợ phát triển hay đã có provider thật?
- Có người đủ kỹ năng, capacity/WIP và reviewer/integration bandwidth không?

Chung nguồn chỉ đọc không tự là xung đột. Branch/worktree riêng không bảo đảm độc lập. Khu vực ghi chung có thể được phối hợp nhưng không tự coi an toàn trước khi có cách tích hợp đã thống nhất.

| Nhóm có thể chạy | Tasks | Prerequisites | Vì sao độc lập | Xung đột/điều kiện | Kỹ năng/capacity | Người tích hợp cần xác nhận |
|---|---|---|---|---|---|---|

Đây là đề xuất nhận việc, không tự phân công thành viên. Tính lại frontier khi prerequisite thay đổi; không bắt chờ cả một đợt nếu task downstream đã đủ điều kiện.

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

Cập nhật roadmap của phân hệ/sprint đã có; chỉ tạo `docs/workflow/plans/<phân-hệ-hoặc-sprint>/roadmap.md` khi chưa có nơi phù hợp. Nội dung gồm Goal/scope, links backlog và đầu vào đã duyệt, tasks, dependencies, rủi ro/capacity và phương án kiểm chứng/tích hợp.

- Việc nhỏ cùng người làm tuần tự: checklist theo mẫu shared, evidence ghi ngay trong entry.
- Việc lớn hoặc giao độc lập: `tasks/task-XX-<slug>.md` theo mẫu shared; roadmap chỉ link tới card, không giữ thêm trạng thái chỉnh tay của task đó.
- Dependency đơn giản: bảng ID → prerequisite/đầu ra cần là đủ. Chỉ tạo sơ đồ khi nhiều nhánh/quan hệ khó đọc hoặc người dùng yêu cầu; tái dùng sơ đồ còn đúng. Khi cần tạo/sửa, đọc `skill://diagram-design`, lưu HTML/SVG trong `docs/workflow/diagrams/` và vượt Browser Native quality gate trước bàn giao; không dùng Mermaid.
- Ghi đủ test cases cho các AC/rủi ro áp dụng trong hồ sơ task; không tạo báo cáo test/handoff riêng nếu links evidence và record hiện hữu đã đủ.

Việc nhỏ vẫn phải có inputs, AC, quyền thực thi và cách kiểm chứng rõ; giảm số file không giảm điều kiện G4.

## Gate G4 và bàn giao (Hard-Stop)

Ready về nội dung chưa đủ để claim: còn cần quyền, owner hiện tại, scope thực thi và cơ chế nhận việc an toàn.

**Quy tắc dừng lượt bắt buộc:** Sau khi lưu backlog và kế hoạch (checklist hoặc cards phù hợp), AI phải **DỪNG TIN NHẮN** và gọi công cụ `ask` của Oh My Pi:

```text
ask(questions=[{
  "id": "gate_g4_approval",
  "question": "Tôi đã cập nhật Product Backlog và kế hoạch có checklist/task cards phù hợp. Bạn có duyệt kế hoạch này (Cổng G4) để chuẩn bị triển khai không?",
  "options": [
    {"label": "Duyệt và chọn phương thức thực thi", "description": "Chuyển sang bước chọn mô hình thực thi (Subagents hoặc Inline)."},
    {"label": "Cần chỉnh sửa danh sách task", "description": "Thêm, bớt hoặc điều chỉnh lại phạm vi các task."},
    {"label": "Xem giải thích thứ tự phụ thuộc", "description": "Giải thích vì sao các task được sắp xếp theo thứ tự này."}
  ],
  "recommended": 0
}])
```

Chỉ sau khi người dùng phê duyệt kế hoạch, AI mới chuyển sang `task-execution` để bắt đầu lựa chọn mô hình thực thi (Spawn Subagents hay Inline) và phân công triển khai mã nguồn.
