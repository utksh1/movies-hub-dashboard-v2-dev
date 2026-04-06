# Conventions

## Coding Style
*   **Boilerplate:** Heavy use of standard Android/Java boilerplate.
*   **Callbacks:** Traditional Volley `Response.Listener` and `Response.ErrorListener` for async network operations.
*   **Naming:**
    *   Activities: `[Name]Activity.java` or `[Name].java`
    *   Layouts: `activity_[name].xml` or `fragment_[name].xml`

## Error Handling
*   **Network:** Handled via Volley ErrorListener, often showing a "Try Again" dialog or a Toast.
*   **Security:** Silent fails or redirects to a "Root Detected" activity if environment checks fail.

## Modding Patterns (Identification)
*   **Flag Hardcoding:** Modders override `boolean` variables (e.g., `playPremium = true`) directly in the Java source or Smali.
*   **Ad Neutralization:** Ad providers initialized with empty strings or ad-load methods modified to return early.
*   **Version Spoofing:** Build version parameters modified in `AppConfig` or `Splash`.
