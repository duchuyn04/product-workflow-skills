---
name: delivery-inspection
description: "Đối chiếu Product Backlog Markdown và ma trận tiến độ local/Jira; kiểm chứng AC, Story Points hoàn tất, checkbox Done và điều kiện release theo bằng chứng."
hide: true
---

# Theo dõi, nghiệm thu và cải tiến

Đọc `skill://product-workflow/references/contract.md` trước; nếu URI chưa khám phá, đọc `.agents/skills/product-workflow/references/contract.md`.

## 1. Xác định câu hỏi và độ phủ nguồn

Người dùng muốn xem tiến độ, tick task/tính năng, đánh giá release hay xử lý thay đổi? Đọc `product-backlog.md` theo đường dẫn trong chỉ mục (mặc định `docs/workflow/product-backlog.md`), xác định scope/release, nguồn trạng thái local/Jira và thời điểm dữ liệu. Đọc module catalogue, AC, approvals/revisions, task cards và evidence liên quan.

Ở chế độ local, dùng hồ sơ Markdown và evidence mới nhất để tổng hợp, không yêu cầu Jira. Ở chế độ Jira, thiếu kết nối/quyền thì ghi `chưa xác minh`, không tự chuyển sang local hoặc báo board live. Không dừng phân tích độc lập chỉ vì thiếu một nguồn.

Phân biệt: không có công việc, không đọc được công việc, dữ liệu chưa lấy đủ trang và snapshot cũ. Thiếu quyền không được biến thành “không có blocker”. Không tuyên bố toàn dự án xanh nếu coverage chưa đủ.

## 2. Board công việc hằng ngày

Đọc board/workflow/mapping thật nếu có. Đề xuất góc nhìn: sprint hiện tại, có thể nhận, của tôi, blocked, chờ review và theo module. Hiển thị key, mục tiêu, owner, trạng thái, blocker và evidence cần; không chỉ màu.

Xem board là thao tác đọc. Tạo filter/view mới, sửa issue hoặc assignee cần quyền riêng; không tự chỉnh workflow Jira. Task đang hiển thị Ready vẫn cần đọc fresh và kiểm tra trước claim trong `task-execution`.

### Product Backlog và điểm theo tính năng

Đọc mục `Product Backlog dạng ma trận` trong `skill://product-workflow/references/records.md` để dùng cùng công thức với planning/execution. Đối chiếu từng hàng với scope, stories/AC, task cards, evidence và review; báo riêng `Tính năng Done`, `SP hoàn tất`, `AC đạt`, kèm số tính năng thiếu ước lượng hoặc chưa chốt AC.

Không tính AC đạt theo số tasks đã xong hoặc số tests pass; không tích tính năng chỉ vì tất cả tasks Done. `N/N` AC nhưng chưa đủ review/kiểm chứng tích hợp vẫn `[ ]`, chưa cộng SP hoàn tất. Canceled, unknown, evidence mất hiệu lực và scope rỗng xử lý theo mẫu shared, không làm đẹp số liệu.

Yêu cầu xem tiến độ chỉ cho phép đọc và báo bất nhất. Khi người dùng yêu cầu cập nhật/tích hoàn thành, hoặc đây là bước nghiệm thu trong scope thực thi đã ủy quyền, agent điều phối ghi các hàng có đủ nguồn, tổng điểm và thời điểm đối chiếu; giữ rõ giới hạn của phần chưa xác minh. Không tự publish Jira.

## 3. Xác định nghĩa vụ của từng ô ma trận

Hàng lấy từ module catalogue của scope đã duyệt, kể cả module chưa có task. Cột: Nghiệp vụ; Stories/UX; Hợp đồng/kiến trúc; Triển khai; Kiểm chứng; Phát hành.

Với mỗi module/giai đoạn, liệt kê các nghĩa vụ đầu ra có nguồn và links: rule/flow cần duyệt, contract revision, issue AC, evidence hoặc release requirement. Tái dùng mẫu `skill://product-workflow/references/records.md` nếu cần ghi rõ nghĩa vụ.

