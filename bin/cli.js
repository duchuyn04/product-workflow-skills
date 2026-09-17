#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { createInterface } from 'node:readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRoot = path.resolve(__dirname, '..');

const SKILLS = [
  'product-workflow',
  'project-guide',
  'product-discovery',
  'story-and-experience',
  'solution-design',
  'delivery-planning',
  'task-execution',
  'delivery-inspection',
  'diagram-design',
];

function printHelp() {
  console.log(`
Product Workflow Skills Installer

Cách dùng:
  npx github:duchuyn04/product-workflow-skills [tùy-chọn] [đường-dẫn-dự-án]
  npx product-workflow-skills [tùy-chọn] [đường-dẫn-dự-án] (sau khi publish npm)

Không có tùy chọn: chọn Project hoặc Global trong terminal tương tác.
Trong script/CI: chỉ định --project, đường dẫn dự án hoặc --global.

Tùy chọn:
  -p, --project    Cài cho dự án (mặc định thư mục hiện tại: .agents/skills/)
  -g, --global     Cài toàn cục cho Oh My Pi (~/.omp/agent/skills/)
  -f, --force      Cài lại skills; vẫn giữ quy tắc riêng trong AGENTS.md
  -h, --help       Hiển thị hướng dẫn sử dụng
  -v, --version    Xem phiên bản

Ví dụ:
  npx github:duchuyn04/product-workflow-skills
  npx github:duchuyn04/product-workflow-skills --project
  npx github:duchuyn04/product-workflow-skills --project ./my-project
  npx github:duchuyn04/product-workflow-skills --global
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

function syncAgentsMd(targetProjectRoot, packageRoot) {
  const srcAgentsPath = path.join(packageRoot, 'AGENTS.md');
  const destAgentsPath = path.join(targetProjectRoot, 'AGENTS.md');

  if (!fs.existsSync(srcAgentsPath)) return;

  const rawWorkflowContent = fs.readFileSync(srcAgentsPath, 'utf8').trim();
  const blockToInsert = `${MARKER_START}\n${rawWorkflowContent}\n${MARKER_END}`;

  if (!fs.existsSync(destAgentsPath)) {
    // Dự án chưa có AGENTS.md -> tạo mới hoàn toàn
    fs.writeFileSync(destAgentsPath, blockToInsert + '\n', 'utf8');
    console.log(`\n✓ Đã tạo mới file AGENTS.md tại thư mục gốc dự án.`);
    return;
  }

  // Dự án đã có AGENTS.md sẵn
  const existingContent = fs.readFileSync(destAgentsPath, 'utf8');

  if (existingContent.includes(MARKER_START) && existingContent.includes(MARKER_END)) {
    // Đã có block của product-workflow-skills -> cập nhật đúng block đó, giữ nguyên phần còn lại
    const regex = new RegExp(`${MARKER_START}[\\s\\S]*?${MARKER_END}`, 'g');
    const updatedContent = existingContent.replace(regex, blockToInsert);
    fs.writeFileSync(destAgentsPath, updatedContent, 'utf8');
    console.log(`\n✓ Đã cập nhật chỉ dẫn product-workflow-skills trong file AGENTS.md hiện có.`);
  } else {
    // AGENTS.md là của dự án người dùng viết từ trước -> Nối thêm vào cuối, giữ nguyên 100% nội dung của họ
    const separator = existingContent.endsWith('\n') ? '\n' : '\n\n';
    const updatedContent = existingContent + separator + blockToInsert + '\n';
    fs.writeFileSync(destAgentsPath, updatedContent, 'utf8');
    console.log(`\n✓ Đã tích hợp chỉ dẫn product-workflow-skills vào file AGENTS.md hiện có (bảo toàn toàn bộ quy tắc riêng trước đó của bạn).`);
  }
}

async function chooseInstallMode() {
  const prompt = createInterface({ input: process.stdin, output: process.stdout });
  try {
    console.log('Chọn phạm vi cài đặt:');
    console.log('  1. Project: .agents/skills/ và AGENTS.md trong dự án hiện tại');
    console.log('  2. Global: ~/.omp/agent/skills/ cho Oh My Pi');
    process.stdout.write('Lựa chọn [1/2] (Enter = Project, Ctrl+C = hủy): ');
    for await (const answer of prompt) {
      const choice = answer.trim();
      if (choice === '' || choice === '1') return 'project';
      if (choice === '2') return 'global';
      process.stdout.write('Nhập 1 cho Project hoặc 2 cho Global: ');
    }
    return null;
  } finally {
    prompt.close();
  }
}


async function run() {
  const args = process.argv.slice(2);

  let targetDir = null;
  let installMode = null;
  let isForce = false;

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
  if (!installMode) {
    if (targetDir) {
      installMode = 'project';
    } else if (process.stdin.isTTY && process.stdout.isTTY) {
      installMode = await chooseInstallMode();
      if (!installMode) {
        console.log('\nĐã hủy cài đặt; chưa ghi file.');
        process.exitCode = 130;
        return;
      }
    } else {
      throw new Error('Không có terminal tương tác. Dùng --project [đường-dẫn] hoặc --global.');
    }
  }
  const isGlobal = installMode === 'global';

  console.log('Đang cài đặt Product Workflow Skills...\n');

  let destSkillsDir = '';
  let targetProjectRoot = '';

  if (isGlobal) {
    destSkillsDir = path.join(os.homedir(), '.omp', 'agent', 'skills');
    console.log(`Chế độ: Cài đặt toàn cục`);
    console.log(`Thư mục đích: ${destSkillsDir}\n`);
  } else {
    targetProjectRoot = path.resolve(process.cwd(), targetDir || '.');
    destSkillsDir = path.join(targetProjectRoot, '.agents', 'skills');
    console.log(`Chế độ: Cài đặt theo dự án`);
    console.log(`Thư mục dự án: ${targetProjectRoot}`);
    console.log(`Thư mục skills: ${destSkillsDir}\n`);
  }

  // Sao chép từng skill
  let installedCount = 0;
  for (const skillName of SKILLS) {
    const srcSkillPath = path.join(packageRoot, skillName);
    const destSkillPath = path.join(destSkillsDir, skillName);

    if (!fs.existsSync(srcSkillPath)) {
      console.warn(`[Cảnh báo] Không tìm thấy nguồn skill: ${skillName}`);
      continue;
    }

    if (fs.existsSync(destSkillPath) && !isForce) {
      // Ghi đè cập nhật nội dung thư mục skill
      copyDirectorySync(srcSkillPath, destSkillPath);
      console.log(`✓ Đã cập nhật: ${skillName}`);
    } else {
      copyDirectorySync(srcSkillPath, destSkillPath);
      console.log(`✓ Đã cài đặt: ${skillName}`);
    }
    installedCount++;
  }

  // Với cài đặt dự án, tích hợp an toàn vào file AGENTS.md (không ghi đè mất quy tắc cũ của người dùng)
  if (!isGlobal && targetProjectRoot) {
    syncAgentsMd(targetProjectRoot, packageRoot);
  }

  console.log(`\nHoàn tất! Đã cài ${installedCount}/${SKILLS.length} skills.`);
  console.log('\nCách bắt đầu sử dụng:');
  console.log('1. Mở AI coding assistant (Oh My Pi, Claude Code, Cursor) trong dự án.');
  console.log('2. Nhập: "Tôi mới vào team, dự án đang ở đâu và nên làm gì tiếp?" hoặc gọi skill: /skill:project-guide');
  console.log('3. Hoặc điều phối công việc với: /skill:product-workflow\n');
}

run().catch((error) => {
  console.error(`Lỗi: ${error.message}`);
  process.exitCode = 1;
});
