---
name: task-execution
description: "Nhận và bàn giao task cho người/AI có kiểm soát, thực thi đúng scope, review và kiểm chứng bằng bằng chứng trước khi hoàn thành."
hide: true
---

# Nhận việc và thực thi

Đọc `skill://product-workflow/references/contract.md` trước; nếu URI chưa khám phá, đọc `.agents/skills/product-workflow/references/contract.md`.

## 1. Kiểm tra yêu cầu và nguồn mới nhất

Xác định task/scope/mode; đọc AC, inputs/contracts/revisions, prerequisite, owner hiện tại và quality policy. Dữ liệu Jira phải mới và đủ quyền; không lấy cache/nháp làm bằng chứng Ready.

Người dùng hỏi “có thể làm gì” chỉ cho phép đề xuất, không tự claim. Người dùng yêu cầu implement một thay đổi độc lập không thuộc backlog Jira vẫn có thể ủy quyền trực tiếp, nhưng phải nói rõ phạm vi này không phải task đã claim trên Jira; không dùng cách đó để vượt cơ chế claim cho issue đang quản lý chung.

Xác định người chịu trách nhiệm, người/agent thực thi và reviewer theo chính sách thật. Không tự tạo danh tính bot hoặc gán reviewer từ tên người ngẫu nhiên.

## 2. Nhận task

### Điều kiện tiên quyết: Kiểm tra cổng (Gate Check)
Kiểm tra nhánh và bằng chứng người dùng duyệt đúng phạm vi trước mọi thao tác ghi source, tests, cấu hình, dependencies hoặc migrations (bao gồm shell và subagents):

| Nhánh | Điều kiện được thực thi |
|---|---|
| Spike | Đã duyệt câu hỏi, cách thử và phạm vi throwaway; không sửa sản phẩm ngoài phạm vi thử nghiệm. |
| Bounded | Phần chat trước `ask` đã trình bày phạm vi, nguyên nhân có bằng chứng, thay đổi dự kiến theo file/symbol, ngoài phạm vi/rủi ro và cách kiểm thử; sau đó đã gọi `ask` và nhận duyệt. Kế hoạch chỉ xuất hiện trong câu hỏi hoặc `options[].description` không phải bằng chứng trình bày. Không yêu cầu G1–G4. |
| Feature, kể cả repo có sẵn | Đã duyệt tuần tự G1 nghiệp vụ, G2 stories/UX, G3 kiến trúc/contracts, G4 tasks cho tính năng đó. |

Đã đọc skill, tìm được file cần sửa hoặc yêu cầu ban đầu chưa phải bằng chứng duyệt. Thiếu duyệt: chỉ đọc/phân tích và soạn tài liệu theo cổng; nêu phần thiếu, hỏi và dừng trước edit. Không có `ask` thì hỏi bằng chat. Đã duyệt đúng scope thì không hỏi lại; scope đổi cần duyệt phần thay đổi.

Chỉ đề nghị nhận task khi:
- Nội dung/AC/cách kiểm chứng/contracts đủ rõ và đúng revision được duyệt.
- Hard prerequisites đáp ứng, không có blocker ngoài hoặc dữ kiện thiếu làm vô hiệu readiness.
- Task chưa có owner, thuộc scope thực thi được chọn và capacity/WIP cho phép.
- Người/agent có kỹ năng và quyền cần; điều kiện duyệt của nhánh ở trên đáp ứng.

Trước claim phải biết công cụ và cơ chế nhận việc được dùng. Cơ chế phải đã được chứng minh rằng hai client cùng claim chỉ một client được bắt đầu. Đọc assignee → ghi assignee → đọc lại không phải bảo đảm nguyên tử. Khóa file máy cá nhân không khóa được cả đội. Không bịa endpoint claim.

Nếu cơ chế an toàn có sẵn và được ủy quyền: đọc fresh → kiểm tra → gửi claim → chờ xác nhận quyền sở hữu → ghi actor/thời điểm → bắt đầu. Conflict thì không ghi đè owner, đề xuất task khác đủ điều kiện.

