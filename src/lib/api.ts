const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001').replace(/\/$/, '')

interface ApiOptions {
  path: string
  payload: Record<string, string>
}

export async function postMailService({ path, payload }: ApiOptions) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    let message = 'No se pudo completar la solicitud.'

    try {
      const data = await response.json()
      if (typeof data.error === 'string') {
        message = data.error
      }
    } catch {
      // noop
    }

    throw new Error(message)
  }
}
