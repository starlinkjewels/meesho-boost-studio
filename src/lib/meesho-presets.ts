export const MEESHO_TIPS = [
  "Use PURE WHITE background (#FFFFFF) — Meesho's algorithm reads non-white backgrounds as larger volumetric weight.",
  "Square 1:1 aspect ratio (1000x1000 or 1200x1200). Avoid tall portrait images — they inflate shipping zone calculation.",
  "Product should fill 75–85% of the frame, perfectly centered. Too much whitespace = higher zone class.",
  "ZERO text, watermarks, logos, price tags, badges, or stickers on the image — Meesho penalises these.",
  "Single product per image. No collages, no model/mannequin shots in catalog hero (use lifestyle only as secondary).",
  "Soft shadow directly under product (not long/dramatic). Flat studio lighting.",
  "No props, no background patterns, no gradient. Plain studio look only.",
  "Front-facing flat lay or straight-on. Avoid angled hero shots for category-1 shipping rate.",
  "Image weight under 200KB ideal. Use compressed JPEG/WebP after generation.",
  "Match the product's actual color exactly — colour mismatch returns inflate effective shipping cost.",
];

// Hard rules that are ALWAYS injected so the final image qualifies for the
// lowest possible shipping/volumetric-weight zone. The user only writes WHAT
// they want done with the product — these rules handle the HOW.
export const LOW_SHIPPING_RULES = `STRICT OUTPUT RULES (must be followed exactly, these decide shipping cost):
- Background: 100% pure solid white #FFFFFF, no gradient, no texture, no pattern, no floor, no wall.
- Aspect ratio: perfect square 1:1.
- Product placement: perfectly centered, fills 78-85% of the frame, no empty borders larger than 10%.
- Lighting: flat, soft, even studio light. Tiny soft contact shadow only directly under the product. No long or dramatic shadows.
- Single product only. No models, no mannequins, no hands, no props, no extra items, no collage.
- Absolutely NO text, NO logo, NO watermark, NO price tag, NO sticker, NO badge, NO border, NO frame.
- Preserve the product's real colour, shape, material and details exactly as in the reference image. Do not redesign the product.
- Output must look like a clean professional e-commerce catalog hero shot.

USER INTENT (apply the above rules while doing this):`;

export const PROMPT_PRESETS = [
  {
    name: "Just clean the background",
    prompt: "Keep the product in @image1 exactly the same. Only fix the background and framing.",
  },
  {
    name: "Fashion / apparel flat lay",
    prompt: "Show the garment from @image1 as a neat flat-lay. No model, no mannequin, no hanger.",
  },
  {
    name: "Jewellery / small item",
    prompt: "Present the item in @image1 as a premium macro catalog shot with crisp detail.",
  },
  {
    name: "Combine multiple angles",
    prompt: "Use @image1 as the main product and @image2 as a reference for missing details. Produce one clean catalog hero.",
  },
];

const _UNUSED_OLD = [
  {
    name: "Catalog Hero (Lowest Shipping)",
    prompt:
      "Take @image1 and place it on a pure pristine white background (#FFFFFF), perfectly centered, product fills 80% of frame, square 1:1 composition, soft natural studio shadow directly beneath, flat even lighting, no text no logo no watermark no price tag, professional e-commerce catalog photo, sharp focus, true-to-life colors, Meesho-ready product shot.",
  },
  {
    name: "Clean Background Replace",
    prompt:
      "Replace the background of @image1 with pure white (#FFFFFF). Keep the product exactly identical — same color, same texture, same shape, same details. Centered composition, square format, subtle drop shadow. No text or graphics added.",
  },
  {
    name: "Fashion / Apparel Flat Lay",
    prompt:
      "Convert @image1 into a flat-lay catalog shot on pure white background. Garment laid flat, neatly arranged, no model, no mannequin, no hanger. Square 1:1, centered, soft top-down lighting, no shadows on background. E-commerce ready.",
  },
  {
    name: "Jewellery / Small Item",
    prompt:
      "Take @image1 and present it as a premium catalog product on pure white background. Centered, sharp macro detail, soft reflection beneath, no props, square crop, no text or branding.",
  },
];
