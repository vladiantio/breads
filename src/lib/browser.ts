// source: https://github.com/bluesky-social/social-app/blob/main/src/lib/browser.ts

export const isSafari = /^((?!chrome|android).)*safari/i.test(
  navigator.userAgent,
)
export const isFirefox = /firefox|fxios/i.test(navigator.userAgent)

/**
 * Detects if the user is currently using a mobile device.
 *
 * This function combines several heuristics to determine if the user's browser
 * is running on a mobile device (phone or tablet). It prioritizes modern
 * Client Hint APIs, then falls back to User Agent string analysis and
 * touch event detection.
 *
 * @returns {boolean} True if the device is likely a mobile device, false otherwise.
 *
 * @remarks
 * - User Agent strings can be spoofed or modified, making this method
 *   inherently imperfect.
 * - Some desktop devices have touchscreens, which might lead to false positives
 *   if only touch support is checked.
 * - New or obscure devices might not be accurately detected.
 * - This function considers tablets as mobile devices for most practical
 *   web development purposes (e.g., responsive design).
 * - It's best used for general UI/UX adjustments, not for critical security or
 *   feature gating.
 *
 * @example
 * ```typescript
 * if (isMobileDevice()) {
 *   console.log('You are on a mobile device!')
 *   // Apply mobile-specific styles or logic
 * } else {
 *   console.log('You are on a desktop device.')
 *   // Apply desktop-specific styles or logic
 * }
 * ```
 */
export function isMobileDevice(): boolean {
  // Ensure we are in a browser environment
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false // Not a browser environment (e.g., Node.js, SSR)
  }

  // 1. Client Hint API (navigator.userAgentData) - Modern and most reliable
  // This is a more robust and privacy-friendly way to get device information.
  if ((navigator as { userAgentData?: { mobile: boolean } }).userAgentData?.mobile) {
    return true
  }

  // 2. Traditional User Agent String Detection
  // This is widely supported but less reliable and can be spoofed.
  const userAgent = navigator.userAgent.toLowerCase()

  const mobileUserAgentKeywords = [
    'android',          // Android phones and tablets
    'iphone',           // iPhones
    'ipad',             // iPads (often treated as mobile/tablet for UI)
    'ipod',             // iPod Touch
    'blackberry',       // BlackBerry devices
    'opera mini',       // Opera Mini browser (primarily mobile)
    'mobile',           // Generic 'mobile' keyword (can be tricky, but useful with others)
    'tablet',           // Generic 'tablet' keyword
    'kindle',           // Amazon Kindle devices
    'silk',             // Amazon Silk browser (used on Kindle Fire)
    'fennec',           // Firefox for Android
  ]

  const isUserAgentMobile = mobileUserAgentKeywords.some(keyword => userAgent.includes(keyword))

  if (isUserAgentMobile) {
    return true
  }

  // 3. Touch Event Detection
  // Many mobile devices support touch events, but some desktop devices (e.g., touch screen laptops)
  // also support them, so this alone is not definitive.
  const hasTouchSupport = (
    // Standard touch event
    'ontouchstart' in window ||
    // More modern and robust touch points check
    (navigator.maxTouchPoints > 0) ||
    // Check if the device has coarse pointer (touchscreen)
    window.matchMedia('(pointer: coarse)').matches
  )

  return hasTouchSupport
}
