---
name: product-discovery
description: "Cổng G1: phân tích yêu cầu từ mô tả và phỏng vấn case study theo quy mô, chuyển As-Is sang To-Be, xác định actors, quy tắc nghiệp vụ và danh mục Epic trước khi viết User Stories."
hide: true
disable-model-invocation: true
---

# Product discovery (G1 Nghiệp vụ & Epic)

Đọc `skill://product-workflow/references/contract.md` và `skill://product-workflow/references/records.md` trước. Nếu harness không hỗ trợ `skill://` (như Claude Code), đọc `<skills-dir>/product-workflow/references/`; `<skills-dir>` là thư mục cha của skill này (`.claude/skills/`, `.agents/skills/` hoặc bản toàn cục). Tên công cụ quy đổi theo `<skills-dir>/product-workflow/references/harness.md`.

Mục tiêu: một business brief đủ rõ để viết User Stories. Không viết story, không ước lượng, không chia sprint ở bước này.

## 1. Thu thập nguồn

Đọc mọi thứ người dùng đã đưa trước khi hỏi. Nhận diện nguồn theo 7 hình thức thu thập yêu cầu:

1. Phỏng vấn khách hàng.
2. Họp với khách hàng.
3. Quan sát quy trình nghiệp vụ.
4. Phiếu khảo sát.
5. Email / tài liệu yêu cầu (mô tả, đề bài, hợp đồng).
6. Feedback từ hệ thống đang sử dụng.
7. Yêu cầu thay đổi / bổ sung chức năng.

Ở đợt hỏi đầu, xin tài liệu thật nếu có: file Excel/sổ theo dõi, mẫu phiếu, hóa đơn, báo cáo hiện có, quy định nội bộ. Một tài liệu thật trả lời được nhiều câu hỏi. Không có thì tiếp tục, không chặn discovery.

## 2. Chọn quy mô

Nếu người dùng chưa nói rõ, gọi `ask` đầu tiên:

```text
ask(questions=[{
  "id": "project_scale",
  "question": "Dự án này ở quy mô nào để tôi chỉnh độ sâu phỏng vấn cho phù hợp?",
  "options": [
    {"label": "MVP / Đồ án môn học", "description": "Một luồng giá trị chính, phỏng vấn nhanh, thường khoảng 5–15 câu tình huống."},
    {"label": "Hệ thống vừa (cửa hàng, SME)", "description": "Đủ các phân hệ vận hành; hỏi kỹ tiền, trạng thái, phân quyền, báo cáo."},
    {"label": "Nền tảng lớn / nhiều phân hệ", "description": "Chốt danh mục phân hệ trước, sau đó phỏng vấn từng phân hệ."}
  ],
  "recommended": 0
}])
```

Quy mô quyết định độ sâu:
- **MVP:** chỉ hỏi va chạm của luồng chính (ai làm gì, sai thì sao, ai được sửa/xóa). Không hỏi bài toán enterprise.
- **Vừa:** hỏi thêm các chủ đề gợi ý ở mục 4.
- **Lớn:** đề xuất danh mục phân hệ (`Quản lý + …`), dùng `ask` để người dùng duyệt danh mục và chọn phân hệ làm trước, rồi phỏng vấn lần lượt từng phân hệ.

## 3. Phân tích từ mô tả

Từ các nguồn đã có, AI tự soạn nháp trước, sau đó mới hỏi phần còn thiếu:

0. **Tên và slug dự án:** lấy từ mô tả (ví dụ `HLPHONE` → `hlphone`). Dùng slug này cho tên file `<du-an>` ở mọi cổng. Không rõ tên thì hỏi trong đợt đầu.
1. **As-Is → To-Be:** nêu vấn đề thực tế (quản lý bằng Excel, sai lệch tồn kho, khó tra cứu…) và giải pháp chuẩn hóa bằng hệ thống.
2. **Actors:** các nhóm người dùng trực tiếp tương tác với hệ thống, kèm việc được làm và không được làm.
3. **Danh mục Epic:** gom yêu cầu cùng miền trách nhiệm thành Epic `EP01`, `EP02`…, tên dạng `Quản lý + …`. Mỗi Epic liệt kê "các yêu cầu xác định được", là đầu vào để tách story ở G2.
4. **Quy tắc nghiệp vụ:** mỗi rule có ID `BRxx`, ví dụ và nguồn xác nhận (`người dùng xác nhận`, `tài liệu <tên>`, `AI suy luận – cần xác nhận`). Rule do AI suy luận là giả định mở, chưa tính là đã rõ.
5. **Yêu cầu phi chức năng:** mong muốn như "giao diện đơn giản", "tìm kiếm nhanh", "chạy trên máy tính quầy". Ghi thành câu kiểm tra được khi có thể (ví dụ: tìm sản phẩm theo tên hoặc mã trong một ô tìm kiếm). Những yêu cầu này đi vào AC của story liên quan ở G2, không thành story riêng.

