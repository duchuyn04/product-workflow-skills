# Quy tắc cốt lõi Product Workflow

Áp dụng cho Agent khi phân tích yêu cầu, viết User Stories, lập Product Backlog hoặc chia sprint và task.

**Mục tiêu duy nhất của quy trình:** từ mô tả yêu cầu, tạo ra Product Backlog (Epic – User Story – Actor – Rank – Priority – Story Point) và kế hoạch sprint có chia task. Bộ skills không viết code, không thiết kế kiến trúc, không review hay nghiệm thu.

Trước khi làm, đọc nội dung `skill://product-workflow` (fallback `product-workflow/SKILL.md` trong thư mục skills đã cài: `.claude/skills/` cho Claude Code, `.agents/skills/` cho Oh My Pi; trong repo này ở gốc repo). Glob không thay cho đọc skill.

---

## 1. Ba cổng duyệt

```text
G1 Nghiệp vụ & Epic ──► [Duyệt] ──► G2 Stories & Backlog ──► [Duyệt] ──► G3 Sprint & Tasks ──► [Duyệt] ──► Kết thúc
```

| Cổng | Skill | Đầu ra |
|---|---|---|
| G1 Nghiệp vụ & Epic | `product-discovery` | `docs/workflow/specs/<du-an>-brief.md` |
| G2 Stories & Backlog | `product-backlog` | `docs/workflow/specs/<du-an>-stories.md`, `docs/workflow/product-backlog.md` |
| G3 Sprint & Tasks | `sprint-planning` | `docs/workflow/sprints/roadmap.md`, `docs/workflow/sprints/sprint-<X>-<slug>/sprint-plan.md`, tùy chọn `docs/workflow/jira-import.csv` |

## 2. Lệnh cấm

- **MỖI LƯỢT MỘT CỔNG:** Trình bày xong một cổng thì gọi `ask` (Claude Code: `AskUserQuestion`) xin duyệt và dừng. "OK" chỉ duyệt cổng vừa trình bày.
- **KHÔNG NHẢY CỔNG:** Chưa duyệt G1 thì không viết story. Chưa duyệt G2 thì không chia sprint.
- **DOCS-FIRST:** Đầu ra của mọi cổng lưu thành file trong `docs/workflow/`, không chỉ in ra chat.
- **AI ĐỀ XUẤT, NGƯỜI PHÊ DUYỆT QUYẾT ĐỊNH:** Priority, Story Point, Rank, phân sprint, velocity ghi `(đề xuất)` cho đến khi được duyệt. Không bịa actors, quy tắc, số người hay tên thành viên.
- **PHỎNG VẤN THEO QUY MÔ:** Hỏi `ask` chọn quy mô (MVP / Vừa / Lớn) trước, rồi hỏi case study cụ thể theo đợt 2–4 câu. Không bỏ qua câu hỏi khi luồng chính còn điểm mơ hồ; không hỏi chi tiết giao diện hay công nghệ.
- **TÊN EPIC:** Bắt đầu bằng `Quản lý + …` (ví dụ `Quản lý sản phẩm`), ID `EP01`, `EP02`…
- **TÊN SPRINT:** `Sprint X – <Mục tiêu ngắn>` (ví dụ `Sprint 1 – Bán hàng cơ bản`), folder `docs/workflow/sprints/sprint-<X>-<slug>/`. Không đặt tên chỉ gồm số thứ tự như `Sprint 1` hay folder `sprint-1/`.
- **SPRINT PLANNING THEO 5 TIÊU CHÍ:** Priority, Story Point, Dependency, Sprint Goal, Capacity. Không lấy máy móc N dòng đầu backlog; tổng SP của sprint không vượt capacity đã xác nhận.
- **SƠ ĐỒ:** Chỉ vẽ khi có yêu cầu, bằng `diagram-design`, không dùng Mermaid. Sơ đồ HTML/SVG tạo hoặc sửa phải kiểm thử qua browser (OMP browser hoặc MCP browser trên Claude Code); không có browser thì ghi `not-run`.

---

## 3. Nhận định sai thường gặp (Red Flags)

| Nhận định sai | Quy tắc đúng |
|---|---|
| Mô tả đã đủ rõ nên có thể viết story và chia sprint trong cùng một lượt. | Mỗi lượt một cổng: lưu file, gọi `ask`, chờ duyệt. |
| Số người trong nhóm và velocity có thể tự suy đoán. | `sprint-planning` phải khảo sát team size, độ dài sprint, velocity. AI chỉ đề xuất con số; người phê duyệt xác nhận. |
| Story Thanh toán có Priority Highest nên thuộc Sprint 1. | Xét dependency: story chỉ vào sprint khi các story nó phụ thuộc đã có trước. |
| Rank và Priority là một. | Priority là mức độ quan trọng; Rank là thứ tự xây dựng duy nhất, có xét dependency. |
| Mỗi story phải có đủ 5 task UI/DB/API/validate/test. | Năm phần này chỉ là gợi ý; chỉ tạo task cho phần story thực sự cần. |
| Epic có thể đặt là `Sản phẩm`, sprint là `Sprint 1`. | Epic theo dạng `Quản lý + …`; sprint theo dạng `Sprint X – <Mục tiêu>`. |
| Phản hồi "OK" cho phép thực hiện toàn bộ các cổng còn lại. | "OK" chỉ duyệt cổng vừa trình bày. |

---

## 4. Bản đồ skills

Chỉ đọc skill của cổng đang thực hiện; không nạp cả bộ.

**Cách đọc theo môi trường:**
- Nếu hỗ trợ `skill://`, mở URI trong bảng bằng công cụ đọc file.
- Tên công cụ trong skills theo Oh My Pi (`ask`, `task`, `browser`); harness khác (như Claude Code) dùng công cụ tương đương trong `product-workflow/references/harness.md`.
- Nếu không hỗ trợ, đọc `<tên-skill>/SKILL.md` trong thư mục skills đã cài (trong repo này là gốc repo).
- Không tìm thấy skill bắt buộc thì báo rõ tên skill và vị trí đã kiểm tra; không tự bịa nội dung thay thế.

| Mục tiêu | Đọc kỹ năng | Đầu ra |
|---|---|---|
| Điều phối, tiếp tục từ docs có sẵn, thay đổi yêu cầu | `skill://product-workflow` | Định tuyến qua G1–G3 |
| Phân tích yêu cầu, As-Is/To-Be, actors, danh mục Epic (G1) | `skill://product-discovery` | `docs/workflow/specs/<du-an>-brief.md` |
| User Stories, AC, ma trận Actor–Story, Priority/SP/Rank (G2) | `skill://product-backlog` | `docs/workflow/specs/<du-an>-stories.md`, `docs/workflow/product-backlog.md` |
| Team/capacity, dependency, sprint, task, CSV Jira (G3) | `skill://sprint-planning` | `docs/workflow/sprints/…`, `docs/workflow/jira-import.csv` |
| Sơ đồ story map, dependency, roadmap khi có yêu cầu | `skill://diagram-design` | HTML/SVG trong `docs/workflow/diagrams/` |
