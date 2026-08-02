import { useMemo, useRef, useState } from "react";
import { supabase } from "../../lib/auth";

interface ImageUploaderProps {
  label: string;
  value?: string | null;
  onChange: (url: string | null) => void;
  onInsertIntoContent?: (url: string) => void;
  bucket?: string;
}

function getStoragePathFromUrl(url: string) {
  const publicIndex = url.indexOf("/object/public/");

  if (publicIndex >= 0) {
    const path = url.slice(publicIndex + "/object/public/".length);
    const [, ...rest] = path.split("/");
    return rest.join("/");
  }

  return url.split("/").slice(-1)[0] ?? "";
}

async function compressToWebP(file: File) {
  const objectUrl = URL.createObjectURL(file);
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = objectUrl;
  });

  const canvas = document.createElement("canvas");
  const maxWidth = 1600;
  const scale = Math.min(1, maxWidth / image.width);
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Unable to create canvas context.");
  }

  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/webp", 0.82);
  });

  URL.revokeObjectURL(objectUrl);

  if (!blob) {
    throw new Error("Unable to compress image.");
  }

  return new File([blob], `${file.name.replace(/\.[^.]+$/, "")}.webp`, {
    type: "image/webp",
  });
}

async function uploadToStorage(file: File, bucket: string) {
  const compressedFile = await compressToWebP(file);
  const filePath = `${Date.now()}-${compressedFile.name}`;
  const { data, error } = await supabase.storage.from(bucket).upload(filePath, compressedFile, {
    cacheControl: "3600",
    upsert: false,
    contentType: "image/webp",
  });

  if (error) {
    throw error;
  }

  const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(data?.path ?? filePath);
  return publicData.publicUrl;
}

export default function ImageUploader({
  label,
  value,
  onChange,
  onInsertIntoContent,
  bucket = "blog-images",
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(value ?? null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [message, setMessage] = useState<string>("");

  const currentPreview = useMemo(() => preview ?? value ?? null, [preview, value]);

  const handleUpload = async (file?: File | null) => {
    if (!file) {
      return;
    }

    setMessage("Compressing and uploading image...");
    setIsUploading(true);

    try {
      const publicUrl = await uploadToStorage(file, bucket);
      setPreview(publicUrl);
      onChange(publicUrl);
      setMessage("Image uploaded successfully.");
    } catch (error) {
      const errorText = error instanceof Error ? error.message : "Unable to upload image.";
      setMessage(errorText);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentPreview) {
      return;
    }

    try {
      const storagePath = getStoragePathFromUrl(currentPreview);
      if (storagePath) {
        await supabase.storage.from(bucket).remove([storagePath]);
      }
      setPreview(null);
      onChange(null);
      setMessage("Image removed.");
    } catch (error) {
      const errorText = error instanceof Error ? error.message : "Unable to delete image.";
      setMessage(errorText);
    }
  };

  return (
    <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-slate-800">{label}</span>
        {currentPreview ? (
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white"
          >
            Delete
          </button>
        ) : null}
      </div>

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragActive(false);
          const file = event.dataTransfer.files?.[0];
          void handleUpload(file);
        }}
        className={`rounded-2xl border border-dashed p-4 text-center transition ${dragActive ? "border-sky-600 bg-sky-50" : "border-slate-300 bg-white"}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/webp,image/jpeg,image/png,image/gif"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            void handleUpload(file);
          }}
        />

        <div className="space-y-2">
          <p className="text-sm text-slate-600">Drag & drop an image, or choose one to upload.</p>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="rounded-xl bg-sky-700 px-4 py-2 text-sm font-semibold text-white"
          >
            {isUploading ? "Uploading..." : "Choose Image"}
          </button>
          {onInsertIntoContent ? (
            <button
              type="button"
              onClick={() => {
                if (currentPreview) {
                  onInsertIntoContent(currentPreview);
                }
              }}
              className="ml-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
            >
              Insert into content
            </button>
          ) : null}
        </div>
      </div>

      {message ? <p className="text-xs text-slate-600">{message}</p> : null}

      {currentPreview ? (
        <div className="space-y-2">
          <img src={currentPreview} alt={label} className="h-48 w-full rounded-xl object-cover" />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700"
          >
            Replace image
          </button>
        </div>
      ) : null}
    </div>
  );
}
