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
| Backlog, owner, sprint, dependencies, trạng thái công việc | Local: backlog chính và hồ sơ task (checklist hoặc card); Jira: Jira đã được chọn làm nguồn chính |
| Nghiệp vụ, glossary, stories/flows, ADR và contracts | Hồ sơ có phiên bản trong repo theo quy ước đã chọn |
| Quyết định duyệt | Bản ghi người duyệt, phạm vi, revision và tham chiếu nguồn xác nhận; liên kết Jira khi được phép |
| Kết quả kiểm chứng | Output thật của công cụ/CI/review/deployment, kèm revision và môi trường |
| Checkpoint | Con trỏ tới các nguồn trên và câu hỏi còn mở, không phải backlog thứ hai |
| Ma trận | Agent cập nhật từ scope, AC, approvals và evidence; ở chế độ Jira, trạng thái issue lấy từ Jira |

Khi bắt đầu workflow có lưu tài liệu, dùng `docs/workflow/product-backlog.md` làm Product Backlog local nếu dự án chưa có nguồn chính khác. Nếu đã có backlog tương đương, cập nhật tại chỗ và ghi đường dẫn trong chỉ mục, không tạo bản cạnh tranh. Mẫu ma trận và cách tính điểm nằm trong mục `Product Backlog dạng ma trận` của `skill://product-workflow/references/records.md`. Chỉ đọc skill hoặc hỏi hiện trạng không cấp quyền tạo/cập nhật backlog.

Backlog ghi rõ nguồn trạng thái `local` hoặc `Jira`, scope/release và thời điểm đối chiếu. Local dùng ID ổn định và trạng thái nội bộ, không giả Jira key hay claim nguyên tử. Mỗi task có một hồ sơ chính: checklist có ID/anchor trong roadmap cho việc nhỏ tuần tự, hoặc card riêng cho việc lớn/bàn giao độc lập. Roadmap giữ Goal, scope, dependencies và links; không sao chép bảng backlog hay trạng thái của task đã có card. Chi tiết chọn hồ sơ nằm trong `Hồ sơ task gọn và task card` của records.md.

Nếu dự án đã dùng Jira, mất kết nối không được tự chuyển về local: giữ snapshot, ghi `chưa xác minh`, không ghi đè trạng thái Jira. Chuyển từ local sang Jira cần người dùng duyệt mapping và đối chiếu ID/key thật sau publish; từ đó Markdown là bản tổng hợp có thời điểm, không phải nguồn trạng thái thứ hai.

Trong scope thực thi đã được ủy quyền, agent điều phối cập nhật backlog sau mỗi kết quả task, review và kiểm chứng tích hợp. Workers chỉ cập nhật task card/evidence được giao; không cùng ghi ma trận chung. Điều phối một người ghi giảm xung đột, không thay cơ chế claim an toàn cho nhiều phiên hoặc nhiều thành viên.

Mặc định đề xuất `docs/workflow/project.md` làm chỉ mục và `docs/workflow/checkpoint.md` làm điểm tiếp tục nếu repo chưa có quy ước. Chỉ tạo khi người dùng yêu cầu bắt đầu/lưu workflow và chốt nơi lưu; ưu tiên tài liệu có sẵn, không sao chép thành nguồn thứ hai. Phiên chỉ trao đổi không tự sinh cả cây tài liệu.

Mỗi artifact có ID ổn định, scope, revision thực (commit khi đã commit, hoặc hash nội dung), nguồn, trạng thái duyệt. Duyệt trong chat phải ghi đúng người, nội dung/phạm vi và bằng chứng tham chiếu; không tự gán người dùng làm PO hay tech lead. Chưa có tham chiếu bền vững thì ghi rõ giới hạn, không bịa message ID. Nội dung đổi sau duyệt phải đánh giá lại phạm vi approval, không giữ `approved` bằng thói quen.

### Hồ sơ vừa đủ

