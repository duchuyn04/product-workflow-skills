#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { createInterface } from 'node:readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRoot = process.env.PRODUCT_WORKFLOW_PACKAGE_ROOT
  ? path.resolve(process.env.PRODUCT_WORKFLOW_PACKAGE_ROOT)
  : path.resolve(__dirname, '..');

const SKILLS = [
  'product-workflow',
  'product-discovery',
  'product-backlog',
  'sprint-planning',
  'diagram-design',
];

// Skills của bản 1.x đã bị gỡ hoặc đổi tên. Installer chỉ cảnh báo, không tự xóa,
// vì thư mục trùng tên (như code-review) có thể là skill riêng của người dùng.
const OBSOLETE_SKILLS = [
  'project-guide',
  'story-and-experience',
  'solution-design',
  'delivery-planning',
  'task-execution',
  'delivery-inspection',
  'diagnosing-bugs',
  'codebase-design',
  'code-review',
];

// Thư mục skills của từng harness; `project` tính từ gốc dự án, `global` tính từ thư mục home.
const HARNESSES = {
  claude: {
    label: 'Claude Code',
    project: ['.claude', 'skills'],
    global: ['.claude', 'skills'],
    command: (skill) => `/${skill}`,
  },
  omp: {
    label: 'Oh My Pi',
    project: ['.agents', 'skills'],
    global: ['.omp', 'agent', 'skills'],
    command: (skill) => `/skill:${skill}`,
  },
};

function printHelp() {
  console.log(`
Product Workflow Skills Installer

Cách dùng:
  npx github:duchuyn04/product-workflow-skills [tùy-chọn] [đường-dẫn-dự-án]
  npx product-workflow-skills [tùy-chọn] [đường-dẫn-dự-án] (sau khi publish npm)

Không có tùy chọn: chọn harness và Project/Global trong terminal tương tác.
Trong script/CI: chỉ định --project, đường dẫn dự án hoặc --global; không chọn harness thì mặc định Oh My Pi.

Phạm vi:
  -p, --project    Cài cho dự án (mặc định thư mục hiện tại)
  -g, --global     Cài toàn cục cho người dùng hiện tại

Harness:
  --omp            Oh My Pi: .agents/skills/ (dự án) hoặc ~/.omp/agent/skills/ (toàn cục)
  --claude         Claude Code: .claude/skills/ (dự án) hoặc ~/.claude/skills/ (toàn cục);
                   cài dự án sẽ thêm khối import @AGENTS.md vào CLAUDE.md
  --all            Cài cho cả Oh My Pi và Claude Code

Khác:
  -f, --force      Cài lại skills; vẫn giữ quy tắc riêng trong AGENTS.md/CLAUDE.md
  -h, --help       Hiển thị hướng dẫn sử dụng
  -v, --version    Xem phiên bản

Ví dụ:
  npx github:duchuyn04/product-workflow-skills
  npx github:duchuyn04/product-workflow-skills --project
  npx github:duchuyn04/product-workflow-skills --claude --project ./my-project
  npx github:duchuyn04/product-workflow-skills --all --project
  npx github:duchuyn04/product-workflow-skills --claude --global
`);
}

function printVersion() {
  try {
    const pkgJson = JSON.parse(
      fs.readFileSync(path.join(packageRoot, 'package.json'), 'utf8')
    );
    console.log(`v${pkgJson.version}`);
  } catch {
    console.log('v1.0.0');
  }
}

function copyDirectorySync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectorySync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
const MARKER_START = '<!-- BEGIN: product-workflow-skills -->';
const MARKER_END = '<!-- END: product-workflow-skills -->';

// Chặn trước khi ghi bất kỳ file nào nếu marker của file chỉ dẫn bị hỏng.
function assertValidMarkers(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  const starts = content.split(MARKER_START).length - 1;
  const ends = content.split(MARKER_END).length - 1;
  if (starts !== ends || starts > 1 ||
      (starts === 1 && content.indexOf(MARKER_END) < content.indexOf(MARKER_START))) {
    throw new Error(`${path.basename(filePath)} có marker Product Workflow không hợp lệ; giữ nguyên file, cần sửa marker trước khi cài lại.`);
  }
}