Không tạo sáu issue giả cho mọi story chỉ để lấp bảng. Một artifact dùng chung có thể chứng minh nghĩa vụ của nhiều modules nhưng không đếm nhân đôi thành số lượng công việc hoàn thành.

## 4. Tính trạng thái từ dữ kiện

Thứ tự đánh giá ô:
1. Không có phạm vi/nghĩa vụ xác định → `Chưa xác định`; không coi 0/0 là Đạt.
2. Toàn bộ nghĩa vụ được xác nhận không áp dụng, có lý do → `N/A`; nghĩa vụ bỏ scope phải có quyết định, không âm thầm đổi mẫu số.
3. Thiếu nguồn, quyền hoặc freshness → gắn lớp `unknown/partial/stale`, không kết luận Đạt từ phần nhìn thấy.
4. Revision đầu vào thay đổi ảnh hưởng approval/evidence → `Cần duyệt lại` cho phần ảnh hưởng, giữ links lịch sử.
5. Có nghĩa vụ chưa đạt bị hard blocker → `Bị chặn`; vẫn hiển thị số phần đạt/đang làm nếu xác định được.
6. Mọi nghĩa vụ áp dụng đạt với evidence/approval đúng revision → `Đạt`.
7. Có công việc/bằng chứng tiến triển nhưng chưa đủ → `Đang làm`; nếu chưa bắt đầu nghĩa vụ nào → `Chưa bắt đầu`.

Cảnh báo dữ liệu là chiều riêng, không che mất trạng thái biết được. Nếu vừa blocked vừa cần duyệt lại, hiển thị lý do cả hai trong drill-down, không xóa blocker vì chỉ có một nhãn chính.

Canceled không đóng góp vào Done. Tập task rỗng không phải hoàn thành. Epic/module chỉ được kết luận đạt scope khi nghĩa vụ tích hợp đạt, không lấy phép đếm subtasks thay cho AC.

Mẫu trả kết quả:

```text
Scope/release: [nguồn đã xác minh]
Dữ liệu: [thời điểm đọc, phạm vi được quyền xem, giới hạn]
```

| Module | Nghiệp vụ | Stories/UX | Hợp đồng | Triển khai | Kiểm chứng | Phát hành | Blocker/nguồn |
|---|---|---|---|---|---|---|---|

Mỗi ô có trạng thái và links hoặc danh sách drill-down ngay dưới bảng: nghĩa vụ, phần thiếu, issue/artifact, revision và owner gỡ chặn đã biết. Không tự gán owner. Trình bày bằng chữ cùng ký hiệu nếu dùng màu; bảo đảm vẫn đọc được khi không có màu.

Không lấy phần trăm số tasks làm “% sản phẩm hoàn thành” hoặc dự báo ngày xong nếu không có cơ sở. Luôn ghi phạm vi; module đạt scope hiện tại không có nghĩa xong vĩnh viễn.

## 5. Yêu cầu tick Done

Kiểm tra DoD/AC, review và bằng chứng đúng revision tích hợp. Code xong, một test pass hoặc PR merge riêng lẻ chưa đủ nếu còn nghĩa vụ khác.

Ở chế độ local, nếu đủ DoD và được ủy quyền cập nhật, ghi `[x]` vào hàng tính năng, liên kết evidence và tính lại tổng theo mẫu shared; thiếu điều kiện thì giữ `[ ]` và ghi phần còn thiếu. Task card và roadmap phải phản ánh đúng kết quả, không có checkbox tự cấp quyền nghiệm thu. Ở chế độ Jira, chuyển qua `task-execution` để dùng transition thật; chỉ phản ánh Done sau khi có xác nhận và đủ evidence. Thiếu quyền/kết nối thì ghi Jira chưa đổi.