Ở chế độ Jira, nếu thiếu quyền/kết nối hoặc cơ chế claim an toàn: nói rõ chưa nhận được task, dừng phần nhận/thực thi công việc quản lý chung. Ở chế độ local đã được chọn, có thể thực thi task do người dùng giao rõ cho người điều phối, với phạm vi và read/write areas đã thống nhất; không cần Jira. Việc ghi owner vào Markdown không phải claim nguyên tử; nhiều phiên/thành viên cùng tranh task vẫn phải có cơ chế an toàn hoặc người dùng xác nhận điều phối thủ công.

Timeout sau claim là kết quả chưa rõ; đối chiếu theo cơ chế có sẵn trước retry/bắt đầu. Không báo thành công chỉ vì không thấy lỗi.
## 3. Lựa chọn chế độ thực thi trong Oh My Pi (Execution Strategy)

Feature đã đạt G1–G4: Main Agent gọi `ask` để chọn mô hình thực thi. Bounded/Spike đã được duyệt thực thi trực tiếp trong phạm vi chốt, không bắt thêm vòng chọn chế độ:

```text
ask(questions=[{
  "id": "execution_mode",
  "question": "Bạn muốn thực thi các task đã được duyệt theo hình thức nào?",
  "options": [
    {"label": "Spawn Subagents (Khuyên dùng trong OMP)", "description": "Tự động phân công Task Worker, Task Reviewer cho từng task và Reviewer tổng nghiệm thu cuối cùng."},
    {"label": "Thực thi trực tiếp (Inline)", "description": "Main Agent tự viết code và kiểm thử từng task một cách tuần tự."},
    {"label": "Từng task có xác nhận", "description": "Làm từng task và dừng lại xin ý kiến duyệt diff sau mỗi task."}
  ],
  "recommended": 0
}])
```

### Quy trình Chế độ Subagents 3 tầng:

#### Tầng 1: Task Worker (Subagent thực thi từng task)
- Main Agent dispatch subagent qua công cụ `task` của OMP cho từng task cụ thể.
- Truyền file task card `docs/workflow/plans/<phân-hệ>/tasks/task-XX-<slug>.md` cùng scope được giao. Worker đọc các nguồn stories/AC/contracts được liên kết đúng revision; không cần toàn bộ lịch sử chat.
- Worker thực thi đúng phạm vi, ghi evidence theo AC vào task card và bàn giao ở trạng thái Review. Không tự tích Done hoặc sửa `product-backlog.md`/`roadmap.md`. Khi chạy nhiều workers đồng thời, để agent điều phối chạy kiểm chứng sau khi tích hợp, tránh checks giữa các chỉnh sửa đang dở.

#### Tầng 2: Task Reviewer (Subagent thẩm định từng task)
- Ngay sau khi Task Worker nộp kết quả, Main Agent dispatch subagent reviewer (agent role `reviewer`).
- Reviewer đọc file task card `task-XX-<slug>.md` và kiểm tra diff của task:
  1. *Spec Compliance:* Code có thỏa mãn đúng AC của task card không? Có code thừa/tự ý mở rộng scope ngoài task không?
  2. *Code Quality:* Mã nguồn có sạch, đúng quy ước dự án, xử lý lỗi đầy đủ và không phá vỡ logic cũ không?
- Nếu Reviewer phát hiện lỗi: Trả feedback rõ ràng để Worker sửa lại ──► Reviewer kiểm tra lại.
- Reviewer trả kết luận và phần cần sửa. Agent điều phối chỉ đánh dấu task Done khi đủ DoD và kiểm chứng cần thiết, rồi cập nhật roadmap và hàng backlog theo mục 7. Review từng task không tự chứng minh tính năng đã Done.

