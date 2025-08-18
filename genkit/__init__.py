"""Lightweight genkit shim for local tests.

This provides a minimal subset of the genkit API used by the project so tests
can import modules that reference genkit without requiring the full external
package or cloud plugins.

This shim is intentionally small and only used during tests/CI. It should not
be relied on for production behavior.
"""
__version__ = "0.0.0-test-shim"

_plugin_registry = {}

def init(plugins=None):
    """Register plugin objects returned by plugin.init(...)."""
    if not plugins:
        return
    for p in plugins:
        name = getattr(p, "name", None) or getattr(p, "__name__", None) or "plugin"
        _plugin_registry[name] = p

def get_plugin(name: str):
    return _plugin_registry.get(name)

def flow(*_args, **_kwargs):
    """A no-op decorator used to mark genkit flows in source code."""
    import inspect
    import asyncio

    def _decorator(fn):
        # Attach an async `run` method to the function so tests can call
        # `await flow.run(...)` and patch `flow.run` as needed.
        async def run(*args, **kwargs):
            try:
                result = fn(*args, **kwargs)
                if inspect.isawaitable(result):
                    return await result
                return result
            except Exception:
                # Do not swallow exceptions; re-raise so tests and runtime
                # can see failures.
                raise

        # Preserve the original callable but expose `.run` for async usage.
        try:
            setattr(fn, "run", run)
        except Exception:
            # In the unlikely event setattr fails, ignore — the function will
            # still be returned and tests that rely on `.run` will fail fast.
            pass

        return fn

    return _decorator
