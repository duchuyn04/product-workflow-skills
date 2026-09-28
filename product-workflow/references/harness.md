# Ánh xạ công cụ theo harness

Skills trong bộ này viết theo tên công cụ của Oh My Pi (OMP). Khi chạy trên harness khác, dùng công cụ tương đương dưới đây và giữ nguyên nghĩa vụ: dừng chờ duyệt, lưu tài liệu, ghi evidence, `not-run` không phải pass. Không bịa tool; không có tương đương thì làm theo cột ghi chú.

## Nhận diện harness

- Có URI `skill://`, công cụ `ask`, `task`, `browser`: Oh My Pi.
- Có `AskUserQuestion`, `Agent`, `Skill`, `Read`/`Write`/`Edit`: Claude Code.
- Harness khác: tìm công cụ cùng chức năng; không có công cụ hỏi thì hỏi trong chat rồi dừng lượt.

## `<skills-dir>`

Thư mục chứa các skill đã cài, cũng là thư mục cha của skill đang đọc. Thử theo thứ tự dự án trước, toàn cục sau:

| Harness | Dự án | Toàn cục |
|---|---|---|
| Oh My Pi | `.agents/skills/` | `~/.omp/agent/skills/` |
| Claude Code | `.claude/skills/` | `~/.claude/skills/` |

## Bảng ánh xạ

| Tên trong skills | Oh My Pi | Claude Code | Ghi chú |
|---|---|---|---|
| `skill://<tên>` | Đọc URI | `Read` file `<skills-dir>/<tên>/SKILL.md` | `skill://<tên>/references/x.md` tương ứng `<skills-dir>/<tên>/references/x.md`. Không dùng tool `Skill` để nạp chuyên gia ẩn. |
| `ask(questions=[...])` | `ask` | `AskUserQuestion` | Xem mục bên dưới. |
| `task` / subagent `reviewer`, Task Worker, Task Reviewer | `task` | `Agent` với `subagent_type: "general-purpose"`, hoặc agent tùy chỉnh trong `.claude/agents/` nếu dự án đã có | Prompt tự chứa ngữ cảnh (đường dẫn file, rubric, tiêu chí). Reviewer/auditor được dặn chỉ đọc, không sửa file. Không có công cụ subagent: chạy pass cô lập tuần tự như skill quy định. |
| `write`, `read` | `write`, `read` | `Write`/`Edit`, `Read` | |
| `browser.open`, `tab.run`, `tab.screenshot`, "Browser Native" | `browser` | MCP browser: Playwright MCP (`browser_navigate`, `browser_evaluate`, `browser_take_screenshot`) hoặc Chrome DevTools MCP (`navigate_page`, `evaluate_script`, `take_screenshot`) | Xem mục Browser. |
| `/skill:<tên>` | `/skill:<tên>` | `/<tên>` | |
| `hide: true` | Ẩn metadata khỏi model | `disable-model-invocation: true` | Model không tự gọi chuyên gia qua `Skill`; router vẫn đọc file bằng `Read`. |
| Luật dự án `AGENTS.md` | Đọc trực tiếp | `CLAUDE.md` import `@AGENTS.md` | Installer tự thêm khối import khi cài cho Claude Code. |

## `ask` trên Claude Code

- Mỗi lần gọi 1–4 câu hỏi; mỗi câu 2–4 lựa chọn; `header` tối đa 12 ký tự.
- Lựa chọn "Other" có sẵn: bỏ các option kiểu "Khác (tự nhập)" trong mẫu để còn tối đa 4 option.
- Option `recommended` đặt đầu danh sách và thêm "(Recommended)" vào label; bỏ trường `id` và `recommended`.
- Kết quả trả về ngay trong lượt. Đó là quyết định của người dùng cho đúng câu hỏi vừa hỏi; nếu người dùng bỏ qua hoặc từ chối trả lời thì dừng lượt, không tự chọn thay.
- Kế hoạch vẫn phải hiển thị trong chat trước khi gọi, như luật Bounded yêu cầu.

## Browser trên Claude Code

- Claude Code không có browser tích hợp. Dùng MCP browser đã cấu hình; nếu tool ở dạng deferred, nạp schema trước (ví dụ `ToolSearch`).
- Playwright MCP chặn `file://` theo mặc định: phục vụ thư mục chứa file qua server tĩnh cục bộ (ví dụ `python -m http.server 8765 --bind 127.0.0.1` hoặc `npx http-server`), mở `http://127.0.0.1:<port>/<file>.html` và tắt server sau khi kiểm thử. MCP khác cho phép `file:///` thì mở trực tiếp bằng đường dẫn tuyệt đối.
- Chờ ổn định trong một lần evaluate: `await document.fonts.ready; await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));` rồi đo `getBBox()`/`getComputedTextLength()` như quality gate yêu cầu.
- Không có MCP browser: ghi `not-run` kèm nguyên nhân (chưa cấu hình MCP browser). Đọc mã HTML hoặc chạy `scripts/self_check.py` không thay kiểm thử browser.
