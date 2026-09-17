# Product Workflow Skills for AI Agents

Bộ kỹ năng (Agent Skills) hỗ trợ quy trình phát triển phần mềm từ làm rõ yêu cầu, thiết kế giải pháp đến lập trình và kiểm thử trên các AI coding harness (Oh My Pi, Claude Code, Cursor).

Thay vì để AI tự suy đoán nghiệp vụ hoặc nhảy vào viết code ngay, bộ kỹ năng này tổ chức công việc theo các vai trò rõ ràng:

- Làm rõ bài toán và quy tắc nghiệp vụ trước khi thiết kế.
- Thống nhất user stories, luồng giao diện, kiến trúc dữ liệu và hợp đồng API trước khi triển khai.
- Phân rã tính năng thành các phần việc cụ thể, có kiểm chứng và lưu lại tài liệu theo phiên bản trong `docs/workflow/`.

## Cấu trúc các kỹ năng

Hệ thống gồm một kỹ năng điều phối, một kỹ năng định hướng dự án và bảy kỹ năng chuyên môn:

```text
                  [ Người dùng (PO, Tech Lead, Dev) ]
                                   │
                                   ▼
                   ┌───────────────────────────────┐
                   │       product-workflow        │  (Điều phối luồng công việc)
                   └───────────────┬───────────────┘
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         ▼                         ▼                         ▼
   project-guide           product-discovery        story-and-experience
 (Định hướng dự án)      (Nghiệp vụ và rules: G1)  (Stories và UX flows: G2)
         │                         │                         │
         ▼                         ▼                         ▼
  solution-design          delivery-planning          task-execution
(Kiến trúc và API: G3)    (Backlog và sprint: G4)    (Lập trình và test)
         │                                                   │
         └─────────────────────────┬─────────────────────────┘
                                   ▼
                          delivery-inspection
                         (Nghiệm thu và phát hành)
```

### Kỹ năng điều phối và định hướng

- `product-workflow`: Tiếp nhận yêu cầu của người dùng, phân tích mục đích và chỉ gọi đúng kỹ năng chuyên môn cần thiết để tiết kiệm ngữ cảnh.
- `project-guide`: Dành cho người mới tham gia dự án hoặc chưa nắm rõ hiện trạng. Kỹ năng này đọc tài liệu hiện có, tổng hợp tiến độ từng phần và đề xuất bước xử lý tiếp theo.

### Các kỹ năng theo vai trò chuyên môn

- `product-discovery` (Phân tích nghiệp vụ): Phỏng vấn nghiệp vụ chuyên sâu theo từng module bằng kỹ thuật Case Study & Cây quyết định (học hỏi từ Matt Pocock), loại bỏ câu hỏi chung chung, làm sắc bén thuật ngữ domain và chốt Business Brief rõ ràng trước khi sang Cổng G2.
- `story-and-experience` (Thiết kế trải nghiệm người dùng): Chuyển nghiệp vụ thành user stories kèm tiêu chí nghiệm thu (Given-When-Then), danh mục màn hình và các trạng thái giao diện (Cổng G2).
- `solution-design` (Kiến trúc kỹ thuật): Đánh giá phương án công nghệ theo ràng buộc thực tế, thiết kế schema dữ liệu, hợp đồng API và ghi nhận quyết định kiến trúc qua ADR (Cổng G3).
- `delivery-planning` (Lập kế hoạch thực hiện): Tạo Product Backlog dạng ma trận, ghi Story Points được duyệt, liên kết AC và task cards, xác định dependency và việc có thể làm song song (Cổng G4).
- `task-execution` (Thực thi code): Nhận task có kiểm soát, viết code đúng phạm vi, kiểm chứng và cập nhật điểm nghiệm thu cùng bằng chứng vào backlog.
- `delivery-inspection` (Kiểm tra và nghiệm thu): Đối chiếu AC, review và kiểm chứng tích hợp trước khi tích hoàn thành; báo tổng điểm và điều kiện phát hành.
- `diagram-design` (Thiết kế sơ đồ trực quan thay Mermaid): Tạo sơ đồ kiến trúc, DB schema, flow, sequence dưới dạng file HTML/SVG độc lập, hiển thị sắc nét trong `docs/workflow/diagrams/`.

## Các cổng kiểm soát chất lượng

Quy trình áp dụng bốn cổng kiểm soát (Gates) theo từng tính năng hoặc module, không bắt dự án phải dừng lại chờ đặc tả toàn bộ mới được làm:

