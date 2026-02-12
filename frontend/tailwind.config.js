export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "dirty-blue-900": "#09090b", // Zinc 950 - Pitch Black/Deepest
        "dirty-blue-850": "#18181b", // Zinc 900 - Panels
        "dirty-blue-800": "#27272a", // Zinc 800 - Borders/Separators
        "dirty-blue-700": "#3f3f46", // Zinc 700
        "dirty-blue-600": "#7c3aed", // Violet 600 - Primary Brand (High Contrast)
        "dirty-blue-500": "#8b5cf6", // Violet 500 - Hover
        "dirty-blue-400": "#a78bfa", // Violet 400
        "dirty-blue-300": "#c4b5fd", // Violet 300 - Accents
        "dirty-blue-200": "#ddd6fe", // Violet 200
        "dirty-blue-100": "#ede9fe"  // Violet 100
      }
    }
  },
  plugins: [],
};
