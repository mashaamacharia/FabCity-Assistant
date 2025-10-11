import { motion, AnimatePresence } from 'framer-motion';
import { X, Download } from 'lucide-react';
import { useEffect, useState } from 'react';

const RichPreviewModal = ({ url, onClose }) => {
  const [fileType, setFileType] = useState('web');

  useEffect(() => {
    if (!url) return;

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
      case 'pdf':
        return (
          <div className="w-full h-full flex flex-col">
            <div className="flex-1 overflow-hidden">
              <iframe
                src={url}
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
              src={url}
              alt="Preview"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        );

      case 'video':
        return (
          <div className="w-full h-full flex items-center justify-center bg-black">
            <video controls className="max-w-full max-h-full">
              <source src={url} />
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
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-fabcity-blue hover:text-fabcity-green text-sm font-medium whitespace-nowrap"
              >
                Open in new tab →
              </a>
            </div>
            <iframe
              src={url}
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
          className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[80vh] overflow-hidden relative"
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

