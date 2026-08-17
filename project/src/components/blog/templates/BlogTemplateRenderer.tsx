import type { BlogTemplateData } from "../../../types/blogTemplate";
import { getTemplateDefinition } from "./TemplateRegistry";

interface BlogTemplateRendererProps {
  data: BlogTemplateData;
}

export default function BlogTemplateRenderer({ data }: BlogTemplateRendererProps) {
  const definition = getTemplateDefinition(data.blog.templateId);
  const TemplateComponent = definition.component;

  return <TemplateComponent data={data} />;
}