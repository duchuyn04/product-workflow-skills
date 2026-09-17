# Quy tắc bắt buộc của Product Workflow

## 1. Nguyên tắc chống đốt cháy giai đoạn (Nghiêm cấm vượt cổng)
- **TUYỆT ĐỐI KHÔNG VIẾT CODE NGAY:** Khi người dùng yêu cầu tạo ứng dụng mới, phát triển tính năng mới hoặc bắt đầu dự án, AI **KHÔNG ĐƯỢC PHÉP** tự ý sinh mã nguồn, tạo file backend/frontend, hay cài đặt dependencies khi chưa hoàn thành và được người dùng phê duyệt lần lượt các cổng G1, G2, G3.
- **Thứ tự thực hiện bắt buộc (tuần tự từng bước):**
  1. `product-discovery` (Cổng G1): Khám phá bài toán, làm rõ mục tiêu, xác định actors, các trường hợp ngoại lệ và chốt quy tắc nghiệp vụ (Business Rules). Trình người dùng duyệt G1.
  2. `story-and-experience` (Cổng G2): Viết User Stories kèm tiêu chí nghiệm thu (Given-When-Then), danh mục màn hình và luồng giao diện UI. Trình người dùng duyệt G2.
  3. `solution-design` (Cổng G3): So sánh kiến trúc, thiết kế Database Schema, REST/GraphQL API Contracts và ghi nhận quyết định qua ADR. Trình người dùng duyệt G3.
  4. `delivery-planning` (Cổng G4): Phân rã tính năng thành các task nhỏ (1–4h), xác định việc phụ thuộc và việc song song. Trình kế hoạch task.
  5. `task-execution`: CHỈ BẮT ĐẦU VIẾT MÃ NGUỒN khi đã qua đủ các cổng G1, G2, G3, G4 và nhận từng task cụ thể.
- **Mỗi lượt trao đổi chỉ xử lý một cổng:** Trình bày kết quả của cổng hiện tại, sau đó **dừng lại** để người dùng xem xét, góp ý hoặc duyệt. Tuyệt đối không gộp nhiều cổng trong một câu trả lời rồi tự ý nhảy vào viết code.

## 2. Điều phối kỹ năng
- Với người mới vào team hoặc chưa rõ dự án đang ở đâu: đọc `skill://project-guide` để định hướng.
- Với mọi yêu cầu phân tích, thiết kế, lập kế hoạch hoặc triển khai: đọc `skill://product-workflow` để điều phối đúng chuyên gia cho cổng tương ứng.
- Từ ngữ "OK", "tiếp tục" hoặc "đồng ý" của người dùng chỉ có giá trị phê duyệt cho nội dung của cổng vừa trình bày, không được suy diễn thành quyền bỏ qua các cổng còn lại để đi code ngay.
- Giữ nguyên nguồn tài liệu đã có; không tự ý thay đổi mã nguồn hoặc deploy khi yêu cầu của người dùng chỉ ở mức trao đổi hoặc thiết kế.
