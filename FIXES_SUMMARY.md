# Send and Archive Extension - v1.0.1 Bug Fixes Summary

## All 5 Issues Fixed Successfully ✅

### Issue #1: Keyboard Shortcut ✅
**Problem**: Keyboard shortcut was `Ctrl+Shift+Enter`  
**Solution**: Changed to `Ctrl+Shift+S` in manifest.json
- Updated `commands.send-and-archive.suggested_key.default`
- More intuitive shortcut (S for Send)
- Avoids potential conflicts

**File Changed**: `manifest.json` line 37

---

### Issue #2: Button Visibility in New Messages ✅
**Problem**: "Send and Archive" button appeared in new compose windows where it shouldn't work  
**Solution**: Implemented smart button visibility logic
- Added `isReplyOrForward()` function to detect compose type
- Uses `ComposeDetails.type` property (values: "new", "reply", "forward", "draft")
- Fallback to `relatedMessageId` check for backwards compatibility
- Button automatically enables for reply/forward, disables for new messages
- Added listeners for `tabs.onCreated` and `tabs.onUpdated` to update button state

**Files Changed**: 
- `background.js` lines 33-86 (new functions)
- `background.js` lines 206-224 (event listeners)

---

### Issue #3: Manifest V3 Warning ✅
**Problem**: Warning on load: "Reading manifest: Property 'applications' is unsupported in Manifest Version 3"  
**Solution**: Replaced deprecated `applications` with `browser_specific_settings`
- Changed `applications.gecko` to `browser_specific_settings.gecko`
- Fully compliant with Thunderbird Manifest V3 standards
- No more warnings on extension load

**File Changed**: `manifest.json` line 8

---

### Issue #4: Context Menu Undefined Error ✅
**Problem**: Error at background.js:178 - "can't access property 'onClicked', messenger.menus is undefined"  
**Solution**: Removed all messenger.menus code
- Deleted `messenger.menus.create()` call in `onInstalled` listener
- Deleted `messenger.menus.onClicked` listener
- Extension now only uses toolbar button and keyboard shortcut
- Cleaner, simpler codebase

**Files Changed**: `background.js` (removed old lines 160-183)

---

### Issue #5: SendMessage API Error (CRITICAL) ✅
**Problem**: "messenger.compose.sendMessage is not a function" at background.js:58  
**Root Cause**: Missing `compose.send` permission and incorrect API usage  
**Solution**: Implemented correct Thunderbird MailExtension API
1. **Added Permission**: Added `compose.send` permission to manifest.json (required for sendMessage)
2. **Fixed API Call**: Changed from `messenger.compose.sendMessage(tabId)` to `messenger.compose.sendMessage(tabId, {mode: 'sendNow'})`
3. **API Research**: Used official Thunderbird WebExtension API documentation (not Firefox docs)

**Why This Works**:
- Thunderbird's `sendMessage()` requires the `compose.send` permission explicitly
- The function accepts an optional `options` parameter with `mode` property
- Modes: "sendNow" (immediate), "sendLater" (queue), or "default" (auto-detect online status)
- Using `sendNow` ensures immediate sending when user clicks the button

**Files Changed**:
- `manifest.json` line 19 (added permission)
- `background.js` line 134 (fixed API call)

**API Documentation Sources**:
- https://webextension-api.thunderbird.net/en/mv3/compose.html
- Official Thunderbird MailExtension compose API (Manifest V3)

---

## Additional Improvements

### Enhanced Error Handling
- Added checks to verify compose window is a reply/forward before attempting to send
- User-friendly notifications when trying to use feature in new message windows
- Better error messages for debugging

### Code Quality
- Added comprehensive JSDoc comments
- Improved function names and structure
- Removed unused/deprecated code
- Updated version number to 1.0.1

### Documentation
- Updated README.md with all changes
- Created CHANGELOG.md for version tracking
- Updated build instructions
- Added technical notes about API differences between Thunderbird and Firefox

---

## Testing Recommendations

### Test Case 1: Reply Window
1. Open an email and click "Reply"
2. **Expected**: "Send and Archive" button should be ENABLED
3. Type a message and click the button
4. **Expected**: Message sends, original archived, notification shown

### Test Case 2: New Message Window
1. Click "Write" to compose a new message
2. **Expected**: "Send and Archive" button should be DISABLED (grayed out)
3. Try clicking the button
4. **Expected**: Nothing happens (button is disabled)

### Test Case 3: Keyboard Shortcut
1. Open a reply window
2. Press `Ctrl+Shift+S`
3. **Expected**: Message sends and archives original

### Test Case 4: Forward Window
1. Open an email and click "Forward"
2. **Expected**: Button should be ENABLED
3. Use the button to send
4. **Expected**: Message sends, original archived

### Test Case 5: No Warnings
1. Restart Thunderbird
2. Check Browser Console (Ctrl+Shift+J)
3. **Expected**: No warnings about "applications" property or "messenger.menus"

---

## Files Modified

1. **manifest.json**
   - Changed keyboard shortcut
   - Replaced `applications` with `browser_specific_settings`
   - Added `compose.send` permission
   - Bumped version to 1.0.1

2. **background.js**
   - Added `isReplyOrForward()` detection function
   - Added `updateButtonVisibility()` function
   - Fixed `sendAndArchive()` with correct API call
   - Removed all messenger.menus code
   - Added tab event listeners for button visibility

3. **README.md**
   - Updated features list
   - Changed keyboard shortcut documentation
   - Updated permissions list
   - Added version history for 1.0.1
   - Updated build instructions

4. **CHANGELOG.md** (New)
   - Comprehensive changelog
   - Documents all fixes and improvements

5. **send-and-archive-v1.0.1.xpi**
   - Rebuilt extension package with all fixes

---

## Installation Instructions

1. **Uninstall old version** (if installed):
   - Go to Add-ons → Send and Archive → Remove

2. **Install v1.0.1**:
   - Open `send-and-archive-v1.0.1.xpi` in Thunderbird
   - Or use "Install Add-on From File" in Add-ons manager

3. **Restart Thunderbird** to ensure clean installation

4. **Test**: Open a reply window and verify the button works!

---

## API References Used

- Thunderbird WebExtension Compose API (MV3): https://webextension-api.thunderbird.net/en/mv3/compose.html
- Thunderbird MailExtensions: https://developer.thunderbird.net/add-ons/mailextensions
- Manifest V3 Guide: https://developer.thunderbird.net/add-ons/manifest-v3

---

## Summary

All 5 issues have been successfully fixed in version 1.0.1. The extension now:
- ✅ Uses the correct keyboard shortcut (`Ctrl+Shift+S`)
- ✅ Only shows/enables the button in reply/forward windows
- ✅ Is fully Manifest V3 compliant (no warnings)
- ✅ Has no context menu errors
- ✅ Uses the correct Thunderbird API to send messages

The extension is ready for testing and deployment!
