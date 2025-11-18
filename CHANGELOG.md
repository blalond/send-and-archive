# Changelog

All notable changes to the Send and Archive Thunderbird extension will be documented in this file.

## [1.0.1] - 2025-11-18

### Fixed
- **Keyboard Shortcut**: Changed from `Ctrl+Shift+Enter` to `Ctrl+Shift+S` for better usability and to avoid conflicts with other shortcuts
- **Manifest V3 Compatibility**: Replaced deprecated `applications` property with `browser_specific_settings` in manifest.json (fixes warning on load)
- **Context Menu Error**: Removed all `messenger.menus` code that was causing "messenger.menus is undefined" error at background.js:178
- **Send API Error**: Fixed critical "messenger.compose.sendMessage is not a function" error by:
  - Adding required `compose.send` permission to manifest.json
  - Using correct Thunderbird API: `messenger.compose.sendMessage(tabId, {mode: 'sendNow'})`
  - Researched and implemented proper Thunderbird MailExtension API (not Firefox API)

### Improved
- **Smart Button Visibility**: Button now only shows/enables in reply and forward windows, disabled for new compose windows
  - Uses `ComposeDetails.type` property to detect compose mode (new/reply/forward/draft)
  - Fallback to `relatedMessageId` check for backwards compatibility
  - Automatically enables/disables button when compose windows open or update
- **Better Error Handling**: Added user-friendly notifications when trying to use the feature in non-reply windows
- **Code Quality**: Removed unused context menu code, improved comments and documentation

### Changed
- Version bumped to 1.0.1 in manifest.json
- Updated all documentation to reflect API and feature changes
- Rebuilt XPI package with fixed code

## [1.0.0] - 2024

### Added
- Initial release with Send and Archive functionality
- Toolbar button in compose windows
- Keyboard shortcut support
- Options page for configuring notifications
- Native integration with Thunderbird's archive system
- Error handling and user notifications
- Support for Thunderbird 128+ with Manifest V3
