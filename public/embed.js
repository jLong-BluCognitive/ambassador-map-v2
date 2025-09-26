(function() {
  'use strict';

  // Configuration - automatically detect the host
  const SCRIPT_SRC = document.currentScript ? document.currentScript.src : '';
  const BASE_URL = SCRIPT_SRC ? new URL(SCRIPT_SRC).origin : 'https://main.d3d9zn9ueor3c9.amplifyapp.com';
  const CONTAINER_ID = 'xgrid-ambassador-map';

  // Create and inject the iframe
  function initializeWidget() {
    // Find or create container
    let container = document.getElementById(CONTAINER_ID);

    if (!container) {
      // If no container exists, create one where the script tag is
      container = document.createElement('div');
      container.id = CONTAINER_ID;

      // Find the script tag and insert container before it
      const scripts = document.getElementsByTagName('script');
      const currentScript = scripts[scripts.length - 1];
      currentScript.parentNode.insertBefore(container, currentScript);
    }

    // Set default styles for container
    if (!container.style.width) {
      container.style.width = '100%';
    }
    if (!container.style.height) {
      container.style.height = '800px';
    }

    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.src = BASE_URL;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.display = 'block';
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allowfullscreen', 'true');
    iframe.setAttribute('title', 'XGrid Ambassador Map');

    // Clear container and add iframe
    container.innerHTML = '';
    container.appendChild(iframe);

    // Log success
    console.log('XGrid Ambassador Map widget initialized successfully');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWidget);
  } else {
    // DOM is already ready
    initializeWidget();
  }
})();