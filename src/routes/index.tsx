import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import {
  Upload,
  Sparkles,
  Download,
  Loader2,
  X,
  CheckCircle2,
  IndianRupee,
  ImagePlus,
  ArrowRight,
} from "lucide-react";
import { SettingsDialog, getStoredApiKey } from "@/components/SettingsDialog";
import { LOW_SHIPPING_RULES, PROMPT_PRESETS, MEESHO_ZONE_A_CHECKLIST } from "@/lib/meesho-presets";
import {
  createImageToImageTask,
  pollTaskUntilDone,
  uploadFileToKie,
} from "@/lib/kie-api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Meesho Catalog Optimizer — Lowest Delivery Charge" },
      {
        name: "description",
        content:
          "Turn your product photos into Meesho Zone-A catalog images and pay the lowest possible delivery charge. Powered by AI.",
      },
    ],
  }),
  component: Index,
});

interface RefImage {
  file?: File;
  url: string;
  uploadedUrl?: string;
}

function Index() {
  const [apiKey, setApiKey] = useState("");
  const [images, setImages] = useState<RefImage[]>([]);
  const [userIntent, setUserIntent] = useState(PROMPT_PRESETS[0].prompt);
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
      toast.error("Upload at least 1 product image");
      return;
    }
    if (!userIntent.trim()) {
      toast.error("Describe what you want done with the product");
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
        setStatus(`Uploading image ${i + 1} of ${images.length}…`);
        const url = await uploadFileToKie(apiKey, img.file);
        uploaded.push(url);
        setImages((prev) => {
          const copy = [...prev];
          copy[i] = { ...copy[i], uploadedUrl: url };
          return copy;
        });
      }
      setStatus("Submitting generation task…");
      const finalPrompt = `${LOW_SHIPPING_RULES}\n${userIntent.trim()}`;
      const taskId = await createImageToImageTask(apiKey, finalPrompt, uploaded, false);
      setStatus("Generating… this takes about 30–60 seconds");
      const urls = await pollTaskUntilDone(apiKey, taskId, (s) =>
        setStatus(`AI is working: ${s}…`),
      );
      setResults(urls);
      setStatus("Done!");
      toast.success(`${urls.length} Zone-A catalog image${urls.length > 1 ? "s" : ""} ready!`);
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Generation failed");
      setStatus("");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/60 to-background">
      <Toaster richColors position="top-right" />

      {/* Header */}
      <header className="border-b sticky top-0 z-40 bg-white/90 backdrop-blur">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-rose-500 text-white grid place-items-center font-bold text-lg">
              M
            </div>
            <div>
              <h1 className="font-bold leading-tight text-base">Meesho Catalog Optimizer</h1>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <IndianRupee className="size-3" />
                Minimum delivery charge — Zone A images
              </p>
            </div>
          </div>
          <SettingsDialog onChange={setApiKey} />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl space-y-5">

        {/* Goal Banner */}
        <div className="rounded-xl bg-rose-500 text-white p-4 flex items-start gap-3">
          <IndianRupee className="size-5 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-sm">Goal: Lowest possible delivery charge on Meesho</p>
            <p className="text-xs text-rose-100 mt-0.5">
              Every image generated automatically follows all Meesho Zone-A rules — pure white
              background, 1:1 square, no text, single product, correct framing. You just describe
              what you want done with your product.
            </p>
          </div>
        </div>

        {/* Zone-A Rules Checklist */}
        <Card className="border-green-200 bg-green-50/60">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm text-green-800 flex items-center gap-2">
              <CheckCircle2 className="size-4 text-green-600" />
              Auto-applied rules for Zone A (always enforced)
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
              {MEESHO_ZONE_A_CHECKLIST.map((rule) => (
                <li key={rule} className="flex items-center gap-1.5 text-xs text-green-800">
                  <CheckCircle2 className="size-3 text-green-500 shrink-0" />
                  {rule}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Step 1: Upload */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <span className="size-6 rounded-full bg-rose-500 text-white text-xs grid place-items-center font-bold shrink-0">1</span>
              Upload your product photo(s)
              <Badge variant="secondary" className="ml-auto text-xs">
                {images.length}/5
              </Badge>
            </CardTitle>
            <CardDescription className="text-xs">
              Reference them in your description as <code className="bg-muted px-1 rounded">@image1</code>, <code className="bg-muted px-1 rounded">@image2</code>, etc.
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
              className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <ImagePlus className="size-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium">Drop images here or click to browse</p>
              <p className="text-xs text-muted-foreground mt-1">
                JPEG · PNG · WebP — up to 5 images
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
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 mt-3">
                {images.map((img, i) => (
                  <div key={i} className="relative group aspect-square">
                    <img
                      src={img.url}
                      alt=""
                      className="w-full h-full object-cover rounded-lg border"
                    />
                    <span className="absolute bottom-1 left-1 text-[9px] bg-black/70 text-white px-1 py-0.5 rounded font-mono">
                      @image{i + 1}
                    </span>
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 size-5 grid place-items-center bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Step 2: Describe intent */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <span className="size-6 rounded-full bg-rose-500 text-white text-xs grid place-items-center font-bold shrink-0">2</span>
              What do you want done with your product?
            </CardTitle>
            <CardDescription className="text-xs">
              Pick a category shortcut below, then edit if needed. Meesho Zone-A rules are applied automatically — just focus on your product.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Category presets */}
            <div className="flex flex-wrap gap-1.5">
              {PROMPT_PRESETS.map((p) => (
                <button
                  key={p.name}
                  onClick={() => setUserIntent(p.prompt)}
                  className={`inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-full border transition-colors ${
                    userIntent === p.prompt
                      ? "bg-rose-500 text-white border-rose-500"
                      : "bg-white text-foreground border-border hover:bg-muted"
                  }`}
                >
                  <span>{p.emoji}</span> {p.name}
                </button>
              ))}
            </div>

            <Textarea
              value={userIntent}
              onChange={(e) => setUserIntent(e.target.value)}
              rows={4}
              placeholder="e.g. Keep the product in @image1 exactly the same. Only remove the background."
              className="text-sm resize-none"
            />

            <p className="text-xs text-muted-foreground flex items-start gap-1">
              <CheckCircle2 className="size-3 mt-0.5 text-green-500 shrink-0" />
              Meesho rules (white bg, 1:1 square, no text, single product…) are always added automatically on top of your description.
            </p>
          </CardContent>
        </Card>

        {/* Step 3: Generate */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <span className="size-6 rounded-full bg-rose-500 text-white text-xs grid place-items-center font-bold shrink-0">3</span>
              Generate Zone-A catalog image
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!apiKey && (
              <div className="text-xs text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                No Kie.ai API key set — click <strong>Settings</strong> (top right) to add it.
              </div>
            )}
            <Button
              onClick={generate}
              disabled={busy || !images.length}
              size="lg"
              className="w-full bg-rose-500 hover:bg-rose-600 text-white"
            >
              {busy ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  {status || "Working…"}
                </>
              ) : (
                <>
                  <Sparkles className="size-4 mr-2" />
                  Generate Meesho catalog image
                  <ArrowRight className="size-4 ml-2" />
                </>
              )}
            </Button>
            {busy && (
              <p className="text-xs text-center text-muted-foreground animate-pulse">
                {status}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {results.length > 0 && (
          <Card className="border-green-300">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base text-green-700">
                <CheckCircle2 className="size-5 text-green-500" />
                Zone-A catalog image{results.length > 1 ? "s" : ""} ready
              </CardTitle>
              <CardDescription className="text-xs">
                Right-click → Save, or use the Download button. Compress below 200KB (use TinyPNG or Squoosh) before uploading to Meesho for best results.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              {results.map((url, i) => (
                <div key={i} className="space-y-2">
                  <div className="aspect-square rounded-lg border overflow-hidden bg-white">
                    <img src={url} alt="" className="w-full h-full object-contain" />
                  </div>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <a href={url} download={`meesho-zone-a-${i + 1}.png`} target="_blank" rel="noreferrer">
                      <Download className="size-4 mr-2" /> Download image {i + 1}
                    </a>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
