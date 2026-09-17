# Mẫu hồ sơ dùng chung

Đây là mẫu để agent điền khi người dùng yêu cầu tạo/lưu hồ sơ. Không tạo sẵn hồ sơ dự án chỉ vì đọc file này. Đọc `skill://product-workflow/references/contract.md` trước. Nếu URI chưa được khám phá, đọc `.agents/skills/product-workflow/references/contract.md`.

Dùng quy ước tài liệu đã có. Nếu chưa có, đề xuất `docs/workflow/project.md` và `docs/workflow/checkpoint.md`, chốt nơi lưu một lần. Tài liệu chi tiết ở nơi phù hợp, chỉ mục chứa links; không nhét toàn dự án vào một file. Bảng dưới mô tả trường cần điền, không phải dữ liệu thật.

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

Danh mục module và nghĩa vụ phải có nguồn trước khi tính tiến độ. Thiếu nghĩa vụ là chưa xác định, không phải 0/0 đạt. Bảng ma trận chỉ là góc nhìn được sinh từ đây và Jira/evidence, không chứa ô tick có quyền riêng.
