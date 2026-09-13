export const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
};

export const isInStandaloneMode = () => {
  return (
    window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true
  );
};
