# Changelog

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
