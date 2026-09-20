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

## 2. So sánh và lựa chọn Tech Stack (Bắt buộc dùng `ask`)

AI **TUYỆT ĐỐI KHÔNG ĐƯỢC TỰ Ý CHỌN TECH STACK TRONG ĐẦU**.
- Phân tích yêu cầu và đề xuất 2–3 phương án công nghệ khả thi kèm ưu/nhược điểm cụ thể.
- **Bắt buộc dùng công cụ `ask` của Oh My Pi** để người dùng trực tiếp bấm chọn phương án:

```text
ask(questions=[{
  "id": "tech_stack_selection",
  "question": "Bạn muốn sử dụng phương án công nghệ (Tech Stack) nào cho tính năng/dự án này?",
  "options": [
    {"label": "Phương án 1 (Khuyến nghị)", "description": "Tóm tắt stack + ưu điểm (ví dụ: Next.js + PostgreSQL)."},
    {"label": "Phương án 2 (Đơn giản / Gọn nhẹ)", "description": "Tóm tắt stack + ưu điểm (ví dụ: React Vite + Express + SQLite)."},
    {"label": "Phương án 3 (Tùy biến khác)", "description": "Người dùng tự nhập hoặc chọn stack khác."}
  ],
  "recommended": 0
}])
```

Chỉ sau khi người dùng xác nhận lựa chọn Tech Stack qua `ask`, AI mới tiến hành vẽ ranh giới, thiết kế Database Schema và API Contracts.

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

### Design lens theo ảnh hưởng kiến trúc

Khi scope thay đổi module, interface/invariants, seam, adapter, dependency direction hoặc testability, đọc `skill://codebase-design`; nếu URI chưa khám phá, đọc `.agents/skills/codebase-design/SKILL.md`. Thiếu cả hai nguồn thì nêu đúng skill/path và dừng phần thiết kế phụ thuộc, không tự bịa Design Delta.

Tiêu thụ Design Delta gồm status, module, interface, seam, adapters, invariants, caller impact, test surface và rejected abstractions. `not-needed` hợp lệ khi trigger kiến trúc đã thỏa nhưng lens không tìm thấy delta hữu ích; thay đổi đã xác nhận là cục bộ thì bỏ qua specialist. Giữ `drafted` và `needs-revalidation` là chưa sẵn sàng, không xử lý như `approved-input`. Lens này không tạo gate mới và không tự duyệt G3. Không tạo seam/adapter giả khi chỉ có một implementation và không có variation thật.

## 6. Ghi ADR cho quyết định đáng lưu

Mẫu ADR:
- Bối cảnh và yêu cầu nguồn.
- Phương án đã xét, lựa chọn đề xuất/đã duyệt.
- Lý do, đánh đổi, điều không giải quyết.
- Ảnh hưởng lên modules/contracts/operations.
- Người duyệt, revision/bằng chứng và điều kiện xem xét lại.

Không tạo ADR cho mọi lựa chọn vụn vặt. Không ghi rằng giải pháp đã triển khai khi mới thiết kế.
## Đầu ra: Lưu file tài liệu kiến trúc (Docs-First)

AI **BẮT BUỘC DÙNG CÔNG CỤ `write` TẠO FILE THẬT** tại đường dẫn:
`docs/workflow/architecture/<tên-tính-năng>-design.md`

Nội dung file bao gồm:
- Quyết định lựa chọn Tech Stack và lý do (ADR).
- Sơ đồ Kiến trúc hệ thống (System Architecture Diagram): **CẤM DÙNG MERMAID**, bắt buộc dùng `skill://diagram-design` (`type-architecture.md`) tạo file `docs/workflow/diagrams/<tên-tính-năng>-architecture.html` và chèn link vào tài liệu.
- Sơ đồ Database Schema / ER: **CẤM DÙNG MERMAID**, bắt buộc dùng `skill://diagram-design` (`type-db-schema.md` hoặc `type-er.md`) tạo file `docs/workflow/diagrams/<tên-tính-năng>-db-schema.html`.
- Chi tiết Database Schema dạng bảng/DDL (khóa chính, khóa ngoại, kiểu dữ liệu, index).
- REST/GraphQL API Contracts cụ thể kèm Sequence Diagram (dùng `type-sequence.md` qua `diagram-design` nếu có luồng auth/thanh toán phức tạp).
## Gate G3 và bàn giao (Hard-Stop)

G3 đạt cho scope khi người phụ trách kỹ thuật được chỉ định duyệt lựa chọn có ảnh hưởng, rủi ro chặn đã được giải quyết hoặc có quyết định chấp nhận rõ, contracts cần cho việc sắp làm đủ ổn định và kiểm chứng được.

*Lưu ý cốt lõi:* Việc chỉ chọn tên công nghệ (ví dụ: React + Express + SQLite) mới chỉ là 10% của G3. G3 bắt buộc phải có Database Schema chi tiết và API Contracts được lưu trữ vào file.

**Quy tắc dừng lượt bắt buộc:** Sau khi dùng công cụ `write` lưu file `docs/workflow/architecture/<tên-tính-năng>-design.md`, AI phải **DỪNG TIN NHẮN** và gọi công cụ `ask` của Oh My Pi:
- Câu hỏi: *"Tôi đã thiết kế xong Schema và API Contracts tại `docs/workflow/architecture/<tên-tính-năng>-design.md`. Bạn có duyệt tài liệu kiến trúc này (Cổng G3) để chuyển sang lập kế hoạch bẻ task Sprint (Cổng G4) không?"*
- Tùy chọn: `[Duyệt và tiếp tục]` (Recommended), `[Cần điều chỉnh Schema/API]`, `[Xem giải thích chi tiết]`.

Sau khi G3 được duyệt, bàn giao sang `delivery-planning` (G4) để phân rã task. Đây là bước tiếp theo DUY NHẤT; tuyệt đối không tự ý nhảy cóc sang `task-execution` để viết code ngay.
Khi yêu cầu đổi, trình delta và affected modules/contracts/ADRs. Chỉ phần ảnh hưởng cần duyệt lại; không tự thay toàn bộ stack hoặc tự sửa callers khi người dùng chỉ hỏi phương án.
