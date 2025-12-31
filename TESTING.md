# Testing Guide for Send and Archive Extension

## Manual Test Cases

### Test 1: Extension Loading

**Steps:**

1.  Load the extension as described above
2.  Open the Browser Console: **Tools** → **Developer Tools** → **Browser Console** (`Ctrl+Shift+J`)
3.  Look for the message: "Send and Archive background script loaded (v1.0.3)"

**Expected Result:**

*   Extension loads without errors
*   Console shows successful loading message with version number

### Test 2: Toolbar Button (New Message)

**Steps:**

1.  Click **"Write"** to compose a new message
2.  Look for the "Send and Archive" button in the compose window toolbar
3.  Try to click the button

**Expected Result:**

*   Button is visible but **disabled** (grayed out) in the compose toolbar
*   If somehow clicked, a notification appears: "This feature only works for replies and forwards, not new messages."
*   Console shows: "Not a reply/forward - aborting"

### Test 3: Toolbar Button (Reply)

**Steps:**

1.  Select an existing email in your inbox
2.  Click **"Reply"**
3.  Compose a reply message
4.  Click the "Send and Archive" button

**Expected Result:**

*   Reply is sent successfully
*   Original message is archived to the archive folder
*   Notification appears (if enabled in settings)
*   Console shows: "Message sent successfully" and "Message archived successfully"

### Test 4: Keyboard Shortcut

**Steps:**

1.  Reply to an existing message
2.  Compose your reply
3.  Press `Ctrl+Shift+S`

**Expected Result:**

*   Same behavior as clicking the toolbar button
*   Reply sent and original archived (if archive folder is configured)
*   Success notification appears (if enabled in settings)

### Test 5: Options Page

**Steps:**

1.  Go to **Tools** → **Add-ons and Themes**
2.  Find "Send and Archive" in the extensions list
3.  Click the **three dots** ⋯ and select **"Options"**
4.  Toggle the "Show notification after archiving" checkbox

**Expected Result:**

*   Options page opens
*   Checkbox state changes
*   "Settings saved successfully!" message appears
*   Settings persist after closing and reopening

### Test 6: Notification Toggle

**Steps:**

1.  Disable notifications in the options page
2.  Reply to a message and use "Send and Archive"
3.  Verify no notification appears
4.  Enable notifications in options
5.  Reply to another message and use "Send and Archive"
6.  Verify notification appears

**Expected Result:**

*   When disabled: no notification after archiving
*   When enabled: notification appears after successful archiving

### Test 7: Send Failure Handling

**Steps:**

1.  Reply to a message
2.  Leave the message body empty or remove the recipient
3.  Try to use "Send and Archive"

**Expected Result:**

*   Send operation fails with an error
*   Original message is NOT archived
*   Error notification is displayed
*   Compose window remains open

### Test 8: No Archive Folder Configured

**Steps:**

1.  Before testing, disable archive for your account:
    *   **Tools** → **Account Settings** → **\[Your Account\]** → **Copies & Folders** → **Message Archives**
    *   Uncheck "Keep message archives in" or remove the archive location
2.  Reply to a message and use "Send and Archive"
3.  Check the notification and console

**Expected Result:**

*   Message is sent successfully
*   Error notification appears: "Message sent, but archiving failed. Please configure an archive folder in: Tools → Account Settings → Copies & Folders → Message Archives"
*   Console shows archiving error (not "Message archived successfully")
*   Original message remains in its current location (not archived)

### Test 9: Archive Folder Location

**Steps:**

1.  Before testing, check your archive settings:
    *   **Tools** → **Account Settings** → **\[Your Account\]** → **Copies & Folders** → **Message Archives**
2.  Note the archive folder structure (e.g., yearly, monthly, single folder)
3.  Use "Send and Archive" on a reply
4.  Check the archive folder

**Expected Result:**

*   Original message is archived according to your existing archive settings
*   Archive folder structure is respected

### Test 10: Multiple Compose Windows

**Steps:**

1.  Open multiple reply windows (reply to 2-3 different messages)
2.  In each window, use the "Send and Archive" button or keyboard shortcut
3.  Focus should be on the correct window

**Expected Result:**

*   Each window operates independently
*   The correct original message is archived for each reply
*   No cross-window interference

## Debugging

### Console Messages to Look For

Successful operation:

```
Send and Archive triggered for tab: [number]
Found related message ID: [number]
Sending message...
Message sent successfully
Archiving message: [number]
Message archived successfully
```

New message (no archive):

```
Send and Archive triggered for tab: [number]
No original message to archive (this is a new message, not a reply)
```

Error condition:

```
Error sending message: [error details]
```

or

```
Error archiving message: [error details]
```

### Common Issues

**Issue:** Button doesn't appear

*   **Solution:** Make sure you're in a compose window, not the main window
*   **Solution:** Try restarting Thunderbird and reloading the extension

**Issue:** Keyboard shortcut doesn't work

*   **Solution:** Ensure the compose window has focus
*   **Solution:** Check if another extension is using the same shortcut

**Issue:** Archive fails

*   **Solution:** Check that the account supports archiving
*   **Solution:** Verify archive folder is configured in account settings
*   **Solution:** Check Browser Console for detailed error messages

**Issue:** `browser.compose.sendMessage() is undefined` error

*   **Solution:** This shouldn't occur with this implementation; if it does, verify you're using the `messenger.compose` API, not `browser.compose`

## Performance Testing

1.  Test with large message bodies (>1MB)
2.  Test with messages containing attachments
3.  Test with HTML-formatted messages
4.  Test with plain text messages

All scenarios should work without performance degradation.

## Clean Up After Testing

To remove the temporary extension:

1.  Go to **about:debugging** in Thunderbird
2.  Find "Send and Archive" in the temporary extensions list
3.  Click **"Remove"**

Or simply restart Thunderbird (temporary extensions are automatically removed).

## Reporting Issues

When reporting issues, please include:

*   Thunderbird version
*   Operating system
*   Extension version (current: 1.0.3)
*   Steps to reproduce
*   Console output (from Browser Console)
*   Expected vs actual behavior