#### Tầng 3: Reviewer Tổng (Nghiệm thu toàn diện sau khi hết tasks)
- Sau khi các workers bàn giao và review từng task đạt, thực hiện nghiệm thu tích hợp của tính năng. Không chờ tất cả ô tính năng được tích Done mới chạy kiểm chứng này.
- Nhiệm vụ của Reviewer Tổng:
  1. Quét toàn bộ `git diff` của toàn bộ tính năng/module từ đầu đến cuối.
  2. Đối chiếu bằng chứng kiểm thử tích hợp/regression do agent điều phối chạy trên revision tích hợp.
  3. Đối chiếu với Definition of Done (DoD) và tiêu chí nghiệm thu của Product Goal.
  4. Xuất báo cáo tổng kết chất lượng và đề xuất sẵn sàng phát hành (release readiness).

## 4. Gói bàn giao
Đưa cho người/agent đủ thông tin để làm mà không cần chat gốc:

| Nội dung | Bắt buộc làm rõ |
|---|---|
| Task và scope | Key/ID thật, mục tiêu, AC, ngoài phạm vi |
| Quyết định đầu vào | Tài liệu/contracts và revision, nguồn duyệt |
| Dependencies | Đầu ra đã có, phần còn chặn, owner gỡ chặn |
| Thực thi | Người chịu trách nhiệm, executor, reviewer theo chính sách |
| Ranh giới thay đổi | Module/read-write areas, vùng dùng chung cần phối hợp |
| Tích hợp | Nhánh/base hoặc quy ước repo, thứ tự tích hợp, người chịu trách nhiệm |
| Kiểm chứng | Cách chạy/quan sát AC, môi trường, checks bắt buộc |
| Bàn giao tiếp | Bằng chứng cần trả, rủi ro còn lại, trạng thái thực tế |

Không hardcode file paths đoán mò; khám phá repo để lấy paths thật khi vào implementation. Không gửi secrets/dữ liệu hạn chế quyền cho subagents hoặc reviewer không được phép.

## 5. Thực thi đúng scope

1. Đọc code/quy ước/tests liên quan, trạng thái làm việc hiện tại và instructions repo; giữ nguyên thay đổi người dùng.
2. Nêu nguyên nhân/cơ chế, giải pháp và đánh đổi trước sửa khi quy định dự án yêu cầu.
3. Nếu nhiều phần độc lập đáng giao song song, xác định ownership/contracts trước; không để hai agent cùng sửa vùng dùng chung không phối hợp.
4. Thực hiện thay đổi nhỏ, đúng AC; không thêm telemetry/retry/config/refactor ngoài yêu cầu.
5. Lỗi tái hiện được thì giữ bằng chứng lỗi và kiểm chứng sau sửa; không chạy lại để phủ nhận lỗi người dùng đã báo. Feature mới cần exercise đường chạy thật và biên rủi ro.
6. Contract/rule đầu vào sai hoặc phải thay đổi: dừng phần chịu ảnh hưởng, báo delta và xin quyết định; không âm thầm mở rộng scope.

Không ép TDD máy móc cho tài liệu hoặc UI walkthrough. Dùng kiểm thử phù hợp, giữ regression test khi có lỗi/biên đáng bảo vệ. Không mock thành công để né tích hợp thật trong nghiệm thu.

## 6. Review và kiểm chứng

- Thu evidence đúng revision/môi trường: lệnh hoặc thao tác, kết quả thật và artifact/link.
- Review sự phù hợp spec trước, chất lượng/bảo mật/khả năng vận hành theo scope tiếp theo.
- Finding có ảnh hưởng phải sửa và chạy lại đường liên quan; không chỉ đổi status review.
- Kiểm chứng ở nhánh riêng không thay checks cần thiết trên revision tích hợp.
- Công cụ không chạy được: ghi `not-run` và nguyên nhân, không biến thành pass.

Mẫu evidence: AC/nghĩa vụ → revision → môi trường → cách kiểm tra → kết quả → link/output → reviewer khi bắt buộc. Dùng mẫu shared khi cần lưu.

### Review hai trục bắt buộc trước Done

