export async function request(url: string, init?: RequestInit): Promise<Response> {
    try {
        return await fetch(url, init)
    } catch (e) {
        const reason = e instanceof Error ? `: ${e.message}` : ""
        throw new Error(`Gagal menghubungi server${reason}`)
    }
}

export async function ensureSuccess(response: Response, fallback: string): Promise<void> {
    if (response.ok) return

    let body: unknown
    try {
        body = await response.json()
    } catch {
        throw new Error(fallback)
    }
    if (typeof body === "object" && body !== null && "error" in body && typeof body.error === "string") {
        throw new Error(body.error)
    }
    throw new Error(fallback)
}
