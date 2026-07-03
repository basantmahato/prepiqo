import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: "#4F46E5",
        "bg-primary": "#ffffff",
        "bg-secondary": "#f9fafb",
        "bg-tertiary": "#f3f4f6",
        "text-primary": "#111827",
        "text-secondary": "#4b5563",
        "text-muted": "#9ca3af",
        "border-subtle": "#e5e7eb",
        "border-strong": "#d1d5db",
        accent: "#111827",
        "accent-hover": "#374151",
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
export default config;
