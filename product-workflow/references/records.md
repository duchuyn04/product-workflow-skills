# Mẫu tài liệu dùng chung

Mẫu để agent điền khi thực hiện các cổng. Không tạo sẵn file dự án chỉ vì đọc file này. Bảng dưới là khung, không phải dữ liệu thật. Mọi ví dụ dùng chung một bộ số liệu minh họa từ đề bài bán điện thoại: `EP01 Quản lý sản phẩm` (US01 Thêm, US04 Tìm kiếm sản phẩm), `EP02 Quản lý bán hàng` (US05 Tạo đơn hàng, US06 Thêm sản phẩm vào đơn, US09 Thanh toán), `EP03 Quản lý kho` (US11 Trừ tồn kho khi bán, US12 Kiểm tra tồn kho), `EP06 Quản lý tài khoản` (US20 Đăng nhập).

## Quy ước đặt tên và ID

- **Epic:** ID `EP01`, `EP02`… Tên hiển thị bắt đầu bằng `Quản lý + [thực thể/nghiệp vụ]`, ví dụ `Quản lý sản phẩm`, `Quản lý bán hàng`. Nhóm như báo cáo, hóa đơn vẫn viết `Quản lý báo cáo`, `Quản lý hóa đơn`. Bảng hẹp có thể dùng tên ngắn bỏ chữ `Quản lý` (ví dụ `Bán hàng`), nhưng tên đầy đủ trong brief và CSV Jira luôn theo dạng `Quản lý + …`.
- **User Story:** ID `US01`, `US02`… đánh số liên tục trên toàn dự án, theo thứ tự Epic. Tên ngắn là một hành động: `Thêm sản phẩm`, `Tạo đơn hàng`.
- **Task:** ID `T01`, `T02`… đánh số liên tục trên toàn dự án (không đánh lại từ đầu mỗi sprint), để task không trùng ID khi xuất Jira.
- **Sprint:** tên hiển thị `Sprint X – <Mục tiêu ngắn>`, ví dụ `Sprint 1 – Bán hàng cơ bản`. Folder `docs/workflow/sprints/sprint-<X>-<slug>/`, slug là mục tiêu viết kebab-case không dấu, ví dụ `sprint-1-ban-hang-co-ban/`. Không đặt tên chỉ gồm số thứ tự như `Sprint 1` hay folder `sprint-1/`.
- ID giữ ổn định khi đổi tên, đổi Rank hoặc chuyển sprint. Story bị bỏ thì ghi `Đã hủy`, không tái dùng ID.

## Đầu file

Mỗi file cổng mở đầu bằng:

```markdown
# <Tiêu đề>
- Dự án: <tên dự án>
- Trạng thái cổng: draft | awaiting-approval | approved | needs-revalidation
- Cập nhật: <YYYY-MM-DD>
- Người duyệt: <tên/vai trò hoặc Chưa duyệt>
```

## G1 — Business brief (`specs/<du-an>-brief.md`)

Các mục theo thứ tự:

1. **Mô tả hệ thống:** đoạn mô tả gốc hoặc tóm tắt; nguồn (tài liệu, phỏng vấn).
2. **Quy mô đã chọn:** MVP / Vừa / Lớn.
3. **Vấn đề và giải pháp:**

| Vấn đề hiện tại (As-Is) | Hậu quả | Giải pháp đề xuất (To-Be) |
|---|---|---|

4. **Actors:**

| Actor | Mô tả | Được làm | Không được làm |
|---|---|---|---|

5. **Danh mục Epic:**

| ID | Epic | Các yêu cầu xác định được | Actors chính |
|---|---|---|---|
| EP01 | Quản lý sản phẩm | Thêm, sửa, xóa, tìm kiếm sản phẩm, xem tồn kho | Quản lý, NV bán hàng |

6. **Quy tắc nghiệp vụ:**

| ID | Quy tắc | Ví dụ | Nguồn xác nhận |
|---|---|---|---|
| BR01 | … | … | bên yêu cầu xác nhận / tài liệu <tên> / AI suy luận – cần xác nhận |

7. **Bảng phủ R1–R8:**

| Mục | Trạng thái (Đã rõ / N/A / Câu hỏi mở) | Tóm tắt quyết định hoặc lý do N/A |
|---|---|---|

8. **Ngoài phạm vi.**
9. **Câu hỏi mở:** câu hỏi, ảnh hưởng, ai trả lời.
10. **Rủi ro đã chấp nhận** (chỉ khi duyệt lúc còn câu hỏi mở).

