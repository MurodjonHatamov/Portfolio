export const BASE_URL = "http://localhost:7700";

export async function request(rest) {
  const res = await fetch(`${BASE_URL}${rest}`, {
    method: "GET",
    headers: { accept: "*/*" },
  });

  if (!res.ok) throw new Error(`Request failed: ${rest}`);

  const contentType = res.headers.get("content-type") || "";

  if (contentType.includes("application/pdf")) {
    return await res.blob(); // ✅ Blob
  }

  return await res.json(); // ✅ JSON
}

export const getMainPage = () => request("/mainpage");
export const getCvBlob = () => request("/mainpage/cv");
export const getProjects = () => request("/projects");