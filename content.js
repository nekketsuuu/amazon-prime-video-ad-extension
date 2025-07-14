console.log("Amazon Prime Ad Muter: Content script loaded.");

const adSelectors = [
  "div[class*='atvwebplayersdk-ad-timer-countdown']",
  "div[aria-label*='広告を再生しています']",
  "span.atvwebplayersdk-ad-timer-ad-text"
];

let isAdPlaying = false;

function setMute(muted) {
  const video = document.querySelector("video");
  if (video) {
    video.muted = muted;
  }
}

function checkForAd() {
  let adElementFound = false;
  for (const selector of adSelectors) {
    if (document.querySelector(selector)) {
      adElementFound = true;
      break;
    }
  }

  if (adElementFound && !isAdPlaying) {
    // Ad just started
    console.log("Amazon Prime Ad Muter: Ad detected. Muting video.");
    setMute(true);
    isAdPlaying = true;
  } else if (!adElementFound && isAdPlaying) {
    // Ad just ended
    console.log("Amazon Prime Ad Muter: Ad finished. Unmuting video.");
    setMute(false);
    isAdPlaying = false;
  }
}

const observer = new MutationObserver(checkForAd);

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

// Initial check
checkForAd();