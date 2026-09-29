---
name: product-workflow
description: "Đọc khi người dùng muốn phân tích yêu cầu, xác định Epic/actors, viết User Stories, lập Product Backlog (Rank, Priority, Story Point) hoặc chia sprint và task. Điều phối 3 cổng duyệt: nghiệp vụ, stories và backlog, sprint và tasks; kết quả lưu Markdown trong docs/workflow/, có thể xuất CSV import Jira."
---

# Product workflow

Một đầu vào duy nhất cho quy trình: **từ mô tả yêu cầu đến Product Backlog và kế hoạch sprint có chia task**. Giao tiếp tiếng Việt trừ khi người dùng yêu cầu khác.

Bộ skills chỉ lập kế hoạch sản phẩm. Không viết code, thiết kế kiến trúc, review hay nghiệm thu. Nếu người dùng yêu cầu những việc đó, nói rõ bộ skills không phụ trách và để họ quyết định cách làm tiếp.

## Khởi động

1. Đọc `skill://product-workflow/references/contract.md` và `skill://product-workflow/references/harness.md`. Nếu harness không hỗ trợ `skill://` (như Claude Code), đọc cùng file dưới `<skills-dir>/product-workflow/references/`; `<skills-dir>` là thư mục cha của skill này (`.claude/skills/`, `.agents/skills/` hoặc bản toàn cục). Skills con dùng cùng quy tắc fallback. Tên công cụ viết theo Oh My Pi; harness khác quy đổi theo `harness.md`.
2. Dò `docs/workflow/` và tài liệu người dùng đưa (mô tả, PDF, Excel, backlog cũ) trước khi hỏi. Không giả định dự án rỗng.
3. Xác định kiểu vào việc (mục dưới) và cổng hiện tại. Nói ngắn: đang ở cổng nào, đã có gì, còn thiếu gì, bước tiếp theo.

## Quy trình 3 cổng

```text
Mô tả yêu cầu
  → G1 Nghiệp vụ & Epic      (product-discovery) → [Duyệt]
  → G2 Stories & Backlog     (product-backlog)   → [Duyệt]
  → G3 Sprint & Tasks        (sprint-planning)   → [Duyệt] → Kết thúc
```

| Cổng | Skill phải đọc | Đầu ra | Điều kiện duyệt |
|---|---|---|---|
| G1 Nghiệp vụ & Epic | `skill://product-discovery` | `docs/workflow/specs/<du-an>-brief.md` | Vấn đề As-Is/To-Be, actors, danh mục Epic, rules chính, phạm vi và R1–R8 theo quy mô đã rõ |
| G2 Stories & Backlog | `skill://product-backlog` | `docs/workflow/specs/<du-an>-stories.md`, `docs/workflow/product-backlog.md` | Mọi story có actor, AC, Priority, Story Point, Rank; ma trận Actor–Story đầy đủ |
| G3 Sprint & Tasks | `skill://sprint-planning` | `docs/workflow/sprints/roadmap.md`, `docs/workflow/sprints/sprint-<X>-<slug>/sprint-plan.md`, tùy chọn `docs/workflow/jira-import.csv` | Có team/capacity đã xác nhận, Sprint Goal, story theo sprint trong capacity, bảng task cho từng story |

Đọc skill bằng công cụ đọc file (`read`; Claude Code: `Read`) trước khi làm. Không dùng tool `Skill` để nạp skill ẩn. Chỉ đọc skill của cổng đang làm, không đọc cả bộ.

Chỉ đọc `skill://diagram-design` khi người dùng muốn sơ đồ (story map, chuỗi dependency, roadmap). Bảng Markdown là mặc định. Không dùng Mermaid.

## Kiểu vào việc

1. **Bắt đầu mới:** bắt đầu từ G1.
2. **Tiếp tục:** đọc file trong `docs/workflow/`, xem trạng thái cổng ghi ở đầu mỗi file, rồi làm tiếp từ cổng chưa duyệt. Không hỏi lại điều đã chốt.
3. **Đã có sẵn đề bài hoặc backlog:** nhập dữ kiện vào đúng mẫu. Mô tả đủ rõ thì vẫn làm G1 nhưng chỉ hỏi phần thiếu. Có sẵn danh sách story thì chuẩn hóa ở G2. Có sẵn backlog có Rank/SP thì xác nhận lại rồi sang G3.
4. **Thay đổi yêu cầu:** sửa brief hoặc story liên quan, cập nhật backlog, rồi lập lại kế hoạch cho các sprint bị ảnh hưởng. Giữ nguyên ID cũ. Cổng đã duyệt mà nội dung đổi thì chuyển sang `needs-revalidation` và xin duyệt lại phần thay đổi.

## Quy tắc cổng

- **Mỗi lượt một cổng.** Làm xong cổng nào thì lưu file, tóm tắt trong chat, gọi `ask` rồi dừng. Không làm tiếp cổng sau trong cùng lượt.
- **Lưu file trước khi hỏi.** Mọi đầu ra của cổng phải nằm trong `docs/workflow/`, không chỉ in ra chat.
- `ask` duyệt cổng có ba lựa chọn: `Duyệt và tiếp tục` (recommended), `Cần điều chỉnh`, `Hỏi thêm chi tiết`.
- "OK" chỉ duyệt đúng cổng vừa trình bày.
- AI đề xuất, người dùng quyết định. Priority, Story Point, Rank và phân sprint do AI đưa ra đều là đề xuất cho đến khi được duyệt.
- Người dùng chủ động muốn đi nhanh ("làm hết luôn") thì vẫn dừng ở từng cổng, nhưng gom câu hỏi và giảm độ sâu phỏng vấn theo quy mô đã chọn.

## Cách dùng

Người dùng có thể nói: "Phân tích yêu cầu hệ thống này", "Tạo product backlog từ mô tả sau", "Chia sprint cho backlog này", "Thêm chức năng X vào backlog", "Tiếp tục từ chỗ đang làm".

Oh My Pi: `/skill:product-workflow`. Claude Code: `/product-workflow`. Ba skill cổng có `hide: true` (Claude Code: `disable-model-invocation: true`): model không tự gọi, router đọc bằng đường dẫn file. Sau khi cài mới, mở phiên mới để harness nhận skill.
