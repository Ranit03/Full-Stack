// Force background color - add this to your frontend code
(function() {
  // Execute immediately when loaded
  document.body.style.backgroundColor = '#000000';
  document.documentElement.style.backgroundColor = '#000000';
  
  // Also add an event listener to ensure it runs after DOM is fully loaded
  document.addEventListener('DOMContentLoaded', function() {
    document.body.style.backgroundColor = '#000000';
    document.documentElement.style.backgroundColor = '#000000';
    if (document.getElementById('root')) {
      document.getElementById('root').style.backgroundColor = '#000000';
    }
    
    // Create and inject a style element with !important rules
    const style = document.createElement('style');
    style.textContent = `
      html, body, #root {
        background-color: #000000 !important;
        background: #000000 !important;
        color: #ffffff !important;
      }
    `;
    document.head.appendChild(style);
  });
  
  // Also try to catch any later changes
  const observer = new MutationObserver(function() {
    document.body.style.backgroundColor = '#000000';
    document.documentElement.style.backgroundColor = '#000000';
  });
  
  // Start observing once DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
    observer.observe(document.body, { attributes: true, childList: true, subtree: true });
  });
})();
