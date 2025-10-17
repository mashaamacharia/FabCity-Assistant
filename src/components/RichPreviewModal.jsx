import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Maximize2, Minimize2, ExternalLink, AlertCircle, Globe } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';

const RichPreviewModal = ({ url, onClose }) => {
  const [fileType, setFileType] = useState('web');
  const [embedUrl, setEmbedUrl] = useState(url);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [metadata, setMetadata] = useState(null);
  const [loadingMetadata, setLoadingMetadata] = useState(false);
  const [showRichPreview, setShowRichPreview] = useState(false);
  const [attemptedEmbed, setAttemptedEmbed] = useState(false);

  // Fetch website metadata when iframe fails
  const fetchMetadata = useCallback(async (targetUrl) => {
    setLoadingMetadata(true);
    try {
      // Try to fetch the page and extract metadata
      // Using a CORS proxy for client-side fetching
      const corsProxy = 'https://api.allorigins.win/raw?url=';
      const response = await fetch(corsProxy + encodeURIComponent(targetUrl));
      const html = await response.text();
      
      // Parse HTML to extract metadata
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Extract metadata
      const title = doc.querySelector('meta[property="og:title"]')?.content ||
                    doc.querySelector('meta[name="twitter:title"]')?.content ||
                    doc.querySelector('title')?.textContent ||
                    targetUrl;
      
      const description = doc.querySelector('meta[property="og:description"]')?.content ||
                         doc.querySelector('meta[name="twitter:description"]')?.content ||
                         doc.querySelector('meta[name="description"]')?.content ||
                         'No description available';
      
      const image = doc.querySelector('meta[property="og:image"]')?.content ||
                    doc.querySelector('meta[name="twitter:image"]')?.content ||
                    null;
      
      const favicon = doc.querySelector('link[rel="icon"]')?.href ||
                     doc.querySelector('link[rel="shortcut icon"]')?.href ||
                     `https://www.google.com/s2/favicons?domain=${new URL(targetUrl).hostname}&sz=128`;
      
      setMetadata({
        title: title.substring(0, 100),
        description: description.substring(0, 200),
        image,
        favicon,
        url: targetUrl
      });
    } catch (error) {
      console.error('Failed to fetch metadata:', error);
      // Set basic metadata as fallback
      const domain = new URL(targetUrl).hostname;
      setMetadata({
        title: domain,
        description: 'Click below to open this website in a new tab',
        image: null,
        favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
        url: targetUrl
      });
    } finally {
      setLoadingMetadata(false);
    }
  }, []);

  useEffect(() => {
    if (!url) return;
    setIframeError(false);
    setShowRichPreview(false);
    setAttemptedEmbed(false);

    let processedUrl = url;
    let detectedType = 'web';

    // Convert Google Drive URLs to embeddable format
    if (url.includes('drive.google.com/file/d/')) {
      const fileIdMatch = url.match(/\/file\/d\/([^\/]+)/);
      if (fileIdMatch) {
        const fileId = fileIdMatch[1];
        processedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
        detectedType = 'googledrive';
        setFileType(detectedType);
        setEmbedUrl(processedUrl);
        return;
      }
    }

    // Convert YouTube URLs to embeddable format
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
        return;
      }
    }

    // Convert Vimeo URLs to embeddable format
    if (url.includes('vimeo.com/')) {
      const videoIdMatch = url.match(/vimeo\.com\/(\d+)/);
      if (videoIdMatch) {
        const videoId = videoIdMatch[1];
        processedUrl = `https://player.vimeo.com/video/${videoId}`;
        detectedType = 'vimeo';
        setFileType(detectedType);
        setEmbedUrl(processedUrl);
        return;
      }
    }

    // Convert Dropbox URLs to embeddable format
    if (url.includes('dropbox.com')) {
      processedUrl = url.replace('www.dropbox.com', 'dl.dropboxusercontent.com').replace('?dl=0', '');
      if (url.includes('.pdf')) {
        detectedType = 'pdf';
      } else if (/\.(jpg|jpeg|png|gif|webp|svg)/i.test(url)) {
        detectedType = 'image';
      }
    }

    // Check file type by extension or URL patterns
    const urlLower = url.toLowerCase();
    if (urlLower.endsWith('.pdf') || urlLower.includes('.pdf?') || urlLower.includes('/pdf/')) {
      detectedType = 'pdf';
      // Wrap PDF URLs in Google Docs viewer for better compatibility
      if (!url.includes('drive.google.com')) {
        processedUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
      }
    } else if (/\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)(\?|$)/i.test(urlLower)) {
      detectedType = 'image';
    } else if (/\.(mp4|webm|ogg|mov)(\?|$)/i.test(urlLower)) {
      detectedType = 'video';
    }

    setFileType(detectedType);
    setEmbedUrl(processedUrl);

    // For regular websites (not YouTube, Vimeo, Drive, etc.), show rich preview by default
    // since most websites block iframe embedding
    if (detectedType === 'web') {
      setShowRichPreview(true);
      fetchMetadata(url);
    }
  }, [url, fetchMetadata]);

  if (!url) return null;

  // Handle iframe load error
  const handleIframeError = () => {
    setIframeError(true);
    if (!metadata && !loadingMetadata) {
      fetchMetadata(url);
    }
  };

  const renderPreview = () => {
    switch (fileType) {
      case 'youtube':
      case 'vimeo':
        return (
          <div className="w-full h-full flex flex-col">
            <div className="bg-gradient-to-r from-red-500 to-pink-500 px-4 py-3 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-white font-medium">
                  {fileType === 'youtube' ? 'YouTube Video' : 'Vimeo Video'}
                </span>
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
                title="Video Preview"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        );

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
              <div className="flex items-center gap-3">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-fabcity-blue hover:text-fabcity-green text-sm font-medium whitespace-nowrap flex items-center gap-2"
                >
                  <ExternalLink size={16} />
                  Open in New Tab
                </a>
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
            </div>
            {(iframeError || (showRichPreview && !attemptedEmbed)) ? (
              <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-8 overflow-auto">
                {loadingMetadata ? (
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fabcity-blue mb-4"></div>
                    <p className="text-gray-600">Loading preview...</p>
                  </div>
                ) : metadata ? (
                  <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                    {/* Preview Image/Thumbnail */}
                    <div className="relative bg-gradient-to-br from-fabcity-blue/10 to-fabcity-green/10 h-64 flex items-center justify-center overflow-hidden">
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
                        <Globe size={80} className="text-fabcity-blue/40" />
                      </div>
                      {/* Website favicon overlay */}
                      <div className="absolute bottom-4 left-4 bg-white rounded-xl p-3 shadow-lg">
                        <img 
                          src={metadata.favicon} 
                          alt="Site icon"
                          className="w-12 h-12"
                          onError={(e) => {
                            e.target.src = `https://www.google.com/s2/favicons?domain=${new URL(metadata.url).hostname}&sz=128`;
                          }}
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="flex-1">
                          <h2 className="text-2xl font-bold text-gray-800 mb-2 line-clamp-2">
                            {metadata.title}
                          </h2>
                          <p className="text-sm text-gray-500 mb-3 flex items-center gap-2">
                            <Globe size={14} />
                            {new URL(metadata.url).hostname}
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3">
                        {metadata.description}
                      </p>

                      {/* Alert message */}
                      {iframeError ? (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                          <AlertCircle size={20} className="text-orange-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm text-orange-800">
                              <strong>Embedding failed.</strong> This website's security policies prevent it from being displayed in a preview.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                          <AlertCircle size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm text-blue-800">
                              <strong>Preview Mode.</strong> Most websites block embedding. You can try to embed this site or open it in a new tab.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <a
                          href={metadata.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-gradient-to-r from-fabcity-blue to-fabcity-green text-white px-6 py-4 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-3 font-semibold"
                        >
                          <ExternalLink size={20} />
                          Open Website
                        </a>
                        {!iframeError && (
                          <button
                            onClick={() => {
                              setShowRichPreview(false);
                              setAttemptedEmbed(true);
                            }}
                            className="flex-1 bg-white border-2 border-fabcity-blue text-fabcity-blue px-6 py-4 rounded-xl hover:bg-fabcity-blue hover:text-white transition-all flex items-center justify-center gap-3 font-semibold"
                          >
                            <Maximize2 size={20} />
                            Try to Embed
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="max-w-md text-center">
                    <AlertCircle size={64} className="text-gray-400 mb-4 mx-auto" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      Cannot Display Website
                    </h3>
                    <p className="text-gray-600 mb-6">
                      This website doesn't allow embedding. Please open it in a new tab.
                    </p>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-fabcity-blue text-white px-6 py-3 rounded-lg hover:bg-fabcity-green transition-colors inline-flex items-center gap-2"
                    >
                      <ExternalLink size={18} />
                      Open Website
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <iframe
                src={embedUrl}
                className="w-full flex-1 border-0"
                title="Web Preview"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-presentation allow-top-navigation"
                onError={handleIframeError}
                referrerPolicy="no-referrer-when-downgrade"
              />
            )}
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