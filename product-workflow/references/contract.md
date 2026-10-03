# Hợp đồng chung của product-workflow

Áp dụng cho `product-discovery`, `product-backlog` và `sprint-planning`. Mẫu tài liệu nằm trong `records.md` cùng thư mục; skills dẫn chiếu tới mẫu, không chép lại.

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
- Dự án đã có backlog hoặc tài liệu tương đương thì cập nhật tại chỗ. Không tạo bản song song.
- Mỗi thông tin chỉ ghi ở một nơi. Backlog chứa Priority/SP/Rank/Sprint; file stories chứa nội dung story và AC; file sprint chỉ liên kết ID story, không chép lại AC.
- Đầu mỗi file ghi: `Trạng thái cổng: draft | awaiting-approval | approved | needs-revalidation`, ngày cập nhật, người duyệt (nếu có).

## 2. Cổng

| Cổng | Điều kiện | Người quyết định |
|---|---|---|
| G1 Nghiệp vụ & Epic | Vấn đề, actors, danh mục Epic, rules chính, phạm vi và R1–R8 theo quy mô rõ ràng; không còn câu hỏi chặn luồng chính | Người phụ trách nghiệp vụ / chủ sản phẩm |
| G2 Stories & Backlog | Story đủ actor, AC, Priority, SP, Rank; ma trận Actor–Story đủ; không có story trùng hoặc quá lớn (> 13 SP) | Chủ sản phẩm (PO) |
| G3 Sprint & Tasks | Team, độ dài sprint, capacity đã xác nhận; mỗi sprint có Goal, tổng SP ≤ capacity, dependency được tôn trọng; mỗi story trong sprint có bảng task | Nhóm phát triển và PO |

- Mỗi cổng là một điểm dừng: lưu file, tóm tắt, gọi `ask`, chờ phê duyệt.
- Chưa duyệt G1 thì không viết story; chưa duyệt G2 thì không chia sprint.
- Duyệt khi còn câu hỏi mở: ghi các câu hỏi đó vào mục `Rủi ro đã chấp nhận` của file cổng trước khi chuyển tiếp.
- Nội dung thay đổi sau khi duyệt: đánh dấu `needs-revalidation` cho phần bị ảnh hưởng và xin duyệt lại phần đó, không đưa cả dự án về draft.
- Ngoại lệ: việc G3 điền cột `Sprint` và velocity vào `product-backlog.md` thuộc phạm vi G3, không mở lại G2. Nếu G3 cần đổi Priority, SP hay Rank thì đó là thay đổi G2 và phải xin duyệt.

## 3. Vai trò, đề xuất và quyết định

Thuật ngữ vai trò:
- **Người phê duyệt:** người ra quyết định tại cổng, theo cột `Người quyết định` ở mục 2.
- **Bên yêu cầu:** nguồn cung cấp yêu cầu, tài liệu và dữ kiện nghiệp vụ. Có thể trùng với người phê duyệt.
- **Người dùng:** chỉ dùng cho người dùng cuối của hệ thống đang được phân tích (actors), không dùng để chỉ người làm việc với agent.

Nguyên tắc:
- AI tìm dữ kiện trong tài liệu được cung cấp trước khi hỏi. Chỉ hỏi các quyết định nghiệp vụ còn thiếu, gom 2–4 câu mỗi đợt.
- Không bịa dữ kiện, actors, quy tắc, capacity, velocity hay tên người. Thông tin chưa có thì ghi `Chưa xác định` và đưa vào câu hỏi mở.
- Priority, Story Point, Rank, phân bổ sprint và phân vai task do AI đưa ra được ghi `(đề xuất)` cho đến khi được xác nhận. Bỏ nhãn sau khi cổng được duyệt.
- Chỉ ghi người phụ trách task khi tên đã được cung cấp. Không tự gán.

## 4. Tiếp tục phiên

Khi mở lại, đọc các file ở mục 1 và trạng thái cổng trong từng file. Tiếp tục từ cổng chưa duyệt; không hỏi lại nội dung đã chốt. File bị sửa tay sau khi duyệt thì chỉ ra điểm khác biệt và xác nhận có giữ bản sửa hay không.

## 5. Công cụ

Tên công cụ (`ask`, `task`, `browser`, `skill://`) theo Oh My Pi. Harness khác dùng công cụ tương đương trong `harness.md` cùng thư mục. Không có công cụ hỏi thì đặt câu hỏi trong chat và dừng lượt. Không bịa API, lệnh CLI hay khả năng kết nối Jira; bộ skills chỉ xuất file CSV, việc import thực hiện thủ công trên Jira.