// Tạo file, thay đúng khối có marker, hoặc nối khối vào cuối; không đụng nội dung ngoài khối.
function upsertMarkedBlock(filePath, block) {
  const fileName = path.basename(filePath);

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, block + '\n', 'utf8');
    console.log(`✓ Đã tạo mới file ${fileName} tại thư mục gốc dự án.`);
    return;
  }

  assertValidMarkers(filePath);
  const existingContent = fs.readFileSync(filePath, 'utf8');

  if (existingContent.includes(MARKER_START)) {
    const regex = new RegExp(`${MARKER_START}[\\s\\S]*?${MARKER_END}`, 'g');
    fs.writeFileSync(filePath, existingContent.replace(regex, block), 'utf8');
    console.log(`✓ Đã cập nhật chỉ dẫn product-workflow-skills trong file ${fileName} hiện có.`);
  } else {
    const separator = existingContent.endsWith('\n') ? '\n' : '\n\n';
    fs.writeFileSync(filePath, existingContent + separator + block + '\n', 'utf8');
    console.log(`✓ Đã tích hợp chỉ dẫn product-workflow-skills vào file ${fileName} hiện có (bảo toàn toàn bộ quy tắc riêng trước đó của bạn).`);
  }
}

function syncAgentsMd(targetProjectRoot) {
  // Trỏ tới mọi router đang được cài trong dự án, kể cả bản của lần cài trước cho harness khác.
  const routers = Object.values(HARNESSES)
    .map((harness) => ({
      label: harness.label,
      path: [...harness.project, 'product-workflow', 'SKILL.md'].join('/'),
    }))
    .filter((router) => fs.existsSync(path.join(targetProjectRoot, router.path)));
  const refs = (file) => routers.length === 1
    ? `\`${routers[0].path.replace(/SKILL\.md$/, file)}\``
    : routers.map((router) => `\`${router.path.replace(/SKILL\.md$/, file)}\` (${router.label})`).join(' hoặc ');
  const routerRefs = refs('SKILL.md');
  const harnessRefs = refs('references/harness.md');

  const block = `${MARKER_START}
## Product Workflow
- Khi phân tích yêu cầu, xác định Epic/actors, viết User Stories, lập Product Backlog hoặc chia sprint và task, đọc ${routerRefs} trước. Glob/liệt kê đường dẫn không thay cho đọc nội dung.
- Quy trình có 3 cổng: G1 Nghiệp vụ & Epic → G2 Stories & Backlog → G3 Sprint & Tasks. Mỗi lượt một cổng: lưu tài liệu vào docs/workflow/, tóm tắt trong chat, gọi ask và chờ duyệt. "OK" chỉ duyệt cổng vừa trình bày.
- Priority, Story Point, Rank và phân sprint do AI đưa ra là đề xuất cho đến khi được duyệt. Không bịa actors, capacity hay tên thành viên.
- Tên công cụ trong skills theo Oh My Pi (ask, task, browser, skill://). Harness khác dùng công cụ tương đương trong ${harnessRefs}; Claude Code: ask → AskUserQuestion, task → Agent.
- Không đọc được skill: báo thiếu cấu hình. Giữ rules riêng của dự án; nêu rõ xung đột và chờ quyết định.
${MARKER_END}`;

  upsertMarkedBlock(path.join(targetProjectRoot, 'AGENTS.md'), block);
}

// Claude Code bỏ qua AGENTS.md khi dự án có CLAUDE.md, nên CLAUDE.md phải import AGENTS.md.
function syncClaudeMd(targetProjectRoot) {
  const claudePath = path.join(targetProjectRoot, 'CLAUDE.md');
  const agentsPath = path.join(targetProjectRoot, 'AGENTS.md');

  if (fs.existsSync(claudePath)) {
    if (fs.realpathSync(claudePath) === fs.realpathSync(agentsPath)) {
      console.log('✓ CLAUDE.md trỏ tới AGENTS.md; không cần thêm import.');
      return;
    }
    const content = fs.readFileSync(claudePath, 'utf8');
    if (!content.includes(MARKER_START) && /^\s*@(\.\/)?AGENTS\.md\s*$/m.test(content)) {
      console.log('✓ CLAUDE.md đã import @AGENTS.md; giữ nguyên.');
      return;
    }
  }

  upsertMarkedBlock(claudePath, `${MARKER_START}\n@AGENTS.md\n${MARKER_END}`);
}

