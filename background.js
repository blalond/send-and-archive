
/**
 * Send and Archive Extension for Thunderbird
 * Background Script - Handles compose window toolbar button and keyboard shortcuts
 */

// Store settings in memory for quick access
let settings = {
  showNotifications: true
};

// Load settings on startup
async function loadSettings() {
  try {
    const result = await messenger.storage.local.get('showNotifications');
    settings.showNotifications = result.showNotifications !== undefined ? result.showNotifications : true;
  } catch (error) {
    console.error('Error loading settings:', error);
  }
}

// Initialize settings
loadSettings();

// Listen for settings changes
messenger.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local' && changes.showNotifications) {
    settings.showNotifications = changes.showNotifications.newValue;
  }
});

/**
 * Check if a compose window is a reply or forward (not a new message)
 * @param {number} tabId - The compose window tab ID
 * @returns {Promise<boolean>} - True if reply/forward, false if new message
 */
async function isReplyOrForward(tabId) {
  try {
    const composeDetails = await messenger.compose.getComposeDetails(tabId);

    // Check the type property (added in Thunderbird 91/102)
    // Possible values: "new", "reply", "forward", "draft"
    if (composeDetails.type) {
      const isReply = composeDetails.type === 'reply' || composeDetails.type === 'forward';
      console.log('Compose type:', composeDetails.type, '- Is reply/forward:', isReply);
      return isReply;
    }

    // Fallback: Check for relatedMessageId (added in Thunderbird 95)
    // If there's a related message, it's a reply or forward
    if (composeDetails.relatedMessageId) {
      console.log('Found relatedMessageId:', composeDetails.relatedMessageId);
      return true;
    }

    console.log('This is a new message (no type or relatedMessageId found)');
    return false;
  } catch (error) {
    console.error('Error checking compose type:', error);
    // If we can't determine, assume it's not a reply (safer default)
    return false;
  }
}

/**
 * Check if an archive folder is configured: Account > Copies & Folders > Message Archives
 * @returns {Promise<boolean>} - True if archive folder is configured, false otherwise
 */
async function hasArchiveFolderConfigured(tabId) {
  try {

    // This relies on unified config, and is not the correct way to do it:
    // const archiveFolder = await messenger.folders.getUnifiedFolder('archives');
    // const capabilities = await messenger.folders.getFolderCapabilities(archiveFolder.id);

    // Note: proper behavior is shown by the built-in menu item "Message > Archive" (shortcut A) where it does nothing if Archive folder not configured.
    // This looks up the folder by "specialUse" but it finds a folder even if it is not configured :
    const composeDetails = await messenger.compose.getComposeDetails(tabId);
    const identity = await messenger.identities.get(composeDetails.identityId);
    const queryAnswer = await messenger.folders.query({ accountId:  identity.accountId, specialUse: ['archives'] });
    const capabilities = await messenger.folders.getFolderCapabilities(queryAnswer[0].id)

    if (capabilities.canAddMessages) {
      console.log('Archive folder is configured');
      return true;
    }

    console.log('No archive folder configured');
    return false;
  } catch (error) {
    // If the API throws an error, it likely means no archive folder is configured
    console.log('Archive folder check failed (likely not configured):', error.message);
    return false;
  }
}

/**
 * Update button visibility based on compose type AND archive folder configuration
 * @param {number} tabId - The compose window tab ID
 */
async function updateButtonVisibility(tabId) {
  try {
    const isReply = await isReplyOrForward(tabId);
    const hasArchive = await hasArchiveFolderConfigured(tabId);

    // Button should only be enabled if BOTH conditions are true:
    // 1. It's a reply or forward (not a new message)
    // 2. An archive folder is configured
    if (isReply && hasArchive) {
      // Enable the button
      await messenger.composeAction.enable(tabId);
      console.log('Button enabled (reply/forward AND archive folder configured)');
    } else {
      // Disable the button
      await messenger.composeAction.disable(tabId);
      if (!isReply) {
        console.log('Button disabled (not a reply/forward)');
      } else if (!hasArchive) {
        console.log('Button disabled (no archive folder configured)');
      }
    }
  } catch (error) {
    console.error('Error updating button visibility:', error);
  }
}

/**
 * Main function to send message and archive the original
 * @param {number} tabId - The compose window tab ID
 */
