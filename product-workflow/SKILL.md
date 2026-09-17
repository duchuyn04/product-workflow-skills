---
name: product-workflow
description: "Điều phối dự án từ ý tưởng đến vận hành: phân tích nghiệp vụ, user stories, UI/UX, tech stack, kiến trúc, module, backlog Scrum, nhận việc người/AI, dependency song song và ma trận tiến độ Jira. Dùng khi bắt đầu hoặc tiếp tục dự án, lập sprint, bàn giao task hay xem toàn cảnh."
---

# Product workflow

Một đầu vào cho người dùng; chỉ nạp chuyên gia cần thiết. Giao tiếp tiếng Việt trừ khi người dùng yêu cầu khác. Bộ skills này là quy trình cho agent, không tự cài công cụ hoặc tạo kết nối Jira.

## Khởi động

1. Đọc `skill://product-workflow/references/contract.md`. Nếu skills vừa được thêm và URI chưa khám phá, đọc `.agents/skills/product-workflow/references/contract.md` trong repo. Dùng quy tắc fallback tương tự cho các skills con; không lặp lỗi URI liên tục.
2. Xác định intent hiện tại và chế độ: trao đổi (`discuss`), thiết kế (`plan`), hoặc thực thi (`execute`). Yêu cầu “xem/thiết kế” không cấp quyền ghi Jira hoặc code.
3. Đọc chỉ dẫn repo, chỉ mục/checkpoint nếu có, và đúng tài liệu liên quan. Nếu chưa có chỉ mục, dò tài liệu hiện hữu trước khi hỏi; không giả định repo rỗng.
4. Nếu nhiều dự án/scope phù hợp mà không suy ra được từ nguồn, hỏi người dùng chọn. Nếu chưa có nơi lưu, đọc `skill://product-workflow/references/records.md`, đề xuất vị trí và chốt khi cần tạo hồ sơ.
5. Kiểm tra revision/approval và dữ liệu Jira cần cho hành động hiện tại. Chỉ cần Jira khi tác vụ thực sự phụ thuộc Jira; không chặn discovery vì chưa có token.
6. Nói ngắn: đang làm scope nào, có gì đã biết, còn thiếu quyết định nào và bước tiếp theo. Bắt đầu công việc đủ điều kiện ngay; không hỏi lại toàn bộ thiết kế đã được duyệt.

## Chọn chuyên gia

Đọc skill bằng `read` trước khi làm. Không giả định harness có một tool tên `Skill`.

| Intent | Skill phải đọc | Đầu ra mong đợi |
|---|---|---|
| Mới vào team, chưa biết dự án ở đâu, nên làm gì tiếp | `skill://project-guide` | Hiện trạng có nguồn, tài liệu đọc trước, bước tiếp |
| Ý tưởng, mục tiêu, nghiệp vụ mơ hồ, domain/rules | `skill://product-discovery` | Business brief, rules, câu hỏi mở, G1 |
| User stories, hành trình, màn hình, UI/UX flows | `skill://story-and-experience` | Story map, AC, flows, G2 |
| Chọn stack, kiến trúc, data/API, ranh giới module | `skill://solution-design` | So sánh lựa chọn, contracts, ADR, G3 |
| Thứ tự module, backlog, sprint, việc song song | `skill://delivery-planning` | Phân rã luồng việc, dependency, đề xuất sprint, điều kiện G4 |
| Nhận task, giao/bàn giao, code, kiểm chứng task | `skill://task-execution` | Claim có xác nhận khi khả dụng, handoff, evidence |
| Xem board/ma trận, tick Done, release, review/retro | `skill://delivery-inspection` | Góc nhìn có nguồn, đánh giá Done/release, cải tiến |
Intent giao nhau: chọn chuyên gia phục vụ kết quả người dùng yêu cầu; chỉ thêm chuyên gia thứ hai khi cần giải quyết đầu vào cụ thể. Không đọc cả sáu skills và mọi tài liệu mỗi lần.

