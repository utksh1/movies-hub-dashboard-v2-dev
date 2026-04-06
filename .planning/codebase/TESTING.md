# Testing

## Automated Tests
*   **Unit Tests:** Not present in the decompiled codebase.
*   **Instrumentation Tests:** Not present in the decompiled codebase.
*   **CI/CD:** No visible GitHub Actions or Gitlab CI config in the decompiled root.

## Manual Testing Patterns (Observed)
*   **Root Detection:** Tested by checking for the "NoRootDialog" on rooted devices.
*   **Subscription Check:** Tested by attempting to play "Premium Only" content.
*   **Ad Load:** Tested by checking if banners or interstitials appear on activity transitions.

## Verification Strategy for Web App
*   **Endpoint Checks:** Verify `x-api-key` and `SERVER_URL` return JSON content in the browser/Postman.
*   **Stream Validation:** Check if the returned `stream_url` is playable in a web player like Video.js.
