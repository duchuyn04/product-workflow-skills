import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync, rmSync, existsSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const cli = fileURLToPath(new URL('../bin/cli.js', import.meta.url));
const start = '<!-- BEGIN: product-workflow-skills -->';
const end = '<!-- END: product-workflow-skills -->';

function project(t, content) {
  const dir = mkdtempSync(path.join(tmpdir(), 'workflow-install-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const agents = path.join(dir, 'AGENTS.md');
  if (content !== undefined) writeFileSync(agents, content);
  return {
    dir,
    read: () => readFileSync(agents, 'utf8'),
    install: () => spawnSync(process.execPath, [cli, '--project', dir], {
      encoding: 'utf8', timeout: 30000,
    }),
  };
}
function globalProject(t) {
  const homeDir = mkdtempSync(path.join(tmpdir(), 'workflow-global-home-'));
  t.after(() => rmSync(homeDir, { recursive: true, force: true }));
  return {
    homeDir,
    skillsDir: path.join(homeDir, '.omp', 'agent', 'skills'),
    install: () => spawnSync(process.execPath, [cli, '--global'], {
      encoding: 'utf8',
      timeout: 30000,
      env: {
        ...process.env,
        HOME: homeDir,
        USERPROFILE: homeDir,
        HOMEPATH: homeDir,
      },
    }),
  };
}

function installSuccessfully(p) {
  const result = p.install();
  assert.equal(result.status, 0, result.error?.message || result.stderr);
}

test('project install creates instructions pointing to an installed router', t => {
  const p = project(t);
  installSuccessfully(p);
  const pointer = p.read().match(/`([^`]+\/product-workflow\/SKILL\.md)`/);
  assert.ok(pointer, 'installed instructions must locate the router');
  assert.ok(existsSync(path.resolve(p.dir, pointer[1])));
});

test('installed bounded workflow requires a visible proposal before approval', t => {
  const p = project(t);
  installSuccessfully(p);

  assert.match(
    p.read(),
    /trình bày Đề xuất sửa lỗi[\s\S]+sau đó mới gọi ask/,
    'installed project instructions must put the visible proposal before ask',
  );

  const router = readFileSync(
    path.join(p.dir, '.agents', 'skills', 'product-workflow', 'SKILL.md'),
    'utf8',
  );
  const proposal = router.indexOf('phải trình bày **Đề xuất sửa lỗi (Bounded)**');
  const approval = router.indexOf('Chỉ sau khi đề xuất đã hiển thị đầy đủ mới gọi `ask`');
  assert.ok(proposal >= 0, 'installed router must require a visible bounded proposal');
  assert.ok(approval > proposal, 'installed router must present the proposal before asking approval');
  assert.match(
    router,
    /không giấu kế hoạch trong `options\[\]\.description`/,
    'ask option descriptions must not become the only visible plan',
  );
});

test('installed workflow requires a Browser Native decision for web UI changes', t => {
  const p = project(t);
  installSuccessfully(p);

  assert.match(
    p.read(),
    /thay đổi giao diện web[\s\S]+gọi ask[\s\S]+Browser Native/i,
    'installed project instructions must expose the Browser Native checkpoint',
  );

  const execution = readFileSync(
    path.join(p.dir, '.agents', 'skills', 'task-execution', 'SKILL.md'),
    'utf8',
  );
  const trigger = execution.indexOf('`ui_changed = true`');
  const checkpoint = execution.indexOf('phải gọi `ask`');
  assert.ok(trigger >= 0, 'execution skill must classify user-visible web changes');
  assert.ok(checkpoint > trigger, 'execution skill must ask after detecting a web UI change');
  assert.match(
    execution,
    /chưa có lựa chọn này thì chưa được báo hoàn thành/i,
    'completion must wait for the Browser Native decision',
  );
});

test('install preserves existing rules and repeated installation is idempotent', t => {
  const original = '# Team rules\r\nKeep TypeScript strict.\r\n';
  const p = project(t, original);
  installSuccessfully(p);
  const installed = p.read();
  assert.ok(installed.startsWith(original));
  installSuccessfully(p);
  assert.equal(p.read(), installed);
});

test('upgrade replaces only the owned block, preserving both surrounding sections', t => {
  const before = '# Team rules\r\n';
  const after = '\r\n# Deployment rules\r\nRequire human approval.\r\n';
  const oldBlock = `${start}\nOld workflow payload\n${end}`;
  const p = project(t, before + oldBlock + after);
  installSuccessfully(p);
  const installed = p.read();
  assert.ok(installed.startsWith(before));
  assert.ok(installed.endsWith(after));
  assert.ok(!installed.includes('Old workflow payload'));
  assert.equal(installed.split(start).length, 2);
});

for (const [name, content] of [
  ['missing end', `${start}\nUser content`],
  ['missing start', `User content\n${end}`],
  ['reversed markers', `${end}\nUser content\n${start}`],
  ['duplicate blocks', `${start}\none\n${end}\n${start}\ntwo\n${end}`],
]) {
  test(`invalid markers (${name}) fail without changing existing rules`, t => {
    const p = project(t, content);
    const result = p.install();
    assert.equal(result.status, 1, result.error?.message || result.stderr);
    assert.equal(p.read(), content);
    assert.ok(!existsSync(path.join(p.dir, '.agents')), 'invalid markers must stop before copying skills');
  });
}

test('project install places all three hidden specialists, support files, and licenses in .agents/skills', t => {
  const p = project(t);
  installSuccessfully(p);

  const skillsDir = path.join(p.dir, '.agents', 'skills');
  const specialists = ['diagnosing-bugs', 'codebase-design', 'code-review'];

  for (const skillName of specialists) {
    const skillMdPath = path.join(skillsDir, skillName, 'SKILL.md');
    assert.ok(existsSync(skillMdPath), `Project install must contain ${skillName}/SKILL.md`);
    const content = readFileSync(skillMdPath, 'utf8');
    assert.match(content, /^hide:\s*true/m, `${skillName} must be marked hide: true`);
    assert.match(content, /^license:\s*MIT/m, `${skillName} must declare MIT license`);
    assert.ok(
      existsSync(path.join(skillsDir, skillName, 'LICENSE')),
      `Project install must contain ${skillName}/LICENSE`,
    );
  }

  // diagnosing-bugs support scripts
  assert.ok(
    existsSync(path.join(skillsDir, 'diagnosing-bugs', 'scripts', 'hitl-loop.template.sh')),
    'Project install must contain hitl-loop.template.sh',
  );

  // codebase-design reference files
  assert.ok(
    existsSync(path.join(skillsDir, 'codebase-design', 'DEEPENING.md')),
    'Project install must contain DEEPENING.md',
  );
  assert.ok(
    existsSync(path.join(skillsDir, 'codebase-design', 'DESIGN-IT-TWICE.md')),
    'Project install must contain DESIGN-IT-TWICE.md',
  );
});

test('global install places all three hidden specialists, support files, and licenses in ~/.omp/agent/skills', t => {
  const g = globalProject(t);
  const result = g.install();
  assert.equal(result.status, 0, result.error?.message || result.stderr);

  const specialists = ['diagnosing-bugs', 'codebase-design', 'code-review'];
  for (const skillName of specialists) {
    const skillMdPath = path.join(g.skillsDir, skillName, 'SKILL.md');
    assert.ok(existsSync(skillMdPath), `Global install must contain ${skillName}/SKILL.md`);
    const content = readFileSync(skillMdPath, 'utf8');
    assert.match(content, /^hide:\s*true/m, `${skillName} must be marked hide: true`);
    assert.match(content, /^license:\s*MIT/m, `${skillName} must declare MIT license`);
    assert.ok(
      existsSync(path.join(g.skillsDir, skillName, 'LICENSE')),
      `Global install must contain ${skillName}/LICENSE`,
    );
  }

  assert.ok(
    existsSync(path.join(g.skillsDir, 'diagnosing-bugs', 'scripts', 'hitl-loop.template.sh')),
    'Global install must contain hitl-loop.template.sh',
  );
  assert.ok(
    existsSync(path.join(g.skillsDir, 'codebase-design', 'DEEPENING.md')),
    'Global install must contain DEEPENING.md',
  );
  assert.ok(
    existsSync(path.join(g.skillsDir, 'codebase-design', 'DESIGN-IT-TWICE.md')),
    'Global install must contain DESIGN-IT-TWICE.md',
  );

  assert.ok(!existsSync(path.join(g.homeDir, 'AGENTS.md')), 'Global install must not create AGENTS.md in home');
});

test('reinstall preserves user rules in AGENTS.md and keeps specialist artifacts intact', t => {
  const original = '# Team Coding Standards\nNever bypass type checks.\n';
  const p = project(t, original);
  installSuccessfully(p);

  const firstRead = p.read();
  assert.ok(firstRead.startsWith(original));

  installSuccessfully(p);
  assert.equal(p.read(), firstRead, 'Repeated install must preserve identical AGENTS.md content');

  const skillsDir = path.join(p.dir, '.agents', 'skills');
  for (const skillName of ['diagnosing-bugs', 'codebase-design', 'code-review']) {
    assert.ok(existsSync(path.join(skillsDir, skillName, 'SKILL.md')));
    assert.ok(existsSync(path.join(skillsDir, skillName, 'LICENSE')));
  }
});

test('missing registered source directory exits non-zero without writing destination files', t => {
  const p = project(t);
  const fakePackageRoot = mkdtempSync(path.join(tmpdir(), 'workflow-missing-source-'));
  t.after(() => rmSync(fakePackageRoot, { recursive: true, force: true }));

  mkdirSync(path.join(fakePackageRoot, 'product-workflow'), { recursive: true });
  writeFileSync(path.join(fakePackageRoot, 'product-workflow', 'SKILL.md'), '# Product Workflow');

  const result = spawnSync(process.execPath, [cli, '--project', p.dir], {
    encoding: 'utf8',
    timeout: 30000,
    env: {
      ...process.env,
      PRODUCT_WORKFLOW_PACKAGE_ROOT: fakePackageRoot,
    },
  });

  assert.notEqual(result.status, 0, 'Installer must exit non-zero when registered skill source is missing');
  assert.match(
    result.stderr,
    /không tìm thấy thư mục nguồn skill/i,
    'Installer stderr must report missing skill source',
  );
  assert.match(
    result.stderr,
    /diagnosing-bugs|codebase-design|code-review/,
    'Installer stderr must name missing skill',
  );
  assert.ok(
    !existsSync(path.join(p.dir, '.agents')),
    'Installer must not create destination files when preflight fails',
  );
});

test('package payload includes all three specialist directories and excludes research', () => {
  const packageRoot = fileURLToPath(new URL('..', import.meta.url));
  const pkg = JSON.parse(readFileSync(path.join(packageRoot, 'package.json'), 'utf8'));

  assert.ok(pkg.files.includes('diagnosing-bugs'), 'package.json.files must include diagnosing-bugs');
  assert.ok(pkg.files.includes('codebase-design'), 'package.json.files must include codebase-design');
  assert.ok(pkg.files.includes('code-review'), 'package.json.files must include code-review');
  assert.ok(!pkg.files.includes('research'), 'package.json.files must not include research');

  for (const file of pkg.files) {
    assert.ok(existsSync(path.join(packageRoot, file)), `Declared package file/dir must exist: ${file}`);
  }

  const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const packResult = spawnSync(npmCmd, ['pack', '--dry-run', '--json'], {
    cwd: packageRoot,
    encoding: 'utf8',
    shell: process.platform === 'win32',
    timeout: 30000,
  });

  assert.equal(
    packResult.status,
    0,
    `npm pack dry-run failed with status ${packResult.status}: ${packResult.error?.message || packResult.stderr}`,
  );

  const packInfo = JSON.parse(packResult.stdout);
  const files = packInfo[0]?.files?.map((f) => f.path) || [];
  const specialistPaths = [
    'diagnosing-bugs/SKILL.md',
    'diagnosing-bugs/LICENSE',
    'diagnosing-bugs/scripts/hitl-loop.template.sh',
    'codebase-design/SKILL.md',
    'codebase-design/LICENSE',
    'codebase-design/DEEPENING.md',
    'codebase-design/DESIGN-IT-TWICE.md',
    'code-review/SKILL.md',
    'code-review/LICENSE',
  ];
  for (const sp of specialistPaths) {
    assert.ok(
      files.some((f) => f.replace(/\\/g, '/') === sp),
      `Packed payload must contain ${sp}`,
    );
  }
  assert.ok(
    !files.some((f) => f.toLowerCase().includes('research')),
    'Packed payload must not contain research',
  );
});

test('installed router wires diagnosis, design, and review triggers with matching URIs and specific skips', t => {
  const p = project(t);
  installSuccessfully(p);

  const routerContent = readFileSync(
    path.join(p.dir, '.agents', 'skills', 'product-workflow', 'SKILL.md'),
    'utf8',
  );

  // 1. Diagnosis trigger + URI + known-root-cause skip
  assert.match(
    routerContent,
    /Bug\/regression\/performance chưa có root cause chắc chắn[\s\S]*?skill:\/\/diagnosing-bugs[\s\S]*?Root cause và evidence đã rõ thì bỏ qua specialist/,
    'Router must pair unknown root cause trigger with diagnosing-bugs and known-root-cause skip',
  );

  // 2. Architecture trigger + URI + confirmed-local skip
  assert.match(
    routerContent,
    /Thay đổi module\/interface\/seam\/adapter\/dependency direction\/testability[\s\S]*?skill:\/\/codebase-design[\s\S]*?xác nhận thay đổi cục bộ không ảnh hưởng kiến trúc, bắt buộc bỏ qua specialist/,
    'Router must pair architecture impact trigger with codebase-design and confirmed-local skip',
  );

  // 3. Review trigger + URI + docs-only/low-risk skip
  assert.match(
    routerContent,
    /Sau implementation của Feature hoặc Risky Bounded[\s\S]*?skill:\/\/code-review[\s\S]*?Docs-only và Bounded rủi ro thấp theo policy hiện hữu không bị ép review hai trục/,
    'Router must pair Feature/Risky Bounded completion trigger with code-review and low-risk skip',
  );
});

test('installed code-review contract defines parallel and sequential modes, separate outputs, blocked missing inputs, and finding closure', t => {
  const p = project(t);
  installSuccessfully(p);

  const reviewContent = readFileSync(
    path.join(p.dir, '.agents', 'skills', 'code-review', 'SKILL.md'),
    'utf8',
  );

  // Parallel mode and sequential fallback
  assert.match(
    reviewContent,
    /dispatch Standards and Spec in parallel with separate context/i,
    'Code review must define parallel execution when subagents are available',
  );
  assert.match(
    reviewContent,
    /isolated sequential passes/i,
    'Code review must define sequential fallback when subagents are unavailable',
  );
  assert.match(
    reviewContent,
    /execution_mode:\s*parallel\s*\|\s*sequential/,
    'Code review output must record parallel or sequential execution mode',
  );

  // Separate Standards and Spec outputs
  assert.match(
    reviewContent,
    /Never merge, rerank, or let one axis mask the other/i,
    'Code review must prohibit merging or reranking the two axes',
  );
  assert.match(
    reviewContent,
    /standards:[\s\S]*?verdict:\s*pass\s*\|\s*changes-required\s*\|\s*blocked[\s\S]*?spec:[\s\S]*?verdict:\s*pass\s*\|\s*changes-required\s*\|\s*blocked/,
    'Code review output schema must report standards and spec verdicts separately',
  );
  assert.match(
    reviewContent,
    /Preserve both reports separately/i,
    'Code review must preserve both axis reports independently',
  );

  // Missing input blocked
  assert.match(
    reviewContent,
    /Missing a required baseline or spec source returns `?blocked`?/i,
    'Missing baseline or required spec source must result in blocked status',
  );

  // Finding closure
  assert.match(
    reviewContent,
    /material finding requires a fix followed by review of the affected axis, or an explicitly sourced accepted exception/i,
    'Material finding must require a fix and re-review or an explicitly sourced accepted exception',
  );
});

test('installed codebase-design and solution-design enforce C-SI-04 fields, status semantics, no-new-gate, and no-fake-seam', t => {
  const p = project(t);
  installSuccessfully(p);

  const skillsDir = path.join(p.dir, '.agents', 'skills');

  // codebase-design/SKILL.md contract
  const designSpecialistContent = readFileSync(
    path.join(skillsDir, 'codebase-design', 'SKILL.md'),
    'utf8',
  );

  // All C-SI-04 schema fields
  const requiredFields = [
    'status: not-needed | drafted | approved-input | needs-revalidation',
    'module:',
    'interface:',
    'seam:',
    'adapters:',
    'invariants:',
    'caller_impact:',
    'test_surface:',
    'rejected_abstractions:',
  ];
  for (const field of requiredFields) {
    assert.ok(
      designSpecialistContent.includes(field),
      `codebase-design must declare C-SI-04 schema field: ${field}`,
    );
  }

  // No-new-gate & parent authority
  assert.match(
    designSpecialistContent,
    /supplies a design lens, not a new approval gate/i,
    'codebase-design must act as a lens and not create a new approval gate',
  );
  assert.match(
    designSpecialistContent,
    /parent retains authority/i,
    'Parent workflow must retain approval authority',
  );

  // No-fake-seam
  assert.match(
    designSpecialistContent,
    /single implementation without real variation does not justify a seam or adapter/i,
    'codebase-design must prohibit creating fake seams or adapters without real variation',
  );

  // solution-design/SKILL.md consumption
  const solutionDesignContent = readFileSync(
    path.join(skillsDir, 'solution-design', 'SKILL.md'),
    'utf8',
  );

  // Consumes full delta fields
  assert.match(
    solutionDesignContent,
    /status, module, interface, seam, adapters, invariants, caller impact, test surface và rejected abstractions/,
    'solution-design must consume all C-SI-04 fields',
  );

  // Status semantics: not-needed, drafted, needs-revalidation, approved-input
  assert.match(
    solutionDesignContent,
    /`not-needed` hợp lệ khi trigger kiến trúc đã thỏa/,
    'solution-design must recognize not-needed status',
  );
  assert.match(
    solutionDesignContent,
    /Giữ `drafted` và `needs-revalidation` là chưa sẵn sàng, không xử lý như `approved-input`/,
    'solution-design must respect drafted and needs-revalidation status semantics',
  );

  // Retains parent authority and forbids fake seams
  assert.match(
    solutionDesignContent,
    /Lens này không tạo gate mới và không tự duyệt G3/,
    'solution-design must confirm design lens does not create a new gate or self-approve G3',
  );
  assert.match(
    solutionDesignContent,
    /Không tạo seam\/adapter giả khi chỉ có một implementation và không có variation thật/,
    'solution-design must prohibit fake seams or adapters',
  );
});

test('installed execution and completion gates wire two-axis review and independent browser native evidence', t => {
  const p = project(t);
  installSuccessfully(p);

  const skillsDir = path.join(p.dir, '.agents', 'skills');

  // Review input & execution contract (task-execution/SKILL.md)
  const executionContent = readFileSync(
    path.join(skillsDir, 'task-execution', 'SKILL.md'),
    'utf8',
  );
  assert.match(
    executionContent,
    /code-review/,
    'Task execution must wire code-review',
  );
  assert.match(
    executionContent,
    /Review Input Packet/,
    'Task execution must assemble Review Input Packet',
  );
  assert.match(
    executionContent,
    /baseline_revision/,
    'Task execution must capture baseline revision for review input',
  );
  assert.match(
    executionContent,
    /Risky Bounded/,
    'Task execution must define Risky Bounded triggers for review',
  );
  assert.match(
    executionContent,
    /standards[\s\S]+spec|hai trục/i,
    'Task execution must require both standards and spec review axes',
  );

  // Completion gate contract (delivery-inspection/SKILL.md)
  const inspectionContent = readFileSync(
    path.join(skillsDir, 'delivery-inspection', 'SKILL.md'),
    'utf8',
  );
  assert.match(
    inspectionContent,
    /standards[\s\S]+spec|hai trục/i,
    'Delivery inspection must verify two-axis review evidence',
  );
  assert.match(
    inspectionContent,
    /(?:missing input|trạng thái `?blocked`?|finding ảnh hưởng chưa được sửa)[\s\S]*?giữ task ở Review\/Blocked/i,
    'Delivery inspection must keep completion in Review/Blocked when inputs are missing or findings are unresolved',
  );
  assert.match(
    inspectionContent,
    /Browser Native/i,
    'Delivery inspection must maintain independent Browser Native verification',
  );
});

const allSkills = [
  'product-workflow', 'project-guide', 'product-discovery', 'story-and-experience',
  'solution-design', 'delivery-planning', 'task-execution', 'delivery-inspection',
  'diagram-design', 'diagnosing-bugs', 'codebase-design', 'code-review',
];
const hiddenSkills = [
  'product-discovery', 'story-and-experience', 'solution-design', 'delivery-planning',
  'task-execution', 'delivery-inspection', 'diagnosing-bugs', 'codebase-design', 'code-review',
];
const claudeImport = `${start}\n@AGENTS.md\n${end}`;

function tempDir(t, prefix) {
  const dir = mkdtempSync(path.join(tmpdir(), prefix));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  return dir;
}

function runCli(args, env = {}) {
  return spawnSync(process.execPath, [cli, ...args], {
    encoding: 'utf8', timeout: 30000, env: { ...process.env, ...env },
  });
}

function assertOk(result) {
  assert.equal(result.status, 0, result.error?.message || result.stderr);
}

test('claude project install places every skill in .claude/skills and wires AGENTS.md and CLAUDE.md', t => {
  const dir = tempDir(t, 'workflow-claude-');
  assertOk(runCli(['--claude', '--project', dir]));

  for (const skillName of allSkills) {
    assert.ok(existsSync(path.join(dir, '.claude', 'skills', skillName, 'SKILL.md')), `missing ${skillName}`);
  }
  assert.ok(existsSync(path.join(dir, '.claude', 'skills', 'product-workflow', 'references', 'harness.md')));
  assert.ok(!existsSync(path.join(dir, '.agents')), 'claude-only install must not create .agents');

  const agents = readFileSync(path.join(dir, 'AGENTS.md'), 'utf8');
  const pointer = agents.match(/`([^`]+\/product-workflow\/SKILL\.md)`/);
  assert.equal(pointer?.[1], '.claude/skills/product-workflow/SKILL.md');
  assert.match(agents, /AskUserQuestion/);

  assert.equal(readFileSync(path.join(dir, 'CLAUDE.md'), 'utf8'), claudeImport + '\n');
});

test('claude install appends the import to an existing CLAUDE.md and stays idempotent', t => {
  const dir = tempDir(t, 'workflow-claude-md-');
  const original = '# Team rules\r\nUse pnpm.\r\n';
  writeFileSync(path.join(dir, 'CLAUDE.md'), original);

  assertOk(runCli(['--claude', '--project', dir]));
  const installed = readFileSync(path.join(dir, 'CLAUDE.md'), 'utf8');
  assert.ok(installed.startsWith(original));
  assert.ok(installed.includes(claudeImport));

  assertOk(runCli(['--claude', '--project', dir]));
  assert.equal(readFileSync(path.join(dir, 'CLAUDE.md'), 'utf8'), installed);
});

test('claude install leaves a CLAUDE.md that already imports AGENTS.md untouched', t => {
  const dir = tempDir(t, 'workflow-claude-import-');
  const original = '# Rules\n@AGENTS.md\n';
  writeFileSync(path.join(dir, 'CLAUDE.md'), original);

  assertOk(runCli(['--claude', '--project', dir]));
  assert.equal(readFileSync(path.join(dir, 'CLAUDE.md'), 'utf8'), original);
});

test('invalid CLAUDE.md markers fail before writing skills or AGENTS.md', t => {
  const dir = tempDir(t, 'workflow-claude-bad-');
  const content = `${start}\nUser content`;
  writeFileSync(path.join(dir, 'CLAUDE.md'), content);

  const result = runCli(['--claude', '--project', dir]);
  assert.equal(result.status, 1, result.stderr);
  assert.match(result.stderr, /CLAUDE\.md có marker Product Workflow không hợp lệ/);
  assert.equal(readFileSync(path.join(dir, 'CLAUDE.md'), 'utf8'), content);
  assert.ok(!existsSync(path.join(dir, '.claude')));
  assert.ok(!existsSync(path.join(dir, 'AGENTS.md')));
});

test('--all installs both harnesses and AGENTS.md points to both routers', t => {
  const dir = tempDir(t, 'workflow-all-');
  assertOk(runCli(['--all', '--project', dir]));

  for (const root of ['.claude', '.agents']) {
    assert.ok(existsSync(path.join(dir, root, 'skills', 'product-workflow', 'SKILL.md')));
  }
  const agents = readFileSync(path.join(dir, 'AGENTS.md'), 'utf8');
  assert.match(agents, /`\.claude\/skills\/product-workflow\/SKILL\.md` \(Claude Code\) hoặc `\.agents\/skills\/product-workflow\/SKILL\.md` \(Oh My Pi\)/);
  assert.ok(existsSync(path.join(dir, 'CLAUDE.md')));
});

test('installing omp after claude keeps AGENTS.md pointing to both installed routers', t => {
  const dir = tempDir(t, 'workflow-sequential-');
  assertOk(runCli(['--claude', '--project', dir]));
  assertOk(runCli(['--omp', '--project', dir]));

  const agents = readFileSync(path.join(dir, 'AGENTS.md'), 'utf8');
  assert.ok(agents.includes('`.claude/skills/product-workflow/SKILL.md`'));
  assert.ok(agents.includes('`.agents/skills/product-workflow/SKILL.md`'));
  assert.equal(agents.split(start).length, 2);
});

test('claude global install uses ~/.claude/skills without writing instruction files', t => {
  const homeDir = tempDir(t, 'workflow-claude-home-');
  assertOk(runCli(['--claude', '--global'], { HOME: homeDir, USERPROFILE: homeDir, HOMEPATH: homeDir }));

  for (const skillName of allSkills) {
    assert.ok(existsSync(path.join(homeDir, '.claude', 'skills', skillName, 'SKILL.md')), `missing ${skillName}`);
  }
  assert.ok(!existsSync(path.join(homeDir, '.omp')));
  assert.ok(!existsSync(path.join(homeDir, 'AGENTS.md')));
  assert.ok(!existsSync(path.join(homeDir, 'CLAUDE.md')));
});

test('hidden specialists also disable model invocation while entry skills stay visible', () => {
  const packageRoot = fileURLToPath(new URL('..', import.meta.url));
  for (const skillName of allSkills) {
    const frontmatter = readFileSync(path.join(packageRoot, skillName, 'SKILL.md'), 'utf8').split('---')[1];
    const hidden = hiddenSkills.includes(skillName);
    assert.equal(/^hide:\s*true$/m.test(frontmatter), hidden, `${skillName} hide flag`);
    assert.equal(/^disable-model-invocation:\s*true$/m.test(frontmatter), hidden, `${skillName} disable-model-invocation flag`);
  }
});

test('workflow skills resolve fallbacks through <skills-dir> instead of a hardcoded .agents path', () => {
  const packageRoot = fileURLToPath(new URL('..', import.meta.url));
  const files = [
    ...allSkills.map((skillName) => path.join(skillName, 'SKILL.md')),
    path.join('product-workflow', 'references', 'contract.md'),
    path.join('product-workflow', 'references', 'records.md'),
  ];
  for (const file of files) {
    const content = readFileSync(path.join(packageRoot, file), 'utf8');
    assert.doesNotMatch(content, /(?:đọc|fallback) `\.agents\/skills\//, `${file} must not hardcode an .agents fallback`);
  }
  const harness = readFileSync(path.join(packageRoot, 'product-workflow', 'references', 'harness.md'), 'utf8');
  for (const mapping of ['AskUserQuestion', '`Agent`', 'disable-model-invocation', '.claude/skills/']) {
    assert.ok(harness.includes(mapping), `harness.md must map ${mapping}`);
  }
});

// Home tạm để một câu trả lời lệch dòng không thể cài vào thư mục home thật của người chạy test.
function runCliAsTty(t, args, { cwd, input = '' } = {}) {
  const sandbox = tempDir(t, 'workflow-tty-');
  const preload = path.join(sandbox, 'force-tty.cjs');
  writeFileSync(preload, 'process.stdin.isTTY = true;\nprocess.stdout.isTTY = true;\n');
  const result = spawnSync(process.execPath, ['--require', preload, cli, ...args], {
    cwd, input, encoding: 'utf8', timeout: 30000,
    env: { ...process.env, HOME: sandbox, USERPROFILE: sandbox, HOMEPATH: sandbox },
  });
  assert.ok(!existsSync(path.join(sandbox, '.omp')) && !existsSync(path.join(sandbox, '.claude')),
    'interactive test must not fall through to a global install');
  return result;
}

test('interactive terminal with an explicit scope keeps the old Oh My Pi install without prompting', t => {
  const dir = tempDir(t, 'workflow-tty-scope-');
  const result = runCliAsTty(t, ['--project', dir]);
  assertOk(result);
  assert.doesNotMatch(result.stdout, /Chọn harness/);
  assert.ok(existsSync(path.join(dir, '.agents', 'skills', 'product-workflow', 'SKILL.md')));
  assert.ok(!existsSync(path.join(dir, '.claude')));
});

test('fully interactive install reads both answers even when they arrive together', t => {
  const dir = tempDir(t, 'workflow-tty-menu-');
  const result = runCliAsTty(t, [], { cwd: dir, input: '2\n1\n' });
  assertOk(result);
  assert.match(result.stdout, /Chọn harness/);
  assert.match(result.stdout, /Chọn phạm vi cài đặt/);
  assert.ok(existsSync(path.join(dir, '.claude', 'skills', 'product-workflow', 'SKILL.md')));
  assert.ok(!existsSync(path.join(dir, '.agents')));
});

test('AGENTS.md block points to an existing harness mapping file', t => {
  const dir = tempDir(t, 'workflow-harness-ref-');
  assertOk(runCli(['--claude', '--project', dir]));
  const agents = readFileSync(path.join(dir, 'AGENTS.md'), 'utf8');
  const ref = agents.match(/`([^`]+\/references\/harness\.md)`/);
  assert.ok(ref, 'AGENTS.md must reference harness.md');
  assert.ok(existsSync(path.join(dir, ref[1])), `${ref[1]} must exist in the project`);
});

test('installed discovery requires scale-aware requirement coverage R1–R8 and audits it at G1', t => {
  const dir = tempDir(t, 'workflow-coverage-');
  assertOk(runCli(['--project', dir]));
  const skills = path.join(dir, '.agents', 'skills');
  const discovery = readFileSync(path.join(skills, 'product-discovery', 'SKILL.md'), 'utf8');

  const section = discovery.indexOf('Danh sách phủ yêu cầu nghiệp vụ');
  assert.ok(section >= 0, 'discovery must define the requirement coverage checklist');
  for (const id of ['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8']) {
    assert.ok(discovery.indexOf(`**${id}`, section) > section, `checklist must define ${id}`);
  }
  assert.match(discovery, /MVP[^\n]*bắt buộc R1, R2, R8/, 'MVP must only require R1, R2 and R8');
  assert.match(discovery, /\*\*5\. Phủ yêu cầu nghiệp vụ/, 'G1 rubric must score requirement coverage');
  assert.match(discovery, /Bảng phủ yêu cầu R1–R8/, 'brief template must record coverage');

  const contract = readFileSync(path.join(skills, 'product-workflow', 'references', 'contract.md'), 'utf8');
  assert.match(contract, /\| G1 Nghiệp vụ \|[^\n]*R1–R8/, 'G1 gate condition must include coverage');
});
