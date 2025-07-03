(function() {
  // Configuration object that will be populated from script attributes
  const config = {
    clientId: '',
    primaryColor: '#0070f3',
    position: 'right',
    title: 'Chat with us',
    autoOpen: false,
    openDelay: 30000,
  };

  // Extract configuration from script tag
  function extractConfig() {
    const scriptTag = document.currentScript || (function() {
      const scripts = document.getElementsByTagName('script');
      return scripts[scripts.length - 1];
    })();

    if (scriptTag) {
      config.clientId = scriptTag.getAttribute('data-client-id') || config.clientId;
      config.primaryColor = scriptTag.getAttribute('data-primary-color') || config.primaryColor;
      config.position = scriptTag.getAttribute('data-position') || config.position;
      config.title = scriptTag.getAttribute('data-title') || config.title;
      config.autoOpen = scriptTag.getAttribute('data-auto-open') === 'true' || config.autoOpen;
      config.openDelay = parseInt(scriptTag.getAttribute('data-open-delay') || config.openDelay);
    }
  }

  // Create the chat widget container
  function createChatWidget() {
    // Create container for the widget
    const container = document.createElement('div');
    container.id = 'connectai-chat-container';
    container.style.position = 'fixed';
    container.style.bottom = '20px';
    container.style[config.position] = '20px';
    container.style.zIndex = '9999';
    document.body.appendChild(container);

    // Create chat bubble
    const bubble = document.createElement('div');
    bubble.id = 'connectai-chat-bubble';
    bubble.style.width = '60px';
    bubble.style.height = '60px';
    bubble.style.borderRadius = '50%';
    bubble.style.backgroundColor = config.primaryColor;
    bubble.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    bubble.style.display = 'flex';
    bubble.style.alignItems = 'center';
    bubble.style.justifyContent = 'center';
    bubble.style.cursor = 'pointer';
    bubble.style.transition = 'all 0.3s ease';
    bubble.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`;
    container.appendChild(bubble);
    
    // Create chat window (initially hidden)
    const chatWindow = document.createElement('div');
    chatWindow.id = 'connectai-chat-window';
    chatWindow.style.position = 'absolute';
    chatWindow.style.bottom = '80px';
    chatWindow.style[config.position] = '0';
    chatWindow.style.width = '350px';
    chatWindow.style.height = '500px';
    chatWindow.style.backgroundColor = 'white';
    chatWindow.style.borderRadius = '12px';
    chatWindow.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.15)';
    chatWindow.style.display = 'none';
    chatWindow.style.flexDirection = 'column';
    chatWindow.style.overflow = 'hidden';
    chatWindow.style.transition = 'all 0.3s ease';
    container.appendChild(chatWindow);

    // Create chat header
    const header = document.createElement('div');
    header.style.padding = '12px 16px';
    header.style.backgroundColor = config.primaryColor;
    header.style.color = 'white';
    header.style.fontWeight = 'bold';
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    header.innerHTML = `
      <span>${config.title}</span>
      <span id="connectai-close-button" style="cursor:pointer">×</span>
    `;
    chatWindow.appendChild(header);

    // Create messages container
    const messagesContainer = document.createElement('div');
    messagesContainer.id = 'connectai-messages';
    messagesContainer.style.flexGrow = '1';
    messagesContainer.style.padding = '16px';
    messagesContainer.style.overflowY = 'auto';
    chatWindow.appendChild(messagesContainer);

    // Add initial bot message
    const welcomeMessage = document.createElement('div');
    welcomeMessage.style.background = '#f0f0f0';
    welcomeMessage.style.borderRadius = '12px';
    welcomeMessage.style.padding = '10px 16px';
    welcomeMessage.style.marginBottom = '12px';
    welcomeMessage.style.maxWidth = '80%';
    welcomeMessage.style.alignSelf = 'flex-start';
    welcomeMessage.textContent = 'Hi there! 👋 How can I help you today?';
    messagesContainer.appendChild(welcomeMessage);

    // Create input area
    const inputArea = document.createElement('div');
    inputArea.style.borderTop = '1px solid #eee';
    inputArea.style.padding = '12px';
    inputArea.style.display = 'flex';
    inputArea.innerHTML = `
      <input id="connectai-input" type="text" placeholder="Type your message..." style="flex-grow:1; padding:8px 12px; border:1px solid #ddd; border-radius:20px; margin-right:8px;">
      <button id="connectai-send" style="background:${config.primaryColor}; color:white; border:none; border-radius:50%; width:36px; height:36px; display:flex; align-items:center; justify-content:center; cursor:pointer;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      </button>
    `;
    chatWindow.appendChild(inputArea);

    // Add event listeners
    bubble.addEventListener('click', toggleChat);
    document.getElementById('connectai-close-button').addEventListener('click', closeChat);
    document.getElementById('connectai-send').addEventListener('click', sendMessage);
    document.getElementById('connectai-input').addEventListener('keypress', function(e) {
      if (e.key === 'Enter') sendMessage();
    });

    // Auto-open chat if configured
    if (config.autoOpen) {
      setTimeout(openChat, config.openDelay);
    }
  }

  // Toggle chat window visibility
  function toggleChat() {
    const chatWindow = document.getElementById('connectai-chat-window');
    if (chatWindow.style.display === 'none') {
      openChat();
    } else {
      closeChat();
    }
  }

  // Open chat window
  function openChat() {
    const chatWindow = document.getElementById('connectai-chat-window');
    chatWindow.style.display = 'flex';
    document.getElementById('connectai-input').focus();
  }

  // Close chat window
  function closeChat(e) {
    if (e) e.stopPropagation();
    const chatWindow = document.getElementById('connectai-chat-window');
    chatWindow.style.display = 'none';
  }

  // Send a message
  function sendMessage() {
    const input = document.getElementById('connectai-input');
    const text = input.value.trim();
    if (!text) return;

    // Add user message to chat
    const messagesContainer = document.getElementById('connectai-messages');
    const userMessage = document.createElement('div');
    userMessage.style.background = config.primaryColor;
    userMessage.style.color = 'white';
    userMessage.style.borderRadius = '12px';
    userMessage.style.padding = '10px 16px';
    userMessage.style.marginBottom = '12px';
    userMessage.style.marginLeft = 'auto';
    userMessage.style.maxWidth = '80%';
    userMessage.textContent = text;
    messagesContainer.appendChild(userMessage);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Clear input
    input.value = '';

    // Send message to ConnectAI server
    sendToConnectAI(text)
      .then(response => {
        // Add bot response
        const botMessage = document.createElement('div');
        botMessage.style.background = '#f0f0f0';
        botMessage.style.borderRadius = '12px';
        botMessage.style.padding = '10px 16px';
        botMessage.style.marginBottom = '12px';
        botMessage.style.maxWidth = '80%';
        botMessage.textContent = response;
        messagesContainer.appendChild(botMessage);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      })
      .catch(error => {
        console.error('ConnectAI Error:', error);
        // Show error message
        const errorMessage = document.createElement('div');
        errorMessage.style.background = '#ffe0e0';
        errorMessage.style.borderRadius = '12px';
        errorMessage.style.padding = '10px 16px';
        errorMessage.style.marginBottom = '12px';
        errorMessage.style.maxWidth = '80%';
        errorMessage.textContent = 'Sorry, there was an error processing your request.';
        messagesContainer.appendChild(errorMessage);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      });
  }

  // Send message to ConnectAI server
  function sendToConnectAI(text) {
    // In a real implementation, this would make an API call to your ConnectAI backend
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate AI response
        const responses = [
          "Thank you for your message! How can I help you further?",
          "I understand what you're looking for. Would you like more information?",
          "That's a great question! Our team specializes in exactly that.",
          "I'd be happy to help with that. Could you provide a bit more detail?"
        ];
        const response = responses[Math.floor(Math.random() * responses.length)];
        resolve(response);
      }, 1000);
    });
  }

  // Initialize widget
  function init() {
    extractConfig();
    createChatWidget();
    
    // Log successful initialization
    console.log(`ConnectAI Chat Widget initialized with client ID: ${config.clientId}`);
  }

  // Initialize once DOM is fully loaded
  if (document.readyState === 'complete') {
    init();
  } else {
    window.addEventListener('load', init);
  }
})();