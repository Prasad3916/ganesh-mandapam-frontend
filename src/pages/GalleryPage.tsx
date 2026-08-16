import React, { useState, useEffect } from 'react';
import { GalleryItem } from '../types';
import { apiFetch, BASE_URL, BACKEND_SERVER_URL } from '../api/apiClient';
import { Image as ImageIcon, Upload, Trash2, X, Plus, Inbox, AlertCircle } from 'lucide-react';

const DEVOTIONAL_PLACEHOLDERS = [
  'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1620882173541-26c71f308a00?w=800&auto=format&fit=crop',
];

export const GalleryPage: React.FC = () => {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState('DECORATION');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const resolveImageUrl = (path?: string, index: number = 0): string => {
    if (!path) return DEVOTIONAL_PLACEHOLDERS[index % DEVOTIONAL_PLACEHOLDERS.length];

    // Handle hardcoded localhost URLs stored in DB previously
    if (path.includes('localhost:8080/api/gallery/files/')) {
      const fileName = path.split('/files/')[1];
      if (fileName) {
        return `${BACKEND_SERVER_URL}/api/gallery/files/${fileName}`;
      }
    }

    if (path.startsWith('http') || path.startsWith('data:')) {
      return path;
    }

    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    if (cleanPath.startsWith('/api/')) {
      return `${BACKEND_SERVER_URL}${cleanPath}`;
    }
    return `${BACKEND_SERVER_URL}/api${cleanPath}`;
  };

  const fetchImages = async () => {
    try {
      const data = await apiFetch<any[]>('/gallery');
      const mapped: GalleryItem[] = data.map((item, idx) => ({
        id: String(item.id),
        title: item.caption || `Mandapam Photo #${idx + 1}`,
        category: item.category || 'DECORATION',
        imageUrl: resolveImageUrl(item.filePath, idx),
        date: item.uploadedAt ? item.uploadedAt.split('T')[0] : new Date().toISOString().split('T')[0],
      }));
      setImages(mapped);
    } catch {
      setImages([]);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleFileChange = (file: File) => {
    setSelectedFile(file);
    setUploadError('');
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setFilePreview(reader.result as string);
    };
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile && !filePreview) return;

    setIsUploading(true);
    setUploadError('');

    try {
      // 1. Generate unique Base64 string for this specific uploaded image
      const base64Data = filePreview || (await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(selectedFile!);
        reader.onloadend = () => resolve(reader.result as string);
      }));

      // Send Base64 directly so each image has its exact data stored
      let uploadSuccess = false;
      try {
        const res = await fetch(`${BASE_URL}/gallery/upload-base64`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageData: base64Data,
            caption: caption || `Mandapam Photo ${images.length + 1}`,
            category: category,
          }),
        });

        if (res.ok) {
          uploadSuccess = true;
          await fetchImages();
        }
      } catch {
        // Continue to fallback
      }

      if (!uploadSuccess && selectedFile) {
        try {
          const formData = new FormData();
          formData.append('file', selectedFile);
          formData.append('caption', caption || `Mandapam Photo ${images.length + 1}`);
          formData.append('category', category);

          const res2 = await fetch(`${BASE_URL}/gallery/upload`, {
            method: 'POST',
            body: formData,
          });

          if (res2.ok) {
            uploadSuccess = true;
            await fetchImages();
          }
        } catch {
          // Continue to local state
        }
      }

      // If server returned error, prepend image locally with its unique Base64 Data URL!
      if (!uploadSuccess) {
        const newLocalImage: GalleryItem = {
          id: String(Date.now()),
          title: caption || `Mandapam Photo ${images.length + 1}`,
          category: category,
          imageUrl: base64Data,
          date: new Date().toISOString().split('T')[0],
        };
        setImages((prev) => [newLocalImage, ...prev]);
      }

      setShowUploadModal(false);
      setSelectedFile(null);
      setFilePreview(null);
      setCaption('');
    } catch {
      setUploadError('Failed to process image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async (id: string) => {
    try {
      await apiFetch(`/gallery/${id}`, { method: 'DELETE' });
    } catch {
      // Ignore error for local items
    }
    setImages((prev) => prev.filter((img) => img.id !== id));
    setSelectedImage(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-maroon-900 via-maroon-800 to-maroon-950 border border-gold-500/40 text-amber-50 shadow-mandapam flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-saffron-500/20 border border-saffron-400/40 rounded-xl text-saffron-400">
            <ImageIcon className="w-8 h-8" />
          </div>
          <div>
            <div className="text-xs font-telugu-devotional text-gold-300 font-bold mb-0.5">
              శ్రీ గణేశాయ నమః • గణపతి బప్పా మోరియా
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-cinzel text-gold-300">
              Ganesh Utsav Photo Gallery
            </h2>
            <p className="text-xs text-amber-200/80">
              Preserve sacred festival moments and mandapam decoration photos
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setShowUploadModal(true);
            setUploadError('');
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-saffron-500 hover:bg-saffron-600 text-white font-bold text-xs shadow-saffron-glow transition transform hover:-translate-y-0.5"
        >
          <Upload className="w-4 h-4" />
          <span>📷 Upload Images</span>
        </button>
      </div>

      {/* Gallery Grid / Empty State */}
      {images.length === 0 ? (
        <div className="p-12 rounded-2xl border-2 border-dashed border-gold-500/40 glass-mandapam text-center space-y-3 shadow-mandapam">
          <div className="flex justify-center text-slate-400 dark:text-amber-400/60">
            <Inbox className="w-12 h-12" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-gold-300">
            🙏 No Gallery Photos Uploaded Yet
          </h3>
          <p className="text-xs text-slate-500 dark:text-amber-200 max-w-sm mx-auto leading-relaxed">
            Preserve your festival memories by uploading mandapam photos here.
          </p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-5 py-2.5 rounded-xl bg-saffron-500 hover:bg-saffron-600 text-white font-bold text-xs shadow-saffron-glow transition inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>📷 Upload Images</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setSelectedImage(item)}
              className="group relative overflow-hidden rounded-2xl border border-gold-500/40 shadow-mandapam bg-maroon-950 cursor-pointer"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = DEVOTIONAL_PLACEHOLDERS[idx % DEVOTIONAL_PLACEHOLDERS.length];
                }}
                className="w-full h-60 object-cover transform group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-maroon-950 via-maroon-950/20 to-transparent opacity-90 p-4 flex flex-col justify-end text-amber-50">
                <span className="px-2.5 py-0.5 rounded-full bg-gold-500/20 border border-gold-400/40 text-gold-300 text-[10px] font-bold w-fit mb-1">
                  {item.category}
                </span>
                <h3 className="font-cinzel font-bold text-sm text-amber-100">{item.title}</h3>
                <p className="text-[10px] text-amber-300/70 font-mono mt-0.5">{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Image Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <form
            onSubmit={handleUploadSubmit}
            className="w-full max-w-md bg-white dark:bg-maroon-950 border-2 border-gold-500 rounded-2xl p-6 text-slate-900 dark:text-amber-50 space-y-4 shadow-mandapam"
          >
            <div className="flex items-center justify-between border-b border-gold-500/30 pb-2">
              <h3 className="text-lg font-bold font-cinzel text-saffron-600 dark:text-gold-300">
                📷 Upload Festival Photo
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowUploadModal(false);
                  setFilePreview(null);
                  setSelectedFile(null);
                }}
                className="text-slate-400 hover:text-slate-600 dark:text-amber-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {uploadError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-amber-200">
                  Select Image File (JPG, PNG, WEBP) *
                </label>
                <input
                  type="file"
                  required={!filePreview}
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileChange(e.target.files[0]);
                    }
                  }}
                  className="w-full p-2 border border-gold-500/40 rounded-lg bg-slate-50 dark:bg-maroon-900 text-slate-900 dark:text-amber-100"
                />
              </div>

              {filePreview && (
                <div className="relative rounded-xl overflow-hidden border border-gold-500/40 max-h-40">
                  <img src={filePreview} alt="Preview" className="w-full h-40 object-cover" />
                </div>
              )}

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-amber-200">
                  Caption / Title (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Maha Aarti Decoration"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gold-500/40 bg-slate-50 dark:bg-maroon-900 text-slate-900 dark:text-amber-100"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-amber-200">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gold-500/40 bg-slate-50 dark:bg-maroon-900 text-slate-900 dark:text-amber-100"
                >
                  <option value="DECORATION">DECORATION</option>
                  <option value="POOJA">POOJA</option>
                  <option value="VISARJAN">VISARJAN</option>
                  <option value="GENERAL">GENERAL</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-gold-500/20">
              <button
                type="button"
                onClick={() => {
                  setShowUploadModal(false);
                  setFilePreview(null);
                  setSelectedFile(null);
                }}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-maroon-900 text-slate-700 dark:text-amber-200 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUploading}
                className="px-6 py-2 rounded-xl bg-saffron-500 hover:bg-saffron-600 text-white font-bold shadow-saffron-glow transition"
              >
                {isUploading ? 'Uploading...' : 'Upload Image'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lightbox Preview Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative max-w-3xl w-full bg-maroon-950 border border-gold-500/60 rounded-2xl overflow-hidden p-4 space-y-3">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-amber-200 hover:bg-black"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={selectedImage.imageUrl}
              alt={selectedImage.title}
              onError={(e) => {
                (e.target as HTMLImageElement).src = DEVOTIONAL_PLACEHOLDERS[0];
              }}
              className="w-full max-h-[70vh] object-contain rounded-xl"
            />
            <div className="flex items-center justify-between text-amber-50 text-xs pt-2">
              <div>
                <p className="font-cinzel font-bold text-sm text-gold-300">{selectedImage.title}</p>
                <p className="text-[10px] text-amber-300/70 font-mono">{selectedImage.date}</p>
              </div>
              <button
                onClick={() => handleDeleteImage(selectedImage.id)}
                className="px-3 py-1.5 rounded-lg bg-red-600/30 hover:bg-red-600 border border-red-500/40 text-red-200 text-xs flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Photo</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
