const adIdentifiers = [".ad-container", ".video-ad-container", ".ad-wrapper", ".advertisement", ".promo"];

function setMute(muted) {
  const video = document.querySelector("video");
  if (video) {
    video.muted = muted;
  }
}

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.addedNodes.length) {
      for (const identifier of adIdentifiers) {
        if (document.querySelector(identifier)) {
          setMute(true);
          return;
        }
      }
    }
    if (mutation.removedNodes.length) {
      let adContainerFound = false;
      for (const identifier of adIdentifiers) {
        if (document.querySelector(identifier)) {
          adContainerFound = true;
          break;
        }
      }
      if (!adContainerFound) {
        setMute(false);
      }
    }
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});