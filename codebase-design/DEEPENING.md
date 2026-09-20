# Deepening

How to deepen a cluster of shallow modules safely. Uses the vocabulary in [SKILL.md](SKILL.md): **module**, **interface**, **seam**, and **adapter**.

## Dependency categories

1. **In-process:** pure computation or in-memory state. Merge behind the new interface and test it directly; no adapter is needed.
2. **Local-substitutable:** dependencies with local stand-ins such as an in-memory filesystem. Test the deepened module with that stand-in; keep the seam internal.
3. **Remote but owned:** an owned service across a network. Define a port at the seam, inject an HTTP/gRPC/queue production adapter, and use an in-memory adapter in tests.
4. **True external:** a third-party system. Inject the external dependency through a port and use a controlled test adapter.

## Seam discipline

- One adapter usually means a hypothetical seam; introduce a port only when behavior really varies, commonly production plus a materially useful test adapter.
- A deep module may have private internal seams. Do not expose them through the external interface merely because tests use them.
- Dependency direction points from the deep module toward the interface it owns; transport and vendors remain adapters.

## Testing: replace, do not layer

Test observable outcomes through the deepened module's interface. Once those tests cover the behavior, remove shallow implementation tests that duplicate the same contract. Tests should survive internal refactoring; if an implementation-only change breaks them, they are testing past the interface.
