// Kie.ai grok-imagine image-to-image client (browser-side, user supplies key).
const BASE = "https://api.kie.ai";

export interface KieTaskResponse {
  code: number;
  msg: string;
  data?: { taskId?: string; resultJson?: string; status?: string; resultUrls?: string[]; [k: string]: any };
}

// Convert a File to a pure base64 string (no data-URL prefix).
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function uploadFileToKie(apiKey: string, file: File): Promise<string> {
  // Convert to base64 on the client, then hand off to the server function
  // which proxies to Kie.ai without CORS restrictions.
  const { uploadToKieServer } = await import("./upload.server");
  const base64 = await fileToBase64(file);
  return uploadToKieServer({
    data: { apiKey, base64, mimeType: file.type, fileName: file.name },
  });
}

export async function createImageToImageTask(
  apiKey: string,
  prompt: string,
  imageUrls: string[],
  nsfwChecker = false,
): Promise<string> {
  const res = await fetch(`${BASE}/api/v1/jobs/createTask`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "grok-imagine/image-to-image",
      input: { prompt, image_urls: imageUrls, nsfw_checker: nsfwChecker },
    }),
  });
  const json: KieTaskResponse = await res.json();
  if (json.code !== 200 || !json.data?.taskId) {
    throw new Error(json.msg || `Create task failed (${json.code})`);
  }
  return json.data.taskId;
}

export async function getTaskDetail(apiKey: string, taskId: string): Promise<KieTaskResponse> {
  const res = await fetch(`${BASE}/api/v1/jobs/recordInfo?taskId=${encodeURIComponent(taskId)}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  return res.json();
}

export async function pollTaskUntilDone(
  apiKey: string,
  taskId: string,
  onTick?: (state: string) => void,
  timeoutMs = 5 * 60 * 1000,
): Promise<string[]> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const json = await getTaskDetail(apiKey, taskId);
    const state = (json.data?.state || json.data?.status || "waiting") as string;
    onTick?.(state);
    if (state === "success" || state === "completed") {
      const raw = json.data?.resultJson;
      if (raw) {
        try {
          const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
          const urls: string[] =
            parsed.resultUrls || parsed.result_urls || parsed.images || parsed.urls || [];
          if (urls.length) return urls;
        } catch {
          // fall through
        }
      }
      if (json.data?.resultUrls?.length) return json.data.resultUrls;
      throw new Error("Task completed but no images returned");
    }
    if (state === "fail" || state === "failed" || state === "error") {
      throw new Error(json.data?.failMsg || json.msg || "Generation failed");
    }
    await new Promise((r) => setTimeout(r, 3000));
  }
  throw new Error("Timed out waiting for generation");
}
