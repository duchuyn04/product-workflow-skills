# Hợp đồng chung của product-workflow

Áp dụng cho bảy skills của bộ workflow. Đây là hướng dẫn cho agent, không phải công cụ Jira hoặc cơ chế khóa tác vụ. Tuân thủ chỉ dẫn cấp cao hơn và quyền thực tế của công cụ.

## 1. Ngữ cảnh vào và kết quả ra

Trước một bước, xác định: yêu cầu hiện tại; chế độ `discuss`, `plan` hoặc `execute`; dự án/scope/release; nguồn và revision đầu vào; quyết định đã duyệt; câu hỏi chặn; quyền đọc/ghi được cấp. Không coi việc từng duyệt thiết kế là quyền thực thi mọi bước.

Kết quả mỗi bước gồm:
- Kết luận/đầu ra, phân biệt sự thật, đề xuất và giả thuyết.
- Liên kết nguồn cùng revision, hoặc ghi rõ chưa xác minh.
- Phần còn thiếu, ảnh hưởng và người có thể giải quyết.
- Gate: `draft`, `awaiting-approval`, `approved` hoặc `needs-revalidation`.
- Bước tiếp theo đủ điều kiện và quyền còn cần. Dừng khi cần quyết định người dùng, không tự vượt gate.

Không in đủ năm mục một cách máy móc nếu trả lời ngắn đã chứa đủ thông tin.

## 2. Điều phối và giới hạn phạm vi

Một đầu vào là `product-workflow`; các skills còn lại là chuyên gia được gọi theo yêu cầu, không phải sáu agent luôn chạy. Đọc skill cần dùng trước khi thực hiện. Khi gọi trực tiếp một skill con, đọc hợp đồng này và xác định đầu vào; chỉ đọc router nếu cần chọn bước tiếp theo, tránh vòng gọi vô hạn.

Chỉ xử lý phạm vi được yêu cầu. Đừng chạy toàn bộ lifecycle để trả lời một câu hỏi hoặc sửa một lỗi nhỏ. Discovery của scope tương lai có thể chạy cùng delivery của scope đã duyệt. Không biến gates thành waterfall toàn dự án.

Không bịa API, lệnh CLI, MCP tool hoặc khả năng claim. Nếu công cụ cần thiết không có, trả rõ khả năng thiếu và hoàn thành phần phân tích không cần công cụ. Không đổi một kết quả proposal thành lời tuyên bố đã cập nhật hệ thống thật.

## 3. Nguồn dữ liệu và quyền sở hữu

| Nội dung | Nguồn chính thức |
|---|---|
| Backlog, owner, sprint, dependencies, trạng thái issue | Jira, khi đã có kết nối được cấp quyền |
| Nghiệp vụ, glossary, stories/flows, ADR và contracts | Hồ sơ có phiên bản trong repo theo quy ước đã chọn |
| Quyết định duyệt | Bản ghi người duyệt, phạm vi, revision và tham chiếu nguồn xác nhận; liên kết Jira khi được phép |
| Kết quả kiểm chứng | Output thật của công cụ/CI/review/deployment, kèm revision và môi trường |
| Checkpoint | Con trỏ tới các nguồn trên và câu hỏi còn mở, không phải backlog thứ hai |
| Ma trận | Tổng hợp chỉ đọc từ nghĩa vụ đầu ra, approvals và Jira/evidence |

Khi chưa kết nối Jira, được tạo **bản nháp backlog chưa publish** nếu người dùng yêu cầu. Ghi rõ chưa có Jira key/owner/trạng thái Jira; không coi bản nháp là nguồn quản lý công việc song song. Sau publish có xác nhận, dùng key trả về và biến nháp thành tham chiếu, không duy trì hai bản trạng thái.

Mặc định đề xuất `docs/workflow/project.md` làm chỉ mục và `docs/workflow/checkpoint.md` làm điểm tiếp tục nếu repo chưa có quy ước. Chỉ tạo khi người dùng yêu cầu bắt đầu/lưu workflow và chốt nơi lưu; ưu tiên tài liệu có sẵn, không sao chép thành nguồn thứ hai. Phiên chỉ trao đổi không tự sinh cả cây tài liệu.

Mỗi artifact có ID ổn định, scope, revision thực (commit khi đã commit, hoặc hash nội dung), nguồn, trạng thái duyệt. Duyệt trong chat phải ghi đúng người, nội dung/phạm vi và bằng chứng tham chiếu; không tự gán người dùng làm PO hay tech lead. Chưa có tham chiếu bền vững thì ghi rõ giới hạn, không bịa message ID. Nội dung đổi sau duyệt phải đánh giá lại phạm vi approval, không giữ `approved` bằng thói quen.

## 4. Câu hỏi và gates

Đọc nguồn trước khi hỏi. Hỏi 2–3 câu cùng chủ đề mỗi lượt, ưu tiên câu ảnh hưởng scope/kiến trúc/an toàn; ghi lý do và phương án có tradeoff. Không hỏi lại câu đã trả lời nếu nguồn chưa mâu thuẫn hoặc thay đổi.

