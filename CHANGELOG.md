# Changelog

## Version 1.0.4 (2025-11-18)

### Added
- **background.js**: New `hasArchiveFolderConfigured()` function that proactively checks if an archive folder is configured
  - Uses `messenger.folders.getUnifiedFolder('archives')` API to check for archive folder presence
  - Returns true if archive folder exists, false otherwise
  - Safely handles errors if the API call fails

### Changed
- **background.js**: Updated `updateButtonVisibility()` function to check BOTH conditions:
  - Whether it's a reply/forward window (existing check)
  - Whether an archive folder is configured (new check)
  - Button is now only enabled if BOTH conditions are true
  - Improved console logging to indicate why button is disabled
- **background.js**: Simplified error handling in `archiveOriginalMessage()` function
  - Removed extensive error type checking since issues are prevented upfront
  - Simplified error notifications since archive folder is checked before enabling button
  - Added note in function documentation that archive folder is assumed to be configured
- **README.md**: Updated documentation to reflect new proactive checking behavior
  - Updated Features section to mention proactive checking
  - Updated Usage section to clarify when button is disabled
  - Updated Troubleshooting section with better guidance about archive folder configuration
  - Added version 1.0.4 to version history
- **manifest.json**: Bumped version to 1.0.4

### Improved
- Button is now disabled preemptively when archiving won't work, providing better user experience
- Users get immediate visual feedback (disabled button) instead of error messages after the fact
- Reduced likelihood of "message sent but not archived" scenarios

## Version 1.0.3 (2025-11-18)

### Fixed
- **background.js**: Improved archiving success detection - now properly detects when archiving fails
  - The extension now correctly checks if `messenger.messages.archive()` succeeds or fails
  - Only logs "Message archived successfully" when archiving actually works
  - Handles errors when no archive folder is configured
  - Displays helpful error notification directing users to configure their archive folder
- **README.md**: Updated version references and added comprehensive troubleshooting for archive configuration
- **INSTALL.md**: Updated keyboard shortcut reference from Ctrl+Shift+Enter to correct Ctrl+Shift+S
- **TESTING.md**: 
  - Updated keyboard shortcut references to Ctrl+Shift+S
  - Removed Test 8 (context menu) and replaced with Test 8 (no archive folder configured)
  - Updated version references to 1.0.3
  - Added expected behavior for disabled buttons in new message windows

### Improved
- Better error handling in `archiveOriginalMessage()` function with descriptive error messages
- Error notifications now always show (regardless of notification settings) to alert users of issues
- More informative console logging for debugging archiving issues

## Version 1.0.2 (2025-11-18)

### Fixed
- **options.html**: Updated keyboard shortcut reference from "Ctrl+Alt+Enter" to the correct "Ctrl+Shift+S"
- **options.html**: Removed reference to context menu feature that was previously removed
- **background.js**: Fixed archiving error by removing incorrect `messenger.messages.getFolderDetails()` API call
  - The `messenger.messages.archive()` API handles all folder details automatically
  - Simplified the archiving function to directly use the archive API
  - The archive function now respects user's Thunderbird archive settings without manual intervention

## Version 1.0.1 (2025-11-18)

### Changed
- Changed keyboard shortcut from Ctrl+Shift+Enter to Ctrl+Shift+S for better compatibility
- Removed context menu feature for cleaner implementation

### Fixed
- Fixed compose window detection and tab handling
- Improved error handling and notification system

## Version 1.0.0 (2025-11-18)

### Initial Release
- Send and archive functionality with toolbar button
- Keyboard shortcut support
- Customizable notifications
- Respects Thunderbird's archive settings
