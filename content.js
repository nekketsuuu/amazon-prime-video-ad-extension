console.log("Amazon Prime Ad Muter: Content script loaded.");

const adSelectors = [
  "div[class*='atvwebplayersdk-ad-timer-countdown']",
  "div[aria-label*='広告を再生しています']",
  "span.atvwebplayersdk-ad-timer-ad-text"
];

function setMuteForAllVideos(muted) {
  const videoElements = document.querySelectorAll("video");
  videoElements.forEach(video => {
    if (video.muted !== muted) {
      video.muted = muted;
      console.log(`Amazon Prime Ad Muter: Video mute state changed to ${muted} for a video element.`);
    }
  });
}

function checkForAd() {
  console.log("Amazon Prime Ad Muter: Running ad check.");
  let adElementFound = false;
  for (const selector of adSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      console.log(`Amazon Prime Ad Muter: Selector '${selector}' found an element.`);
      adElementFound = true;
      break;
    } else {
      console.log(`Amazon Prime Ad Muter: Selector '${selector}' did NOT find an element.`);
    }
  }

  console.log(`Amazon Prime Ad Muter: Final adElementFound status: ${adElementFound}`);
  setMuteForAllVideos(adElementFound);
}

const observer = new MutationObserver(checkForAd);

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

// Initial check
checkForAd();