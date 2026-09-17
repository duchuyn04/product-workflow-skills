---
name: solution-design
description: "Chọn tech stack theo ràng buộc thật, thiết kế kiến trúc, ranh giới module, quyền sở hữu dữ liệu, contracts và ADR đủ để triển khai an toàn."
hide: true
---

# Thiết kế giải pháp

Đọc `skill://product-workflow/references/contract.md` trước; nếu URI chưa khám phá, đọc `.agents/skills/product-workflow/references/contract.md`.

## Đầu vào

Scope và stories/AC/flows, business rules, NFR, quyết định G1/G2 liên quan, hiện trạng code/hạ tầng và năng lực đội. Đọc repo/config/docs trước khi hỏi. Kiến trúc sơ bộ có thể thảo luận khi G2 chưa chốt, nhưng không chứng nhận quyết định phụ thuộc là sẵn sàng triển khai.

## 1. Tách ràng buộc thật khỏi sở thích

Ghi yêu cầu bắt buộc, mong muốn và chưa biết: loại sản phẩm, tải/dữ liệu, độ trễ, bảo mật/privacy, tích hợp, offline/realtime nếu có, ngân sách, năng lực đội, deployment/operations và khả năng thay đổi.

Không bịa con số tải, SLA hoặc năng lực thành viên. Ràng buộc chưa có nguồn phải hỏi hoặc ghi giả thuyết cần kiểm chứng. Không tự mặc định Next.js, microservices, monorepo hay cloud cụ thể.

## 2. So sánh stack

Chọn 2–3 phương án khả thi có thể đáp ứng yêu cầu bắt buộc; ưu tiên phương án đơn giản và công nghệ đội vận hành được. Nếu chỉ một phương án hợp lệ vì ràng buộc thật, giải thích thay vì tạo đối thủ giả.

| Tiêu chí | Phương án A | Phương án B | Nguồn/bằng chứng | Quyết định cần |
|---|---|---|---|---|
| Yêu cầu bắt buộc | | | | |
| Năng lực đội và bảo trì | | | | |
| Chi phí và vận hành | | | | |
| Kiểm thử, bảo mật, triển khai | | | | |
| Phụ thuộc nhà cung cấp/đường thay đổi | | | | |

Không chấm điểm chính xác giả. Nếu dùng trọng số, người dùng/đội phải chốt tiêu chí và trọng số; giải thích độ không chắc chắn. Giá/capability bên ngoài ảnh hưởng quyết định phải kiểm tra nguồn cập nhật.

Đề xuất rõ phương án, lý do và đánh đổi; người có trách nhiệm kỹ thuật/sản phẩm xác nhận quyết định liên quan. Đừng để “AI khuyến nghị” thành approval.

## 3. Giải quyết rủi ro bằng spike khi cần

Với điểm chưa biết có thể làm phương án thất bại, đề xuất spike gồm: câu hỏi, cách thử, dữ liệu an toàn, điều kiện đạt/không đạt, timebox để đội chốt và quyết định nó mở khóa. Không làm prototype kéo dài hoặc biến prototype thành production ngoài ý muốn.

Ghi output và giới hạn phép thử; đo một môi trường không tự suy ra chịu tải production.

## 4. Vẽ ranh giới trước khi chia tasks

Thiết kế đủ cho scope tiếp theo:
- System context: người dùng, hệ thống ngoài, trust boundaries.
- Thành phần chạy và cách giao tiếp; môi trường dev/test/production nếu có.
- Module catalogue: trách nhiệm, ngoài trách nhiệm, public interface và dependencies.
- Data model: thực thể, quan hệ, invariants, owner và vòng đời/migration.
- Authorization/data isolation, failure paths và recovery đúng yêu cầu.
- Logging/metrics cần kiểm chứng NFR và hỗ trợ vận hành; không thêm telemetry tùy hứng.
- Chiến lược test/build/integration/deployment và rollback khi áp dụng.

Đừng chia module chỉ theo thư mục UI/API/database. Module dựa trên trách nhiệm domain và hợp đồng; không ép mỗi module thành service chạy riêng.

Mẫu module:

| Module ID | Trách nhiệm | Không phụ trách | Dữ liệu sở hữu | Contract cung cấp/tiêu thụ | Dependency thật | Reviewer/owner đã xác nhận |
|---|---|---|---|---|---|---|

## 5. Chốt contracts để có thể làm song song

Mỗi hợp đồng cần thiết có revision và gồm: bên cung cấp/tiêu thụ; input/output; điều kiện/auth; lỗi và ý nghĩa; invariants; semantics đồng thời hoặc idempotency nếu yêu cầu; compatibility/migration nếu thay bản đang dùng; cách kiểm chứng.

Một task không được tự đổi hợp đồng dùng chung mà không báo ảnh hưởng. Mock có thể hỗ trợ làm song song sau khi chốt contract, nhưng không chứng minh integration thật hoặc thay bằng chứng Done.

Xác định shared-write areas: schema/migration, auth, shared components, build/deployment config. Chỉ ra nơi phải có chủ tích hợp hoặc trình tự thay đổi trước khi giao nhiều người.

## 6. Ghi ADR cho quyết định đáng lưu

Mẫu ADR:
- Bối cảnh và yêu cầu nguồn.
- Phương án đã xét, lựa chọn đề xuất/đã duyệt.
- Lý do, đánh đổi, điều không giải quyết.
- Ảnh hưởng lên modules/contracts/operations.
- Người duyệt, revision/bằng chứng và điều kiện xem xét lại.

Không tạo ADR cho mọi lựa chọn vụn vặt. Không ghi rằng giải pháp đã triển khai khi mới thiết kế.

## Gate G3 và bàn giao

G3 đạt cho scope khi người phụ trách kỹ thuật được chỉ định duyệt lựa chọn có ảnh hưởng, rủi ro chặn đã được giải quyết hoặc có quyết định chấp nhận rõ, contracts cần cho việc sắp làm đủ ổn định và kiểm chứng được.

Bàn giao cho `delivery-planning`: module map, contracts/revisions, dependency thực, shared-write conflicts, enablers/spikes cần thiết, cách tích hợp và NFR phải chứng minh. Không lập một thứ tự module cố định bỏ qua giá trị sản phẩm.
Sau khi G3 được duyệt, bàn giao sang `delivery-planning` để phân rã task; tuyệt đối không tự ý nhảy sang `task-execution` để viết code ngay.

Khi yêu cầu đổi, trình delta và affected modules/contracts/ADRs. Chỉ phần ảnh hưởng cần duyệt lại; không tự thay toàn bộ stack hoặc tự sửa callers khi người dùng chỉ hỏi phương án.
