console.log("Amazon Prime Ad Muter: Content script loaded.");

const adSelectors = [
  "div[class*='atvwebplayersdk-ad-timer-countdown']",
  "div[aria-label*='広告を再生しています']",
  "span.atvwebplayersdk-ad-timer-ad-text"
];

function setMute(muted) {
  const video = document.querySelector("video");
  if (video) {
    if (video.muted !== muted) {
      video.muted = muted;
      console.log(`Amazon Prime Ad Muter: Video mute state set to ${muted}`);
    } else {
      console.log(`Amazon Prime Ad Muter: Video mute state is already ${muted}`);
    }
  } else {
    console.log("Amazon Prime Ad Muter: Video element not found.");
  }
}

function checkForAd() {
  console.log("Amazon Prime Ad Muter: Checking for ads...");
  let adFound = false;
  for (const selector of adSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      console.log(`Amazon Prime Ad Muter: Found ad element with selector: ${selector}`);
      adFound = true;
      break;
    }
  }
  
  if (adFound) {
      console.log("Amazon Prime Ad Muter: Ad detected.");
  } else {
      console.log("Amazon Prime Ad Muter: No ad detected.");
  }

  setMute(adFound);
}

const observer = new MutationObserver((mutations) => {
    console.log("Amazon Prime Ad Muter: DOM changed, running ad check.");
    checkForAd();
});

console.log("Amazon Prime Ad Muter: Starting MutationObserver.");
observer.observe(document.body, {
  childList: true,
  subtree: true,
});

// Initial check
console.log("Amazon Prime Ad Muter: Running initial ad check.");
checkForAd();
