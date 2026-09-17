---
name: delivery-inspection
description: "Tổng hợp board và ma trận tiến độ có nguồn, kiểm tra Done/release, đánh giá tác động thay đổi, hỗ trợ Sprint Review và Retrospective."
hide: true
---

# Theo dõi, nghiệm thu và cải tiến

Đọc `skill://product-workflow/references/contract.md` trước; nếu URI chưa khám phá, đọc `.agents/skills/product-workflow/references/contract.md`.

## 1. Xác định câu hỏi và độ phủ nguồn

Người dùng muốn xem tiến độ, tick task, đánh giá release hay xử lý thay đổi? Xác định scope/release và thời điểm dữ liệu. Đọc module catalogue, nghĩa vụ đầu ra, approvals/revisions, Jira và evidence liên quan theo quyền thực tế.

Nếu chưa kết nối Jira, không báo board live hoặc owner/status hiện tại. Có thể tổng hợp tiến độ tài liệu đã đọc và bản nháp được gắn nhãn; các phần phụ thuộc Jira ghi `chưa xác minh`. Không dừng mọi phân tích độc lập vì thiếu một nguồn.

Phân biệt: không có công việc, không đọc được công việc, dữ liệu chưa lấy đủ trang và snapshot cũ. Thiếu quyền không được biến thành “không có blocker”. Không tuyên bố toàn dự án xanh nếu coverage chưa đủ.

## 2. Board công việc hằng ngày

Đọc board/workflow/mapping thật nếu có. Đề xuất góc nhìn: sprint hiện tại, có thể nhận, của tôi, blocked, chờ review và theo module. Hiển thị key, mục tiêu, owner, trạng thái, blocker và evidence cần; không chỉ màu.

Xem board là thao tác đọc. Tạo filter/view mới, sửa issue hoặc assignee cần quyền riêng; không tự chỉnh workflow Jira. Task đang hiển thị Ready vẫn cần đọc fresh và kiểm tra trước claim trong `task-execution`.

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

Nếu đạt và có quyền/công cụ Jira, chuyển qua `task-execution` để cập nhật bằng transition thật và xác nhận kết quả. Nếu thiếu quyền/kết nối thì nói rõ Jira chưa đổi. Không giữ checkbox có quyền riêng trong ma trận.

Nếu Jira đã Done nhưng chưa chứng minh DoD: hiển thị “Jira: Done; kiểm chứng: chưa đủ” cùng phần thiếu. Không tự certify, reopen hay sửa lịch sử bên ngoài quyền được cấp.

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
