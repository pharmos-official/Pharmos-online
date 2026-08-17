import type { BlogTemplateData, TemplateId } from "../../types/blogTemplate";
import { TEMPLATE_DEFINITIONS } from "./templates/TemplateRegistry";
import TemplateThumbnail from "./templates/TemplateThumbnail";

interface TemplatePickerProps {
  value: TemplateId | string;
  onChange: (value: TemplateId | string) => void;
  data: BlogTemplateData;
}

export default function TemplatePicker({ value, onChange, data }: TemplatePickerProps) {
  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 md:p-6">
      <div>
        <h3 className="text-base font-bold text-slate-900">Choose Your Blog Template</h3>
        <p className="mt-1 text-sm text-slate-500">
          Select a layout to instantly preview your article with the same data.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
        {TEMPLATE_DEFINITIONS.map((definition) => (
          <TemplateThumbnail
            key={definition.meta.id}
            meta={definition.meta}
            data={data}
            selected={value === definition.meta.id}
            onSelect={() => onChange(definition.meta.id)}
          />
        ))}
      </div>
    </div>
  );
}