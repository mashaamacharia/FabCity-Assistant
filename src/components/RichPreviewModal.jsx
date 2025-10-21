import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Maximize2, Minimize2, ExternalLink, Globe, FileText, Image as ImageIcon } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';

const RichPreviewModal = ({ url, onClose }) => {
  const [fileType, setFileType] = useState('web');
  const [embedUrl, setEmbedUrl] = useState(url);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [metadata, setMetadata] = useState(null);
  const [loadingMetadata, setLoadingMetadata] = useState(false);
  const [embedMode, setEmbedMode] = useState('checking'); // 'checking', 'iframe', 'preview'

  // Fetch website metadata
  const fetchMetadata = useCallback(async (targetUrl) => {
    setLoadingMetadata(true);
    try {
      const corsProxy = 'https://api.allorigins.win/raw?url=';
      const response = await fetch(corsProxy + encodeURIComponent(targetUrl), {
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });
      const html = await response.text();
      
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      const title = doc.querySelector('meta[property="og:title"]')?.content ||
                    doc.querySelector('meta[name="twitter:title"]')?.content ||
                    doc.querySelector('title')?.textContent ||
                    new URL(targetUrl).hostname;
      
      const description = doc.querySelector('meta[property="og:description"]')?.content ||
                         doc.querySelector('meta[name="twitter:description"]')?.content ||
                         doc.querySelector('meta[name="description"]')?.content ||
                         'No description available';
      
      const image = doc.querySelector('meta[property="og:image"]')?.content ||
                    doc.querySelector('meta[name="twitter:image"]')?.content ||
                    null;
      
      const domain = new URL(targetUrl).hostname;
      const favicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
      
      setMetadata({
        title: title.substring(0, 100),
        description: description.substring(0, 300),
        image,
        favicon,
        url: targetUrl,
        domain
      });
    } catch (error) {
      console.error('Failed to fetch metadata:', error);
      const domain = new URL(targetUrl).hostname;
      setMetadata({
        title: domain,
        description: 'Click below to open this website',
        image: null,
        favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
        url: targetUrl,
        domain
      });
    } finally {
      setLoadingMetadata(false);
    }
  }, []);

  useEffect(() => {
    if (!url) return;
    setEmbedMode('checking');

    let processedUrl = url;
    let detectedType = 'web';

    // Google Drive
    if (url.includes('drive.google.com/file/d/')) {
      const fileIdMatch = url.match(/\/file\/d\/([^\/]+)/);
      if (fileIdMatch) {
        processedUrl = `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
        detectedType = 'googledrive';
        setFileType(detectedType);
        setEmbedUrl(processedUrl);
        setEmbedMode('iframe');
        return;
      }
    }

    // YouTube
    if (url.includes('youtube.com/watch') || url.includes('youtu.be/')) {
      let videoId = '';
      if (url.includes('youtube.com/watch')) {
        const urlParams = new URLSearchParams(url.split('?')[1]);
        videoId = urlParams.get('v');
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0];
      }
      if (videoId) {
        processedUrl = `https://www.youtube.com/embed/${videoId}`;
        detectedType = 'youtube';
        setFileType(detectedType);
        setEmbedUrl(processedUrl);
        setEmbedMode('iframe');
        return;
      }
    }

    // Vimeo
    if (url.includes('vimeo.com/')) {
      const videoIdMatch = url.match(/vimeo\.com\/(\d+)/);
      if (videoIdMatch) {
        processedUrl = `https://player.vimeo.com/video/${videoIdMatch[1]}`;
        detectedType = 'vimeo';
        setFileType(detectedType);
        setEmbedUrl(processedUrl);
        setEmbedMode('iframe');
        return;
      }
    }

    // Dropbox
    if (url.includes('dropbox.com')) {
      processedUrl = url.replace('www.dropbox.com', 'dl.dropboxusercontent.com').replace('?dl=0', '');
    }

    // File types
    const urlLower = url.toLowerCase();
    if (urlLower.endsWith('.pdf') || urlLower.includes('.pdf?') || urlLower.includes('/pdf/')) {
      detectedType = 'pdf';
      if (!url.includes('drive.google.com')) {
        processedUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
      }
      setFileType(detectedType);
      setEmbedUrl(processedUrl);
      setEmbedMode('iframe');
      return;
    } else if (/\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)(\?|$)/i.test(urlLower)) {
      detectedType = 'image';
      setFileType(detectedType);
      setEmbedUrl(processedUrl);
      setEmbedMode('iframe');
      return;
    } else if (/\.(mp4|webm|ogg|mov)(\?|$)/i.test(urlLower)) {
      detectedType = 'video';
      setFileType(detectedType);
      setEmbedUrl(processedUrl);
      setEmbedMode('iframe');
      return;
    }

    // Regular website - always fetch metadata first, attempt iframe in background
    setFileType('web');
    setEmbedUrl(processedUrl);
    fetchMetadata(url);
    
    // Start with preview mode for better UX, iframe will be tested silently
    setEmbedMode('preview');
    
    // Silently test if iframe will work
    testIframeEmbedding(processedUrl);
  }, [url, fetchMetadata]);

  // Test if iframe embedding will work
  const testIframeEmbedding = (targetUrl) => {
    const testFrame = document.createElement('iframe');
    testFrame.style.display = 'none';
    testFrame.src = targetUrl;
    
    let timeout;
    let loaded = false;

    const cleanup = () => {
      clearTimeout(timeout);
      if (testFrame.parentNode) {
        document.body.removeChild(testFrame);
      }
    };

    testFrame.onload = () => {
      loaded = true;
      cleanup();
      // If iframe loads successfully within 3 seconds, we can use iframe mode
      setEmbedMode('iframe');
    };

    testFrame.onerror = () => {
      cleanup();
      setEmbedMode('preview');
    };

    // If no response in 3 seconds, assume it won't embed
    timeout = setTimeout(() => {
      if (!loaded) {
        cleanup();
        setEmbedMode('preview');
      }
    }, 3000);

    document.body.appendChild(testFrame);
  };

  const getFileTypeIcon = () => {
    switch (fileType) {
      case 'pdf':
        return <FileText size={80} className="text-red-500/40" />;
      case 'image':
        return <ImageIcon size={80} className="text-blue-500/40" />;
      case 'youtube':
      case 'vimeo':
      case 'video':
        return (
          <svg className="w-20 h-20 text-red-500/40" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
          </svg>
        );
      default:
        return <Globe size={80} className="text-fabcity-blue/40" />;
    }
  };

  const renderIframeView = () => {
    const showHeader = fileType === 'youtube' || fileType === 'vimeo' || fileType === 'googledrive';
    
    return (
      <div className="w-full h-full flex flex-col">
        {showHeader && (
          <div className="bg-gradient-to-r from-fabcity-blue to-fabcity-green px-4 py-3 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-white font-medium">
                {fileType === 'youtube' && 'YouTube Video'}
                {fileType === 'vimeo' && 'Vimeo Video'}
                {fileType === 'googledrive' && 'Google Drive Document'}
              </span>
            </div>
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="text-white hover:text-gray-200 text-sm font-medium flex items-center gap-2"
            >
              {isFullScreen ? <><Minimize2 size={16} /> Exit</> : <><Maximize2 size={16} /> Full Screen</>}
            </button>
          </div>
        )}
        
        <div className="flex-1 overflow-hidden relative">
          {fileType === 'image' ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-900">
              <img
                src={embedUrl}
                alt="Preview"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ) : fileType === 'video' ? (
            <div className="w-full h-full flex items-center justify-center bg-black">
              <video controls className="max-w-full max-h-full">
                <source src={embedUrl} />
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            <iframe
              src={embedUrl}
              className="w-full h-full border-0"
              title="Content Preview"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-presentation"
            />
          )}
        </div>
        
        {fileType === 'pdf' && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-fabcity-green text-white py-3 hover:bg-opacity-90 transition-colors"
          >
            <Download size={18} />
            Download PDF
          </a>
        )}
      </div>
    );
  };

  const renderPreviewView = () => {
    if (loadingMetadata) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-fabcity-blue border-t-transparent mb-4"></div>
          <p className="text-gray-600 font-medium">Loading preview...</p>
        </div>
      );
    }

    if (!metadata) {
      return (
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="text-center">
            <Globe size={64} className="text-gray-400 mb-4 mx-auto" />
            <p className="text-gray-600">Unable to load preview</p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 flex flex-col overflow-auto bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-3xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
            {/* Hero Image */}
            <div className="relative bg-gradient-to-br from-fabcity-blue/10 to-fabcity-green/10 h-72 flex items-center justify-center overflow-hidden">
              {metadata.image ? (
                <img 
                  src={metadata.image} 
                  alt={metadata.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className={`${metadata.image ? 'hidden' : 'flex'} w-full h-full items-center justify-center bg-gradient-to-br from-fabcity-blue/20 to-fabcity-green/20`}>
                {getFileTypeIcon()}
              </div>
              
              {/* Favicon Badge */}
              <div className="absolute bottom-6 left-6 bg-white rounded-2xl p-4 shadow-2xl border border-gray-100">
                <img 
                  src={metadata.favicon} 
                  alt="Site icon"
                  className="w-14 h-14"
                  onError={(e) => {
                    e.target.src = `https://www.google.com/s2/favicons?domain=${metadata.domain}&sz=128`;
                  }}
                />
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">
                {metadata.title}
              </h2>
              
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <Globe size={16} />
                <span className="font-medium">{metadata.domain}</span>
              </div>
              
              <p className="text-gray-700 leading-relaxed mb-8 text-lg">
                {metadata.description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={metadata.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-gradient-to-r from-fabcity-blue to-fabcity-green text-white px-8 py-4 rounded-xl hover:shadow-xl transition-all flex items-center justify-center gap-3 font-semibold text-lg"
                >
                  <ExternalLink size={22} />
                  Visit Website
                </a>
                {!isFullScreen && (
                  <button
                    onClick={() => setIsFullScreen(true)}
                    className="sm:w-auto bg-white border-2 border-gray-300 text-gray-700 px-6 py-4 rounded-xl hover:border-fabcity-blue hover:text-fabcity-blue transition-all flex items-center justify-center gap-2 font-semibold"
                  >
                    <Maximize2 size={20} />
                    Expand
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!url) return null;

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
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className={`bg-white rounded-2xl shadow-2xl overflow-hidden relative transition-all duration-300 ${
            isFullScreen 
              ? 'fixed inset-0 w-full h-full rounded-none' 
              : 'w-full max-w-6xl h-[90vh]'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 bg-white/95 backdrop-blur-sm rounded-full p-3 shadow-xl hover:bg-gray-100 transition-all hover:scale-110"
          >
            <X size={24} className="text-gray-700" />
          </button>

          {/* Content */}
          {embedMode === 'checking' && (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-fabcity-blue border-t-transparent mb-4 mx-auto"></div>
                <p className="text-gray-600 font-medium">Loading content...</p>
              </div>
            </div>
          )}
          
          {embedMode === 'iframe' && renderIframeView()}
          {embedMode === 'preview' && renderPreviewView()}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RichPreviewModal;