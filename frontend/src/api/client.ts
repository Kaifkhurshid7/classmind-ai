export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(method: string, url: string, body?: unknown, isForm = false): Promise<T> {
  const init: RequestInit = { method, headers: {} };
  if (body !== undefined) {
    if (isForm) init.body = body as FormData;
    else {
      (init.headers as Record<string, string>)['Content-Type'] = 'application/json';
      init.body = JSON.stringify(body);
    }
  }
  const res = await fetch(url, init);
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const j = await res.json();
      if (j.error) msg = j.error;
    } catch {
      /* non-JSON error body */
    }
    throw new ApiError(msg, res.status);
  }
  return (await res.json()) as T;
}

export const api = {
  get: <T>(url: string) => request<T>('GET', url),
  post: <T>(url: string, body: unknown = {}) => request<T>('POST', url, body),
  put: <T>(url: string, body: unknown) => request<T>('PUT', url, body),
  del: <T>(url: string) => request<T>('DELETE', url),
  upload: <T>(url: string, form: FormData) => request<T>('POST', url, form, true),
};
