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
