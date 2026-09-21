# Product Workflow Skills for AI Agents

Bộ kỹ năng (Agent Skills) chuẩn hóa quy trình phát triển phần mềm cho các công cụ lập trình AI như Oh My Pi, Claude Code hoặc Cursor. Bộ công cụ giúp AI làm việc theo từng giai đoạn rõ ràng:

- Làm rõ yêu cầu và quy tắc nghiệp vụ trước khi thiết kế.
- Thống nhất user stories, luồng giao diện, kiến trúc dữ liệu và hợp đồng API trước khi viết code.
- Phân rã tính năng thành các phần việc cụ thể, có kiểm chứng và lưu trữ tài liệu theo phiên bản trong thư mục `docs/workflow/`.

## Cấu trúc các kỹ năng

Hệ thống gồm một kỹ năng điều phối chung, một kỹ năng định hướng hiện trạng dự án, bảy kỹ năng chuyên môn và ba kỹ năng hỗ trợ kích hoạt theo ngữ cảnh:

<p align="center">
  <img src="docs/workflow/diagrams/skills-architecture.svg" alt="Cấu trúc các kỹ năng Product Workflow" width="100%">
</p>
<p align="center"><em>Sơ đồ cấu trúc 12 kỹ năng và cơ chế kích hoạt chuyên gia nội bộ.</em></p>

### Kỹ năng điều phối và định hướng

- `product-workflow`: Phân tích yêu cầu ban đầu, phân loại mức độ thay đổi và gọi đúng kỹ năng chuyên môn cần thiết.
- `project-guide`: Khảo sát hiện trạng codebase và tài liệu sẵn có để hỗ trợ người mới tham gia dự án xác định việc cần làm tiếp theo.

### Kỹ năng theo vai trò chuyên môn

- `product-discovery`: Làm rõ nghiệp vụ và các quy tắc cốt lõi qua tình huống thực tế, chốt tài liệu tóm tắt nghiệp vụ (brief) trước khi thiết kế.
- `story-and-experience`: Chuyển nghiệp vụ thành user stories kèm tiêu chí nghiệm thu, luồng thao tác và tùy chọn dựng bản mẫu giao diện (mockup) tương tác để xem trước.
- `solution-design`: Thiết kế giải pháp kỹ thuật, lựa chọn công nghệ, lập schema cơ sở dữ liệu kèm sơ đồ quan hệ thực thể (ERD) và chốt hợp đồng API.
- `delivery-planning`: Lập kế hoạch sprint, phân chia công việc theo vai trò, xác định thứ tự phụ thuộc và các phần việc có thể làm song song.
- `task-execution`: Triển khai mã nguồn theo từng nhiệm vụ cụ thể, viết kiểm thử đơn vị và lưu lại bằng chứng kiểm chứng.
- `delivery-inspection`: Đối chiếu tiêu chí nghiệm thu, kiểm tra chất lượng mã nguồn và xác nhận hoàn thành trước khi bàn giao.
- `diagram-design`: Vẽ sơ đồ kiến trúc, luồng xử lý và dữ liệu dưới dạng file HTML/SVG độc lập, kiểm tra hiển thị trực tiếp trên trình duyệt.

### Chuyên gia nội bộ kích hoạt theo ngữ cảnh

Ba kỹ năng này được cấu hình ẩn (`hide: true`), chỉ tự động kích hoạt khi có tình huống kỹ thuật tương ứng:

- `diagnosing-bugs`: Tự động kích hoạt khi gặp lỗi, lỗi tái xuất hiện hoặc suy giảm hiệu năng chưa rõ nguyên nhân để tìm gốc rễ vấn đề trước khi sửa.
- `codebase-design`: Tự động kích hoạt khi thay đổi chạm vào ranh giới module, cấu trúc interface hoặc khả năng kiểm thử của mã nguồn.
- `code-review`: Tự động kích hoạt sau khi hoàn thành tính năng để rà soát chất lượng code theo tiêu chuẩn dự án và độ khớp với yêu cầu.

## Các cổng kiểm soát chất lượng

