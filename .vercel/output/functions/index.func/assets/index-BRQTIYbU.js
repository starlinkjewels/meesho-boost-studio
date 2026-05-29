import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Toaster as Toaster$1, toast } from "sonner";
import { X, Settings, IndianRupee, CheckCircle2, ImagePlus, Loader2, Sparkles, ArrowRight, Download } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as LabelPrimitive from "@radix-ui/react-label";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx(Comp, { className: cn(buttonVariants({ variant, size, className })), ref, ...props });
  }
);
Button.displayName = "Button";
const Textarea = React.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "textarea",
      {
        className: cn(
          "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Textarea.displayName = "Textarea";
const Card = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      className: cn("rounded-xl border bg-card text-card-foreground shadow", className),
      ...props
    }
  )
);
Card.displayName = "Card";
const CardHeader = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("flex flex-col space-y-1.5 p-6", className), ...props })
);
CardHeader.displayName = "CardHeader";
const CardTitle = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      className: cn("font-semibold leading-none tracking-tight", className),
      ...props
    }
  )
);
CardTitle.displayName = "CardTitle";
const CardDescription = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("text-sm text-muted-foreground", className), ...props })
);
CardDescription.displayName = "CardDescription";
const CardContent = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("p-6 pt-0", className), ...props })
);
CardContent.displayName = "CardContent";
const CardFooter = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("flex items-center p-6 pt-0", className), ...props })
);
CardFooter.displayName = "CardFooter";
const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({ className, variant, ...props }) {
  return /* @__PURE__ */ jsx("div", { className: cn(badgeVariants({ variant }), className), ...props });
}
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Overlay,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsxs(
    DialogPrimitive.Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxs(DialogPrimitive.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
          /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
DialogContent.displayName = DialogPrimitive.Content.displayName;
const DialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsx("div", { className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className), ...props });
DialogHeader.displayName = "DialogHeader";
const DialogFooter = ({ className, ...props }) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
    ...props
  }
);
DialogFooter.displayName = "DialogFooter";
const DialogTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Title,
  {
    ref,
    className: cn("text-lg font-semibold leading-none tracking-tight", className),
    ...props
  }
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;
const DialogDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;
const Input = React.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "input",
      {
        type,
        className: cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);
