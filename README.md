# Product Workflow Skills for AI Agents

Bộ kỹ năng (Agent Skills) hỗ trợ quy trình phát triển phần mềm từ làm rõ yêu cầu, thiết kế giải pháp đến lập trình và kiểm thử trên các AI coding harness (Oh My Pi, Claude Code, Cursor).

Thay vì để AI tự suy đoán nghiệp vụ hoặc nhảy vào viết code ngay, bộ kỹ năng này tổ chức công việc theo các vai trò rõ ràng:

- Làm rõ bài toán và quy tắc nghiệp vụ trước khi thiết kế.
- Thống nhất user stories, luồng giao diện, kiến trúc dữ liệu và hợp đồng API trước khi triển khai.
- Phân rã tính năng thành các phần việc cụ thể, có kiểm chứng và lưu lại tài liệu theo phiên bản trong `docs/workflow/`.

## Cấu trúc các kỹ năng

Hệ thống gồm một kỹ năng điều phối, một kỹ năng định hướng dự án và sáu kỹ năng chuyên môn:

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

- `product-discovery` (Phân tích nghiệp vụ): Làm rõ bài toán, phỏng vấn domain, xác định actors, các trường hợp ngoại lệ và chốt quy tắc nghiệp vụ cốt lõi (Cổng G1).
- `story-and-experience` (Thiết kế trải nghiệm người dùng): Chuyển nghiệp vụ thành user stories kèm tiêu chí nghiệm thu (Given-When-Then), danh mục màn hình và các trạng thái giao diện (Cổng G2).
- `solution-design` (Kiến trúc kỹ thuật): Đánh giá phương án công nghệ theo ràng buộc thực tế, thiết kế schema dữ liệu, hợp đồng API và ghi nhận quyết định kiến trúc qua ADR (Cổng G3).
- `delivery-planning` (Lập kế hoạch thực hiện): Phân rã tính năng thành các task nhỏ (1–4 giờ), xác định việc phụ thuộc, nhóm các task có thể làm song song và chuẩn bị sprint backlog (Cổng G4).
- `task-execution` (Thực thi code): Nhận task có kiểm soát, viết code đúng phạm vi, chạy test và thu thập bằng chứng hoàn thành theo tiêu chí nghiệm thu.
- `delivery-inspection` (Kiểm tra và nghiệm thu): Theo dõi ma trận tiến độ, kiểm tra tiêu chuẩn hoàn thành (Definition of Done), đánh giá rủi ro và điều kiện phát hành.

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

## Tối ưu hóa cho Oh My Pi (OMP)

Khi chạy trong Oh My Pi, hệ thống tự động kích hoạt các tính năng native:
- **Duyệt cổng tương tác bằng công cụ `ask`**: Thay vì phải tự gõ lệnh, terminal hiển thị menu chọn trực quan (`[Duyệt và tiếp tục]`, `[Cần điều chỉnh]`, `[Giải thích thêm]`) tại mỗi cổng G1–G4.
- **Lập kế hoạch chi tiết (Plan Mode)**: Bẻ nhỏ tính năng thành các task độc lập kèm đầy đủ file paths và tiêu chí nghiệm thu (AC) trước khi viết code.
- **Hỏi người dùng chọn mô hình Subagents**: Sau khi duyệt Cổng G4, AI dùng `ask` để bạn chọn:
  1. **Spawn Subagents (Mô hình 3 tầng)**:
     - *Task Worker*: Subagent thực thi code và kiểm thử cho từng task độc lập.
     - *Task Reviewer*: Subagent thẩm định diff ngay sau mỗi task (Spec Compliance + Code Quality).
     - *Reviewer Tổng*: Subagent kiểm tra toàn bộ git diff, chạy test tích hợp và đối chiếu Definition of Done (DoD) trước khi hoàn tất tính năng.
  2. **Thực thi tuần tự (Inline Execution)**: Main Agent tự làm từng task.
  3. **Từng task có xác nhận**: Dừng lại xin duyệt diff sau mỗi task.

## Cài đặt

### Cách 1: Cài đặt chuẩn qua npx skills

Sử dụng công cụ quản lý kỹ năng chuẩn quốc tế (`skills.sh`), hỗ trợ tự động hơn 79+ AI Coding Agents (Claude Code, Cursor, Codex, Windsurf, Cline, v.v.):

```bash
npx skills@latest add duchuyn04/product-workflow-skills
```

Các tùy chọn:

```bash
# Cài đặt toàn bộ 8 skills mà không cần chọn thủ công
npx skills@latest add duchuyn04/product-workflow-skills -y --all

# Cài đặt toàn cục (Global) cho tài khoản máy tính
npx skills@latest add duchuyn04/product-workflow-skills -g

# Cập nhật các skills đã cài lên phiên bản mới nhất
npx skills update
```

### Cách 2: Cài đặt kèm tự động tích hợp AGENTS.md

Nếu bạn muốn công cụ tự động tạo hoặc tích hợp thông minh quy trình vào file `AGENTS.md` ở thư mục gốc dự án:

```bash
npx github:duchuyn04/product-workflow-skills
```

### Cách 3: Sao chép thủ công

1. Sao chép các thư mục kỹ năng vào thư mục `.agents/skills/` trong dự án của bạn.
2. Sao chép file `AGENTS.md` vào thư mục gốc của dự án.

Nếu dùng toàn cục cho Oh My Pi, sao chép các thư mục kỹ năng vào `~/.omp/agent/skills/`.

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


