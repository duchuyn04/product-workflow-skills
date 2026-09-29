---
name: sprint-planning
description: "Cổng G3: từ Product Backlog đã duyệt, khảo sát team và capacity, xét dependency, chọn User Stories vào từng sprint theo 5 tiêu chí, viết Sprint Goal, chia story thành task và xuất CSV import Jira."
hide: true
disable-model-invocation: true
---

# Sprint planning (G3 Sprint & Tasks)

Đọc `skill://product-workflow/references/contract.md` và `skill://product-workflow/references/records.md` trước. Nếu harness không hỗ trợ `skill://` (như Claude Code), đọc `<skills-dir>/product-workflow/references/`; `<skills-dir>` là thư mục cha của skill này (`.claude/skills/`, `.agents/skills/` hoặc bản toàn cục). Tên công cụ quy đổi theo `<skills-dir>/product-workflow/references/harness.md`.

Quy trình: Product Backlog → Sprint Planning → Sprint Backlog → Task/Sub-task.

## Đầu vào

- `docs/workflow/product-backlog.md` đã duyệt G2 (Rank, Priority, SP) và file stories (dependency, AC).
- R8 trong brief: hạn chót, số người, thời gian.

Backlog chưa duyệt, hoặc story thiếu SP, thì quay về G2.

## 1. Khảo sát nhóm

Gọi `ask` cho những gì chưa biết. Có thể gộp tối đa 4 câu trong một lần gọi:

```text
ask(questions=[
  {"id": "team_size", "question": "Nhóm thực hiện có bao nhiêu người?",
   "options": [
     {"label": "1 người", "description": "Làm tuần tự, không cần chia vai."},
     {"label": "2–3 người", "description": "Chia vai Frontend / Backend / QA."},
     {"label": "4–6 người", "description": "Nhiều việc song song trong một sprint."}
   ]},
  {"id": "sprint_length", "question": "Mỗi sprint dài bao lâu?",
   "options": [
     {"label": "2 tuần", "description": "Phổ biến nhất."},
     {"label": "1 tuần", "description": "Phản hồi nhanh, sprint nhỏ."},
     {"label": "3–4 tuần", "description": "Ít sprint hơn, mỗi sprint nhiều story hơn."}
   ], "recommended": 0},
  {"id": "velocity", "question": "Nhóm đã biết mỗi sprint làm được khoảng bao nhiêu Story Point chưa?",
   "options": [
     {"label": "Chưa, hãy đề xuất", "description": "AI ước lượng từ số người và độ dài sprint, nhóm xác nhận."},
     {"label": "Đã biết", "description": "Nhập con số ở ô Other."}
   ], "recommended": 0}
])
```

- Không đánh dấu lựa chọn khuyến nghị cho câu hỏi số người; đó là dữ kiện, không phải đề xuất.
- Chưa biết velocity: đề xuất một con số ban đầu và trình bày cách tính, ví dụ: `số người × số ngày làm việc thực tế trong sprint × SP một người làm được mỗi ngày`. Nhóm mới hoặc sinh viên làm bán thời gian thì dùng hệ số thấp và nói rõ giả định. Tham khảo, không phải mặc định: nhóm 4–5 sinh viên, sprint 2 tuần, khoảng 18–20 SP. Người dùng xác nhận thì mới dùng.
- Nhóm từ 2 người trở lên: đề xuất cách phân vai (ví dụ 2 Backend, 1 Frontend, 1 QA) ghi `(đề xuất)`, hoặc hỏi luôn trong cùng lần `ask` nếu còn chỗ. Cột `Vai trò` của task dựa trên cách phân vai này.
- Có hạn chót (R8): tính số sprint khả dụng. Nếu tổng SP vượt `số sprint × velocity`, nói rõ và đề nghị người dùng chọn: cắt story Priority thấp, thêm sprint, hay giữ và chấp nhận rủi ro.
- Không đoán số người hay tên thành viên.

## 2. Chuỗi dependency

Lập bảng dependency giữa các story, lấy từ trường `Phụ thuộc` của story và bổ sung khi thấy thiếu. Ví dụ chuỗi: Đăng nhập → Quản lý sản phẩm → Tìm kiếm → Kiểm tra tồn kho → Tạo đơn → Thêm sản phẩm vào đơn → Tính tiền → Thanh toán → Trừ tồn kho → Hóa đơn.

Kiểm tra vòng lặp (A cần B, B cần A). Có vòng lặp thì tách story hoặc hỏi người dùng.

Chỉ vẽ sơ đồ khi người dùng muốn, bằng `skill://diagram-design` (`type-dependency`).

## 3. Chọn story vào sprint

Không lấy máy móc N dòng đầu của backlog. Xét 5 tiêu chí:

1. **Priority:** ưu tiên story quan trọng.
2. **Story Point:** tổng SP của sprint không vượt capacity.
3. **Dependency:** story chỉ vào sprint khi các story nó cần đã ở sprint trước, hoặc cùng sprint và xếp trước. Vì vậy Thanh toán dù `Highest` vẫn chưa vào Sprint 1 nếu chưa có Tạo đơn.
4. **Sprint Goal:** các story trong sprint cùng hướng tới một kết quả demo được.
5. **Capacity:** năng lực nhóm đã xác nhận ở bước 1. Ưu tiên chức năng cơ bản trước, chức năng phức tạp sau.

