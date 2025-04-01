// src/lib/colors.ts


//
// function adjustLightness(hex: string, amount: number): string {
//   const clamp = (val: number) => Math.min(255, Math.max(0, val));
//   const num = parseInt(hex.slice(1), 16);
//   const r = clamp(((num >> 16) & 0xff) + amount);
//   const g = clamp(((num >> 8) & 0xff) + amount);
//   const b = clamp((num & 0xff) + amount);
//   return `#${(1 << 24 | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase()}`;
// }

export function getTextColorForBackground(bg: string): string {
  if (!bg || !/^#[0-9a-f]{6}$/i.test(bg)) return "#000000";
  const r = parseInt(bg.slice(1, 3), 16);
  const g = parseInt(bg.slice(3, 5), 16);
  const b = parseInt(bg.slice(5, 7), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? "#000000" : "#ffffff";
}

function toColorObject(hex: string): { backgroundColor: string; textColor: string } {
  return {
    backgroundColor: hex,
    textColor: getTextColorForBackground(hex)
  };
}

// Strict Gmail palettes (by row in the HTML source)
export const gmailPalette  = {
  pastel: [
    "#f6c5be", "#ffe6c7", "#fef1d1", "#b9e4d0",
    "#c6f3de", "#c9daf8", "#e4d7f5", "#fcdee8",
  "#efa093", "#ffd6a2", "#fce8b3", "#89d3b2",
    "#a0eac9", "#a4c2f4", "#d0bcf1", "#fbc8d9",
  "#fbd3e0", "#ffc8af", "#ffdeb5", "#fdedc1",
    "#fbe983", "#b3efd3", "#a2dcc1", "#f2b2a8",
  "#ebdbde", "#cca6ac", "#e7e7e7", "#b6cff5",
    "#98d7e4", "#e3d7ff", "#c2c2c2", "#f691b2",
  "#ff7537", "#ffad46"
  ],
  base: [
  "#e66550", "#ffbc6b", "#fcda83", "#44b984",
    "#68dfa9", "#6d9eeb", "#b694e8", "#f7a7c0",
  "#cc3a21", "#eaa041", "#f2c960", "#149e60",
    "#3dc789", "#3c78d8", "#8e63ce", "#e07798",
  "#ac2b16", "#cf8933", "#d5ae49", "#0b804b",
    "#2a9c68", "#285bac", "#653e9b", "#b65775",
  "#822111", "#a46a21", "#aa8831", "#076239",
    "#1a764d", "#1c4587", "#41236d", "#83334c",
  "#662e37", "#994a64"
  ],
  vivid: [
  "#fb4c2f", "#ffad47", "#fad165", "#16a766",
    "#43d692", "#4a86e8", "#a479e2", "#f691b3",
  "#8a1c0a", "#7a2e0b", "#7a4706", "#594c05",
    "#684e07", "#0b4f30", "#04502e", "#094228",
  "#0d3472", "#0d3b44", "#3d188e", "#711a36",
    "#4986e7", "#2da2bb", "#b99aff", "#b3efd3",
  "#a2dcc1", "#464646"
  ],
  monochrome: [  "#000000", "#434343", "#666666", "#999999"
    , "#cccccc", "#efefef", "#f3f3f3", "#ffffff",]
};

export const colorPalettes = {
  pastel: gmailPalette.pastel.map(toColorObject),
  base: gmailPalette.base.map(toColorObject),
  vivid: gmailPalette.vivid.map(toColorObject)
};


export function getColorCycle(palette: keyof typeof colorPalettes): string[] {
  return colorPalettes[palette].map(c => c.backgroundColor);
}

export function resolveColorInput(input: string): { backgroundColor: string; textColor: string } {
  input = input?.trim().toLowerCase();
  if (!input) return fallbackColor;

  if (input.startsWith('#') && /^#[0-9a-f]{6}$/i.test(input)) {
    return {
      backgroundColor: input,
      textColor: getTextColorForBackground(input)
    };
  }

  // Not supporting name-based input anymore since colors are no longer keyed
  return fallbackColor;
}

export const fallbackColor = {
  backgroundColor: "#cfe2f3", // pastel blue
  textColor: "#000000"
};

export function applyFallbackColors(nodes: any[]) {
  const paletteType = 'base';
  for (const node of nodes) {
    if (node.type === "modelNode") {
      const categories = node?.data?.categories || [];
      for (const cat of categories) {
        if (!cat.color || !cat.color.backgroundColor || !cat.color.textColor) {
          const fallback = getNextPaletteColor(paletteType);
          cat.color = fallback;
        }
      }
    }
  }
}

let colorIndex = 0;

export function getNextPaletteColor(paletteType: keyof typeof colorPalettes): { backgroundColor: string; textColor: string } {
  const colors = colorPalettes[paletteType];
  const color = colors[colorIndex % colors.length];
  colorIndex += 1;
  return color;
}
