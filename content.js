let debugLogsEnabled = false;
let autoMutingEnabled = true; // Default to true

// Function to log messages conditionally
function log(message) {
  if (debugLogsEnabled) {
    console.log(message);
  }
}

log("Amazon Prime Ad Muter: Content script loaded.");

const adSelectors = [
  "div[class*='atvwebplayersdk-ad-timer-countdown']",
  "div[aria-label*='広告を再生しています']",
  "span.atvwebplayersdk-ad-timer-ad-text"
];

function setMuteForAllVideos(muted) {
  if (!autoMutingEnabled) {
    log("Amazon Prime Ad Muter: Auto Muting is disabled by user setting.");
    return;
  }

  const videoElements = document.querySelectorAll("video");
  videoElements.forEach(video => {
    if (video.muted !== muted) {
      video.muted = muted;
      log(`Amazon Prime Ad Muter: Video mute state changed to ${muted} for a video element.`);
    }
  });
}

function checkForAd() {
  log("Amazon Prime Ad Muter: Running ad check.");
  let adElementFound = false;
  for (const selector of adSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      // Check if the element is visible
      if (element.offsetWidth > 0 || element.offsetHeight > 0) {
        log(`Amazon Prime Ad Muter: Selector '${selector}' found a VISIBLE element.`);
        adElementFound = true;
        break;
      }
    } else {
      log(`Amazon Prime Ad Muter: Selector '${selector}' did NOT find an element.`);
    }
  }

  log(`Amazon Prime Ad Muter: Final adElementFound status: ${adElementFound}`);
  setMuteForAllVideos(adElementFound);
}

const observer = new MutationObserver(checkForAd);

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

// Periodically check for ads every 100ms
setInterval(checkForAd, 100);

// Initial check
checkForAd();

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "toggleDebugLogs") {
    debugLogsEnabled = request.enabled;
    log(`Amazon Prime Ad Muter: Debug logs ${debugLogsEnabled ? 'enabled' : 'disabled'}.`);
  } else if (request.type === "toggleAutoMuting") {
    autoMutingEnabled = request.enabled;
    log(`Amazon Prime Ad Muter: Auto Muting feature ${autoMutingEnabled ? 'enabled' : 'disabled'}.`);
    // Re-evaluate ad state immediately after muting is toggled
    checkForAd();
  }
});

// Load initial states from storage
chrome.storage.local.get(['debugLogsEnabled', 'autoMutingEnabled'], (result) => {
  debugLogsEnabled = result.debugLogsEnabled || false;
  autoMutingEnabled = result.autoMutingEnabled !== false; // Default to true
  log(`Amazon Prime Ad Muter: Initial debug logs state loaded: ${debugLogsEnabled ? 'enabled' : 'disabled'}.`);
  log(`Amazon Prime Ad Muter: Initial Auto Muting feature state loaded: ${autoMutingEnabled ? 'enabled' : 'disabled'}.`);
  // Perform an initial check with the loaded muting state
  checkForAd();
});