## G2 — Stories (`specs/<du-an>-stories.md`)

Nhóm story theo Epic. Mỗi story:

```markdown
### US05 – Tạo đơn hàng
- Epic: EP02 – Quản lý bán hàng
- Story: Là nhân viên bán hàng, tôi muốn tạo đơn hàng để ghi nhận giao dịch với khách hàng.
- Rule liên quan: BR03, BR04
- Phụ thuộc: US04 (cần tìm được sản phẩm)
- Acceptance Criteria:
  - AC1: Given nhân viên đã đăng nhập, When chọn "Tạo đơn" và thêm ít nhất một sản phẩm còn hàng, Then đơn được tạo ở trạng thái "Chờ thanh toán".
  - AC2: Given sản phẩm hết hàng, When thêm vào đơn, Then hệ thống báo hết hàng và không thêm.
```

Story tự động do hệ thống thực hiện viết `Là hệ thống, tôi muốn … để …` và ghi rõ sự kiện kích hoạt.

**Ma trận Actor–Story** (lưu trong file stories, backlog liên kết tới):

| ID | User Story | NV bán hàng | NV kho | Quản lý | Khách hàng |
|---|---|---|---|---|---|
| US04 | Tìm kiếm sản phẩm | ✓ | ✓ | ✓ | ✓ |
| US05 | Tạo đơn hàng | ✓ | | | |
| US11 | Trừ tồn kho khi bán (tự động) | | | | |

`✓` nghĩa là actor thực hiện hoặc sử dụng trực tiếp story, dựa trên rule quyền trong brief. Story `Là hệ thống` ghi `(tự động)` và để trống cột actor. Cột actor lấy từ brief, không chép actor của ví dụ.

## G2 — Product Backlog (`product-backlog.md`)

Đầu file thêm: tổng số story, tổng SP, velocity dự kiến (sau G3).

**Góc nhìn 1 – Theo Epic** (dùng trong báo cáo, thấy Epic – Story – User):

| Rank | ID / Epic | User Story | <Actor 1> | <Actor 2> | … | Priority | Story Point | Sprint |
|---|---|---|---|---|---|---|---|---|
| | **EP06 – Quản lý tài khoản** | | | | | | | |
| 1 | US20 | Đăng nhập | ✓ | ✓ | | Highest | 3 | — |
| | **EP02 – Quản lý bán hàng** | | | | | | | |
| 2 | US05 | Tạo đơn hàng | ✓ | | | Highest | 5 | — |
| 3 | US06 | Thêm sản phẩm vào đơn | ✓ | | | Highest | 5 | — |

Dòng Epic là dòng nhóm, không có SP riêng. Nhóm Epic theo thứ tự Rank nhỏ nhất của story bên trong. Cuối mỗi nhóm có thể thêm tổng SP của Epic.

**Góc nhìn 2 – Theo Rank** (thứ tự xây dựng, dùng khi chia sprint):

| Rank | ID | Epic | User Story | Priority | Story Point | Sprint |
|---|---|---|---|---|---|---|
| 1 | US20 | Tài khoản | Đăng nhập | Highest | 3 | — |
| 2 | US05 | Bán hàng | Tạo đơn hàng | Highest | 5 | — |
| 3 | US06 | Bán hàng | Thêm sản phẩm vào đơn | Highest | 5 | — |

Hai góc nhìn là cùng dữ liệu. Khi sửa Priority/SP/Rank/Sprint thì sửa cả hai bảng cho khớp.

**Tổng hợp theo Epic:**

| Epic | Số story | Tổng SP |
|---|---|---|

- **Priority:** `Highest`, `High`, `Medium`, `Low` (khớp Jira). Priority là mức quan trọng nghiệp vụ.
- **Rank:** thứ tự duy nhất 1…N trong backlog, xét cả Priority, giá trị và dependency. Hai story cùng Priority vẫn khác Rank.
- **Story Point:** dãy Fibonacci `1, 2, 3, 5, 8, 13`, là độ lớn tương đối so với story mốc, không quy đổi ra giờ. Story > 13 phải tách.
- Cột `Sprint` để `—` cho đến G3; G3 điền cột này mà không mở lại G2.

## G3 — Roadmap (`sprints/roadmap.md`)

Đầu file: số người, độ dài sprint, velocity (đã biết hoặc ước lượng, ghi nguồn), hạn chót nếu có.

**Chuỗi dependency:**

