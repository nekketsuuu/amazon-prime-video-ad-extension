const skipAdButtonSelectors = ["button[aria-label='Skip Ad']", "button[aria-label='Skip']", "div[class*='skipButton']"];

function setMute(muted) {
  const video = document.querySelector("video");
  if (video) {
    video.muted = muted;
  }
}

function checkForAd() {
  let adFound = false;
  for (const selector of skipAdButtonSelectors) {
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

// Initial check in case the ad is already present
checkForAd();
