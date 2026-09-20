---
name: product-workflow
description: "Đọc trước khi sửa bug, điều chỉnh hành vi hiện có, thêm tính năng vào repo cũ hoặc tạo ứng dụng mới: phân loại Spike/Bounded/Feature và xin duyệt trước khi sửa source. Điều phối nghiệp vụ, stories/UX, kiến trúc, tasks, thực thi và nghiệm thu; quản lý backlog và tiến độ local/Jira."
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

### Trước thao tác ghi mã nguồn

Đọc nội dung skill; thấy đường dẫn qua Glob chưa phải đã đọc. Trước khi duyệt, chỉ đọc/phân tích source và soạn tài liệu thiết kế theo cổng; chưa sửa source, tests, cấu hình, dependencies hoặc migrations, kể cả qua shell hay giao subagent.

Nêu nhánh, phạm vi, bước hiện tại và bằng chứng duyệt trong hội thoại. Yêu cầu ban đầu không phải duyệt phương án chưa trình bày. Nếu đã có duyệt rõ cho đúng phạm vi thì tiếp tục, không hỏi lại; scope đổi phải xin duyệt phần thay đổi.

- Bounded: sau khi đọc source, phải trình bày **Đề xuất sửa lỗi (Bounded)** trong phần chat thông thường, theo đúng thứ tự: (1) nhánh và phạm vi; (2) nguyên nhân gốc rễ cùng bằng chứng file/symbol; (3) các thay đổi dự kiến theo file/symbol; (4) phần ngoài phạm vi và rủi ro; (5) cách tái hiện và kiểm chứng sau sửa. Nếu nguyên nhân mới là giả thuyết, tiếp tục chẩn đoán và chưa xin duyệt. Chỉ sau khi đề xuất đã hiển thị đầy đủ mới gọi `ask` rồi chờ trả lời. Nội dung trong câu hỏi hoặc mô tả lựa chọn của `ask` không thay thế đề xuất trong chat. Nếu không có `ask`, hỏi bằng chat và dừng. Bỏ G1–G4 không có nghĩa bỏ duyệt.
- Feature trên repo có sẵn: G1–G4 chỉ tập trung phần bổ sung và ảnh hưởng lên hành vi cũ; tái sử dụng stack/conventions hiện hữu. Có source không đồng nghĩa đã duyệt tính năng mới.
- Spike: chỉ thử nghiệm throwaway trong phạm vi đã duyệt.

Ví dụ: đổi các mức tốc độ giọng đọc thành 0.5x, 1x, 1.2x, 1.5x là Bounded nếu đã có chức năng chọn tốc độ. Đọc nơi khai báo và áp dụng tốc độ, đề xuất sửa và kiểm thử, chờ duyệt rồi mới edit. Nếu chưa có chức năng đó, xét Feature.

## Chọn chuyên gia

Đọc skill bằng `read` trước khi làm. Không giả định harness có một tool tên `Skill`.

| Intent | Skill phải đọc | Đầu ra mong đợi |
|---|---|---|
| Mới vào team, chưa biết dự án ở đâu, nên làm gì tiếp | `skill://project-guide` | Hiện trạng có nguồn, tài liệu đọc trước, bước tiếp |
| Ý tưởng, mục tiêu, nghiệp vụ mơ hồ, domain/rules | `skill://product-discovery` | Business brief, rules, câu hỏi mở, G1 |
| User stories, hành trình, màn hình, UI/UX flows | `skill://story-and-experience` | Story map, AC, flows, G2 |
| Chọn stack, kiến trúc, data/API, ranh giới module | `skill://solution-design` | So sánh lựa chọn, contracts, ADR, G3 |
| Thứ tự module, tạo Product Backlog, sprint, việc song song | `skill://delivery-planning` | Ma trận tính năng, Story Points, AC, task cards và điều kiện G4 |
| Nhận task, giao/bàn giao, code, kiểm chứng task | `skill://task-execution` | Nhận việc có xác nhận, handoff, evidence và cập nhật backlog |
| Xem board/ma trận, chấm điểm nghiệm thu, tick Done, release | `skill://delivery-inspection` | Đối chiếu evidence, AC đạt/tổng, SP hoàn tất và checkbox |
| Vẽ sơ đồ kiến trúc, DB schema, flows, sequence thay Mermaid | `skill://diagram-design` | File sơ đồ HTML/SVG độc lập trong docs/workflow/diagrams/ |
Intent giao nhau: chọn chuyên gia phục vụ kết quả người dùng yêu cầu; chỉ thêm chuyên gia thứ hai khi cần giải quyết đầu vào cụ thể. Không đọc cả sáu skills và mọi tài liệu mỗi lần.

