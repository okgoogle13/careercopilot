class RateLimitExceeded(Exception):
    def __init__(self, detail='Rate limit exceeded'):
        self.detail = detail