// Một readline dùng chung cho mọi câu hỏi để không mất các dòng người dùng đã gõ hoặc dán sẵn.
let promptReader = null;

function closePrompt() {
  promptReader?.rl.close();
  promptReader = null;
}

async function promptChoice(lines, question, retry, choices) {
  if (!promptReader) {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    promptReader = { rl, lines: rl[Symbol.asyncIterator]() };
  }
  for (const line of lines) console.log(line);
  process.stdout.write(question);
  for (;;) {
    const { value, done } = await promptReader.lines.next();
    if (done) return null;
    const choice = value.trim();
    if (choice in choices) return choices[choice];
    process.stdout.write(retry);
  }
}

function chooseHarnesses() {
  return promptChoice(
    [
      'Chọn harness:',
      '  1. Oh My Pi',
      '  2. Claude Code',
      '  3. Cả hai',
    ],
    'Lựa chọn [1/2/3] (Enter = Oh My Pi, Ctrl+C = hủy): ',
    'Nhập 1, 2 hoặc 3: ',
    { '': ['omp'], '1': ['omp'], '2': ['claude'], '3': ['claude', 'omp'] },
  );
}

function chooseInstallMode() {
  return promptChoice(
    [
      'Chọn phạm vi cài đặt:',
      '  1. Project: thư mục skills và file chỉ dẫn trong dự án hiện tại',
      '  2. Global: thư mục skills toàn cục của người dùng',
    ],
    'Lựa chọn [1/2] (Enter = Project, Ctrl+C = hủy): ',
    'Nhập 1 cho Project hoặc 2 cho Global: ',
    { '': 'project', '1': 'project', '2': 'global' },
  );
}

function cancelInstall() {
  console.log('\nĐã hủy cài đặt; chưa ghi file.');
  process.exitCode = 130;
}