async function sendAndArchive(tabId) {
  try {
    console.log('Send and Archive triggered for tab:', tabId);

    // Verify this is a reply or forward
    const isReply = await isReplyOrForward(tabId);
    if (!isReply) {
      console.log('Not a reply/forward - aborting');
      await messenger.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon-48.png',
        title: 'Send and Archive',
        message: 'This feature only works for replies and forwards, not new messages.'
      });
      return;
    }

    // Get the compose details to find the original message
    const composeDetails = await messenger.compose.getComposeDetails(tabId);

    // Get the original message ID
    let originalMessageId = composeDetails.relatedMessageId;

    if (!originalMessageId) {
      console.log('No related message found - cannot archive');
      await messenger.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon-48.png',
        title: 'Send and Archive',
        message: 'Could not find the original message to archive.'
      });
      return;
    }

    console.log('Found related message ID:', originalMessageId);

    // Send the message using the correct Thunderbird API
    // The sendMessage function requires the compose.send permission
    console.log('Sending message...');

    try {
      // Send the message immediately using sendNow mode
      await messenger.compose.sendMessage(tabId, { mode: 'sendNow' });
      console.log('Message sent successfully');

      // Archive the original message
      await archiveOriginalMessage(originalMessageId);

    } catch (sendError) {
      console.error('Error sending message:', sendError);
      // Show error notification
      await messenger.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon-48.png',
        title: 'Send and Archive - Error',
        message: 'Failed to send message: ' + sendError.message
      });
    }

  } catch (error) {
    console.error('Error in sendAndArchive:', error);
    await messenger.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon-48.png',
      title: 'Send and Archive - Error',
      message: 'An error occurred: ' + error.message
    });
  }
}

/**
 * Archive the original message using Thunderbird's built-in archive functionality
 * Note: This function assumes archive folder is configured (checked before button is enabled)
 * @param {number} messageId - The message ID to archive
 */
async function archiveOriginalMessage(messageId) {
  try {
    console.log('Archiving message:', messageId);

    // Use Thunderbird's built-in archive functionality
    // The messages.archive() method automatically handles folder details
    // and respects the user's archive settings
    await messenger.messages.archive([messageId]);

    console.log('Message archived successfully');

    // Show notification if enabled
    if (settings.showNotifications) {
      await messenger.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon-48.png',
        title: 'Send and Archive',
        message: 'Message sent and original archived successfully'
      });
    }

  } catch (error) {
    // This should rarely happen since we check for archive folder before enabling the button
    console.error('Error archiving message:', error);

    // Show simplified error notification
    await messenger.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon-48.png',
      title: 'Send and Archive - Archive Error',
      message: 'Message sent, but failed to archive original: ' + (error.message || 'Unknown error')
    });
  }
}

// Listen for new compose windows being opened
// Update button visibility based on whether it's a reply/forward or new message
messenger.tabs.onCreated.addListener(async (tab) => {
  // Check if this is a compose window
  if (tab.type === 'messageCompose') {
    console.log('New compose window opened:', tab.id);
    // Wait a bit for the compose window to fully initialize
    setTimeout(() => {
      updateButtonVisibility(tab.id);
    }, 100);
  }
});

// Also check when tabs are updated (in case compose type changes)
messenger.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (tab.type === 'messageCompose') {
    updateButtonVisibility(tabId);
  }
});

// Listen for compose action button clicks (toolbar button in compose window)
messenger.composeAction.onClicked.addListener(async (tab) => {
  console.log('Compose action button clicked');
  await sendAndArchive(tab.id);
});

// Listen for keyboard shortcut
messenger.commands.onCommand.addListener(async (command) => {
  if (command === 'send-and-archive') {
    console.log('Keyboard shortcut triggered');
    // Get the current compose window
    const windows = await messenger.windows.getAll({ populate: true, windowTypes: ['messageCompose'] });

    if (windows.length > 0) {
      // Get the focused window
      const focusedWindow = windows.find(w => w.focused);
      if (focusedWindow && focusedWindow.tabs && focusedWindow.tabs.length > 0) {
        await sendAndArchive(focusedWindow.tabs[0].id);
      } else if (windows[0].tabs && windows[0].tabs.length > 0) {
        // Fallback to first compose window if none is focused
        await sendAndArchive(windows[0].tabs[0].id);
      }
    }
  }
});

console.log('Send and Archive background script loaded (v1.0.4)');