- Feature: cập nhật brief/stories/design/plan hiện hữu theo phân hệ và phần scope bị ảnh hưởng. Chỉ tạo file khi chưa có nơi phù hợp hoặc cần bàn giao độc lập; ghi approval theo scope/revision, không tạo bộ file mới cho mỗi chỉnh sửa nhỏ.
- Bounded/Spike: đề xuất và duyệt theo nhánh trong chat; cập nhật record/evidence hiện hữu nếu có. Không ép tạo cây tài liệu G1–G4.
- Một bảng backlog chính. Mẫu chi tiết nằm trong `records.md`; skills dẫn tới mẫu thay vì chép lại. Evidence/review/handoff lưu trong hồ sơ liên quan hoặc liên kết output, không sinh báo cáo riêng cho mỗi bước.
- Sơ đồ chỉ cần khi bảng/chữ chưa diễn đạt rõ quan hệ/luồng phức tạp hoặc người dùng yêu cầu. Tái dùng sơ đồ còn đúng; không đổi DB thì không tạo ER/schema mới. Mọi sơ đồ thực sự tạo/sửa vẫn dùng `diagram-design`, không Mermaid, và phải qua Browser Native quality gate.

## 4. Câu hỏi và gates

Đọc nguồn trước khi hỏi; chỉ hỏi quyết định nghiệp vụ còn thiếu, gom theo chủ đề khi có nhiều câu. Với hệ thống lớn, phân rã phân hệ và hỏi cuốn chiếu theo rủi ro. Dừng khi mục tiêu, scope, actors/rules đủ rõ và không còn câu hỏi chặn phần sắp làm; không dùng quota câu hỏi hay thêm vòng hỏi tiếp tục sau mỗi đợt. Đủ dữ kiện vẫn phải xin duyệt G1.

| Gate | Điều kiện | Người quyết định |
|---|---|---|
| G1 Nghiệp vụ | Mục tiêu và phạm vi rõ ràng, quy tắc của phần tính năng sắp làm không còn câu hỏi chặn | Người phụ trách nghiệp vụ được chỉ định |
| G2 Stories/UX | AC và flow thống nhất, quyền/lỗi quan trọng được xét | Người phụ trách sản phẩm/UX được chỉ định |
| G3 Giải pháp | Ràng buộc đáp ứng, contracts cần cho triển khai đủ rõ | Người phụ trách kỹ thuật được chỉ định |
| G4 Thực thi | Scope công việc đã duyệt, prerequisites và quyền thực thi đáp ứng | Người/đội có trách nhiệm theo quy định dự án |

Chưa chỉ định người quyết định thì hỏi, không tự tạo approval. “OK” chỉ xác nhận đề xuất cụ thể ngay trước đó, không cấp quyền publish, claim, deploy hay duyệt mọi tài liệu tương lai.
### Vi phạm nghiêm trọng: Đốt cháy giai đoạn (Gate-skipping)
Các hành vi sau bị coi là vi phạm nghiêm trọng quy trình:
1. Với Feature (kể cả repo có source), viết code khi chưa duyệt G1–G4; với Bounded/Spike, thực thi khi chưa duyệt phương án sửa/thử nghiệm. Đọc skill hoặc nhận yêu cầu ban đầu không thay cho duyệt.
2. Tự suy đoán quyết định nghiệp vụ còn thiếu thay vì dùng `ask`; nguồn đã xác nhận đủ thì tái dùng, không bắt phỏng vấn lại.
3. Tự chọn/thay stack khi có quyết định công nghệ mới đáng kể mà chưa trình phương án và xin duyệt; stack hiện hữu đã chốt thì kế thừa, không hỏi chọn lại.
4. Chỉ in tài liệu thiết kế của cổng ra chat mà không lưu phần cập nhật vào hồ sơ vật lý trong `docs/workflow/`.
5. Gộp nhiều cổng trong một lượt trả lời rồi tự ý suy diễn là đã được duyệt.

Mỗi cổng là một điểm dừng bắt buộc. AI phải lưu file tài liệu vào `docs/workflow/`, trình bày tóm tắt và dùng công cụ `ask` để người dùng duyệt trước khi chuyển sang cổng kế tiếp.

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
