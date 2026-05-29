import { createAPIFileRoute } from "@tanstack/react-start/api";

const KIE_BASE = "https://api.kie.ai";

export const APIRoute = createAPIFileRoute("/api/upload-proxy")({
  POST: async ({ request }) => {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid form data" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const file = formData.get("file") as File | null;
    if (!file) {
      return new Response(JSON.stringify({ error: "No file provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const uploadPath = (formData.get("uploadPath") as string) || "images/user-upload";

    const kieForm = new FormData();
    kieForm.append("file", file, file.name);
    kieForm.append("uploadPath", uploadPath);

    const res = await fetch(`${KIE_BASE}/api/v1/upload`, {
      method: "POST",
      headers: { Authorization: authHeader },
      body: kieForm,
    });

    const text = await res.text();
    let json: unknown;
    try {
      json = JSON.parse(text);
    } catch {
      json = { error: text };
    }

    return new Response(JSON.stringify(json), {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  },
});
