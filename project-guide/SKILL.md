---
name: project-guide
description: "Hướng dẫn người mới vào team hoặc người chưa biết nên làm gì tiếp: đọc hiện trạng dự án, giải thích tiến độ theo scope/module, chỉ ra tài liệu cần đọc, blockers và bước tiếp theo phù hợp. Dùng cho onboarding, tôi mới vào team, dự án đang ở đâu, bắt đầu từ đâu hoặc nên dùng skill nào."
---

# Project guide

Giúp người chưa có bối cảnh trả lời: sản phẩm làm gì, hiện đang ở đâu, điều gì chưa biết và tôi nên làm gì tiếp. Không bắt họ biết tên skill hoặc tự báo giai đoạn dự án.

Đọc `skill://product-workflow/references/contract.md` trước. Nếu URI chưa khám phá, đọc `.agents/skills/product-workflow/references/contract.md`. Skill này là hướng dẫn **chỉ đọc**, không phải bộ điều phối thực thi thứ hai. Không tự tạo hồ sơ/checkpoint, chạy setup/build/migration, sửa code, claim/assign task, cập nhật Jira hay deploy.

## 1. Xác định nhu cầu mà không phỏng vấn lại dự án

Nếu người dùng đã nêu vai trò, module hoặc mục tiêu, dùng ngay. Nếu chưa rõ, trước hết tìm hiểu nguồn để đưa được một bản định hướng chung. Chỉ hỏi tối đa 2 câu cá nhân hóa khi thật sự ảnh hưởng đề xuất: vai trò/kỹ năng muốn đóng góp và mục tiêu công việc hoặc phạm vi họ quan tâm.

Không hỏi “dự án đang ở giai đoạn nào?” hoặc “đã làm xong module gì?” như điều kiện để bắt đầu; đó chính là việc skill cần tìm hiểu. Không đoán năng lực từ chức danh, tên người hoặc số commit. Nếu nhiều dự án/scope trong workspace mà không phân biệt được, hỏi chọn phạm vi trước khi tổng hợp.

## 2. Đọc nguồn theo thứ tự, vừa đủ để định hướng

1. Chỉ dẫn repo, README và chỉ mục tài liệu: mục tiêu sản phẩm, cách tổ chức và nguồn chính thức.
2. Chỉ mục/checkpoint và Product Backlog: đọc đường dẫn đã ghi; mặc định `docs/workflow/product-backlog.md`. Xác định scope/release, nguồn trạng thái local/Jira và thời điểm đối chiếu; đọc hàng liên quan cùng links stories/task cards/evidence, không xem checkbox là bằng chứng độc lập.
3. Tài liệu được tham chiếu: nghiệp vụ/glossary, scope, stories/UX, kiến trúc/ADR/contracts, module catalogue và approval. Đọc phần quyết định/nghiệm thu liên quan trước, không nạp mọi file.
4. Nếu cần xác định mức triển khai: cấu trúc code, manifest/scripts, checks và evidence CI/review/deployment đã có. Đọc đủ để phân biệt thiết kế với implementation; không chạy cài đặt hoặc test chỉ để giới thiệu dự án.
5. Nếu đã có công cụ Jira và quyền đọc: đọc scope/board/sprint, issue liên quan, blockers và owner mới nhất; xử lý phân trang/giới hạn quyền. Không yêu cầu credentials trong chat hoặc tự thiết lập kết nối.

Không có chỉ mục vẫn tận dụng tài liệu hiện hữu; không tự sinh chỉ mục cho đủ mẫu. File trong `.agents/skills/`, templates hoặc nội dung README giới thiệu không phải bằng chứng sản phẩm đã đạt gate hay hoàn thành module.

Mỗi kết luận quan trọng có đường dẫn/link và revision/thời điểm nếu lấy được. Nguồn không có timestamp đáng tin thì nói chưa xác minh độ mới, không tự điền ngày. Không mở `.env`, auth stores hoặc dữ liệu nhạy cảm để phục vụ onboarding.

## 3. Tổng hợp hiện trạng theo phạm vi, không đoán một phase duy nhất

Đánh giá riêng các chiều: nghiệp vụ; stories/UX; giải pháp/contracts; triển khai; kiểm chứng; phát hành/vận hành. Cùng lúc module A có thể đang vận hành còn module B đang discovery.

| Quan sát | Được kết luận | Không được suy ra |
|---|---|---|
| Có business brief nhưng không có approval | Có tài liệu nghiệp vụ, chưa xác minh gate đã duyệt | G1 đã đạt hoặc chưa ai từng duyệt |
| Có stories/wireframes | Có đặc tả/thiết kế để đọc | UX đã được duyệt hoặc UI đã triển khai |
| Có code/manifest/config deploy | Có dấu vết implementation/cấu hình | Build đạt, AC đạt hoặc production đang chạy |
| Có evidence test/review | Đã kiểm chứng phần được ghi, tại revision/môi trường đó | Mọi tính năng hoặc revision mới đều đạt |
| Có deployment evidence | Đã phát hành revision vào môi trường được ghi | Production hiện vẫn khỏe hoặc mọi module đã phát hành |
| Có checkpoint cũ | Đây là điểm tiếp tục đã ghi trước đó | Owner/status hiện tại vẫn như checkpoint |
| Không thấy task hoặc thiếu quyền đọc Jira | Chưa xác minh được task/trạng thái | Không có việc, chưa ai nhận hoặc task đã Done |