async function run() {
  const args = process.argv.slice(2);

  let targetDir = null;
  let installMode = null;
  let isForce = false;
  let harnesses = new Set();

  for (const arg of args) {
    if (arg === '-h' || arg === '--help') {
      printHelp();
      return;
    }
    if (arg === '-v' || arg === '--version') {
      printVersion();
      return;
    }
    if (arg === '-g' || arg === '--global' || arg === '-p' || arg === '--project') {
      const requestedMode = arg === '-g' || arg === '--global' ? 'global' : 'project';
      if (installMode && installMode !== requestedMode) {
        throw new Error('Chỉ chọn một phạm vi: --project hoặc --global.');
      }
      installMode = requestedMode;
      continue;
    }
    if (arg === '--claude' || arg === '--omp') {
      harnesses.add(arg.slice(2));
      continue;
    }
    if (arg === '--all') {
      harnesses = new Set(['claude', 'omp']);
      continue;
    }
    if (arg === '-f' || arg === '--force') {
      isForce = true;
      continue;
    }
    if (!arg.startsWith('-') && !targetDir) {
      targetDir = arg;
    }
  }

  if (targetDir && installMode === 'global') {
    throw new Error('Đường dẫn dự án không áp dụng cho --global.');
  }
  const interactive = process.stdin.isTTY && process.stdout.isTTY;
  // Chỉ hỏi harness khi chạy không tham số; lệnh có sẵn phạm vi giữ hành vi cũ (mặc định Oh My Pi).
  const fullyInteractive = interactive && !installMode && !targetDir;
  try {
    if (harnesses.size === 0) {
      if (fullyInteractive) {
        const chosen = await chooseHarnesses();
        if (!chosen) return cancelInstall();
        harnesses = new Set(chosen);
      } else {
        harnesses.add('omp');
      }
    }
    if (!installMode) {
      if (targetDir) {
        installMode = 'project';
      } else if (interactive) {
        installMode = await chooseInstallMode();
        if (!installMode) return cancelInstall();
      } else {
        throw new Error('Không có terminal tương tác. Dùng --project [đường-dẫn] hoặc --global.');
      }
    }
  } finally {
    closePrompt();
  }
  const isGlobal = installMode === 'global';
  const selected = Object.keys(HARNESSES).filter((key) => harnesses.has(key));

  // Preflight: mọi thư mục nguồn đã đăng ký bắt buộc phải tồn tại trước khi ghi bất kỳ file/thư mục đích nào
  const missingSkills = SKILLS.filter((skillName) => {
    const srcPath = path.join(packageRoot, skillName);
    return !fs.existsSync(srcPath) || !fs.statSync(srcPath).isDirectory();
  });
  if (missingSkills.length > 0) {
    throw new Error(`Không tìm thấy thư mục nguồn skill: ${missingSkills.join(', ')}`);
  }

  const targetProjectRoot = isGlobal ? '' : path.resolve(process.cwd(), targetDir || '.');
  if (!isGlobal) {
    assertValidMarkers(path.join(targetProjectRoot, 'AGENTS.md'));
    if (harnesses.has('claude')) {
      assertValidMarkers(path.join(targetProjectRoot, 'CLAUDE.md'));
    }
  }

  console.log('Đang cài đặt Product Workflow Skills...\n');
  console.log(`Chế độ: ${isGlobal ? 'Cài đặt toàn cục' : 'Cài đặt theo dự án'}`);
  if (!isGlobal) console.log(`Thư mục dự án: ${targetProjectRoot}`);

  for (const key of selected) {
    const harness = HARNESSES[key];
    const destSkillsDir = isGlobal
      ? path.join(os.homedir(), ...harness.global)
      : path.join(targetProjectRoot, ...harness.project);
    console.log(`\n[${harness.label}] Thư mục skills: ${destSkillsDir}`);

    for (const skillName of SKILLS) {
      const destSkillPath = path.join(destSkillsDir, skillName);
      const existed = fs.existsSync(destSkillPath) && !isForce;
      copyDirectorySync(path.join(packageRoot, skillName), destSkillPath);
      console.log(`✓ ${existed ? 'Đã cập nhật' : 'Đã cài đặt'}: ${skillName}`);
    }

    const leftovers = OBSOLETE_SKILLS.filter((skillName) => fs.existsSync(path.join(destSkillsDir, skillName)));
    if (leftovers.length > 0) {
      console.log(`! Còn thư mục của bản cũ không còn dùng: ${leftovers.join(', ')}.`);
      console.log(`  Installer không tự xóa; nếu đó không phải skill riêng của bạn, hãy xóa thủ công trong ${destSkillsDir}.`);
    }
  }

  // Với cài đặt dự án, tích hợp an toàn vào file chỉ dẫn (không ghi đè mất quy tắc cũ của người dùng)
  if (!isGlobal) {
    console.log('');
    syncAgentsMd(targetProjectRoot);
    if (harnesses.has('claude')) {
      syncClaudeMd(targetProjectRoot);
    }
  }

  const labels = selected.map((key) => HARNESSES[key].label).join(' và ');
  console.log(`\nHoàn tất! Đã cài ${SKILLS.length}/${SKILLS.length} skills cho ${labels}.`);
  console.log('\nCách bắt đầu sử dụng:');
  for (const key of selected) {
    const harness = HARNESSES[key];
    console.log(`- ${harness.label}: mở phiên mới trong dự án, gọi ${harness.command('product-workflow')} để bắt đầu.`);
  }
  console.log('- Hoặc nói tự nhiên: "Phân tích yêu cầu sau, lập product backlog và chia sprint giúp tôi."\n');
}

run().catch((error) => {
  console.error(`Lỗi: ${error.message}`);
  process.exitCode = 1;
});
