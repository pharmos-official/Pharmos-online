import { useState } from "react";
import type { BlogTemplateData } from "../../types/blogTemplate";
import BlogTemplateRenderer from "./templates/BlogTemplateRenderer";

type DeviceMode = "desktop" | "tablet" | "mobile";

interface LivePreviewProps {
  data: BlogTemplateData;
}

const deviceTabs: Array<{ id: DeviceMode; label: string; icon: string }> = [
  { id: "desktop", label: "Desktop", icon: "🖥️" },
  { id: "tablet", label: "Tablet", icon: "📱" },
  { id: "mobile", label: "Mobile", icon: "📲" },
];

const frameClasses: Record<DeviceMode, string> = {
  desktop: "w-full max-w-full",
  tablet: "w-[768px] max-w-full mx-auto",
  mobile: "w-[390px] max-w-full mx-auto",
};

export default function LivePreview({ data }: LivePreviewProps) {
  const [mode, setMode] = useState<DeviceMode>("desktop");

  return (
    <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900">Live Preview</h3>
          <p className="text-sm text-slate-500">Previewing {data.blog.templateId || "classic"} template</p>
        </div>

        <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1" role="group" aria-label="Preview device">
          {deviceTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setMode(tab.id)}
              aria-pressed={mode === tab.id}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                mode === tab.id ? "bg-white text-sky-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <span aria-hidden="true">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
        <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-3 py-2">
          <span className={`h-2.5 w-2.5 rounded-full ${mode === "mobile" ? "bg-emerald-400" : "bg-rose-400"}`} />
          <span className={`h-2.5 w-2.5 rounded-full ${mode === "mobile" ? "bg-amber-400" : "bg-amber-400"}`} />
          <span className={`h-2.5 w-2.5 rounded-full ${mode === "mobile" ? "bg-slate-300" : "bg-emerald-400"}`} />
          <span className="ml-2 flex-1 rounded-md bg-white px-3 py-1 text-[10px] text-slate-400">
            https://pharmos.com/blog/{data.blog.slug}
          </span>
        </div>

        <div className={`overflow-y-auto bg-slate-50 p-4 ${mode === "mobile" ? "h-[600px]" : "h-[700px]"}`}>
          <div
            className={`overflow-hidden ${frameClasses[mode]} ${
              mode === "mobile"
                ? "min-h-[560px] rounded-[2rem] border-[8px] border-slate-900 shadow-xl"
                : mode === "tablet"
                  ? "min-h-[620px] rounded-2xl border-[6px] border-slate-700 shadow-lg"
                  : "min-h-[640px] rounded-lg border border-slate-300 shadow-sm"
            }`}
          >
            <BlogTemplateRenderer data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}