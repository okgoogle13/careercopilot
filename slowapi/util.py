def get_remote_address(request):
    return getattr(request, 'client', None) and getattr(request.client, 'host', '127.0.0.1') or '127.0.0.1'
