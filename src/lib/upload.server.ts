import { createServerFn } from "@tanstack/react-start";

interface UploadPayload {
  apiKey: string;
  base64: string;
  mimeType: string;
  fileName: string;
}

// Server-side proxy — runs on the server so there are no CORS issues.
// Converts the base64 payload back into a File and does a multipart upload
// to Kie.ai's API endpoint.
export const uploadToKieServer = createServerFn()
  .validator((d: unknown) => d as UploadPayload)
  .handler(async ({ data }) => {
    const { apiKey, base64, mimeType, fileName } = data;

    const buffer = Buffer.from(base64, "base64");
    const blob = new Blob([buffer], { type: mimeType });

    const form = new FormData();
    form.append("file", blob, fileName);
    form.append("uploadPath", "images/user-upload");

    const res = await fetch("https://api.kie.ai/api/v1/upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: form,
    });

    const json: any = await res.json();
    const url =
      json?.data?.downloadUrl ?? json?.data?.fileUrl ?? json?.data?.url;
    if (!url) {
      throw new Error(
        json?.msg ?? "Upload failed: " + JSON.stringify(json),
      );
    }
    return url as string;
  });
