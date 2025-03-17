import { useEffect } from "react";

const InstagramRedirect: React.FC = () => {
  useEffect(() => {
    function isInstagramWebView(): boolean {
      const ua = navigator.userAgent.toLowerCase();
      return ua.includes("instagram");
    }

    if (isInstagramWebView()) {
      const siteUrl = "https://loveprompt.heymahodaye.site/"; // Replace with your actual website

      // Try to open in Chrome (Android)
      window.location.replace(`googlechrome://navigate?url=${siteUrl}`);

      // Immediate fallback for Safari (iOS)
      window.location.replace(siteUrl);
    }
  }, []);

  return null; // No UI needed
};

export default InstagramRedirect;
