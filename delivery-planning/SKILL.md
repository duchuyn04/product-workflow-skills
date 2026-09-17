---
name: delivery-planning
description: "Chia nhỏ phạm vi công việc thành các luồng tính năng hoàn chỉnh, xác định dependency và việc có thể làm song song, chuẩn bị backlog và kế hoạch sprint theo năng lực đội."
hide: true
---

# Lập kế hoạch giao hàng

Đọc `skill://product-workflow/references/contract.md` trước; nếu URI chưa khám phá, đọc `.agents/skills/product-workflow/references/contract.md`.

## Đầu vào

Product Goal/scope được duyệt; stories/AC/flows; module map, contracts/revisions và quyết định giải pháp; backlog hiện có nếu đọc được; capacity/kỹ năng/reviewer và nhịp sprint do đội khai báo. Phần chưa biết ghi rõ, không tự gán người, story points hoặc số sprint.

## 1. Chọn thứ tự dựa trên giá trị và dependency

- Tìm walking skeleton: một đường hẹp end-to-end tạo giá trị cốt lõi và kiểm chứng được trên môi trường phù hợp.
- Xác định enablers bắt buộc và rủi ro cần spike. Không làm toàn bộ “nền tảng dùng chung” trước mọi giá trị.
- Ưu tiên đề xuất theo giá trị, rủi ro và việc được mở khóa; Product Owner quyết định thứ tự backlog.
- Không đợi hoàn tất một module nếu task tiếp theo chỉ cần một đầu ra/hợp đồng cụ thể đã sẵn sàng.
- Phạm vi xa chỉ cần đủ để nhìn dependency/rủi ro; chi tiết hóa sâu phần sắp làm, không tạo hàng trăm task giả chính xác.

## 2. Phân rã tính năng và chia task bàn giao được

Mỗi story cần mang lại một luồng hoạt động hoàn chỉnh từ đầu đến cuối (end-to-end) để có thể kiểm chứng độc lập. Task kỹ thuật có thể chia theo chuyên môn để hỗ trợ story, nhưng việc hoàn thành riêng từng task kỹ thuật chưa đủ để kết luận story đã xong.

Mẫu task:
- ID/key hoặc ID nháp rõ nhãn chưa publish; story/epic và module liên quan.
- Hành vi/giá trị giao được, ngoài phạm vi, AC.
- Inputs: tài liệu/contracts đúng revision và tiền điều kiện.
- Hard blockers: đầu ra cần, ID/key và lý do; external blockers có owner gỡ chặn.
- Kỹ năng cần, khả năng nhận việc của người/AI theo chính sách; không tự assign.
- Read/write areas đã biết, xung đột ngữ nghĩa, integration owner cần xác nhận.
- Cách kiểm chứng và yêu cầu review; điều kiện Done liên quan.

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

- Product Backlog: PO sắp thứ tự theo Product Goal; refinement diễn ra liên tục.
- Sizing: Developers thực hiện; AI có thể nêu rủi ro/đề xuất, không cam kết thời lượng thay đội. Story points không bắt buộc.
- Sprint Planning: vì sao có giá trị → chọn những gì phù hợp capacity → kế hoạch thực hiện/tích hợp. Đội thống nhất Sprint Goal.
- Sprint có độ dài cố định không quá một tháng; dùng nhịp đội đã chọn, hỏi nếu chưa có. Không tự chia lịch theo tuần tùy ý.
- Daily Scrum: Developers kiểm tra tiến độ hướng Sprint Goal và thích nghi kế hoạch; summary của AI chỉ là đầu vào.
- Review: kiểm tra Increment đạt DoD và phản hồi stakeholders; không phải cổng bắt buộc để release.
- Retrospective: chọn cải tiến có owner/tiêu chí theo dõi; Scrum Master hỗ trợ thực hành và gỡ trở ngại.
- Chưa Done cuối sprint không tính hoàn thành; quay lại backlog để cân nhắc, không tự đưa sang sprint sau như cam kết mới.

AI không thay PO/Developers/Scrum Master, không tính AI như một người để suy velocity. Scope thay đổi trong sprint phải phối hợp với PO và không làm nguy hại Sprint Goal.

Mẫu sprint proposal: Goal → mục được chọn đề xuất → capacity/rủi ro → dependency/nhóm song song → kế hoạch review/tích hợp/demo → câu hỏi cần đội quyết định.

## 6. Publish chỉ khi được phép

Chưa kết nối Jira: xuất draft theo `skill://product-workflow/references/records.md`, không tạo keys/assignees/status giả. Ghi rõ không thể claim hoặc báo board live từ nháp.

Có Jira: đọc project/board/hierarchy/fields/link types/permissions thực tế; đối chiếu backlog để tránh trùng. Trình breakdown và ảnh hưởng; lấy phê duyệt publish khi chưa được ủy quyền. Tạo theo dependency để liên kết keys thật, chỉ báo thành công sau output xác nhận. Timeout sau ghi phải đối chiếu, không tạo lại mù.

Quyền publish issue không bao gồm start/close sprint, sửa schema hay assign người khác. Không tự thay parent issue chỉ vì đã tạo subtasks.

## Gate G4 và bàn giao (Hard-Stop)

Ready về nội dung chưa đủ để claim: còn cần quyền, owner hiện tại, scope thực thi và cơ chế nhận việc an toàn.
**Quy tắc dừng lượt bắt buộc:** Sau khi bẻ nhỏ tính năng thành danh sách task cụ thể (1–4h) kèm thứ tự và dependency, AI phải **DỪNG TIN NHẮN** hoặc gọi công cụ `ask` của Oh My Pi để người dùng duyệt:

```text
ask(questions=[{
  "id": "gate_g4_approval",
  "question": "Bạn có duyệt kế hoạch phân rã task (Cổng G4) này để chuẩn bị triển khai không?",
  "options": [
    {"label": "Duyệt và chọn phương thức thực thi", "description": "Chuyển sang bước chọn mô hình thực thi (Subagents hoặc Inline)."},
    {"label": "Cần chỉnh sửa danh sách task", "description": "Thêm, bớt hoặc điều chỉnh lại phạm vi các task."},
    {"label": "Xem giải thích thứ tự phụ thuộc", "description": "Giải thích vì sao các task được sắp xếp theo thứ tự này."}
  ],
  "recommended": 0
}])
```

Chỉ sau khi người dùng phê duyệt kế hoạch, AI mới chuyển sang `task-execution` để bắt đầu lựa chọn mô hình thực thi (Spawn Subagents hay Inline) và phân công triển khai mã nguồn.
