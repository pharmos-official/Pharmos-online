import { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface BlogEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autosaveKey?: string;
}

const modules = {
  toolbar: {
    container: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote", "code-block"],
      ["link", "image", "video", "table"],
      ["undo", "redo"],
    ],
    handlers: {
      table: () => {
        const editor = (document.querySelector(".ql-editor") as HTMLElement | null);
        if (!editor) return;

        const tableHtml = `
          <table style="width: 100%; border-collapse: collapse;">
            <tbody>
              <tr>
                <td style="border: 1px solid #cbd5e1; padding: 8px;">Heading</td>
                <td style="border: 1px solid #cbd5e1; padding: 8px;">Value</td>
              </tr>
              <tr>
                <td style="border: 1px solid #cbd5e1; padding: 8px;">Item</td>
                <td style="border: 1px solid #cbd5e1; padding: 8px;">Data</td>
              </tr>
            </tbody>
          </table>
        `;

        const editorNode = document.querySelector(".ql-editor") as HTMLElement;
        if (editorNode) {
          editorNode.insertAdjacentHTML("beforeend", tableHtml);
        }
      },
    },
  },
  history: {
    delay: 600,
    maxStack: 100,
    userOnly: true,
  },
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "list",
  "bullet",
  "blockquote",
  "code-block",
  "link",
  "image",
  "video",
];

export default function BlogEditor({
  value,
  onChange,
  placeholder = "Start writing your blog story...",
  autosaveKey = "blog-editor-autosave",
}: BlogEditorProps) {
  const quillRef = useRef<ReactQuill | null>(null);
  const [editorValue, setEditorValue] = useState(value);

  useEffect(() => {
    setEditorValue(value);
  }, [value]);

  useEffect(() => {
    const savedValue = window.localStorage.getItem(autosaveKey);
    if (savedValue) {
      setEditorValue(savedValue);
      onChange(savedValue);
    }
  }, [autosaveKey, onChange]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      window.localStorage.setItem(autosaveKey, editorValue);
    }, 400);

    return () => window.clearTimeout(timeout);
  }, [autosaveKey, editorValue]);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-sm">
      <div className="rounded-t-2xl border-b border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">
        Rich Text Editor
      </div>

      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={editorValue}
        onChange={(nextValue) => {
          setEditorValue(nextValue);
          onChange(nextValue);
        }}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="min-h-[320px] md:min-h-[420px]"
      />
    </div>
  );
}