Thay đổi nghiệp vụ đã chốt: dùng discovery để xác định delta, inspection để tìm ảnh hưởng rồi gọi chuyên gia cho phần phải sửa. Bug đã rõ trong một task không buộc phỏng vấn lại toàn sản phẩm; dùng kỹ thuật debug phù hợp trong task-execution.

## Điểm quyết định theo scope

- G1: nghiệp vụ và phạm vi được người có trách nhiệm xác nhận.
- G2: stories/AC và UX flows của phạm vi tiếp theo thống nhất.
- G3: quyết định giải pháp/contracts cần thiết đã được duyệt.
- G4: công việc sắp thực thi có đầu vào, prerequisites và quyền đầy đủ.

Các cổng kiểm soát áp dụng theo từng tính năng, module hoặc phạm vi cụ thể, không chặn mọi công việc để đợi đặc tả xong toàn bộ dự án. AI chỉ đề xuất, không tự phê duyệt. Khi chưa đủ điều kiện qua cổng, cần nêu chính xác điều kiện còn thiếu và người có thẩm quyền quyết định.

Nếu người dùng nói “OK”, gắn với đề xuất cụ thể ngay trước đó; đừng coi là quyền deploy, publish backlog hoặc duyệt mọi quyết định còn mở.

## Một phiên làm việc

1. Tiếp nhận yêu cầu và nạp phần bối cảnh tối thiểu.
2. Chuyên gia tạo/điều chỉnh đầu ra; tách facts, hypotheses, proposals và open questions.
3. Kiểm tra liên kết đầu vào/đầu ra, revision và gate. Nếu cần hỏi, gom 2–3 câu có ảnh hưởng thật.
4. Chỉ thực thi bước kế khi intent/quyền/gate cho phép. Người dùng chỉ muốn thiết kế thì bàn giao thiết kế, không chuyển sang code.
5. Nếu được phép lưu, cập nhật chỉ mục/checkpoint theo mẫu shared; giữ tham chiếu, không copy backlog.
6. Trả kết quả, bằng chứng/giới hạn và next action. Không gọi task đã làm xong khi external write chưa xác nhận.

## Tích hợp và phân công

- Không có Jira: discovery, UX, architecture và kế hoạch nháp vẫn làm được; claims/trạng thái/board live chưa khả dụng. Nháp phải được gắn nhãn rõ.
- Có Jira: xác minh công cụ, scope/quyền, mapping và data coverage trước. Không bịa project key, field ID hay transition.
- Việc song song: delivery-planning xác định nhóm độc lập; task-execution kiểm tra lại trước claim. Đừng tự giao cho người chưa đồng ý.
- Nếu cần subagents, Main giữ vai trò tích hợp và quyền quyết định của người dùng; mỗi agent nhận scope riêng cùng contracts. Subagents không được tự publish/claim nếu không được ủy quyền.
- Công cụ subagent không khả dụng: làm trực tiếp; không sửa cấu hình agent toàn cục chỉ để chạy workflow.

## Cách dùng

Người dùng có thể nói “Tôi mới vào team nên làm gì tiếp”, “Bắt đầu phân tích dự án này”, “Tiếp tục từ checkpoint”, “Chia việc sprint tới”, “Tôi nhận task này”, hoặc “Xem ma trận tiến độ”.

Trong Oh My Pi, có thể gọi rõ `/skill:project-guide` khi cần định hướng, hoặc `/skill:product-workflow` khi cần điều phối công việc. Skills được khám phá lúc khởi động; sau khi mới thêm folder, mở phiên Oh My Pi mới nếu phiên hiện tại chưa thấy URI. Sáu chuyên gia chuyên sâu có `hide: true`: ẩn metadata khỏi model nhưng vẫn đọc được bằng URI; router và guide được hiển thị để người dùng dễ tiếp cận.

Không dùng `/skill:product-workflow` hay `/skill:project-guide` như tên lệnh shell. Nếu `.agents` source bị tắt hoặc skill bị filter, giải thích cấu hình đang chặn; không tự thay settings của người dùng.
