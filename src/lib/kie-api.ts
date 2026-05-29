// Kie.ai grok-imagine image-to-image client (browser-side, user supplies key).
const BASE = "https://api.kie.ai";

export interface KieTaskResponse {
  code: number;
  msg: string;
  data?: { taskId?: string; resultJson?: string; status?: string; resultUrls?: string[]; [k: string]: any };
}

export async function uploadFileToKie(apiKey: string, file: File): Promise<string> {
  // Convert to base64 and use kie's base64 upload endpoint
  const b64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const res = await fetch(`${BASE}/api/file-base64-upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      base64Data: `data:${file.type};base64,${b64}`,
      uploadPath: "images/user-upload",
      fileName: file.name,
    }),
  });
  const json = await res.json();
  const url = json?.data?.downloadUrl || json?.data?.fileUrl || json?.data?.url;
  if (!url) throw new Error(json?.msg || "Upload failed: " + JSON.stringify(json));
  return url;
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