```text
[Ý tưởng] ──► [Gate G1] ──► [Gate G2] ──► [Gate G3] ──► [Gate G4] ──► [Code và test] ──► [Hoàn thành]
              Nghiệp vụ     Stories & UX   Kiến trúc     Kế hoạch
```

- Gate G1 (Nghiệp vụ): Mục tiêu bài toán và các quy tắc nghiệp vụ cốt lõi đã được người phụ trách xác nhận.
- Gate G2 (Stories và UX): Toàn bộ tiêu chí nghiệm thu và luồng thao tác của phần tính năng tiếp theo đã thống nhất.
- Gate G3 (Kiến trúc): Công nghệ, schema dữ liệu và hợp đồng API cần cho triển khai đã được phê duyệt.
- Gate G4 (Sẵn sàng thực thi): Tính năng đã được chia thành các task cụ thể, đầy đủ điều kiện tiên quyết và không còn vướng mắc kỹ thuật.

## Product Backlog dạng ma trận

Trong dự án sử dụng skills, agent lưu ma trận tại `docs/workflow/product-backlog.md`, hoặc cập nhật backlog tương đương đã có. Mỗi hàng là một tính năng; chi tiết triển khai vẫn nằm trong các file `plans/<phân-hệ-hoặc-sprint>/tasks/task-XX-<slug>.md`.

Các cột gồm ID, phân hệ, tính năng, ưu tiên, Story Points, AC đạt/tổng, trạng thái, `[ ]` / `[x]` và liên kết stories/tasks/bằng chứng.

- Story Points là ước lượng do đội duyệt; chưa ước lượng thì ghi `—`.
- AC đạt/tổng là số tiêu chí nghiệm thu đã được kiểm chứng, không phải số tests hay tasks.
- Agent điều phối cập nhật sau mỗi kết quả task, review và kiểm chứng. Chỉ tích `[x]` khi đủ AC, review bắt buộc và kiểm chứng tích hợp; khi evidence mất hiệu lực thì bỏ tích phần ảnh hưởng và tính lại điểm.
- Tổng quan tách riêng tính năng Done, SP hoàn tất và AC đạt. Không cộng SP theo phần trăm AC hoặc dùng các tỷ lệ này làm phần trăm sản phẩm hoàn thành.
- Không có Jira thì dùng backlog local. Nếu đã chọn Jira làm nguồn chính, Markdown phản ánh trạng thái Jira và bằng chứng; mất kết nối không tự đổi nguồn. Workers cập nhật task cards, người điều phối cập nhật ma trận chung.

Đây là hướng dẫn để agent tạo backlog trong dự án đích. Cài đặt hoặc chỉnh sửa bộ skills không tự tạo backlog mẫu trong repo này.

## Tối ưu hóa cho Oh My Pi (OMP)

Khi chạy trong Oh My Pi, hệ thống tự động kích hoạt các tính năng native:
- **Duyệt cổng tương tác bằng công cụ `ask`**: Thay vì phải tự gõ lệnh, terminal hiển thị menu chọn trực quan (`[Duyệt và tiếp tục]`, `[Cần điều chỉnh]`, `[Giải thích thêm]`) tại mỗi cổng G1–G4.
- **Lập kế hoạch chi tiết (Plan Mode)**: Bẻ nhỏ tính năng thành các task độc lập kèm đầy đủ file paths và tiêu chí nghiệm thu (AC) trước khi viết code.
- **Hỏi người dùng chọn mô hình Subagents**: Sau khi duyệt Cổng G4, AI dùng `ask` để bạn chọn:
  1. **Spawn Subagents (Mô hình 3 tầng)**:
     - *Task Worker*: Thực thi trong phạm vi task, ghi evidence và bàn giao để review.
     - *Task Reviewer*: Thẩm định diff theo AC và quy ước dự án.
     - *Agent điều phối và Reviewer tổng*: Chạy/đối chiếu kiểm chứng tích hợp, cập nhật task cards, backlog và checkbox theo Definition of Done.
  2. **Thực thi tuần tự (Inline Execution)**: Main Agent tự làm từng task.
  3. **Từng task có xác nhận**: Dừng lại xin duyệt diff sau mỗi task.

- **Tích hợp Engine Browser Native (Chromium)**:
  - *Sửa mũi tên & font chữ trong Diagram*: Đợi font web nạp xong, đo chính xác bounding box thật của chữ qua DOM, nới rộng hộp node nếu chữ tràn (tiếng Việt có dấu) và nắn lại tọa độ mũi tên bám khít mép hộp mà không đâm xuyên node. Chụp ảnh màn hình ngầm để thẩm định bố cục.
  - *Đề xuất kiểm thử Web trực quan qua `ask`*: Sau khi hoàn thành task giao diện web hoặc tạo sơ đồ HTML, AI chủ động dùng `ask` hỏi bạn có muốn mở Browser Native để test web hay không, giúp kiểm tra giao diện trực quan và bắt lỗi console trước khi nghiệm thu.
