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

const allSkills = [
  'product-workflow',
  'product-discovery',
  'product-backlog',
  'sprint-planning',
  'diagram-design',
];
const hiddenSkills = ['product-discovery', 'product-backlog', 'sprint-planning'];
const obsoleteSkills = [
  'project-guide', 'story-and-experience', 'solution-design', 'delivery-planning',
  'task-execution', 'delivery-inspection', 'diagnosing-bugs', 'codebase-design', 'code-review',
];
const claudeImport = `${start}
@AGENTS.md
${end}`;


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

test('project install places every skill and the router references in .agents/skills', t => {
  const p = project(t);
  installSuccessfully(p);

  const skillsDir = path.join(p.dir, '.agents', 'skills');
  for (const skillName of allSkills) {
    assert.ok(existsSync(path.join(skillsDir, skillName, 'SKILL.md')), `Project install must contain ${skillName}/SKILL.md`);
  }
  for (const reference of ['contract.md', 'records.md', 'harness.md']) {
    assert.ok(existsSync(path.join(skillsDir, 'product-workflow', 'references', reference)), `missing ${reference}`);
  }
  for (const obsolete of obsoleteSkills) {
    assert.ok(!existsSync(path.join(skillsDir, obsolete)), `fresh install must not create ${obsolete}`);
  }
});

test('global install places every skill in ~/.omp/agent/skills without instruction files', t => {
  const g = globalProject(t);
  const result = g.install();
  assert.equal(result.status, 0, result.error?.message || result.stderr);

  for (const skillName of allSkills) {
    assert.ok(existsSync(path.join(g.skillsDir, skillName, 'SKILL.md')), `Global install must contain ${skillName}/SKILL.md`);
  }
  assert.ok(!existsSync(path.join(g.homeDir, 'AGENTS.md')), 'Global install must not create AGENTS.md in home');
});

test('reinstall preserves user rules in AGENTS.md and keeps every skill intact', t => {
  const original = '# Team Coding Standards\nNever bypass type checks.\n';
  const p = project(t, original);
  installSuccessfully(p);

  const firstRead = p.read();
  assert.ok(firstRead.startsWith(original));

  installSuccessfully(p);
  assert.equal(p.read(), firstRead, 'Repeated install must preserve identical AGENTS.md content');

  for (const skillName of allSkills) {
    assert.ok(existsSync(path.join(p.dir, '.agents', 'skills', skillName, 'SKILL.md')));
  }
});

test('upgrade from 1.x warns about obsolete skill folders without deleting them', t => {
  const p = project(t);
  const leftover = path.join(p.dir, '.agents', 'skills', 'code-review');
  mkdirSync(leftover, { recursive: true });
  writeFileSync(path.join(leftover, 'SKILL.md'), '# My own review skill');

  const result = p.install();
  assert.equal(result.status, 0, result.error?.message || result.stderr);
  assert.match(result.stdout, /Còn thư mục của bản cũ không còn dùng: code-review/);
  assert.equal(readFileSync(path.join(leftover, 'SKILL.md'), 'utf8'), '# My own review skill');
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
  assert.match(result.stderr, /không tìm thấy thư mục nguồn skill/i);
  assert.match(result.stderr, /product-backlog|sprint-planning/, 'Installer stderr must name missing skill');
  assert.ok(!existsSync(path.join(p.dir, '.agents')), 'Installer must not create destination files when preflight fails');
});

test('package payload ships exactly the registered skills', () => {
  const packageRoot = fileURLToPath(new URL('..', import.meta.url));
  const pkg = JSON.parse(readFileSync(path.join(packageRoot, 'package.json'), 'utf8'));

  const shippedDirs = pkg.files.filter((file) => existsSync(path.join(packageRoot, file, 'SKILL.md')));
  assert.deepEqual([...shippedDirs].sort(), [...allSkills].sort(), 'package.json.files must list exactly the registered skills');
  for (const obsolete of obsoleteSkills) {
    assert.ok(!pkg.files.includes(obsolete), `package.json.files must not include ${obsolete}`);
  }
  for (const file of pkg.files) {
    assert.ok(existsSync(path.join(packageRoot, file)), `Declared package file/dir must exist: ${file}`);
  }

  const cliSource = readFileSync(cli, 'utf8');
  const registered = cliSource.match(/const SKILLS = \[([\s\S]*?)\];/)[1].match(/'([^']+)'/g).map((s) => s.slice(1, -1));
  assert.deepEqual(registered, allSkills, 'installer SKILLS must match the tested skill list');
});

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

function installedSkills(t) {
  const dir = tempDir(t, 'workflow-content-');
  assertOk(runCli(['--project', dir]));
  const skills = path.join(dir, '.agents', 'skills');
  return {
    dir,
    read: (...parts) => readFileSync(path.join(skills, ...parts), 'utf8'),
  };
}

test('installed AGENTS.md block describes the three planning gates instead of source-edit rules', t => {
  const p = project(t);
  installSuccessfully(p);
  const agents = p.read();
  assert.match(agents, /G1 Nghiệp vụ & Epic → G2 Stories & Backlog → G3 Sprint & Tasks/);
  assert.match(agents, /Mỗi lượt một cổng/);
  assert.doesNotMatch(agents, /Bounded|Browser Native|Trước khi sửa source/);
});