Feature và **Risky Bounded** phải đọc `skill://code-review`; nếu URI chưa khám phá, đọc `.agents/skills/code-review/SKILL.md`. Risky Bounded là thay đổi ảnh hưởng contract/interface, security/quyền, dữ liệu hoặc migration, hay nhiều module. Docs-only và Bounded cục bộ rủi ro thấp tiếp tục policy review hiện hữu.

Với Feature, ghi baseline revision khi nhận task sau G4. Với Bounded, trước first write ghi baseline revision và pre-existing dirty paths. Sau triển khai, giới hạn review vào owned changed areas. Tạo Review Input Packet C-SI-05 gồm `baseline_revision`, `owned_changed_areas`, task card, stories/AC, architecture contract, standards sources và required checks. Thiếu baseline hoặc spec bắt buộc là `blocked`, không phải pass.

Có subagents: chạy Standards và Spec song song với context tách biệt. Không có subagents: chạy hai pass tuần tự, vẫn giữ hai báo cáo riêng; không bỏ axis hoặc gộp/rerank findings. Finding ảnh hưởng phải được sửa và review lại, hoặc có accepted exception kèm nguồn. Chỉ chuyển sang Verification/Done khi cả hai verdict đạt và không còn finding chưa xử lý.

Code review không thay Browser Native: task có thay đổi UI/diagram vẫn phải hoàn thành checkpoint tương ứng bên dưới.

### Kiểm chứng Giao diện Web với Engine Browser Native

#### 1. File sơ đồ HTML/SVG: quality gate tự động
Đối với mọi task tạo hoặc sửa `docs/workflow/diagrams/*.html`:
- AI **bắt buộc tự động** dùng `browser.open({ url: "file://..." })` trước khi bàn giao. Không gọi `ask` để quyết định có chạy kiểm thử hay không.
- Chờ `document.fonts.ready` và hai animation frames, sau đó dùng `tab.run`/DOM thật để kiểm tra:
  - `getBBox()`/`getComputedTextLength()` của text, font đã tải, không tràn node và padding mỗi bên tối thiểu 16px.
  - Connector bám đúng mép node, không đi xuyên node trung gian, label cách stroke 6–10px.
  - Connector song song cách nhau tối thiểu 12px, không trùng hoặc che nhau.
- Chụp `tab.screenshot()` và lưu kết quả đo làm evidence. Chạy thêm `scripts/self_check.py` như kiểm tra tĩnh bổ sung.
- Nếu assertion thất bại, sửa nguồn và chạy lại. Nếu Browser Native không khởi chạy được, ghi `not-run` cùng nguyên nhân. `failed` hoặc `not-run` đều chặn bàn giao và trạng thái Done.
- Chỉ sau khi quality gate đạt, AI mới dùng `ask` nếu người dùng muốn preview trực quan.

#### 2. Giao diện Web khác
Ngay sau khi thực thi, xác định `ui_changed` cho task. Đặt `ui_changed = true` khi code làm thay đổi bất kỳ bề mặt web nào người dùng nhìn thấy hoặc tương tác: page/component, style, form, navigation, nội dung động, hoặc trạng thái loading/error/empty. Tên task là “chức năng”, “logic” hay “refactor” không loại trừ checkpoint nếu kết quả hiển thị hoặc tương tác đã đổi.

Với `ui_changed = true` và không phải diagram, checkpoint bắt buộc sau khi code/checks tự động hoàn tất nhưng trước khi báo hoàn thành:
- Nếu người dùng chưa chọn cách kiểm thử Browser Native cho đúng scope, phải gọi `ask` theo mẫu dưới và dừng chờ quyết định.
- Nếu người dùng đã chọn rõ trong cùng scope, thực hiện lựa chọn đó và không hỏi lặp lại.
- Chọn bỏ qua phải ghi Browser Native là `not-run` cùng lý do; không được tuyên bố giao diện đã kiểm chứng trực quan.
- Chưa có lựa chọn này thì chưa được báo hoàn thành.

