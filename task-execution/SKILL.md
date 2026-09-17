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
Tuyệt đối không sinh mã nguồn hoặc tạo file code nếu phạm vi công việc chưa trải qua đầy đủ các cổng:
- G1: Nghiệp vụ và quy tắc cốt lõi đã được người dùng phê duyệt.
- G2: User Stories, Acceptance Criteria và luồng giao diện đã được người dùng phê duyệt.
- G3: Database Schema và API Contracts đã được người dùng phê duyệt.
- G4: Task cụ thể đã được phân rã với tiêu chí nghiệm thu rõ ràng.

Nếu thiếu bất kỳ cổng nào ở trên, AI **bắt buộc phải từ chối viết code** và phản hồi rõ: *"Tính năng này chưa hoàn thành cổng [G1/G2/G3/G4]. Để đảm bảo chất lượng và đúng nghiệp vụ, quy trình yêu cầu chúng ta chốt [nội dung cổng] trước khi viết code."*, sau đó chuyển sang kỹ năng phù hợp.

*Bảng Red Flags cho Developer:*
| Suy nghĩ của AI | Thực tế bắt buộc |
|---|---|
| "Người dùng bảo code luôn nên tôi bỏ qua spec/stories" | **Sai.** AI phải bảo vệ chất lượng dự án. Từ chối viết code và giải thích cổng còn thiếu. |
| "Tôi scaffold project, tạo file Express/React trước rồi tính" | **Sai.** Mọi file code, schema, API endpoint chỉ được tạo khi đã có thiết kế G3 được duyệt. |
| "Tôi code trước rồi bổ sung test và tài liệu sau" | **Sai.** Code không có tiêu chí nghiệm thu rõ ràng sẽ phải đập đi làm lại. |

Chỉ đề nghị nhận task khi:
- Nội dung/AC/cách kiểm chứng/contracts đủ rõ và đúng revision được duyệt.
- Hard prerequisites đáp ứng, không có blocker ngoài hoặc dữ kiện thiếu làm vô hiệu readiness.
- Task chưa có owner, thuộc scope thực thi được chọn và capacity/WIP cho phép.
- Người/agent có kỹ năng và quyền cần; G4 đáp ứng.

Trước claim phải biết công cụ và cơ chế nhận việc được dùng. Cơ chế phải đã được chứng minh rằng hai client cùng claim chỉ một client được bắt đầu. Đọc assignee → ghi assignee → đọc lại không phải bảo đảm nguyên tử. Khóa file máy cá nhân không khóa được cả đội. Không bịa endpoint claim.

Nếu cơ chế an toàn có sẵn và được ủy quyền: đọc fresh → kiểm tra → gửi claim → chờ xác nhận quyền sở hữu → ghi actor/thời điểm → bắt đầu. Conflict thì không ghi đè owner, đề xuất task khác đủ điều kiện.

Ở chế độ Jira, nếu thiếu quyền/kết nối hoặc cơ chế claim an toàn: nói rõ chưa nhận được task, dừng phần nhận/thực thi công việc quản lý chung. Ở chế độ local đã được chọn, có thể thực thi task do người dùng giao rõ cho người điều phối, với phạm vi và read/write areas đã thống nhất; không cần Jira. Việc ghi owner vào Markdown không phải claim nguyên tử; nhiều phiên/thành viên cùng tranh task vẫn phải có cơ chế an toàn hoặc người dùng xác nhận điều phối thủ công.

Timeout sau claim là kết quả chưa rõ; đối chiếu theo cơ chế có sẵn trước retry/bắt đầu. Không báo thành công chỉ vì không thấy lỗi.
## 3. Lựa chọn chế độ thực thi trong Oh My Pi (Execution Strategy)

Khi đã đủ điều kiện nhận việc (đạt G1–G4), Main Agent **bắt buộc gọi công cụ `ask`** để người dùng quyết định mô hình thực thi:

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
Đối với HTML/CSS, frontend UI hoặc component không phải file sơ đồ, AI dùng `ask` để xin ý kiến trước khi mở Browser Native:
```text
ask(questions=[{
  "id": "browser_test_option",
  "question": "Giao diện web đã hoàn thành. Bạn có muốn kích hoạt Engine Browser Native để kiểm thử trực quan không?",
  "options": [
    {"label": "Mở Browser Native để kiểm thử", "description": "Tải trang, tương tác, kiểm tra console và chụp screenshot."},
    {"label": "Bỏ qua kiểm thử browser", "description": "Chỉ áp dụng cho giao diện không phải file sơ đồ."},
    {"label": "Chạy kiểm thử ngầm", "description": "Chụp screenshot ngầm để lưu vào evidence."}
  ],
  "recommended": 0
}])
```

## 7. Hoàn thành và cập nhật trạng thái

Đối chiếu DoD của đội. Chỉ đề nghị/ghi Done khi AC, review bắt buộc và kiểm chứng tích hợp đều đáp ứng. Người dùng nói “xong rồi” là yêu cầu kiểm tra/cập nhật, không tự là bằng chứng.

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