Thay đổi nghiệp vụ đã chốt: dùng discovery để xác định delta, inspection để tìm ảnh hưởng rồi gọi chuyên gia cho phần phải sửa. Bug đã rõ trong một task không buộc phỏng vấn lại toàn sản phẩm; dùng kỹ thuật debug phù hợp trong task-execution.

Thay đổi giao diện web gồm mọi thay đổi làm khác bề mặt người dùng nhìn thấy hoặc tương tác: page/component, style, form, navigation và các trạng thái loading/error/empty. Sau khi thực thi loại thay đổi này, trước khi báo hoàn thành phải chuyển qua checkpoint Browser Native trong `task-execution`: gọi `ask` để người dùng chọn cách kiểm thử, trừ khi họ đã chọn rõ cho đúng scope. Diagram HTML/SVG theo quality gate tự động riêng, không dùng câu hỏi này.

## Quy tắc bắt buộc: Chống đốt cháy giai đoạn (Hard-Gate & Hard-Stop)

### 1. Phân loại 3 nhánh công việc (Three Paths)
Ngay khi nhận yêu cầu, router phải phân loại rõ:
- **Spike:** Nghiên cứu/thử nghiệm tính khả thi ──► Nêu câu hỏi, đề xuất thử nghiệm ngắn (2–3 câu), xin xác nhận ──► Chạy thử, báo cáo kết quả khuyến nghị (code dán nhãn bỏ đi).
- **Bounded:** Thay đổi nhỏ trên luồng code ĐÃ CÓ ──► Nêu nguyên nhân và giải pháp ngắn trong chat ──► **Dừng lại chờ duyệt** ──► Duyệt xong mới chuyển sang `task-execution`.
- **Greenfield / New Feature:** Tạo mới ứng dụng, module hoặc tính năng mới ──► **Bắt buộc đi đủ 4 cổng tuần tự**:
  `G1 (Nghiệp vụ)` ──► [Duyệt] ──► `G2 (Stories & UX)` ──► [Duyệt] ──► `G3 (Kiến trúc & Contracts)` ──► [Duyệt] ──► `G4 (Tasks)` ──► `task-execution (Code)`

*Nguyên tắc bánh cóc một chiều (One-way ratchet):* Khi phân vân giữa Bounded và Greenfield, luôn chọn nhánh nặng hơn. Phát hiện độ phức tạp tăng lên giữa chừng thì nâng cấp nhánh ngay, không bao giờ tự ý hạ cấp.

### 2. Quy tắc trạng thái kết thúc khép kín (Terminal States)
Mỗi cổng chỉ có DUY NHẤT một kỹ năng kế tiếp hợp lệ:
- Hoàn thành G1 (`product-discovery`) ──► Dừng lại xin duyệt ──► Duyệt xong CHỈ ĐƯỢC gọi `story-and-experience` (G2). Nghiêm cấm nhảy cóc sang G3 hay code.
- Hoàn thành G2 (`story-and-experience`) ──► Dừng lại xin duyệt ──► Duyệt xong CHỈ ĐƯỢC gọi `solution-design` (G3).
- Hoàn thành G3 (`solution-design`) ──► Dừng lại xin duyệt ──► Duyệt xong CHỈ ĐƯỢC gọi `delivery-planning` (G4).
- Hoàn thành G4 (`delivery-planning`) ──► Bàn giao từng task cụ thể cho `task-execution`.

### 3. Quy tắc dừng lượt (Hard-Stop Policy) và công cụ `ask` trong Oh My Pi
Mỗi lượt trao đổi chỉ hoàn thành một cổng. Trình bày xong kết quả của cổng đó thì **BẮT BUỘC DỪNG TIN NHẮN** để người dùng phản hồi/duyệt. Tuyệt đối không vừa trình bày thiết kế vừa gọi công cụ tạo file mã nguồn trong cùng một turn.

Với Bounded, thứ tự bắt buộc trong cùng lượt là: **trình bày Đề xuất sửa lỗi trong chat → gọi `ask` → chờ quyết định**. Thẻ `ask` chỉ ghi nhận quyết định; giữ câu hỏi và mô tả lựa chọn ngắn, không giấu kế hoạch trong `options[].description`. Chưa có phần chat chứa đủ phạm vi, nguyên nhân có bằng chứng, thay đổi dự kiến, rủi ro/ngoài phạm vi và cách kiểm chứng thì chưa được gọi `ask`.

