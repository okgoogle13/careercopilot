"""Minimal genkit.plugins shim exposing a fake googleai plugin object used in tests.

The real project expects `from genkit.plugins import googleai` and then calls
`googleai.init(...)` and uses `googleai.gemini_pro` and `googleai.GenerationConfig`.
We provide minimal objects with those attributes so tests and imports succeed.
"""

class _FakeGoogleAIPlugin:
    def __init__(self):
        self.name = "googleai"

    def init(self, api_key=None):
        # Return a simple object that represents an initialized plugin
        return self

    class GenerationConfig:
        def __init__(self, **kwargs):
            self.__dict__.update(kwargs)

    class _Model:
        async def generate(self, *args, **kwargs):
            class _Resp:
                def text(self):
                    return "{}"

                def output(self):
                    return {}

            return _Resp()

    @property
    def gemini_pro(self):
        return self._Model()


googleai = _FakeGoogleAIPlugin()
