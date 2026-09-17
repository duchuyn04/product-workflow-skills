---
name: story-and-experience
description: "Chuyển nghiệp vụ thành story map, acceptance criteria, user journeys, UI/UX flows và trạng thái màn hình có thể kiểm chứng."
hide: true
---

# Stories và trải nghiệm

Đọc `skill://product-workflow/references/contract.md` trước; nếu URI chưa khám phá, đọc `.agents/skills/product-workflow/references/contract.md`.

## Đầu vào và phạm vi

Scope cần thiết kế; mục tiêu, actors/quyền, business rules và G1/revision; glossary; trải nghiệm/design system đã có. Đọc nguồn để lấy dữ kiện, không bắt người dùng nhập lại.

Thiếu rule ảnh hưởng hành vi thì đưa câu hỏi cụ thể về discovery. Vẫn có thể phác thảo phần độc lập nhưng ghi `draft`; không lấp rule bằng một màn hình tùy ý hoặc tự xác nhận G1.

## 1. Lập story map theo hành trình

- Xác định actor và kết quả họ muốn đạt, entry/exit, các hoạt động chính theo thứ tự trải nghiệm.
- Đặt stories dưới từng hoạt động; nhóm theo phạm vi phát hành và giá trị, không theo frontend/backend/database.
- Epic diễn tả capability/kết quả; module diễn tả ranh giới giải pháp. Không ép hai khái niệm thành một.
- Chia nhỏ thành các luồng tính năng hoàn chỉnh từ đầu đến cuối (end-to-end), có thể chạy thử và demo được. Phần việc nền tảng kỹ thuật vẫn có thể tách riêng thành enabler, nhưng cần chỉ rõ story hoặc rủi ro mà nó giải quyết.
- Không tự bỏ stories khỏi phạm vi đã duyệt. Đề xuất cắt scope phải có giá trị bị mất và người quyết định.

Mẫu story map:

| Actor/journey | Hoạt động | Story ID | Kết quả người dùng | Rule nguồn | Scope/release đề xuất | Câu hỏi chặn |
|---|---|---|---|---|---|---|

## 2. Viết story và AC

Mỗi story có:
- ID ổn định, actor, nhu cầu và giá trị; link mục tiêu/rule nguồn.
- Scope và ngoài phạm vi; tiền/hậu điều kiện.
- Acceptance criteria quan sát được, gồm biên, lỗi và quyền liên quan.
- Dữ liệu cần, flow/screen references, câu hỏi chưa giải quyết.
- Điều kiện demo/kiểm chứng; không điền implementation trước khi thiết kế giải pháp.

Mẫu AC:

```text
Given [trạng thái, vai trò và dữ liệu đầu vào liên quan]
When [hành động hoặc sự kiện]
Then [kết quả và trạng thái quan sát được]
And [không tạo tác dụng phụ trái rule, nếu đây là yêu cầu]
```

Không để AC chỉ là “API trả 200”, “giao diện đẹp” hoặc “không có lỗi”. Không thêm tính năng retry/undo/offline mặc định; chỉ đặc tả khi rule hoặc flow cần.

## 3. Thiết kế flow trước chi tiết trang trí

Cho mỗi story/journey:
1. Chọn điểm vào và quyền truy cập; xác định điều kiện chuyển từng bước.
2. Chỉ rõ dữ liệu nhập, validation, hành động, kết quả và nơi đi tiếp.
3. Thêm nhánh thất bại hoặc từ chối quyền có ý nghĩa; phân biệt hệ thống lỗi, dữ liệu không hợp lệ và chưa có dữ liệu.
4. Xét hủy, quay lại, thao tác lặp, tải lại trang, dữ liệu cũ, thay đổi quyền hoặc thực hiện đồng thời nếu ảnh hưởng nghiệp vụ.
5. Chọn phản hồi phù hợp: inline, toast, dialog hay trang riêng theo mức độ lỗi và khả năng phục hồi; nêu tradeoff nếu cần người dùng chọn.

Mẫu flow:

| Flow ID/bước | Actor | Màn hình/trạng thái | Hành động | Điều kiện | Kết quả/điểm đến | Rule/AC | Lỗi và phục hồi |
|---|---|---|---|---|---|---|---|

Không coi mỗi flow là một màn hình hoặc mỗi màn hình là một story.

## 4. Danh mục màn hình và trạng thái

Với mỗi màn hình/component thuộc scope, ghi:
- Mục đích, vị trí trong journey, phân cấp nội dung và thao tác chính/phụ.
- Vai trò/quyền, nguồn dữ liệu và dữ liệu nhạy cảm cần bảo vệ.
- Input/validation; loading, disabled, empty, error, success theo điều kiện thực tế.
- Retry/recovery hoặc bước hỗ trợ khi không thể tự phục hồi.
- Responsive, focus/keyboard, labels, error announcements và contrast theo yêu cầu accessibility đã chốt.
- Wireframe/mockup reference và revision nếu có; phân biệt đề xuất hình ảnh với UI đã dựng.

Tái sử dụng design system/component hiện có. Không chọn style, font hay brand mới khi repo đã có quy ước. Những lựa chọn UX có tradeoff đáng kể phải hỏi người dùng, không ngầm chọn.

## 5. Walkthrough và kiểm tra liên kết

Đi thử trên sơ đồ/wireframe với dữ liệu mẫu được ghi nhãn:
- Happy path đạt mục tiêu và hậu điều kiện.
- Một failure path quan trọng có phản hồi/phục hồi rõ.
- Một denied path không lộ dữ liệu hoặc thao tác ngoài quyền.
- Biên/concurrency nếu rule quy định.

So từng AC với flow và màn hình. Rule không được stories nào bao phủ phải được nêu; UI behavior không có nguồn thì hỏi có phải feature mới. Không tuyên bố đã test trình duyệt khi mới walkthrough tài liệu.

## Gate G2 và bàn giao

G2 hoàn thành khi người phụ trách sản phẩm hoặc UX duyệt phạm vi, tiêu chí nghiệm thu và luồng thao tác đúng phiên bản. Không cần chờ hoàn thiện toàn bộ giao diện của cả hệ thống mới bắt đầu làm phần tính năng đã đủ rõ ràng. Nếu phạm vi không có giao diện, ghi rõ không áp dụng kèm lý do; lúc này vẫn cần mô tả hành vi và tiêu chí nghiệm thu cho API hoặc quy trình xử lý nền.

Bàn giao cho `solution-design`: stories/flows đã duyệt, yêu cầu dữ liệu/quyền/NFR, câu hỏi chặn và những quyết định UX ảnh hưởng kỹ thuật. Không tự chọn stack hoặc publish Jira.

Khi tiếp tục/đổi rule, chỉ xét stories/flows liên quan và đánh dấu approval bị ảnh hưởng cần duyệt lại. Lưu links và next action theo hợp đồng, không chép toàn bộ tài liệu vào checkpoint.
