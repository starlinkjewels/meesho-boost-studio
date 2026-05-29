// Meesho Zone-A (lowest delivery charge) hard rules — ALWAYS injected into every prompt.
// The user only writes WHAT they want done with the product.
// These rules control HOW the final image must look to qualify for the cheapest shipping zone.
export const LOW_SHIPPING_RULES = `MANDATORY MEESHO CATALOG RULES — follow all of these exactly, they directly determine the shipping cost zone:
1. Background: 100% pure solid white (#FFFFFF). Zero gradient, zero texture, zero pattern, zero shadow on wall, zero floor line.
2. Aspect ratio: perfect square 1:1 (e.g. 1200×1200 px).
3. Product placement: centered precisely, filling 80–85% of the frame. Equal whitespace on all four sides.
4. Lighting: flat, soft, even studio light. Only a very faint contact shadow directly beneath the product — no long, dramatic, or coloured shadows.
5. Single product only. No model, no mannequin, no hand, no hanger, no prop, no extra object, no collage, no composite.
6. Zero text, zero logo, zero watermark, zero price tag, zero sticker, zero badge, zero border, zero frame of any kind.
7. Preserve the product's real colour, shape, fabric/material texture, and all fine details exactly as shown in the reference image. Do NOT redesign, recolour, or simplify the product.
8. Output must look like a premium professional e-commerce hero catalog shot that would pass Meesho's automated image-quality check for Zone A (lowest shipping rate).

USER TASK (apply ALL rules above while completing this):`;

export const PROMPT_PRESETS: { name: string; emoji: string; prompt: string }[] = [
  {
    name: "Clean background",
    emoji: "🤍",
    prompt:
      "Keep @image1 exactly as-is — same product, same angle, same colours. Only remove the background and replace it with pure white. Re-center and crop to a perfect square.",
  },
  {
    name: "Clothing flat-lay",
    emoji: "👗",
    prompt:
      "Show the garment from @image1 as a neat, wrinkle-free flat-lay on pure white. No model, no mannequin, no hanger. Spread the fabric naturally so the full garment shape is visible.",
  },
  {
    name: "Footwear pair",
    emoji: "👟",
    prompt:
      "Show both shoes/sandals from @image1 as a clean pair, side by side or one slightly behind the other, on pure white. Toe tips pointing forward-left at a slight angle for best shape visibility.",
  },
  {
    name: "Jewellery / accessories",
    emoji: "💍",
    prompt:
      "Present the jewellery item from @image1 as a crisp, close-up macro catalog shot. All details, stones, and finish clearly visible against pure white. No hand, no neck form.",
  },
  {
    name: "Home décor / furniture",
    emoji: "🪴",
    prompt:
      "Show the home décor item from @image1 at a slight 3/4 angle so depth and dimensions are clear. Pure white background, no room scene, no props. Product only.",
  },
  {
    name: "Electronics / gadget",
    emoji: "📱",
    prompt:
      "Show the product from @image1 straight-on (front-facing) against pure white. Screen or face of the product fully visible. No hand, no cable, no packaging unless it's the product itself.",
  },
  {
    name: "Merge angles → hero",
    emoji: "🔀",
    prompt:
      "Use @image1 as the primary reference for shape and colour, and @image2 for any details not visible in @image1. Produce one single clean catalog hero shot of the product, front-facing.",
  },
  {
    name: "Bag / wallet",
    emoji: "👜",
    prompt:
      "Show the bag/wallet from @image1 upright and slightly angled (3/4 view) so the front, side, and strap are all visible. Pure white, no stuffing, no tissue inside — natural shape only.",
  },
];

export const MEESHO_ZONE_A_CHECKLIST = [
  "Pure white (#FFFFFF) background",
  "Perfect 1:1 square crop",
  "Product centered, fills 80–85% of frame",
  "Flat even studio lighting",
  "Single product — no model, no props",
  "No text, logo, watermark, or badges",
  "Exact colour & material preserved",
];
