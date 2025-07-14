const adSelectors = [
  "div[class*='atvwebplayersdk-ad-timer-countdown']",
  "div[aria-label*='広告を再生しています']",
  "span.atvwebplayersdk-ad-timer-ad-text"
];

function setMute(muted) {
  const video = document.querySelector("video");
  if (video) {
    video.muted = muted;
  }
}

function checkForAd() {
  let adFound = false;
  for (const selector of adSelectors) {
    if (document.querySelector(selector)) {
      adFound = true;
      break;
    }
  }
  setMute(adFound);
}

const observer = new MutationObserver(checkForAd);

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

// Initial check
checkForAd();