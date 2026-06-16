const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/v1";

export async function api<T = unknown>(
  path: string,
  init: RequestInit = {},
  token?: string
): Promise<T> {
  const url = `${BASE}${path}`;

  console.log("BASE =", BASE);
  console.log("URL =", url);
  console.log("TOKEN EXISTS =", !!token);

  try {
    const res = await fetch(url, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init.headers,
      },
      cache: "no-store",
    });

    console.log("STATUS =", res.status);

    if (!res.ok) {
      const text = await res.text();
      console.error("API ERROR =", text);
      throw new Error(text);
    }

    return res.json();
  } catch (err) {
    console.error("FETCH FAILED =", err);
    throw err;
  }
}