Quy trình áp dụng bốn cổng kiểm soát (Gates) theo từng tính năng hoặc phân hệ, cho phép triển khai cuốn chiếu mà không cần chờ đặc tả toàn bộ sản phẩm:

<p align="center">
  <img src="docs/workflow/diagrams/quality-gates.svg" alt="Quy trình 4 Cổng kiểm soát chất lượng tuần tự" width="100%">
</p>
<p align="center"><em>Bốn cổng kiểm soát chất lượng tuần tự từ ý tưởng ban đầu đến nghiệm thu.</em></p>

- Gate G1 (Nghiệp vụ): Xác nhận mục tiêu bài toán, phạm vi tính năng và các quy tắc nghiệp vụ cốt lõi.
- Gate G2 (Stories và UX): Thống nhất tiêu chí nghiệm thu và luồng thao tác người dùng cho phần việc tiếp theo.
- Gate G3 (Kiến trúc): Phê duyệt phương án công nghệ, schema dữ liệu và hợp đồng API cần cho việc triển khai.
- Gate G4 (Sẵn sàng thực thi): Phân rã tính năng thành các nhiệm vụ cụ thể, đủ điều kiện tiên quyết và không còn vướng mắc kỹ thuật.

## Quản lý tiến độ với Product Backlog

Trong dự án sử dụng bộ skills, AI cập nhật danh mục công việc chính tại `docs/workflow/product-backlog.md` hoặc tài liệu backlog sẵn có của dự án. Mỗi hàng đại diện cho một tính năng; kế hoạch thực hiện (roadmap) liên kết đến các mã tính năng được chọn và kế hoạch sprint tương ứng.

Cấu trúc bảng gồm thứ tự ưu tiên, mã định danh, phân hệ, tên tính năng, liên kết actor/story, điểm ước lượng (Story Points), số tiêu chí nghiệm thu đạt được, trạng thái và đường dẫn bằng chứng.

- Điểm ước lượng do đội ngũ dự án phê duyệt; khi chưa ước lượng thì để trống (`—`).
- Tỷ lệ nghiệm thu phản ánh số tiêu chí (Acceptance Criteria) đã qua kiểm chứng thực tế, không tính theo số lượng file hay số lượng dòng code.
- Tính năng chỉ đánh dấu hoàn tất khi đáp ứng đầy đủ tiêu chí nghiệm thu, vượt qua khâu review và có kết quả kiểm thử tích hợp.
- Khi sử dụng hệ thống quản lý bên ngoài như Jira, tài liệu Markdown phản ánh trạng thái đồng bộ từ nguồn chính đó.

### Hồ sơ tài liệu theo quy mô công việc

- Việc sửa lỗi nhỏ hoặc thử nghiệm (Bounded / Spike): Trao đổi trực tiếp phương án trong phiên làm việc, thực hiện và kiểm chứng sau khi xác nhận, không cần sinh bộ tài liệu G1–G4.
- Tính năng mới (Feature): Áp dụng đủ các cổng G1–G4, cập nhật trực tiếp vào tài liệu phân hệ hiện có thay vì tạo file mới rời rạc.
- Nhiệm vụ nhỏ tuần tự: Ghi nhận dạng danh sách kiểm tra (checklist) kèm bằng chứng ngay trong roadmap. Nhiệm vụ lớn hoặc cần bàn giao độc lập thì lưu thành từng thẻ nhiệm vụ riêng trong thư mục `tasks/`.
- Tái sử dụng nền tảng công nghệ, hợp đồng API và sơ đồ sẵn có nếu còn phù hợp với yêu cầu mới.

## Tối ưu hóa cho Oh My Pi (OMP)

Khi chạy trong Oh My Pi, hệ thống tận dụng các tính năng có sẵn của môi trường:

