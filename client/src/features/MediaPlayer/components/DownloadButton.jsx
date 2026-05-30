import { useState } from 'react';
import { Download, Loader2, AlertCircle, ExternalLink, X } from 'lucide-react';

const TMDB_BASE_URL = 'https://image.tmdb.org/t/p/';

const DownloadButton = ({ posterPath, mediaTitle, count = '' }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);

  const imageUrl = `${TMDB_BASE_URL}original${posterPath}`;

  const handleDownload = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!posterPath) return;

    setIsDownloading(true);
    setShowErrorToast(false); // Reset toast status if re-triggered

    try {
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error('Network asset fetching failed.');

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;

      const safeTitle = mediaTitle
        ? mediaTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()
        : 'poster';
      link.download = `${safeTitle}_poster_${count}.jpg`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error handling media file download pipeline:', error);
      // Instead of an alert, trigger the interactive action toast overlay
      setShowErrorToast(true);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleOpenInNewTab = () => {
    window.open(imageUrl, '_blank');
    setShowErrorToast(false);
  };

  return (
    <div className="relative">
      <button
        onClick={handleDownload}
        disabled={isDownloading || !posterPath}
        className="flex items-center gap-2 px-3 py-2 bg-zinc-800/90 border border-zinc-700 hover:bg-zinc-700 disabled:bg-zinc-900 disabled:text-zinc-600 disabled:border-zinc-800 text-white rounded-lg text-sm font-medium transition-all duration-200 active:scale-95 shadow-md cursor-pointer"
        title="Download High Resolution Poster Asset"
      >
        {isDownloading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-orange-400" />
            <span>Saving...</span>
          </>
        ) : (
          <Download className="w-4 h-4 text-zinc-300 group-hover:text-white" />
        )}
      </button>

      {/* INTERACTIVE ERROR ACTION TOAST */}
      {showErrorToast && (
        <div className="fixed bottom-6 right-6 z-[1000] flex flex-col gap-3 w-80 p-4 rounded-xl bg-zinc-900 border border-zinc-800 shadow-2xl text-white animate-in slide-in-from-bottom-5 duration-300">
          {/* Header Area */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex gap-2.5 items-center">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-sm font-semibold text-zinc-100">
                Download Blocked
              </p>
            </div>
            <button
              onClick={() => setShowErrorToast(false)}
              className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Description Text */}
          <p className="text-xs text-zinc-400 leading-relaxed">
            Browser security rules blocked the automatic download file
            structure. Would you like to view and save it in a clean tab?
          </p>

          {/* Interactive Choices Row */}
          <div className="flex items-center justify-end gap-2 mt-1">
            <button
              onClick={() => setShowErrorToast(false)}
              className="px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 rounded-md font-medium transition-colors cursor-pointer"
            >
              No, Cancel
            </button>
            <button
              onClick={handleOpenInNewTab}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-md transition-colors shadow-sm cursor-pointer"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Yes, Open</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DownloadButton;
