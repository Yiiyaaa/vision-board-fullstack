async function fetchAsset(request, env, pathname) {
  const url = new URL(request.url)
  url.pathname = pathname
  return env.ASSETS.fetch(new Request(url, request))
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const pathname = url.pathname === '/' ? '/index.html' : url.pathname
    const response = await fetchAsset(request, env, pathname)

    if (response.status !== 404 || pathname.includes('.')) {
      return response
    }

    return fetchAsset(request, env, '/index.html')
  },
}