**Tận dụng công cụ `ask` của OMP:** Tại điểm dừng của mỗi cổng (G1, G2, G3, G4), AI ưu tiên gọi công cụ `ask` để người dùng bấm chọn duyệt trực quan:
- Duyệt cổng: `ask` với các tùy chọn `[Duyệt và tiếp tục]` (recommended), `[Cần điều chỉnh]`, `[Hỏi thêm chi tiết]`.
- Sau khi duyệt G4: `ask` để người dùng chọn chiến lược thực thi mã nguồn:
  1. `Spawn Subagents`: Dispatch Task Worker ──► Task Reviewer từng task ──► Reviewer tổng (Khuyến nghị cho OMP).
  2. `Thực thi tuần tự (Inline)`: Main Agent tự thực thi và kiểm thử từng task.
  3. `Từng task có xác nhận`: Làm xong mỗi task thì dừng lại xin duyệt diff trước khi sang task kế tiếp.

### 4. Nguyên tắc Docs-First (Lưu trữ file tài liệu vật lý ra `docs/workflow/`)
CẤM CHỈ IN TÀI LIỆU TRONG CHAT. Mỗi cổng hoàn thành bắt buộc phải dùng công cụ `write` lưu file Markdown thật vào thư mục `docs/workflow/` để người dùng đọc lại, lưu trữ và theo dõi phiên bản:
- Cổng G1: `docs/workflow/specs/<tên-tính-năng>-brief.md`
- Cổng G2: `docs/workflow/specs/<tên-tính-năng>-stories.md`
- Cổng G3: `docs/workflow/architecture/<tên-tính-năng>-design.md`
- Cổng G4: `docs/workflow/plans/<tên-phân-hệ-hoặc-sprint>/roadmap.md` và từng file `tasks/task-XX-<slug>.md`.
- Product Backlog xuyên suốt workflow: `docs/workflow/product-backlog.md`, theo mẫu và quy tắc điểm trong `skill://product-workflow/references/records.md`. Ghi tính năng khi scope G1 được duyệt, liên kết AC sau G2, tasks/SP sau G4; cập nhật điểm và checkbox từ evidence trong quá trình thực thi. Không dồn chi tiết tasks vào file này.
- Thư mục sơ đồ: `docs/workflow/diagrams/<tên-sơ-đồ>.html` (xuất qua `skill://diagram-design`, tuyệt đối không dùng Mermaid)
Sau khi tạo file, thông báo đường dẫn file đã tạo để người dùng mở trong IDE xem lại, sau đó mới gọi công cụ `ask` để duyệt cổng.

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

- Không có Jira và chưa có nguồn chính khác: quản lý backlog local bằng Markdown và task cards theo hợp đồng chung. Không giả Jira key hoặc claim đồng thời; thực thi local cần phạm vi và người điều phối được ủy quyền.
- Có Jira: xác minh công cụ, scope/quyền, mapping và data coverage trước. Không bịa project key, field ID hay transition.
- Việc song song: delivery-planning xác định nhóm độc lập; task-execution kiểm tra lại trước claim. Đừng tự giao cho người chưa đồng ý.
- Nếu cần subagents, Main giữ vai trò tích hợp và quyền quyết định của người dùng; mỗi agent nhận scope riêng cùng contracts. Subagents không được tự publish/claim nếu không được ủy quyền.
- Công cụ subagent không khả dụng: làm trực tiếp; không sửa cấu hình agent toàn cục chỉ để chạy workflow.

## Cách dùng

Người dùng có thể nói “Tôi mới vào team nên làm gì tiếp”, “Bắt đầu phân tích dự án này”, “Tiếp tục từ checkpoint”, “Chia việc sprint tới”, “Tôi nhận task này”, hoặc “Xem ma trận tiến độ”.

Trong Oh My Pi, có thể gọi rõ `/skill:project-guide` khi cần định hướng, hoặc `/skill:product-workflow` khi cần điều phối công việc. Skills được khám phá lúc khởi động; sau khi mới thêm folder, mở phiên Oh My Pi mới nếu phiên hiện tại chưa thấy URI. Sáu chuyên gia chuyên sâu có `hide: true`: ẩn metadata khỏi model nhưng vẫn đọc được bằng URI; router và guide được hiển thị để người dùng dễ tiếp cận.

Không dùng `/skill:product-workflow` hay `/skill:project-guide` như tên lệnh shell. Nếu `.agents` source bị tắt hoặc skill bị filter, giải thích cấu hình đang chặn; không tự thay settings của người dùng.
