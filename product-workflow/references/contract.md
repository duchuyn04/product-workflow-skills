# Hợp đồng chung của product-workflow

Áp dụng cho `product-discovery`, `product-backlog` và `sprint-planning`. Mẫu tài liệu nằm trong `records.md` cùng thư mục; skills dẫn tới mẫu, không chép lại.

## 1. Nguồn sự thật

| Nội dung | File |
|---|---|
| Mô tả hệ thống, As-Is/To-Be, actors, Epic, rules, R1–R8 | `docs/workflow/specs/<du-an>-brief.md` |
| User Stories, AC, ma trận Actor–Story | `docs/workflow/specs/<du-an>-stories.md` |
| Product Backlog (Rank, Priority, SP, Sprint) | `docs/workflow/product-backlog.md` |
| Lộ trình các sprint | `docs/workflow/sprints/roadmap.md` |
| Sprint Goal, story đã chọn, tasks | `docs/workflow/sprints/sprint-<X>-<slug>/sprint-plan.md` |
| Bản xuất cho Jira | `docs/workflow/jira-import.csv` (sinh từ các file trên, không phải nguồn thứ hai) |

- `<du-an>` là slug kebab-case không dấu của tên dự án, chốt một lần ở G1.
- Dự án đã có backlog hoặc tài liệu tương đương thì cập nhật tại chỗ. Không tạo bản cạnh tranh.
- Mỗi thông tin chỉ ghi ở một nơi. Backlog chứa Priority/SP/Rank/Sprint; file stories chứa nội dung story và AC; file sprint chỉ liên kết ID story, không chép lại AC.
- Đầu mỗi file ghi: `Trạng thái cổng: draft | awaiting-approval | approved | needs-revalidation`, ngày cập nhật, người duyệt (nếu có).

## 2. Cổng

| Cổng | Điều kiện | Người quyết định |
|---|---|---|
| G1 Nghiệp vụ & Epic | Vấn đề, actors, danh mục Epic, rules chính, phạm vi và R1–R8 theo quy mô rõ ràng; không còn câu hỏi chặn luồng chính | Người phụ trách nghiệp vụ / chủ sản phẩm |
| G2 Stories & Backlog | Story đủ actor, AC, Priority, SP, Rank; ma trận Actor–Story đủ; không có story trùng hoặc quá lớn (> 13 SP) | Chủ sản phẩm (PO) |
| G3 Sprint & Tasks | Team, độ dài sprint, capacity đã xác nhận; mỗi sprint có Goal, tổng SP ≤ capacity, dependency được tôn trọng; mỗi story trong sprint có bảng task | Nhóm phát triển và PO |

- Mỗi cổng là một điểm dừng: lưu file, tóm tắt, gọi `ask`, chờ người dùng.
- Chưa duyệt G1 thì không viết story; chưa duyệt G2 thì không chia sprint.
- Người dùng muốn duyệt khi còn câu hỏi mở: ghi các câu hỏi đó vào mục `Rủi ro đã chấp nhận` của file cổng rồi mới chuyển tiếp.
- Nội dung thay đổi sau khi duyệt: đánh dấu `needs-revalidation` cho phần bị ảnh hưởng và xin duyệt lại phần đó, không kéo cả dự án về draft.
- Ngoại lệ: G3 điền cột `Sprint` và velocity vào `product-backlog.md` là phần việc của G3, không mở lại G2. Nếu G3 cần đổi Priority, SP hay Rank thì đó là thay đổi G2 và phải xin duyệt.

## 3. Đề xuất và quyết định

- AI tìm dữ kiện trong tài liệu được cung cấp trước khi hỏi. Chỉ hỏi quyết định nghiệp vụ còn thiếu, gom 2–4 câu mỗi đợt.
- Không bịa dữ kiện, actors, quy tắc, capacity, velocity hay tên người. Chưa biết thì ghi `Chưa xác định` và đưa vào câu hỏi mở.
- Priority, Story Point, Rank, phân sprint và phân vai task do AI đưa ra được ghi `(đề xuất)` cho đến khi người dùng xác nhận. Sau khi duyệt cổng thì bỏ nhãn.
- Chỉ ghi người phụ trách task khi người dùng nêu tên. Không tự gán.

## 4. Tiếp tục phiên

Khi mở lại, đọc các file ở mục 1 và trạng thái cổng trong từng file. Làm tiếp từ cổng chưa duyệt; không hỏi lại những gì đã chốt. File bị sửa tay sau khi duyệt thì chỉ ra chỗ khác biệt và hỏi người dùng có giữ bản sửa không.

## 5. Công cụ

Tên công cụ (`ask`, `task`, `browser`, `skill://`) theo Oh My Pi. Harness khác dùng công cụ tương đương trong `harness.md` cùng thư mục. Không có công cụ hỏi thì hỏi trong chat rồi dừng lượt. Không bịa API, lệnh CLI hay khả năng kết nối Jira; bộ skills chỉ xuất file CSV, việc import do người dùng làm.