## Cài đặt
### Cách 1 (Khuyên dùng): Cài đặt qua trình quản lý chuẩn quốc tế `npx skills`

Chạy lệnh sau trong terminal của bạn để mở giao diện tương tác chọn skills (giống hệt ảnh của bạn):

```bash
npx skills@latest add duchuyn04/product-workflow-skills
```

Giao diện terminal sẽ hiển thị bảng danh sách 9 skills:
- Dùng phím mũi tên `↑` `↓` để di chuyển.
- Phím `Space` để chọn hoặc bỏ chọn từng kỹ năng, hoặc chọn `Select All (0/9)`.
- Phím `Enter` để xác nhận cài đặt.

**Các tùy chọn cài đặt nhanh:**
```bash
# Cài đặt tự động toàn bộ 9 skills không cần chọn thủ công
npx skills@latest add duchuyn04/product-workflow-skills -y --all

# Cài đặt toàn cục (Global) cho tài khoản máy tính
npx skills@latest add duchuyn04/product-workflow-skills -g

# Cập nhật các skills đã cài lên phiên bản mới nhất
npx skills update
```

---

### Cách 2: Trình cài đặt kèm đồng bộ tự động `AGENTS.md`

Nếu bạn muốn cài đặt và tự động tạo hoặc tích hợp khối chỉ dẫn vào file `AGENTS.md` ở thư mục gốc dự án:

```bash
npx github:duchuyn04/product-workflow-skills
```

Installer hiển thị menu lựa chọn:
```text
1. Project: .agents/skills/ và AGENTS.md trong dự án hiện tại
2. Global: ~/.omp/agent/skills/ cho Oh My Pi
```
Nhập `1` (hoặc Enter) để cài cho Project; nhập `2` để cài Global.

Có thể chọn trực tiếp bằng cờ:
```bash
# Cài vào dự án hiện tại
npx github:duchuyn04/product-workflow-skills --project

# Cài vào một dự án khác
npx github:duchuyn04/product-workflow-skills --project ./my-project

# Cài global cho Oh My Pi
npx github:duchuyn04/product-workflow-skills --global
```
### Đóng gói và chạy bản local

Từ thư mục mã nguồn:

```bash
npm pack
```

Lệnh tạo `product-workflow-skills-<version>.tgz`. Dùng đường dẫn đến gói để chạy bản local mà không cần publish npm:

```bash
npx --yes --package ./product-workflow-skills-1.0.0.tgz product-workflow-skills
```

Có thể thêm `--project ./my-project` hoặc `--global` sau tên lệnh `product-workflow-skills`. Trong terminal tương tác, bỏ cờ để dùng menu.

Sau khi chủ sở hữu publish package lên npm, có thể gọi `npx product-workflow-skills`. `npm pack` chỉ tạo gói local, không publish hoặc cập nhật GitHub.

### Sao chép thủ công

Sao chép các thư mục kỹ năng vào `.agents/skills/` trong dự án và tích hợp chỉ dẫn từ `AGENTS.md`. Với Oh My Pi global, sao chép skills vào `~/.omp/agent/skills/`.

## Câu lệnh mẫu theo nhu cầu


| Nhu cầu                        | Câu lệnh mẫu                                                             |
| ------------------------------ | ------------------------------------------------------------------------ |
| Định hướng dự án               | "Tôi mới vào dự án, hiện tại dự án đang ở đâu và tôi nên làm gì tiếp?"   |
| Phân tích nghiệp vụ            | "Làm rõ nghiệp vụ xử lý trùng lặp dữ liệu và các quy tắc liên quan."     |
| Viết User Stories              | "Viết User Stories và đặc tả trạng thái giao diện cho màn hình tạo mới." |
| Thiết kế kiến trúc và API      | "Thiết kế database schema và REST API contracts cho module này."         |
| Lập kế hoạch sprint            | "Chia nhỏ tính năng thành các task cụ thể để chuẩn bị triển khai."       |
| Triển khai code                | "Thực hiện task API đăng nhập và chạy unit test."                        |
| Kiểm tra tiến độ và nghiệm thu | "Xem ma trận tiến độ và kiểm tra tiêu chí hoàn thành của sprint này."    |