- Phê duyệt cổng tương tác: Sử dụng công cụ `ask` để hiển thị menu lựa chọn trực quan tại mỗi cổng G1–G4.
- Lập kế hoạch chi tiết: Bẻ nhỏ tính năng thành các nhiệm vụ độc lập kèm đường dẫn file và tiêu chí kiểm chứng trước khi viết code.
- Lựa chọn mô hình thực thi: Sau Cổng G4, người dùng có thể chọn giao việc cho subagent độc lập (Task Worker và Task Reviewer) hoặc để main agent thực hiện tuần tự.
- Kiểm tra trực quan qua trình duyệt: Tự động mở sơ đồ HTML/SVG hoặc giao diện web trên Chromium để kiểm tra độ ổn định của font chữ, bố cục và kết nối trước khi bàn giao.

## Cài đặt

### Cách 1: Cài đặt nhanh qua `npx skills`

Chạy lệnh sau trong terminal để mở giao diện chọn skills:

```bash
npx skills@latest add duchuyn04/product-workflow-skills
```

Chọn các kỹ năng cần dùng hoặc chọn toàn bộ, sau đó nhấn Enter để hoàn tất.

Để áp dụng đầy đủ quy tắc ở cấp dự án, chạy thêm lệnh cài đặt tích hợp vào `AGENTS.md`:

```bash
npx github:duchuyn04/product-workflow-skills --project
```

Lệnh trên cài đặt đầy đủ 12 kỹ năng vào thư mục `.agents/skills/` và bổ sung khối chỉ dẫn tương ứng vào `AGENTS.md`.

Các tùy chọn cài đặt dòng lệnh:

```bash
# Cài đặt tự động toàn bộ skills
npx skills@latest add duchuyn04/product-workflow-skills -y --all

# Cài đặt toàn cục cho tài khoản máy tính
npx skills@latest add duchuyn04/product-workflow-skills -g

# Cập nhật các skills đã cài lên bản mới nhất
npx skills update
```

---

### Cách 2: Trình cài đặt kèm đồng bộ cấu hình

Chạy trực tiếp trình cài đặt:

```bash
npx github:duchuyn04/product-workflow-skills
```

Menu hiển thị hai tùy chọn:
1. `Project`: Cài vào `.agents/skills/` và đồng bộ `AGENTS.md` trong dự án hiện tại.
2. `Global`: Cài vào thư mục toàn cục `~/.omp/agent/skills/`.

Chỉ định trực tiếp qua tham số dòng lệnh:

```bash
# Cài vào dự án hiện tại
npx github:duchuyn04/product-workflow-skills --project

# Cài vào một dự án cụ thể
npx github:duchuyn04/product-workflow-skills --project ./my-project

# Cài toàn cục cho Oh My Pi
npx github:duchuyn04/product-workflow-skills --global
```

### Đóng gói và chạy bản cục bộ

Tạo gói cài đặt từ thư mục mã nguồn:

```bash
npm pack
```

Chạy gói vừa tạo mà không cần tải từ registry:

```bash
npx --yes --package ./product-workflow-skills-1.0.0.tgz product-workflow-skills
```

### Sao chép thủ công

Sao chép các thư mục kỹ năng vào `.agents/skills/` trong dự án và bổ sung chỉ dẫn từ `AGENTS.md`. Đối với cấu hình toàn cục của Oh My Pi, sao chép vào `~/.omp/agent/skills/`.

## Câu lệnh mẫu theo nhu cầu

| Nhu cầu | Câu lệnh mẫu |
|---|---|
| Định hướng dự án | "Tôi mới vào dự án, hiện tại dự án đang ở đâu và tôi nên làm gì tiếp?" |
| Phân tích nghiệp vụ | "Làm rõ nghiệp vụ xử lý trùng lặp dữ liệu và các quy tắc liên quan." |
| Viết User Stories | "Viết User Stories và đặc tả trạng thái giao diện cho màn hình tạo mới." |
| Thiết kế kiến trúc và API | "Thiết kế database schema và REST API contracts cho module này." |
| Lập kế hoạch sprint | "Chia nhỏ tính năng thành các task cụ thể để chuẩn bị triển khai." |
| Triển khai code | "Thực hiện task API đăng nhập và chạy unit test." |
| Kiểm tra tiến độ và nghiệm thu | "Xem ma trận tiến độ và kiểm tra tiêu chí hoàn thành của sprint này." |
