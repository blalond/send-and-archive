# Send and Archive Extension for Thunderbird

A Thunderbird extension that adds a "Send and Archive" feature to compose windows, allowing you to send your message and automatically archive the original message being replied to with a single action.

## Features

*   **Toolbar Button**: Adds a "Send and Archive" button to the compose window toolbar
*   **Keyboard Shortcut**: Use `Ctrl+Shift+S` to quickly send and archive
*   **Conditionally Enabled**: Button is only enabled when replying-to or forwarding existing messages and if archive folder is configured
*   **Configurable Notifications**: Enable or disable success notifications via the options page (options page: Tools → Add-ons and Themes → Send and Archive → Options)
*   **Error Handling**: Only archives if the send operation succeeds

## Compatibility

*   **Thunderbird Version**: 128.0 or higher
*   **Manifest Version**: 3
*   **Platform**: Windows, macOS, Linux

## Installation

### From Source

1.  Clone or download this repository
2.  Open Thunderbird
3.  Go to Tools → Add-ons and Themes (or press `Ctrl+Shift+A`)
4.  Click the gear icon ⚙️ and select "Debug Add-ons"
5.  Click "Load Temporary Add-on"
6.  Navigate to the extension directory and select `manifest.json`

### Building a Distribution Package

To create an installable XPI file, use script [`build.sh`](build.sh) or:

```
cd thunderbird-send-and-archive
zip -r send-and-archive.xpi manifest.json background.js options.html options.js icons/ -x "*.DS_Store" "*.git*"
```

Then install the XPI file through Thunderbird's Add-ons manager.

## Technical Details

### Manifest Version

This extension uses Manifest Version 3 for compatibility with modern Thunderbird versions (128+).

### Permissions Required

*   `compose`: Access compose window details
*   `compose.send`: Send composed messages programmatically
*   `messagesRead`: Read message information to find the original message
*   `messagesMove`: Archive messages
*   `accountsRead`: Access account information for archive operations
*   `storage`: Store user preferences
*   `notifications`: Display notifications

## Troubleshooting

### Button doesn't appear or is disabled

*   Make sure the extension is enabled in the Add-ons manager
*   Verify you're replying to or forwarding a message (not composing a new message)
*   **Check that an archive folder is configured**: The button is automatically disabled if no archive folder is set up
    *   Go to: Tools → Account Settings → \[Your Account\] → Copies & Folders → Message Archives
    *   Make sure "Keep message archives in" is checked and a location is selected
*   Try restarting Thunderbird
*   Check that you're in a compose window (not the main Thunderbird window)

### Messages archived to wrong folder

*   This extension uses Thunderbird's built-in archive settings
*   Configure your archive preferences: Tools → Account Settings → Copies & Folders → Message Archives

## Development

### File Structure

```
thunderbird-send-and-archive/
├── manifest.json          # Extension manifest (Manifest V3)
├── background.js          # Main extension logic
├── options.html           # Options page UI
├── options.js            # Options page logic
├── icons/                # Extension icons
│   ├── icon-48.png
│   └── icon-96.png
└── README.md             # This file
```

### API Usage

The extension uses proper Thunderbird WebExtension APIs (not Firefox APIs):

*   `messenger.compose.getComposeDetails()`: Get compose window information including type (reply/forward/new)
*   `messenger.compose.sendMessage(tabId, {mode: 'sendNow'})`: Send the composed message immediately
*   `messenger.composeAction.enable()/disable()`: Control button visibility based on compose type
*   `messenger.messages.archive()`: Archive messages using native functionality
*   `messenger.storage.local`: Store and retrieve settings

**Important**: The extension uses `browser_specific_settings` (not `applications`) in manifest.json for Manifest V3 compatibility.

API Reference:

*   Thunderbird WebExtension Compose API (MV3): [https://webextension-api.thunderbird.net/en/mv3/compose.html](https://webextension-api.thunderbird.net/en/mv3/compose.html)
*   Thunderbird MailExtensions: [https://developer.thunderbird.net/add-ons/mailextensions](https://developer.thunderbird.net/add-ons/mailextensions)
*   Manifest V3 Guide: https://developer.thunderbird.net/add-ons/manifest-v3

### Testing and Debugging

To test during development:

1.  Load the extension as a temporary add-on (see Installation)
2.  Open the Browser Console: Tools → Developer Tools → Browser Console (Ctrl+Shift+J)
3.  Look for console messages prefixed with "Send and Archive"

List of manual tests are kept at [TESTING.md](TESTING.md)

## License

This extension is provided as-is for use with Thunderbird.

## Support

For issues, feature requests, or contributions, please check the extension's repository.

## Version History

### For full technical notes on version history, see [CHANGELOG.md](CHANGELOG.md)

### 1.0.4 

*   **NEW**: Button is now automatically disabled if no archive folder is configured
*   **IMPROVED**: Button only enabled when BOTH conditions are met: (1) It's a reply/forward, AND (2) Archive folder exists
*   **IMPROVED**: Simplified error handling since issues are prevented upfront

### 1.0.3

*   **FIXED**: Improved archiving success detection - now properly detects when archiving fails (e.g., no archive folder configured)
*   **FIXED**: Only logs "Message archived successfully" and shows notification when archiving actually succeeds
*   **IMPROVED**: Better error handling with descriptive messages when archiving fails
*   **IMPROVED**: Helpful error message directing users to configure archive folder if not set up
*   **UPDATED**: Comprehensive documentation updates across all files

### 1.0.2

*   **FIXED**: Updated keyboard shortcut references in options.html from "Ctrl+Alt+Enter" to correct "Ctrl+Shift+S"
*   **FIXED**: Removed reference to context menu feature in options.html
*   **FIXED**: Archiving error by removing incorrect `messenger.messages.getFolderDetails()` API call
*   **IMPROVED**: Simplified archiving function to directly use the archive API

### 1.0.1

*   **FIXED**: Changed keyboard shortcut from `Ctrl+Shift+Enter` to `Ctrl+Shift+S` for better usability
*   **FIXED**: Button now only appears/is enabled in reply and forward windows (disabled for new messages)
*   **FIXED**: Removed `applications` property and replaced with `browser_specific_settings` for Manifest V3 compatibility
*   **FIXED**: Removed context menu code that was causing "messenger.menus is undefined" error
*   **FIXED**: Implemented correct Thunderbird API for sending messages using `messenger.compose.sendMessage(tabId, {mode: 'sendNow'})`
*   **IMPROVED**: Added detection logic using `ComposeDetails.type` property to identify reply/forward vs new messages
*   **IMPROVED**: Better error handling and user feedback for non-reply windows

### 1.0.0 (Initial Release)

*   Send and Archive functionality
*   Toolbar button in compose window
*   Keyboard shortcut
*   Options page for notification settings
*   Native archive integration
*   Error handling and notifications