```text
ask(questions=[{
  "id": "browser_test_option",
  "question": "Thay đổi giao diện web đã hoàn thành. Bạn muốn kiểm thử bằng OMP Browser Native theo cách nào?",
  "options": [
    {"label": "Mở Browser Native để kiểm thử", "description": "Tải trang, tương tác, kiểm tra console và chụp screenshot."},
    {"label": "Chạy kiểm thử ngầm", "description": "Tự động tải trang và lưu screenshot/evidence mà không cần preview tương tác."},
    {"label": "Bỏ qua kiểm thử browser", "description": "Ghi Browser Native là not-run; không xác nhận giao diện đã được kiểm chứng trực quan."}
  ],
  "recommended": 0
}])
```
## 7. Hoàn thành và cập nhật trạng thái

Đối chiếu DoD của đội. Chỉ đề nghị/ghi Done khi AC, review bắt buộc và kiểm chứng tích hợp đều đáp ứng. Với `ui_changed = true`, phải có quyết định Browser Native và hoàn tất lựa chọn tương ứng trước khi báo hoàn thành; nếu bỏ qua, ghi `not-run` và không claim kiểm chứng trực quan. Người dùng nói “xong rồi” là yêu cầu kiểm tra/cập nhật, không tự là bằng chứng.

Có quyền ghi Jira: dùng transition thật, ghi evidence references theo quy ước, xác nhận kết quả. Không có quyền/kết nối: bàn giao đánh giá và nói Jira chưa cập nhật. PR merge không tự là story Done; children Done không tự đóng parent; Done không đồng nghĩa đã Released.

Nếu Jira đã Done nhưng evidence thiếu, báo bất nhất để người có quyền xử lý; không tự chứng nhận hoặc tự sửa lịch sử. Chuyển `delivery-inspection` khi cần nhìn ảnh hưởng lên module/sprint/release.

### Cập nhật Product Backlog sau mỗi kết quả

Trong scope thực thi được ủy quyền, agent điều phối phải cập nhật `docs/workflow/product-backlog.md` (hoặc backlog hiện hữu), không chỉ báo xong trong chat:
1. Đọc hàng tính năng theo ID trong task card, stories/AC và evidence mới nhất; dùng quy tắc của `skill://product-workflow/references/records.md`.
2. Ghi kết quả task/review/kiểm chứng, kể cả failed/not-run. Tính lại AC đạt/tổng của tính năng, không cộng điểm theo số tasks hoặc lời báo của worker.
3. Khi đủ DoD và kiểm chứng tích hợp, tích `[x]` và cộng toàn bộ SP đã duyệt của tính năng. Còn thiếu review hoặc AC thì giữ `[ ]`, trạng thái tương ứng và 0 SP hoàn tất cho hàng đó.
4. Tính lại tổng quan, cập nhật nguồn/thời điểm và link evidence. Nếu lỗi mới hoặc thay đổi làm bằng chứng mất hiệu lực, bỏ tích phần ảnh hưởng, tính lại điểm và giữ lịch sử.
5. Chế độ Jira chỉ phản ánh transition được xác nhận; mất quyền/kết nối thì ghi chưa đồng bộ, không tự chuyển sang local. Không cần gọi Jira ở chế độ local.

Chỉ agent điều phối ghi ma trận chung; workers/reviewers gửi kết quả qua task cards và handoff. Nếu file bị người khác thay đổi, đọc bản mới và đối chiếu trước khi ghi. Cuối lượt báo đường dẫn backlog, ID tính năng vừa cập nhật, điểm và nghĩa vụ còn thiếu.

## 8. Gián đoạn, trả việc và tiếp tục

Lưu checkpoint/handoff khi được phép: output/revision, tiến độ kiểm chứng, nhánh làm việc, blockers và next action. Không tự giải phóng hay cướp owner vì một phiên im lặng.

Phiên tiếp theo đọc nguồn fresh và xác minh quyền tiếp tục. Trả task/chuyển owner cần thẩm quyền và bàn giao phần đã làm; không xóa công việc dở của người khác. Nếu dependency bị reopen hoặc contract đổi, đánh giá lại phần đang làm trước khi tiếp tục.
