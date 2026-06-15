import { useRef, useState } from 'react';

/**
 * ImageUploader — shows current image (or placeholder), lets admin
 * click to pick a new file, and calls onUpload(file) with the selected File.
 *
 * Props:
 * - currentImage: base64 data URL or null
 * - onUpload: async (file: File) => void  — called when user selects a file
 * - uploading: boolean — shows spinner while upload is in progress
 * - label: string — optional label text
 */
export default function ImageUploader({ currentImage, onUpload, uploading = false, label = 'Image' }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPG, PNG, WEBP, etc.)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be smaller than 5MB. Please compress it first.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(file);

    onUpload(file);
  };

  const displayImage = preview || currentImage;

  return (
    <div>
      <p className="text-sm font-medium text-walnut/80 mb-1.5">{label}</p>

      <div
        className="relative w-full aspect-[4/3] rounded-2xl border-2 border-dashed border-walnut/20 bg-almond overflow-hidden cursor-pointer group hover:border-sage transition-colors"
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="Click to upload image"
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
      >
        {displayImage ? (
          <>
            <img src={displayImage} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-walnut/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-almond-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span className="text-almond-light text-sm font-medium">Replace image</span>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-walnut/40 group-hover:text-sage transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span className="text-sm font-medium">Click to upload image</span>
            <span className="text-xs">JPG, PNG, WEBP — max 5MB</span>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-walnut/40 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-almond-light border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
