export const clientEnv = {
  NEXT_PUBLIC_WEB_SOCKET_API: (() => {
    const value = process.env.NEXT_PUBLIC_WEB_SOCKET_API;
    if (!value) throw new Error("Missing NEXT_PUBLIC_WEB_SOCKET_API");
    return value;
  })(),
  NEXT_PUBLIC_BASE_URL: (() => {
    const value = process.env.NEXT_PUBLIC_BASE_URL;
    if (!value) throw new Error("Missing NEXT_PUBLIC_BASE_URL");
    return value;
  })(),
};