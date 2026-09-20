import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync, rmSync, existsSync } from 'node:fs';
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
