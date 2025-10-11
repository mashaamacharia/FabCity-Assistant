import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ExternalLink } from 'lucide-react';

const Message = ({ message, onLinkClick }) => {
  const isUser = message.sender === 'user';

  // Extract links from markdown text
  const extractLinks = (text) => {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const links = [];
    let match;
    while ((match = linkRegex.exec(text)) !== null) {
      links.push({ text: match[1], url: match[2] });
    }
    return links;
  };

  const links = extractLinks(message.text);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}
    >
      <div
        className={`max-w-[85%] md:max-w-[75%] px-5 py-4 rounded-2xl ${
          isUser
            ? 'bg-fabcity-yellow text-white shadow-md'
            : 'bg-gray-100 text-gray-900 border border-gray-200'
        }`}
      >
        <div className="markdown-content">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ node, href, children, ...props }) => (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (href && onLinkClick) {
                      onLinkClick(href);
                    }
                  }}
                  className={`inline-flex items-center gap-1 hover:underline ${
                    isUser ? 'text-white' : 'text-fabcity-blue'
                  }`}
                  {...props}
                >
                  {children}
                  <ExternalLink size={12} className="inline" />
                </button>
              ),
            }}
          >
            {message.text}
          </ReactMarkdown>
        </div>
        <div className={`text-xs mt-1 ${isUser ? 'text-white/80' : 'text-gray-400'}`}>
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default Message;