Cách làm, cho từng sprint:
1. Chọn Sprint Goal trước: kết quả demo được tiếp theo trên luồng chính, dựa vào các story Rank cao nhất chưa xếp.
2. Đi theo Rank. Đưa vào sprint các story phục vụ Goal, có dependency đã thỏa, và còn đủ chỗ trong capacity.
3. Story tiếp theo không vừa capacity thì để sang sprint sau (ví dụ Sprint 2 = 21 SP, capacity 20, thì để "Tạo hóa đơn" sang Sprint 3, còn 18 SP). Không nhảy xuống lấy story Rank thấp chỉ để lấp đầy chỗ trống; sprint thấp hơn capacity vài SP là bình thường.
4. Chỉ đưa story Rank thấp hơn lên trước khi nó phục vụ đúng Goal và story Rank cao hơn đang chờ dependency. Ghi lý do trong roadmap.
5. Đặt tên sprint `Sprint X – <Mục tiêu ngắn>`, Sprint Goal viết một câu nêu kết quả người dùng thấy được.
- Lập kế hoạch cho toàn bộ backlog khi người dùng muốn thấy lộ trình tổng thể. Sprint càng xa càng là dự báo; ghi chú điều đó trong roadmap.
- Story không xếp được thì liệt kê ở mục "Story chưa xếp sprint" kèm lý do.

## 4. Chia story thành task

Với mỗi story trong sprint, chia thành task đánh số `T01`, `T02`… liên tục trên toàn dự án.

- Gợi ý các phần cần xét: giao diện, dữ liệu/DB, API/xử lý, kiểm tra dữ liệu nhập, testing. Chỉ tạo task cho phần story thực sự cần. Không bắt đủ 5 task, không tạo task giả để đủ mẫu.
- Mỗi task đủ nhỏ để một người làm trong 1–2 ngày.
- Mỗi story nên có ít nhất một task kiểm thử dựa trên AC của story.
- Cột `Vai trò`: Frontend / Backend / QA / Fullstack, theo số người đã khảo sát. Nhóm 1 người thì ghi `Fullstack` hoặc bỏ cột.
- Cột `Người phụ trách`: chỉ ghi tên người dùng đưa. Chưa có thì `—`.
- Cột `Phụ thuộc`: task nào phải xong trước. Giúp nhóm thấy việc nào làm song song được.
- Việc nền không thuộc story nào (dựng project, tạo DB, dữ liệu mẫu) gắn vào story đầu tiên cần nó, thường ở Sprint 1. Không tạo story giả cho việc nền.
- Kiểm tra chuỗi task phụ thuộc dài nhất của mỗi vai trò có vừa độ dài sprint không. Nếu một người phải làm tuần tự quá nhiều task, chia lại vai hoặc chuyển bớt story sang sprint sau, và nêu rủi ro này trong tóm tắt.

## 5. Lưu

1. `docs/workflow/sprints/roadmap.md`: thông tin nhóm, chuỗi dependency, bảng tổng thể các sprint, story chưa xếp sprint.
2. `docs/workflow/sprints/sprint-<X>-<slug>/sprint-plan.md` cho từng sprint: Sprint Goal, thời gian, capacity, bảng story, bảng task.
3. Điền cột `Sprint` ở cả hai góc nhìn trong `docs/workflow/product-backlog.md`, và cập nhật velocity ở đầu file.

Tất cả theo mẫu trong `records.md`.

## 6. Xuất CSV cho Jira (tùy chọn)

Gọi `ask` hỏi người dùng có muốn file import Jira không. Nếu có, tạo `docs/workflow/jira-import.csv` theo mẫu `G3 — CSV import Jira` trong `records.md`: Epic, rồi Story, rồi Sub-task; kèm hướng dẫn map cột khi import. Không tự kết nối hay ghi vào Jira.

## 7. Xin duyệt G3

1. Tóm tắt trong chat: team và velocity, bảng tổng thể các sprint (Goal, story, SP), số task mỗi sprint, story chưa xếp, rủi ro (vượt hạn chót, dependency dài).
2. Gọi `ask` duyệt G3 với ba lựa chọn `Duyệt và tiếp tục` / `Cần điều chỉnh` / `Hỏi thêm chi tiết`, rồi dừng lượt.

Duyệt xong thì ghi `approved`, bỏ nhãn `(đề xuất)`. Quy trình kết thúc. Gợi ý bước tiếp theo cho nhóm: đưa lên Jira bằng CSV, bắt đầu Sprint 1, cập nhật trạng thái To Do → In Progress → Testing → Done trên board, rồi Sprint Review và Retrospective.

## Lập lại kế hoạch

Khi người dùng báo sprint trước chưa xong hết, thêm story, hoặc đổi team:
- Story chưa xong quay lại backlog giữ Rank cũ. Không tự đẩy sang sprint sau như một cam kết.
- Chỉ lập lại các sprint chưa bắt đầu. Sprint đã chốt thì giữ, trừ khi người dùng muốn đổi.
- Giữ ID story và task. Task mới dùng số tiếp theo.
- Xin duyệt lại phần thay đổi.
