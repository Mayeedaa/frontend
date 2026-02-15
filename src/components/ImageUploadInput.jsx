import { useState } from 'react';

export default function ImageUploadInput({ value, onChange, label = 'Product Image' }) {
  const [preview, setPreview] = useState(value);
  const [loading, setLoading] = useState(false);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    setLoading(true);
    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target.result;
        setPreview(base64String);
        onChange(base64String);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Error reading file:', err);
      alert('Failed to read image file');
    } finally {
      setLoading(false);
    }
  };

  const handleClearImage = () => {
    setPreview('');
    onChange('');
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-900 dark:text-slate-50">
        {label}
      </label>

      {/* Image Preview */}
      {preview && (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full max-w-xs h-48 object-cover rounded-lg border border-gray-200 dark:border-slate-700"
          />
          <button
            onClick={handleClearImage}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            type="button"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      {/* Or Paste Image URL */}
      <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
        <p className="text-sm text-gray-600 dark:text-slate-400 mb-2">Or paste image URL:</p>
        <input
          type="url"
          placeholder="https://example.com/image.jpg"
          value={preview && !preview.startsWith('data:') ? preview : ''}
          onChange={(e) => {
            setPreview(e.target.value);
            onChange(e.target.value);
          }}
          className="input-field w-full"
        />
      </div>

      {/* Upload Button */}
      <div className="relative">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          disabled={loading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        <button
          type="button"
          disabled={loading}
          className="btn-primary w-full py-2 disabled:opacity-50"
        >
          {loading ? 'Uploading...' : 'Choose Image File'}
        </button>
      </div>

      <p className="text-xs text-gray-500 dark:text-slate-400">
        Max size: 5MB. Supported formats: JPG, PNG, GIF, WebP
      </p>
    </div>
  );
}