Ở chế độ local, backlog/task cards và evidence mới nhất là nguồn trạng thái, không phải checkpoint. Ở chế độ Jira, Jira mới nhất thắng snapshot Markdown về trạng thái issue; evidence/approval quyết định mức chứng minh chất lượng. Nếu Jira Done nhưng thiếu evidence, giữ cả hai thông tin, không âm thầm đổi trạng thái. Revision thay đổi thì nêu approval nào có thể cần xét lại.

Nếu cần ma trận chi tiết, đọc `skill://delivery-inspection` và dùng quy tắc tổng hợp của nó; không tạo một hệ thống status khác. Bản giới thiệu thông thường chỉ cần vài dòng theo scope/module.

## 4. Đề xuất bước tiếp theo phù hợp

Trả tối đa 3 việc theo thứ tự, mỗi việc có:
- Hành động cụ thể và kết quả mong đợi, không chỉ tên skill.
- Vì sao nên làm lúc này; nguồn/bằng chứng liên quan.
- Đầu vào cần đọc và điều kiện/quyền còn thiếu.
- Người có thể giải đáp/gỡ chặn nếu đã biết; chưa có thì ghi vai trò cần xác nhận, không bịa tên.
- Skill đích hoặc câu lệnh bàn giao rõ ràng để người dùng chọn.

Ưu tiên một bước an toàn có thể bắt đầu: đọc glossary và đi qua một flow, xem contract của module quan tâm, hoặc chuẩn bị câu hỏi về AC. Nếu có task đủ điều kiện được kiểm tra từ nguồn fresh và phù hợp kỹ năng đã khai báo, có thể đề xuất task đó nhưng phải nhắc **chưa claim**; người dùng chọn rồi `task-execution` kiểm tra lại.

Thiếu quyền/Jira không chặn việc học domain hoặc xem thiết kế. Không đề xuất làm lại discovery toàn dự án vì không có checkpoint. Không đề xuất tự chốt nghiệp vụ, sửa contract, deploy hoặc nhận task của người khác cho người mới.

Nếu chưa biết vai trò, đưa bước định hướng chung trước rồi hỏi; không tự chọn frontend/backend cho họ. Giải thích thuật ngữ domain xuất hiện lần đầu bằng glossary dự án, không ném danh sách jargon.

## 5. Chọn đường đi, không tự chạy

Khi cần chọn skill đích, đọc bảng `Chọn chuyên gia` trong `skill://product-workflow` (fallback `.agents/skills/product-workflow/SKILL.md`). Đó là nguồn định tuyến duy nhất; không chép lại một danh sách flow dễ lỗi thời.

Chỉ đọc bảng để đề xuất. Không khởi động router rồi lại quay về guide theo trigger onboarding. Nếu router đã gọi guide, trả bản định hướng về router và dừng trước mọi bước thực thi. Người dùng phải chọn hoặc yêu cầu tiếp tục hành động cụ thể; lời gọi guide không tự là ủy quyền hành động đó.

Câu lệnh bàn giao đề xuất:

```text
/skill:product-workflow [hành động cụ thể người dùng chọn] trong [scope/module].
Dùng [nguồn/revision]. Kết quả cần: [đầu ra].
Chưa thực hiện [những thao tác chưa được cấp quyền].
```

Chỉ điền thông tin đã có; không trả placeholder như một task thật. Nếu thiếu dữ kiện, dùng câu yêu cầu giải quyết đúng điểm thiếu trước. Người dùng có thể trả lời tự nhiên thay vì sao chép lệnh.

## 6. Định dạng trả lời cho người mới

1. **Dự án làm gì:** 2–3 câu về người dùng, giá trị và thuật ngữ cốt lõi có nguồn.
2. **Hiện trạng đã xác minh:** bảng ngắn `Scope/module | Đang có gì/đang chờ gì | Nguồn | Chưa xác minh`; không ép một nhãn phase toàn dự án.
3. **Bạn nên làm tiếp:** 1–3 hành động ưu tiên, đầu ra và lý do; đánh dấu điều kiện chưa đáp ứng.
4. **Đọc trước:** tối đa 3 tài liệu/đoạn thực sự tồn tại, theo thứ tự, mỗi mục nói đọc để hiểu gì.
5. **Cá nhân hóa/bàn giao:** tối đa 2 câu còn cần hoặc một câu lệnh bước tiếp theo; không mặc định vừa hỏi vừa thực thi.

Nếu bằng chứng ít, trả lời ngắn hơn và nói rõ giới hạn. Báo cáo giới thiệu không phải chứng nhận Ready/Done hoặc dự báo tiến độ. Không ghi lại báo cáo thành file nếu người dùng chỉ yêu cầu hướng dẫn.

## Cách gọi

`/skill:project-guide` hoặc “Tôi mới vào team, cho biết dự án đang ở đâu và tôi nên bắt đầu từ đâu”. Có thể thêm vai trò/module quan tâm. Nếu skill mới chưa xuất hiện, mở phiên Oh My Pi mới; không thay settings toàn cục để ép nạp.
