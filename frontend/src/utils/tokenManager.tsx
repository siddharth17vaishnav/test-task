import { fetchCookie } from "./cookies";

export const loadDefaultHeaders = () => {
  const auth_token = fetchCookie("accessToken") ?? "";
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${auth_token}`,
  } as Record<string, string>;
};
export const prepareHeaders = (headers: Headers) => {
  const newHeaders = loadDefaultHeaders();
  Object.keys(newHeaders).forEach((header) => {
    headers.set(header, newHeaders[header]);
  });
  return headers;
};
