import React from 'react';
import { createRoot } from 'react-dom/client';
import ChatWidget from './components/ChatWidget';
import WIDGET_CONFIG from '../widget.config.js';
import './index.css';

// Embeddable Chat Widget Script
// This file creates a standalone widget that can be embedded in any website

(function() {
  'use strict';

  // Configuration - can be overridden by the embedding page
  // Priority: window.FabCityConfig > widget.config.js > fallback
  const defaultConfig = {
    apiUrl: window.FabCityConfig?.apiUrl || WIDGET_CONFIG.apiUrl || 'http://localhost:3001',
    name: window.FabCityConfig?.name || WIDGET_CONFIG.name || 'Fab City Assistant',
    // Add more configuration options as needed
  };

  // Wait for DOM to be ready
  const initWidget = () => {
    // Create container div for the widget if it doesn't exist
    let widgetContainer = document.getElementById('fabcity-chat-widget-root');
    
    if (!widgetContainer) {
      widgetContainer = document.createElement('div');
      widgetContainer.id = 'fabcity-chat-widget-root';
      document.body.appendChild(widgetContainer);
    }

    // Create React root and render the widget
    const root = createRoot(widgetContainer);
    root.render(
      <React.StrictMode>
        <ChatWidget config={defaultConfig} />
      </React.StrictMode>
    );

    console.log('✅ Fab City AI Chat Widget loaded successfully');
    console.log('🌐 Configured API URL:', defaultConfig.apiUrl);
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }
})();

