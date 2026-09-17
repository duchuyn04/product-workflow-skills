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

Nếu thiếu Jira hoặc cơ chế claim: nói rõ chưa nhận được task; dừng phần nhận/thực thi task được quản lý chung. Có thể hoàn thiện handoff hoặc phân tích không thay đổi chung. Chỉ chuyển sang điều phối thủ công nếu người dùng đồng ý giới hạn, không coi là đã đáp ứng claim đồng thời.

Timeout sau claim là kết quả chưa rõ; đối chiếu theo cơ chế có sẵn trước retry/bắt đầu. Không báo thành công chỉ vì không thấy lỗi.

## 3. Gói bàn giao

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

## 4. Thực thi đúng scope

1. Đọc code/quy ước/tests liên quan, trạng thái làm việc hiện tại và instructions repo; giữ nguyên thay đổi người dùng.
2. Nêu nguyên nhân/cơ chế, giải pháp và đánh đổi trước sửa khi quy định dự án yêu cầu.
3. Nếu nhiều phần độc lập đáng giao song song, xác định ownership/contracts trước; không để hai agent cùng sửa vùng dùng chung không phối hợp.
4. Thực hiện thay đổi nhỏ, đúng AC; không thêm telemetry/retry/config/refactor ngoài yêu cầu.
5. Lỗi tái hiện được thì giữ bằng chứng lỗi và kiểm chứng sau sửa; không chạy lại để phủ nhận lỗi người dùng đã báo. Feature mới cần exercise đường chạy thật và biên rủi ro.
6. Contract/rule đầu vào sai hoặc phải thay đổi: dừng phần chịu ảnh hưởng, báo delta và xin quyết định; không âm thầm mở rộng scope.

Không ép TDD máy móc cho tài liệu hoặc UI walkthrough. Dùng kiểm thử phù hợp, giữ regression test khi có lỗi/biên đáng bảo vệ. Không mock thành công để né tích hợp thật trong nghiệm thu.

## 5. Review và kiểm chứng

- Thu evidence đúng revision/môi trường: lệnh hoặc thao tác, kết quả thật và artifact/link.
- Review sự phù hợp spec trước, chất lượng/bảo mật/khả năng vận hành theo scope tiếp theo.
- Finding có ảnh hưởng phải sửa và chạy lại đường liên quan; không chỉ đổi status review.
- Kiểm chứng ở nhánh riêng không thay checks cần thiết trên revision tích hợp.
- Công cụ không chạy được: ghi `not-run` và nguyên nhân, không biến thành pass.

Mẫu evidence: AC/nghĩa vụ → revision → môi trường → cách kiểm tra → kết quả → link/output → reviewer khi bắt buộc. Dùng mẫu shared khi cần lưu.

## 6. Hoàn thành và cập nhật trạng thái

Đối chiếu DoD của đội. Chỉ đề nghị/ghi Done khi AC, review bắt buộc và kiểm chứng tích hợp đều đáp ứng. Người dùng nói “xong rồi” là yêu cầu kiểm tra/cập nhật, không tự là bằng chứng.

Có quyền ghi Jira: dùng transition thật, ghi evidence references theo quy ước, xác nhận kết quả. Không có quyền/kết nối: bàn giao đánh giá và nói Jira chưa cập nhật. PR merge không tự là story Done; children Done không tự đóng parent; Done không đồng nghĩa đã Released.

Nếu Jira đã Done nhưng evidence thiếu, báo bất nhất để người có quyền xử lý; không tự chứng nhận hoặc tự sửa lịch sử. Chuyển `delivery-inspection` khi cần nhìn ảnh hưởng lên module/sprint/release.

## 7. Gián đoạn, trả việc và tiếp tục

Lưu checkpoint/handoff khi được phép: output/revision, tiến độ kiểm chứng, nhánh làm việc, blockers và next action. Không tự giải phóng hay cướp owner vì một phiên im lặng.

Phiên tiếp theo đọc nguồn fresh và xác minh quyền tiếp tục. Trả task/chuyển owner cần thẩm quyền và bàn giao phần đã làm; không xóa công việc dở của người khác. Nếu dependency bị reopen hoặc contract đổi, đánh giá lại phần đang làm trước khi tiếp tục.
