document.addEventListener('DOMContentLoaded', () => {
  const debugLogsToggle = document.getElementById('debugLogsToggle');
  const enableMutingToggle = document.getElementById('enableMutingToggle');

  // Load the saved states
  chrome.storage.local.get(['debugLogsEnabled', 'autoMutingEnabled'], (result) => {
    debugLogsToggle.checked = result.debugLogsEnabled || false;
    enableMutingToggle.checked = result.autoMutingEnabled !== false; // Default to true
  });

  // Save debug logs state and send message to content script when toggled
  debugLogsToggle.addEventListener('change', () => {
    const isEnabled = debugLogsToggle.checked;
    chrome.storage.local.set({ debugLogsEnabled: isEnabled });

    // Send message to all tabs to update content script
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        if (tab.url && tab.url.startsWith("http")) { // Only send to http(s) pages
          chrome.tabs.sendMessage(tab.id, { type: "toggleDebugLogs", enabled: isEnabled });
        }
      });
    });
  });

  // Save auto muting state and send message to content script when toggled
  enableMutingToggle.addEventListener('change', () => {
    const isEnabled = enableMutingToggle.checked;
    chrome.storage.local.set({ autoMutingEnabled: isEnabled });

    // Send message to all tabs to update content script
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        if (tab.url && tab.url.startsWith("http")) { // Only send to http(s) pages
          chrome.tabs.sendMessage(tab.id, { type: "toggleAutoMuting", enabled: isEnabled });
        }
      });
    });
  });
});