const Label = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(LabelPrimitive.Root, { ref, className: cn(labelVariants(), className), ...props }));
Label.displayName = LabelPrimitive.Root.displayName;
const KEY_STORAGE = "kie_api_key";
function getStoredApiKey() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(KEY_STORAGE) || "";
}
function SettingsDialog({ onChange }) {
  const [open, setOpen] = useState(false);
  const [key, setKey] = useState("");
  useEffect(() => {
    setKey(getStoredApiKey());
  }, [open]);
  const save = () => {
    localStorage.setItem(KEY_STORAGE, key.trim());
    onChange?.(key.trim());
    toast.success("API key saved locally");
    setOpen(false);
  };
  return /* @__PURE__ */ jsxs(Dialog, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", children: [
      /* @__PURE__ */ jsx(Settings, { className: "size-4 mr-2" }),
      " Settings"
    ] }) }),
    /* @__PURE__ */ jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: "API Key" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "Your personal API key. Stored only in your browser (localStorage) and never sent anywhere except directly from your device to generate images." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "api-key", children: "API Key" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "api-key",
            type: "password",
            value: key,
            onChange: (e) => setKey(e.target.value),
            placeholder: "sk-..."
          }
        )
      ] }),
      /* @__PURE__ */ jsx(DialogFooter, { children: /* @__PURE__ */ jsx(Button, { onClick: save, children: "Save" }) })
    ] })
  ] });
}
const LOW_SHIPPING_RULES = `MANDATORY MEESHO CATALOG RULES — follow all of these exactly, they directly determine the shipping cost zone:
1. Background: 100% pure solid white (#FFFFFF). Zero gradient, zero texture, zero pattern, zero shadow on wall, zero floor line.
2. Aspect ratio: perfect square 1:1 (e.g. 1200×1200 px).
3. Product placement: centered precisely, filling 80–85% of the frame. Equal whitespace on all four sides.
4. Lighting: flat, soft, even studio light. Only a very faint contact shadow directly beneath the product — no long, dramatic, or coloured shadows.
5. Single product only. No model, no mannequin, no hand, no hanger, no prop, no extra object, no collage, no composite.
6. Zero text, zero logo, zero watermark, zero price tag, zero sticker, zero badge, zero border, zero frame of any kind.
7. Preserve the product's real colour, shape, fabric/material texture, and all fine details exactly as shown in the reference image. Do NOT redesign, recolour, or simplify the product.
8. Output must look like a premium professional e-commerce hero catalog shot that would pass Meesho's automated image-quality check for Zone A (lowest shipping rate).

USER TASK (apply ALL rules above while completing this):`;
const PROMPT_PRESETS = [
  {
    name: "Clean background",
    emoji: "🤍",
    prompt: "Keep @image1 exactly as-is — same product, same angle, same colours. Only remove the background and replace it with pure white. Re-center and crop to a perfect square."
  },
  {
    name: "Clothing flat-lay",
    emoji: "👗",
    prompt: "Show the garment from @image1 as a neat, wrinkle-free flat-lay on pure white. No model, no mannequin, no hanger. Spread the fabric naturally so the full garment shape is visible."
  },
  {
    name: "Footwear pair",
    emoji: "👟",
    prompt: "Show both shoes/sandals from @image1 as a clean pair, side by side or one slightly behind the other, on pure white. Toe tips pointing forward-left at a slight angle for best shape visibility."
  },
  {
    name: "Jewellery / accessories",
    emoji: "💍",
    prompt: "Present the jewellery item from @image1 as a crisp, close-up macro catalog shot. All details, stones, and finish clearly visible against pure white. No hand, no neck form."
  },
  {
    name: "Home décor / furniture",
    emoji: "🪴",
    prompt: "Show the home décor item from @image1 at a slight 3/4 angle so depth and dimensions are clear. Pure white background, no room scene, no props. Product only."
  },
  {
    name: "Electronics / gadget",
    emoji: "📱",
    prompt: "Show the product from @image1 straight-on (front-facing) against pure white. Screen or face of the product fully visible. No hand, no cable, no packaging unless it's the product itself."
  },
  {
    name: "Merge angles → hero",
    emoji: "🔀",
    prompt: "Use @image1 as the primary reference for shape and colour, and @image2 for any details not visible in @image1. Produce one single clean catalog hero shot of the product, front-facing."
  },
  {
    name: "Bag / wallet",
    emoji: "👜",
    prompt: "Show the bag/wallet from @image1 upright and slightly angled (3/4 view) so the front, side, and strap are all visible. Pure white, no stuffing, no tissue inside — natural shape only."
  }
];
const MEESHO_ZONE_A_CHECKLIST = [
  "Pure white (#FFFFFF) background",
  "Perfect 1:1 square crop",
  "Product centered, fills 80–85% of frame",
  "Flat even studio lighting",
  "Single product — no model, no props",
  "No text, logo, watermark, or badges",
  "Exact colour & material preserved"
];
const BASE = "https://api.kie.ai";
async function uploadFileToKie(apiKey, file) {
  const form = new FormData();
  form.append("file", file, file.name);
  form.append("uploadPath", "images/user-upload");
  const res = await fetch("/api/upload-proxy", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`
    },
    body: form
  });
  const json = await res.json();
  const url = json?.data?.downloadUrl || json?.data?.fileUrl || json?.data?.url;
  if (!url) throw new Error(json?.msg || "Upload failed: " + JSON.stringify(json));
  return url;
}
async function createImageToImageTask(apiKey, prompt, imageUrls, nsfwChecker = false) {
  const res = await fetch(`${BASE}/api/v1/jobs/createTask`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "grok-imagine/image-to-image",
      input: { prompt, image_urls: imageUrls, nsfw_checker: nsfwChecker }
    })
  });
  const json = await res.json();
  if (json.code !== 200 || !json.data?.taskId) {
    throw new Error(json.msg || `Create task failed (${json.code})`);
  }
  return json.data.taskId;
}
async function getTaskDetail(apiKey, taskId) {
  const res = await fetch(`${BASE}/api/v1/jobs/recordInfo?taskId=${encodeURIComponent(taskId)}`, {
    headers: { Authorization: `Bearer ${apiKey}` }
  });
  return res.json();
}
async function pollTaskUntilDone(apiKey, taskId, onTick, timeoutMs = 5 * 60 * 1e3) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const json = await getTaskDetail(apiKey, taskId);
    const state = json.data?.state || json.data?.status || "waiting";
    onTick?.(state);
    if (state === "success" || state === "completed") {
      const raw = json.data?.resultJson;
      if (raw) {
        try {
          const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
          const urls = parsed.resultUrls || parsed.result_urls || parsed.images || parsed.urls || [];
          if (urls.length) return urls;
        } catch {
        }
      }
      if (json.data?.resultUrls?.length) return json.data.resultUrls;
      throw new Error("Task completed but no images returned");
    }
    if (state === "fail" || state === "failed" || state === "error") {
      throw new Error(json.data?.failMsg || json.msg || "Generation failed");
    }
    await new Promise((r) => setTimeout(r, 3e3));
  }
  throw new Error("Timed out waiting for generation");
}
function Index() {
  const [apiKey, setApiKey] = useState("");
  const [images, setImages] = useState([]);
  const [userIntent, setUserIntent] = useState(PROMPT_PRESETS[0].prompt);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [results, setResults] = useState([]);
  const fileRef = useRef(null);
  useEffect(() => {
    setApiKey(getStoredApiKey());
  }, []);
  const addFiles = (files) => {
    if (!files) return;
    const arr = Array.from(files).slice(0, 5 - images.length);
    const next = arr.map((f) => ({
      file: f,
      url: URL.createObjectURL(f)
    }));
    setImages((prev) => [...prev, ...next].slice(0, 5));
  };
  const removeImage = (i) => setImages((prev) => prev.filter((_, idx) => idx !== i));
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
      const uploaded = [];
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
          copy[i] = {
            ...copy[i],
            uploadedUrl: url
          };
          return copy;
        });
      }
      setStatus("Submitting generation task…");
      const finalPrompt = `${LOW_SHIPPING_RULES}
${userIntent.trim()}`;
      const taskId = await createImageToImageTask(apiKey, finalPrompt, uploaded, false);
      setStatus("Generating… this takes about 30–60 seconds");
      const urls = await pollTaskUntilDone(apiKey, taskId, (s) => setStatus(`AI is working: ${s}…`));
      setResults(urls);
      setStatus("Done!");
      toast.success(`${urls.length} Zone-A catalog image${urls.length > 1 ? "s" : ""} ready!`);
    } catch (e) {
      console.error(e);
      toast.error(e.message || "Generation failed");
      setStatus("");
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gradient-to-b from-rose-50/60 to-background", children: [
    /* @__PURE__ */ jsx(Toaster, { richColors: true, position: "top-right" }),
    /* @__PURE__ */ jsx("header", { className: "border-b sticky top-0 z-40 bg-white/90 backdrop-blur", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-3 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "size-9 rounded-lg bg-rose-500 text-white grid place-items-center font-bold text-lg", children: "M" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "font-bold leading-tight text-base", children: "Meesho Catalog Optimizer" }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(IndianRupee, { className: "size-3" }),
            "Minimum delivery charge — Zone A images"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx(SettingsDialog, { onChange: setApiKey })
    ] }) }),
    /* @__PURE__ */ jsxs("main", { className: "container mx-auto px-4 py-8 max-w-2xl space-y-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "rounded-xl bg-rose-500 text-white p-4 flex items-start gap-3", children: [
        /* @__PURE__ */ jsx(IndianRupee, { className: "size-5 mt-0.5 shrink-0" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "font-semibold text-sm", children: "Goal: Lowest possible delivery charge on Meesho" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-rose-100 mt-0.5", children: "Every image generated automatically follows all Meesho Zone-A rules — pure white background, 1:1 square, no text, single product, correct framing. You just describe what you want done with your product." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "border-green-200 bg-green-50/60", children: [
        /* @__PURE__ */ jsx(CardHeader, { className: "pb-2 pt-4 px-4", children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-sm text-green-800 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(CheckCircle2, { className: "size-4 text-green-600" }),
          "Auto-applied rules for Zone A (always enforced)"
        ] }) }),
        /* @__PURE__ */ jsx(CardContent, { className: "px-4 pb-4", children: /* @__PURE__ */ jsx("ul", { className: "grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1", children: MEESHO_ZONE_A_CHECKLIST.map((rule) => /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-1.5 text-xs text-green-800", children: [
          /* @__PURE__ */ jsx(CheckCircle2, { className: "size-3 text-green-500 shrink-0" }),
          rule
        ] }, rule)) }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "pb-2", children: [
          /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2 text-base", children: [
            /* @__PURE__ */ jsx("span", { className: "size-6 rounded-full bg-rose-500 text-white text-xs grid place-items-center font-bold shrink-0", children: "1" }),
            "Upload your product photo(s)",
            /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "ml-auto text-xs", children: [
              images.length,
              "/5"
            ] })
          ] }),
          /* @__PURE__ */ jsxs(CardDescription, { className: "text-xs", children: [
            "Reference them in your description as ",
            /* @__PURE__ */ jsx("code", { className: "bg-muted px-1 rounded", children: "@image1" }),
            ", ",
            /* @__PURE__ */ jsx("code", { className: "bg-muted px-1 rounded", children: "@image2" }),
            ", etc."
          ] })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxs("div", { onClick: () => fileRef.current?.click(), onDragOver: (e) => e.preventDefault(), onDrop: (e) => {
            e.preventDefault();
            addFiles(e.dataTransfer.files);
          }, className: "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors", children: [
            /* @__PURE__ */ jsx(ImagePlus, { className: "size-8 mx-auto mb-2 text-muted-foreground" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", children: "Drop images here or click to browse" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "JPEG · PNG · WebP — up to 5 images" }),
            /* @__PURE__ */ jsx("input", { ref: fileRef, type: "file", accept: "image/jpeg,image/png,image/webp", multiple: true, className: "hidden", onChange: (e) => addFiles(e.target.files) })
          ] }),
          images.length > 0 && /* @__PURE__ */ jsx("div", { className: "grid grid-cols-4 sm:grid-cols-5 gap-2 mt-3", children: images.map((img, i) => /* @__PURE__ */ jsxs("div", { className: "relative group aspect-square", children: [
            /* @__PURE__ */ jsx("img", { src: img.url, alt: "", className: "w-full h-full object-cover rounded-lg border" }),
            /* @__PURE__ */ jsxs("span", { className: "absolute bottom-1 left-1 text-[9px] bg-black/70 text-white px-1 py-0.5 rounded font-mono", children: [
              "@image",
              i + 1
            ] }),
            /* @__PURE__ */ jsx("button", { onClick: () => removeImage(i), className: "absolute top-1 right-1 size-5 grid place-items-center bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsx(X, { className: "size-3" }) })
          ] }, i)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "pb-2", children: [
          /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2 text-base", children: [
            /* @__PURE__ */ jsx("span", { className: "size-6 rounded-full bg-rose-500 text-white text-xs grid place-items-center font-bold shrink-0", children: "2" }),
            "What do you want done with your product?"
          ] }),
          /* @__PURE__ */ jsx(CardDescription, { className: "text-xs", children: "Pick a category shortcut below, then edit if needed. Meesho Zone-A rules are applied automatically — just focus on your product." })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-3", children: [
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5", children: PROMPT_PRESETS.map((p) => /* @__PURE__ */ jsxs("button", { onClick: () => setUserIntent(p.prompt), className: `inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-full border transition-colors ${userIntent === p.prompt ? "bg-rose-500 text-white border-rose-500" : "bg-white text-foreground border-border hover:bg-muted"}`, children: [
            /* @__PURE__ */ jsx("span", { children: p.emoji }),
            " ",
            p.name
          ] }, p.name)) }),
          /* @__PURE__ */ jsx(Textarea, { value: userIntent, onChange: (e) => setUserIntent(e.target.value), rows: 4, placeholder: "e.g. Keep the product in @image1 exactly the same. Only remove the background.", className: "text-sm resize-none" }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground flex items-start gap-1", children: [
            /* @__PURE__ */ jsx(CheckCircle2, { className: "size-3 mt-0.5 text-green-500 shrink-0" }),
            "Meesho rules (white bg, 1:1 square, no text, single product…) are always added automatically on top of your description."
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2 text-base", children: [
          /* @__PURE__ */ jsx("span", { className: "size-6 rounded-full bg-rose-500 text-white text-xs grid place-items-center font-bold shrink-0", children: "3" }),
          "Generate Zone-A catalog image"
        ] }) }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-3", children: [
          !apiKey && /* @__PURE__ */ jsxs("div", { className: "text-xs text-destructive bg-destructive/10 rounded-lg px-3 py-2", children: [
            "No Kie.ai API key set — click ",
            /* @__PURE__ */ jsx("strong", { children: "Settings" }),
            " (top right) to add it."
          ] }),
          /* @__PURE__ */ jsx(Button, { onClick: generate, disabled: busy || !images.length, size: "lg", className: "w-full bg-rose-500 hover:bg-rose-600 text-white", children: busy ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(Loader2, { className: "size-4 mr-2 animate-spin" }),
            status || "Working…"
          ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(Sparkles, { className: "size-4 mr-2" }),
            "Generate Meesho catalog image",
            /* @__PURE__ */ jsx(ArrowRight, { className: "size-4 ml-2" })
          ] }) }),
          busy && /* @__PURE__ */ jsx("p", { className: "text-xs text-center text-muted-foreground animate-pulse", children: status })
        ] })
      ] }),
      results.length > 0 && /* @__PURE__ */ jsxs(Card, { className: "border-green-300", children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "pb-2", children: [
          /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2 text-base text-green-700", children: [
            /* @__PURE__ */ jsx(CheckCircle2, { className: "size-5 text-green-500" }),
            "Zone-A catalog image",
            results.length > 1 ? "s" : "",
            " ready"
          ] }),
          /* @__PURE__ */ jsx(CardDescription, { className: "text-xs", children: "Right-click → Save, or use the Download button. Compress below 200KB (use TinyPNG or Squoosh) before uploading to Meesho for best results." })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { className: "grid sm:grid-cols-2 gap-4", children: results.map((url, i) => /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("div", { className: "aspect-square rounded-lg border overflow-hidden bg-white", children: /* @__PURE__ */ jsx("img", { src: url, alt: "", className: "w-full h-full object-contain" }) }),
          /* @__PURE__ */ jsx(Button, { asChild: true, variant: "outline", size: "sm", className: "w-full", children: /* @__PURE__ */ jsxs("a", { href: url, download: `meesho-zone-a-${i + 1}.png`, target: "_blank", rel: "noreferrer", children: [
            /* @__PURE__ */ jsx(Download, { className: "size-4 mr-2" }),
            " Download image ",
            i + 1
          ] }) })
        ] }, i)) })
      ] })
    ] })
  ] });
}
export {
  Index as component
};
