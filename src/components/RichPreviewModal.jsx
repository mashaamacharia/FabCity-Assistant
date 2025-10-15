import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Maximize2, Minimize2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const RichPreviewModal = ({ url, onClose }) => {
  const [fileType, setFileType] = useState('web');
  const [embedUrl, setEmbedUrl] = useState(url);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    if (!url) return;

    // Convert Google Drive view URLs to preview URLs for embedding
    let processedUrl = url;
    if (url.includes('drive.google.com/file/d/')) {
      // Extract file ID from Google Drive URL
      const fileIdMatch = url.match(/\/file\/d\/([^\/]+)/);
      if (fileIdMatch) {
        const fileId = fileIdMatch[1];
        // Convert to preview URL which can be embedded
        processedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
        setFileType('googledrive');
        setEmbedUrl(processedUrl);
        return;
      }
    }

    setEmbedUrl(processedUrl);

    const urlLower = url.toLowerCase();
    if (urlLower.endsWith('.pdf')) {
      setFileType('pdf');
    } else if (/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(urlLower)) {
      setFileType('image');
    } else if (/\.(mp4|webm|ogg|mov)$/i.test(urlLower)) {
      setFileType('video');
    } else {
      setFileType('web');
    }
  }, [url]);

  if (!url) return null;

  const renderPreview = () => {
    switch (fileType) {
      case 'googledrive':
        return (
          <div className="w-full h-full flex flex-col">
            <div className="bg-gradient-to-r from-blue-500 to-green-500 px-4 py-3 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.01 1.5c-2.19 0-4.18.79-5.73 2.1L1.55 9.45c-.23.27-.23.66 0 .93l4.73 5.85c1.55 1.31 3.54 2.1 5.73 2.1 4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 15c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>
                </svg>
                <span className="text-sm text-white font-medium">Google Drive Document</span>
              </div>
              <button
                onClick={() => setIsFullScreen(!isFullScreen)}
                className="text-white hover:text-gray-200 text-sm font-medium whitespace-nowrap flex items-center gap-2"
              >
                {isFullScreen ? (
                  <>
                    <Minimize2 size={16} />
                    Exit Full Screen
                  </>
                ) : (
                  <>
                    <Maximize2 size={16} />
                    Full Screen
                  </>
                )}
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <iframe
                src={embedUrl}
                className="w-full h-full border-0"
                title="Google Drive Preview"
                allow="autoplay"
              />
            </div>
          </div>
        );

      case 'pdf':
        return (
          <div className="w-full h-full flex flex-col">
            <div className="flex-1 overflow-hidden">
              <iframe
                src={embedUrl}
                className="w-full h-full border-0"
                title="PDF Preview"
              />
            </div>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-fabcity-green text-white py-3 hover:bg-opacity-90 transition-colors"
            >
              <Download size={18} />
              Download PDF
            </a>
          </div>
        );

      case 'image':
        return (
          <div className="w-full h-full flex items-center justify-center bg-black/50">
            <img
              src={embedUrl}
              alt="Preview"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        );

      case 'video':
        return (
          <div className="w-full h-full flex items-center justify-center bg-black">
            <video controls className="max-w-full max-h-full">
              <source src={embedUrl} />
              Your browser does not support the video tag.
            </video>
          </div>
        );

      case 'web':
      default:
        return (
          <div className="w-full h-full flex flex-col">
            <div className="bg-gray-100 px-4 py-3 border-b flex items-center justify-between">
              <span className="text-sm text-gray-600 truncate flex-1 mr-4">{url}</span>
              <button
                onClick={() => setIsFullScreen(!isFullScreen)}
                className="text-fabcity-blue hover:text-fabcity-green text-sm font-medium whitespace-nowrap flex items-center gap-2"
              >
                {isFullScreen ? (
                  <>
                    <Minimize2 size={16} />
                    Exit Full Screen
                  </>
                ) : (
                  <>
                    <Maximize2 size={16} />
                    Full Screen
                  </>
                )}
              </button>
            </div>
            <iframe
              src={embedUrl}
              className="w-full flex-1 border-0"
              title="Web Preview"
              sandbox="allow-scripts allow-same-origin allow-popups"
            />
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`bg-white rounded-2xl shadow-2xl overflow-hidden relative transition-all duration-300 ${
            isFullScreen 
              ? 'fixed inset-0 w-full h-full rounded-none' 
              : 'w-full max-w-6xl h-[85vh]'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
          >
            <X size={24} className="text-gray-700" />
          </button>
          {renderPreview()}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RichPreviewModal;