test('router routes the three gates to their skills and output files and never to code execution', t => {
  const s = installedSkills(t);
  const router = s.read('product-workflow', 'SKILL.md');
  for (const [gate, skill] of [
    ['G1 Nghiệp vụ & Epic', 'product-discovery'],
    ['G2 Stories & Backlog', 'product-backlog'],
    ['G3 Sprint & Tasks', 'sprint-planning'],
  ]) {
    assert.match(router, new RegExp(`\\| ${gate} \\| \`skill://${skill}\``), `${gate} must route to ${skill}`);
  }
  for (const output of [
    'docs/workflow/specs/<du-an>-brief.md',
    'docs/workflow/product-backlog.md',
    'docs/workflow/sprints/roadmap.md',
    'docs/workflow/sprints/sprint-<X>-<slug>/sprint-plan.md',
    'docs/workflow/jira-import.csv',
  ]) {
    assert.ok(router.includes(output), `router must name ${output}`);
  }
  assert.match(router, /Mỗi lượt một cổng/);
  assert.match(router, /Không viết code/);
});

test('shipped skills no longer reference removed skills or the old G4/Bounded workflow', () => {
  const packageRoot = fileURLToPath(new URL('..', import.meta.url));
  const files = [
    ...allSkills.filter((name) => name !== 'diagram-design').map((name) => path.join(name, 'SKILL.md')),
    path.join('product-workflow', 'references', 'contract.md'),
    path.join('product-workflow', 'references', 'records.md'),
    'AGENTS.md',
    path.join('bin', 'cli.js'),
  ];
  const stale = new RegExp(`\\b(?:${[...obsoleteSkills, 'G4', 'Bounded', 'Spike'].join('|')})\\b`);
  for (const file of files) {
    const content = readFileSync(path.join(packageRoot, file), 'utf8');
    const body = file.endsWith('cli.js') ? content.replace(/\/\/ Skills của bản 1\.x[\s\S]*?const OBSOLETE_SKILLS = \[[\s\S]*?\];/, '') : content;
    assert.doesNotMatch(body, stale, `${file} must not reference the removed workflow`);
  }
});

test('discovery asks for project scale, scales R1–R8 and has no mandatory subagent audit', t => {
  const s = installedSkills(t);
  const discovery = s.read('product-discovery', 'SKILL.md');

  assert.match(discovery, /"id": "project_scale"/, 'discovery must ask for the project scale first');
  for (const id of ['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8']) {
    assert.ok(discovery.includes(`**${id}.`), `discovery must define ${id}`);
  }
  assert.match(discovery, /MVP:\*\* bắt buộc R1, R2, R8/, 'MVP must only require R1, R2 and R8');
  assert.match(discovery, /EP01/, 'discovery must produce an Epic catalogue');
  assert.match(discovery, /Quản lý \+/, 'Epic names follow the Quản lý + … convention');
  assert.doesNotMatch(discovery, /Subagent|REVISE|100 câu/, 'no mandatory auditor or question quota');
  assert.match(discovery, /Bước tiếp theo duy nhất là `product-backlog` \(G2\)/);
});

test('product-backlog builds stories, the actor matrix and a ranked, sized backlog', t => {
  const s = installedSkills(t);
  const backlog = s.read('product-backlog', 'SKILL.md');
  const records = s.read('product-workflow', 'references', 'records.md');

  assert.match(backlog, /Là <actor>, tôi muốn <hành động> để <giá trị>/);
  assert.match(backlog, /Given \/ When \/ Then/);
  assert.match(backlog, /Ma trận Actor–Story/);
  assert.match(backlog, /`Highest` \/ `High` \/ `Medium` \/ `Low`/);
  assert.match(backlog, /`1, 2, 3, 5, 8, 13`/);
  assert.match(backlog, /Rank khác Priority/);
  assert.match(backlog, /Bước tiếp theo duy nhất là `sprint-planning` \(G3\)/);

  assert.match(records, /Góc nhìn 1 – Theo Epic/);
  assert.match(records, /Góc nhìn 2 – Theo Rank/);
  assert.match(records, /\| Rank \| ID \/ Epic \| User Story \|[^\n]*\| Priority \| Story Point \| Sprint \|/);
  assert.match(records, /\| Rank \| ID \| Epic \| User Story \| Priority \| Story Point \| Sprint \|/);
});

test('sprint-planning surveys the team, applies five criteria and writes named sprints with task tables', t => {
  const s = installedSkills(t);
  const planning = s.read('sprint-planning', 'SKILL.md');
  const records = s.read('product-workflow', 'references', 'records.md');

  assert.match(planning, /"id": "team_size"/, 'sprint planning must ask the team size');
  assert.match(planning, /"id": "velocity"/, 'sprint planning must ask or propose velocity');
  for (const criterion of ['Priority', 'Story Point', 'Dependency', 'Sprint Goal', 'Capacity']) {
    assert.match(planning, new RegExp(`\\*\\*${criterion}:\\*\\*`), `five criteria must include ${criterion}`);
  }
  assert.match(planning, /Không lấy máy móc N dòng đầu/);
  assert.match(planning, /`Sprint X – <Mục tiêu ngắn>`/);
  assert.match(planning, /jira-import\.csv/);

  assert.match(records, /\| Task \| Story \| Nội dung \| Vai trò \| Người phụ trách \| Phụ thuộc \|/);
  assert.match(records, /Issue Id,Issue Type,Summary,Description,Priority,Story Points,Parent Id,Sprint,Labels/);
  assert.match(records, /Không đặt tên trơ trọi `Sprint 1` hay folder `sprint-1\/`/);
});

test('contract defines exactly three gates and keeps AI numbers as proposals', t => {
  const s = installedSkills(t);
  const contract = s.read('product-workflow', 'references', 'contract.md');
  const gates = contract.match(/^\| G\d [^|]+\|/gm);
  assert.deepEqual(gates, ['| G1 Nghiệp vụ & Epic |', '| G2 Stories & Backlog |', '| G3 Sprint & Tasks |']);
  assert.match(contract, /`\(đề xuất\)`/);
});