| Story | Cần có trước | Lý do |
|---|---|---|
| US05 Tạo đơn hàng | US20 Đăng nhập, US04 Tìm kiếm sản phẩm | Phải đăng nhập và tìm được sản phẩm mới tạo đơn |

**Tổng thể các sprint:**

| Sprint | Sprint Goal | User Stories | Tổng SP | Capacity |
|---|---|---|---|---|
| Sprint 1 – Bán hàng cơ bản | Nhân viên đăng nhập, tìm điện thoại, kiểm tra tồn kho và tạo đơn | US20, US01, US04, US12, US05 | 17 | 20 |
| Sprint 2 – Hoàn thiện thanh toán | Thêm sản phẩm vào đơn, tính tiền, thanh toán và trừ tồn kho | US06, US07, US09, US11 | 18 | 20 |

**Story chưa xếp sprint:** danh sách ID kèm lý do (vượt capacity, phụ thuộc chưa xong, Priority thấp).

**Xuất Jira** (khi có `jira-import.csv`): đường dẫn file và các bước import, map cột theo mục CSV bên dưới.

## G3 — Kế hoạch sprint (`sprints/sprint-<X>-<slug>/sprint-plan.md`)

```markdown
# Sprint 1 – Bán hàng cơ bản
- Dự án: <tên dự án>
- Trạng thái cổng: draft | awaiting-approval | approved | needs-revalidation
- Cập nhật: <YYYY-MM-DD>
- Người duyệt: <tên/vai trò hoặc Chưa duyệt>
- Thời gian: 2 tuần (ngày bắt đầu/kết thúc nếu đã xác định)
- Sprint Goal: Xây dựng quy trình cơ bản để nhân viên đăng nhập, tìm kiếm điện thoại, kiểm tra tồn kho và tạo đơn hàng.
- Capacity: 20 SP · Đã chọn: 17 SP
```

**User Stories trong sprint:**

| Rank | ID | User Story | Priority | SP |
|---|---|---|---|---|
| 1 | US20 | Đăng nhập | Highest | 3 |
| … | … | … | … | … |
| | | **Tổng** | | **17** |

**Tasks:**

| Task | Story | Nội dung | Vai trò | Người phụ trách | Phụ thuộc |
|---|---|---|---|---|---|
| T01 | US20 | Thiết kế màn hình Login | Frontend | — | — |
| T02 | US20 | API Login | Backend | — | — |
| T03 | US20 | Kiểm tra username/password | Backend | — | T02 |
| T04 | US20 | Testing Login | QA | — | T01, T03 |

Có thể bổ sung dạng cây cho từng story khi cần:

```text
US20 – Đăng nhập (3 SP)
├── T01 – Thiết kế màn hình Login
├── T02 – API Login
├── T03 – Kiểm tra username/password
└── T04 – Testing Login
```

`Người phụ trách` chỉ ghi tên đã được cung cấp; chưa có thì ghi `—`.

## G3 — CSV import Jira (`jira-import.csv`)

Mã hóa UTF-8, dòng đầu là tiêu đề, dấu phẩy phân cách, ô có dấu phẩy thì đặt trong ngoặc kép.

```csv
Issue Id,Issue Type,Summary,Description,Priority,Story Points,Parent Id,Sprint,Labels
EP06,Epic,Quản lý tài khoản,"Đăng nhập, đăng xuất, phân quyền",,,,,
US20,Story,Đăng nhập,"Là nhân viên, tôi muốn đăng nhập để sử dụng chức năng theo quyền của mình.",Highest,3,EP06,Sprint 1 – Bán hàng cơ bản,
T01,Sub-task,Thiết kế màn hình Login,,,,US20,Sprint 1 – Bán hàng cơ bản,frontend
```

- Thứ tự dòng: Epic → Story → Sub-task, để cha có trước con.
- `Issue Id` và `Parent Id` dùng ID của backlog. Lúc import, map `Issue Id` → *Issue Id* và `Parent Id` → *Parent* để Jira nối cha–con.
- Tên trường Story Points khác nhau theo loại project (`Story Points` hoặc `Story point estimate`); cần chọn đúng trường khi map cột. Tên loại issue (`Sub-task`/`Subtask`) cũng phải khớp cấu hình project.
- Story chưa xếp sprint để trống cột `Sprint`.
- Ghi hướng dẫn import vào mục `Xuất Jira` của `sprints/roadmap.md` và tóm tắt trong chat, gồm các bước: tạo project, vào trang import CSV của Jira, chọn file, map từng cột, kiểm tra kết quả trên Backlog.
