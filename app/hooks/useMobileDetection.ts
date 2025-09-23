import { useState, useEffect } from 'react';

/**
 * Custom hook to detect if the user is on a mobile device
 * Returns true for mobile devices, false for desktop
 */
export const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      // Check screen width (mobile breakpoint)
      const screenWidth = window.innerWidth <= 768;
      
      // Check user agent for mobile devices
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileKeywords = [
        'mobile', 'android', 'iphone', 'ipad', 'tablet', 
        'blackberry', 'windows phone', 'webos'
      ];
      const userAgentMobile = mobileKeywords.some(keyword => 
        userAgent.includes(keyword)
      );
      
      // Check for touch capability
      const hasTouchScreen = 'ontouchstart' in window || 
        navigator.maxTouchPoints > 0;
      
      // Consider it mobile if any of these conditions are true
      const mobile = screenWidth || (userAgentMobile && hasTouchScreen);
      setIsMobile(mobile);
    };

    // Check on mount
    checkMobile();

    // Listen for window resize
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};