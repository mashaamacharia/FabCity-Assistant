import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';

const Message = ({ message, onLinkClick }) => {
  const isUser = message.sender === 'user';
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(!isUser && !message.isTyped);

  // Simulate typing effect for AI responses
  useEffect(() => {
    if (isUser || message.isTyped) {
      setDisplayedText(message.text);
      setIsTyping(false);
      return;
    }

    let currentText = '';
    let currentIndex = 0;
    setIsTyping(true);

    const typeNextCharacter = () => {
      if (currentIndex < message.text.length) {
        // Handle markdown links specially - type them as a unit
        const remainingText = message.text.slice(currentIndex);
        const linkMatch = remainingText.match(/^\[([^\]]+)\]\(([^)]+)\)/);
        
        if (linkMatch) {
          // Type the entire link at once
          currentText += linkMatch[0];
          currentIndex += linkMatch[0].length;
        } else {
          // Type single character
          currentText += message.text[currentIndex];
          currentIndex++;
        }

        setDisplayedText(currentText);
        
        // Randomize typing speed for natural feel
        const delay = Math.random() * 20 + 10; // 10-30ms
        setTimeout(typeNextCharacter, delay);
      } else {
        setIsTyping(false);
        // Mark message as typed in parent component
        if (message.onTypingComplete) {
          message.onTypingComplete(message.id);
        }
      }
    };

    typeNextCharacter();
  }, [message.text, isUser]);

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

  const links = extractLinks(displayedText);

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
            {displayedText}
          </ReactMarkdown>
          {isTyping && !isUser && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block ml-1 -mb-1 w-1.5 h-4 bg-fabcity-green"
            />
          )}
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