Nếu Jira đã Done nhưng chưa chứng minh DoD: hiển thị “Jira: Done; kiểm chứng: chưa đủ” cùng phần thiếu. Không tự certify, reopen hay sửa lịch sử bên ngoài quyền được cấp.

### Kiểm chứng Giao diện Web trên Browser Native trước khi Tick Done
Đối với các tính năng hoặc stories có thành phần giao diện Web (Frontend / UI / Sơ đồ tương tác):
- **CẤM TICK DONE KHI CHƯA XÁC THỰC GIAO DIỆN HOẶC CHƯA HỎI Ý KIẾN NGƯỜI DÙNG:** AI chủ động đề xuất và dùng công cụ `ask` để hỏi người dùng có muốn mở Engine Browser Native để test web thực tế hay không:
  ```text
  ask(questions=[{
    "id": "browser_inspect_option",
    "question": "Tính năng web đã hoàn thành code. Bạn có muốn kích hoạt Engine Browser Native để mở giao diện kiểm thử trực quan trước khi nghiệm thu Tick Done không?",
    "options": [
      {"label": "Mở Browser Native để kiểm thử", "description": "Tự động khởi chạy Chromium, render trang web và đối chiếu Acceptance Criteria trực quan."},
      {"label": "Bỏ qua kiểm thử browser", "description": "Nghiệm thu dựa trên kết quả unit tests và code review hiện có."},
      {"label": "Chạy kiểm thử ngầm (Headless Screenshot)", "description": "Chụp ảnh màn hình giao diện ngầm để đính kèm vào bằng chứng nghiệm thu."}
    ],
    "recommended": 0
  }])
  ```
- Nếu người dùng chọn mở Browser: AI mở trình duyệt native qua `browser.open`, kiểm tra các trạng thái màn hình (Loading, Empty, Success, Error) đối chiếu với AC, chụp screenshot đính kèm vào evidence trước khi tick `[x]`.

## 6. Release readiness và vận hành

Done và Released tách biệt. Đánh giá theo scope:
- Revision/artifact tích hợp và AC/DoD đã đạt.
- Cấu hình/secrets qua cơ chế an toàn; không in secrets vào báo cáo.
- Migration, rollback/recovery và backup nếu thay đổi có yêu cầu đó.
- Quyền triển khai, người vận hành, smoke checks và điều kiện dừng/rollback.
- Metrics/logs cần theo dõi theo NFR và trách nhiệm xử lý sự cố.

Chỉ đánh giá không có nghĩa được deploy. Hỏi quyền rõ trước thao tác production hoặc ghi dữ liệu thật. Sau release, dùng evidence deployment/smoke đúng revision rồi mới ghi trạng thái phát hành; phản hồi/lỗi quay về backlog để ưu tiên.

## 7. Sprint Review, Retrospective và thay đổi

Sprint Review: tổng hợp Increment đạt DoD, tiến độ tới Product/Sprint Goal và phản hồi stakeholders. Phần chưa Done phải hiện là chưa hoàn thành, không trình như Increment đạt chuẩn. Review không phải cổng bắt buộc để release.

Retrospective: phân biệt quan sát có bằng chứng với suy đoán; chọn cải tiến có owner, hành động và tiêu chí quan sát để đội duyệt. Không tự chấm năng suất cá nhân qua số commits/tasks.

Yêu cầu/rule/contract thay đổi: trace tới stories → flows → contracts/modules → tasks → evidence/approvals. Nêu delta, phạm vi bị ảnh hưởng, việc có thể tiếp tục và quyết định cần người phụ trách. Chỉ đánh dấu cần duyệt lại các phần thật sự bị ảnh hưởng, không reset toàn dự án.

Kết thúc: ma trận/đánh giá có nguồn, giới hạn xác minh, blocker có hành động tiếp theo; lưu checkpoint khi được phép. Không đổi trạng thái Jira chỉ để báo cáo trông đẹp hơn.
