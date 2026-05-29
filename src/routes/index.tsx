import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import {
  Upload,
  Sparkles,
  Download,
  Loader2,
  X,
  Package,
} from "lucide-react";
import { SettingsDialog, getStoredApiKey } from "@/components/SettingsDialog";
import { LOW_SHIPPING_RULES, PROMPT_PRESETS } from "@/lib/meesho-presets";
import {
  createImageToImageTask,
  pollTaskUntilDone,
  uploadFileToKie,
} from "@/lib/kie-api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Meesho Catalog Optimizer — AI Image Tool for Lower Shipping" },
      {
        name: "description",
        content:
          "Transform your product photos into Meesho-ready catalog images that get the lowest shipping zone. Powered by Grok Imagine AI.",
      },
    ],
  }),
  component: Index,
});

interface RefImage {
  file?: File;
  url: string;
  uploading?: boolean;
  uploadedUrl?: string;
}

function Index() {
  const [apiKey, setApiKey] = useState("");
  const [images, setImages] = useState<RefImage[]>([]);
  const [prompt, setPrompt] = useState(PROMPT_PRESETS[0].prompt);
  const [nsfw, setNsfw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [results, setResults] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setApiKey(getStoredApiKey());
  }, []);

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files).slice(0, 5 - images.length);
    const next: RefImage[] = arr.map((f) => ({ file: f, url: URL.createObjectURL(f) }));
    setImages((prev) => [...prev, ...next].slice(0, 5));
  };

  const removeImage = (i: number) =>
    setImages((prev) => prev.filter((_, idx) => idx !== i));

  const generate = async () => {
    if (!apiKey) {
      toast.error("Add your Kie.ai API key in Settings first");
      return;
    }
    if (images.length === 0) {
      toast.error("Upload at least 1 reference image");
      return;
    }
    if (!prompt.trim()) {
      toast.error("Write a prompt");
      return;
    }
    setBusy(true);
    setResults([]);
    setStatus("Uploading images…");
    try {
      const uploaded: string[] = [];
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        if (img.uploadedUrl) {
          uploaded.push(img.uploadedUrl);
          continue;
        }
        if (!img.file) continue;
        setStatus(`Uploading image ${i + 1}/${images.length}…`);
        const url = await uploadFileToKie(apiKey, img.file);
        uploaded.push(url);
        setImages((prev) => {
          const copy = [...prev];
          copy[i] = { ...copy[i], uploadedUrl: url };
          return copy;
        });
      }
      setStatus("Submitting generation task…");
      const taskId = await createImageToImageTask(apiKey, prompt, uploaded, nsfw);
      setStatus(`Task ${taskId} queued. Generating…`);
      const urls = await pollTaskUntilDone(apiKey, taskId, (s) =>
        setStatus(`Status: ${s}…`),
      );
      setResults(urls);
      setStatus("Done!");
      toast.success(`Generated ${urls.length} catalog image${urls.length > 1 ? "s" : ""}`);
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Generation failed");
      setStatus("");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster richColors position="top-right" />

      {/* Header */}
      <header className="border-b sticky top-0 z-40 bg-background/80 backdrop-blur">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-lg bg-primary text-primary-foreground grid place-items-center font-bold">
              M
            </div>
            <div>
              <h1 className="font-bold leading-tight">Meesho Catalog Optimizer</h1>
              <p className="text-xs text-muted-foreground">
                AI product photos → lowest shipping zone
              </p>
            </div>
          </div>
          <SettingsDialog onChange={setApiKey} />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 grid lg:grid-cols-3 gap-6">
        {/* Left: Inputs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="size-5" /> Reference Images
                <Badge variant="secondary" className="ml-auto">
                  {images.length}/5
                </Badge>
              </CardTitle>
              <CardDescription>
                Upload your current Meesho catalog photo(s). Reference them in the prompt with{" "}
                <code className="bg-muted px-1 rounded">@image1</code>,{" "}
                <code className="bg-muted px-1 rounded">@image2</code>…
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  addFiles(e.dataTransfer.files);
                }}
                className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition"
              >
                <Upload className="size-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm">Drop images or click to upload</p>
                <p className="text-xs text-muted-foreground mt-1">
                  JPEG / PNG / WebP · max 10MB · up to 5 images
                </p>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="hidden"
                  onChange={(e) => addFiles(e.target.files)}
                />
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4">
                  {images.map((img, i) => (
                    <div key={i} className="relative group">
                      <img
                        src={img.url}
                        alt=""
                        className="aspect-square object-cover rounded-md border w-full"
                      />
                      <span className="absolute top-1 left-1 text-[10px] bg-black/70 text-white px-1.5 py-0.5 rounded">
                        @image{i + 1}
                      </span>
                      <button
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 size-5 grid place-items-center bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Prompt */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="size-5" /> Prompt
              </CardTitle>
              <CardDescription>
                Pick a Meesho-optimised preset or write your own.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {PROMPT_PRESETS.map((p) => (
                  <Button
                    key={p.name}
                    size="sm"
                    variant="secondary"
                    onClick={() => setPrompt(p.prompt)}
                  >
                    {p.name}
                  </Button>
                ))}
              </div>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={6}
                placeholder="Describe how the image should look…"
              />
              <div className="flex items-center gap-2">
                <Switch id="nsfw" checked={nsfw} onCheckedChange={setNsfw} />
                <Label htmlFor="nsfw" className="text-sm text-muted-foreground">
                  Disable content filter (nsfw_checker = false)
                </Label>
              </div>
              <Button
                onClick={generate}
                disabled={busy}
                size="lg"
                className="w-full"
              >
                {busy ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" /> {status || "Working…"}
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4 mr-2" /> Generate (Quality · ~$0.025 / 4 images)
                  </>
                )}
              </Button>
              {!apiKey && (
                <p className="text-xs text-destructive text-center">
                  ⚠ No API key set. Click Settings (top right).
                </p>
              )}
            </CardContent>
          </Card>

          {/* Results */}
          {results.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="size-5" /> Generated Catalog Images
                </CardTitle>
                <CardDescription>
                  Right-click → Save, or use the download button. Compress under 200KB before
                  uploading to Meesho.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-4">
                {results.map((url, i) => (
                  <div key={i} className="space-y-2">
                    <img src={url} alt="" className="w-full rounded-md border" />
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      <a href={url} download={`meesho-catalog-${i + 1}.png`} target="_blank" rel="noreferrer">
                        <Download className="size-4 mr-2" /> Download
                      </a>
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: Tips */}
        <aside className="space-y-6">
          <Card className="bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="size-5" /> Why this lowers shipping
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2 opacity-95">
              <p>
                Meesho calculates shipping using <b>volumetric weight zones</b>. The catalog
                image's perceived product size, background, and aspect ratio directly affect the
                zone class assigned at listing time.
              </p>
              <p>
                Sellers report drops from <b>₹220 → ₹80</b> just by re-uploading a clean white,
                square, tightly-cropped product shot — no product change.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Lightbulb className="size-5" /> Meesho Image Rules
              </CardTitle>
              <CardDescription>
                Compiled from Meesho Supplier Panel guidelines & seller community reports
                (Reddit r/Meesho, seller groups).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2 text-sm list-decimal pl-5">
                {MEESHO_TIPS.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Model in use</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-1">
              <p><b>grok-imagine / image-to-image</b> via Kie.ai</p>
              <p>Quality tier: <b>5 credits ≈ $0.025</b> → 4 images per generation</p>
              <p>Standard: 4 credits ≈ $0.02 → 6 images</p>
            </CardContent>
          </Card>
        </aside>
      </main>
    </div>
  );
}