| Gate | Điều kiện | Người quyết định |
|---|---|---|
| G1 Nghiệp vụ | Mục tiêu và phạm vi rõ ràng, quy tắc của phần tính năng sắp làm không còn câu hỏi chặn | Người phụ trách nghiệp vụ được chỉ định |
| G2 Stories/UX | AC và flow thống nhất, quyền/lỗi quan trọng được xét | Người phụ trách sản phẩm/UX được chỉ định |
| G3 Giải pháp | Ràng buộc đáp ứng, contracts cần cho triển khai đủ rõ | Người phụ trách kỹ thuật được chỉ định |
| G4 Thực thi | Scope công việc đã duyệt, prerequisites và quyền thực thi đáp ứng | Người/đội có trách nhiệm theo quy định dự án |

Chưa chỉ định người quyết định thì hỏi, không tự tạo approval. “OK” chỉ xác nhận đề xuất cụ thể ngay trước đó, không cấp quyền publish, claim, deploy hay duyệt mọi tài liệu tương lai.

## 5. Trạng thái, Ready và Done

Ngữ nghĩa logic: Draft → Refined → Ready → In progress → Review → Verification → Done. Ánh xạ vào workflow Jira thật trước khi ghi; không yêu cầu tự tạo đúng bảy status. `Blocked` là trở ngại có lý do và người gỡ chặn, `Canceled` không phải Done.

Task đủ điều kiện nhận khi AC/scope/contracts/cách kiểm chứng rõ; hard prerequisites đáp ứng; không có câu hỏi hoặc blocker ngoài chưa giải quyết; chưa có owner; nằm trong phạm vi thực thi được đội chọn và capacity/WIP cho phép. Không coi cache Ready là bằng chứng hiện tại.

Definition of Done là quy định chất lượng của đội: AC đạt, kiểm chứng đúng revision tích hợp, review bắt buộc đạt, tài liệu/contracts cần thiết cập nhật, Increment dùng được. Không mặc định mỗi dự án có cùng bộ tests hoặc bắt chạy test không liên quan.

PR merge không tự là Done; tất cả subtasks Done không tự chứng minh AC tích hợp của parent. `Done` khác `Released`. Agent báo hoàn thành không phải evidence.

## 6. Jira: mặc định không có kết nối

Trước thao tác Jira thật, kiểm tra công cụ đang có, instance/project/board, loại Cloud/Data Center, fields/hierarchy/transitions/link types, danh tính và quyền thao tác. Chỉ xin thông tin không thể đọc từ nguồn được cấp quyền. Credentials phải đi qua cơ chế secret/auth của công cụ; không yêu cầu dán token vào chat, docs hay skills.

Chỉ đọc khi được quyền đọc. Trước ghi, xác nhận phạm vi ủy quyền và trình thay đổi khi cần: tạo issue không bao gồm start sprint; xem ma trận không bao gồm sửa assignee. Không thay scheme/status/field hoặc cài add-on khi chưa duyệt.

Claim đồng thời đòi cơ chế có bảo đảm được chứng minh. Read-then-write, ghi assignee rồi đọc lại và automation bất đồng bộ không đủ. Nếu chưa có cơ chế an toàn, dừng claim và nói rõ; không âm thầm chuyển sang cách thủ công hay khóa file local để giả làm khóa dùng chung.

Timeout sau ghi: kết quả chưa rõ, đối chiếu trước thử lại. Thiếu quyền, dữ liệu phân trang chưa đầy đủ, rate limit hoặc snapshot cũ: đánh dấu `partial/unknown/stale`; không coi thiếu dữ liệu là không có blocker. Không claim/Done bằng snapshot cũ; không ghi đè Jira từ checkpoint.

## 7. Tự quản và cộng tác

PO chịu trách nhiệm Product Goal và thứ tự backlog; Developers chọn lượng việc, sizing và cách thực hiện; Scrum Master hỗ trợ Scrum và hiệu quả đội. AI hỗ trợ, không tự nhận accountabilities của con người. Tái dùng phân vai của đội; không tự gán từ chức danh mơ hồ.

Người/agent tự nhận task Ready trong scope đã chọn. AI thực thi cần con người chịu trách nhiệm, định danh phiên và reviewer phù hợp. Không đoán kỹ năng từ tên người, không giao việc cho thành viên khác chỉ vì họ đang rảnh.

Task bàn giao phải đủ context để một thành viên khác thực hiện mà không cần lịch sử chat; chỉ tải source liên quan. Phân công song song phải xét dependencies, hợp đồng, tài nguyên ghi chung, năng lực và review bandwidth. Nhánh/worktree tách biệt không làm mất xung đột ngữ nghĩa.

## 8. Kết thúc hoặc đổi phiên

Ghi checkpoint khi được phép lưu: scope/mode, artifact references/revisions, issue keys nếu có, bước vừa thực hiện và bằng chứng, câu hỏi mở, next action, thời điểm đọc Jira và giới hạn dữ liệu. Không ghi secrets, toàn bộ chat hoặc bản sao trạng thái có thẩm quyền.

Khi tiếp tục, xác minh nguồn hiện tại trước hành động, đánh dấu thay đổi/approval lỗi thời; không tự hỏi lại toàn bộ discovery. Khi chỉ dẫn mâu thuẫn hoặc công cụ thiếu, nêu chính xác phần bị chặn và tiếp tục phần độc lập.