## 4. Phỏng vấn case study

- Hỏi theo đợt, mỗi đợt 2–4 câu qua `ask`. Mỗi câu là một tình huống cụ thể có các phương án để chọn, không hỏi chung chung kiểu "Quy tắc của bạn là gì?".
  - Ví dụ tốt: "Khách mua 2 máy nhưng kho chỉ còn 1: hệ thống chặn tạo đơn, cho tạo đơn chờ hàng, hay cho bán và báo kho sau?"
- Sau mỗi đợt, cập nhật nháp brief, rồi chỉ hỏi tiếp những gì còn thiếu. Dừng khi đủ điều kiện ở mục 6. Không đặt số câu tối thiểu hay tối đa.
- Không hỏi chi tiết giao diện, màu sắc, công nghệ, hạ tầng. Những thứ đó không ảnh hưởng tới backlog ở mức story.
- Làm rõ từ ngữ mơ hồ (ví dụ: "hủy đơn" và "trả hàng" khác nhau thế nào; "khách hàng" có phải người đăng nhập hệ thống không).

**Chủ đề gợi ý cho quy mô Vừa/Lớn** (chỉ hỏi phần áp dụng):
- Vòng đời và trạng thái của thực thể chính (đơn hàng, phiếu, hợp đồng…).
- Tính tiền, giảm giá, hoàn tiền, các con số không được sai (tồn kho không âm…).
- Hai người cùng thao tác trên một dữ liệu.
- Phân quyền chi tiết theo actor.
- Sự cố và ngoại lệ (thanh toán lỗi, hủy giữa chừng).
- Tích hợp với hệ thống khác.

## 5. Danh sách phủ R1–R8

Hỏi bằng tình huống cụ thể, ví dụ: "Cuối tháng quản lý cần xem những con số nào, lọc theo gì, có xuất Excel không?", không hỏi "Bạn có cần báo cáo không?".

- **R1. Mục tiêu:** vấn đề cần giải quyết, ai hưởng lợi, kết quả đo được.
- **R2. Ưu tiên phạm vi:** nhóm chức năng nào Bắt buộc / Nên có / Để sau. Đây là đầu vào cho Priority ở G2.
- **R3. Báo cáo:** ai xem gì, kỳ báo cáo, bộ lọc, định dạng xuất.
- **R4. Pháp lý:** chứng từ bắt buộc, dữ liệu cá nhân, thời hạn lưu.
- **R5. Lịch sử thay đổi:** thao tác nào cần ghi vết ai làm, lúc nào.
- **R6. Dữ liệu cũ:** dữ liệu đang ở đâu, có chuyển sang không.
- **R7. Thông báo:** sự kiện nào báo cho ai, qua kênh nào.
- **R8. Ràng buộc dự án:** hạn chót, số người, thời gian có thể làm. Đây là đầu vào cho số sprint ở G3.

Theo quy mô:
- **MVP:** bắt buộc R1, R2, R8. Với R3–R7 chỉ hỏi nhanh có cần hay không; không cần thì ghi `N/A` kèm lý do.
- **Vừa/Lớn:** cả R1–R8 phải có câu trả lời, hoặc `N/A` có lý do được người dùng xác nhận.

## 6. Điều kiện chốt brief

Chốt khi:
1. Mỗi Epic có danh sách yêu cầu đủ để tách story.
2. Mỗi actor có phạm vi quyền rõ.
3. Luồng chính không còn câu hỏi chặn.
4. R1–R8 đạt mức của quy mô đã chọn.

Người dùng muốn dừng sớm khi còn câu hỏi mở: ghi các câu đó vào `Câu hỏi mở`. Nếu họ vẫn muốn duyệt thì ghi vào `Rủi ro đã chấp nhận` rồi mới duyệt.

## 7. Lưu và xin duyệt G1

1. Lưu `docs/workflow/specs/<du-an>-brief.md` theo mẫu `G1 — Business brief` trong `records.md`. Nếu phân hệ đã có brief thì cập nhật tại chỗ.
2. Tóm tắt trong chat: số actors, danh mục Epic (ID, tên, số yêu cầu), rules chính, câu hỏi mở.
3. Gọi `ask` duyệt G1 với ba lựa chọn `Duyệt và tiếp tục` / `Cần điều chỉnh` / `Hỏi thêm chi tiết`, rồi dừng lượt.

Duyệt xong thì ghi trạng thái `approved` vào brief. Bước tiếp theo duy nhất là `product-backlog` (G2).

Khi yêu cầu thay đổi sau này: sửa brief tại chỗ, ghi ngày và nội dung thay đổi, liệt kê các story bị ảnh hưởng để G2 cập nhật.
