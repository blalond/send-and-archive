
/**
 * Send and Archive Extension for Thunderbird
 * Background Script - Handles compose window toolbar button, menu items, and keyboard shortcuts
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
 * Main function to send message and archive the original
 * @param {number} tabId - The compose window tab ID
 */
async function sendAndArchive(tabId) {
  try {
    console.log('Send and Archive triggered for tab:', tabId);
    
    // Get the compose details to find the original message
    const composeDetails = await messenger.compose.getComposeDetails(tabId);
    
    // Check if this is a reply or forward - we only archive if there's an original message
    let originalMessageId = null;
    
    if (composeDetails.relatedMessageId) {
      originalMessageId = composeDetails.relatedMessageId;
      console.log('Found related message ID:', originalMessageId);
    }
    
    // Send the message
    // Note: In Manifest V3, we use messenger.compose.sendMessage()
    // This returns a SendMessageResult with mode and messageId
    console.log('Sending message...');
    
    try {
      // Send the message using the proper Thunderbird API
      await messenger.compose.sendMessage(tabId);
      console.log('Message sent successfully');
      
      // If there's an original message, archive it
      if (originalMessageId) {
        await archiveOriginalMessage(originalMessageId);
      } else {
        console.log('No original message to archive (this is a new message, not a reply)');
      }
      
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
 * @param {number} messageId - The message ID to archive
 */
async function archiveOriginalMessage(messageId) {
  try {
    console.log('Archiving message:', messageId);
    
    // Get the full message details
    const message = await messenger.messages.get(messageId);
    console.log('Message details:', message);
    
    // Get the account for this message
    const folder = await messenger.messages.getFolderDetails(message.folder);
    console.log('Message folder:', folder);
    
    // Use Thunderbird's built-in archive functionality
    // The messages.archive() method respects user's archive settings
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
    console.error('Error archiving message:', error);
    // Show error notification even if notifications are disabled for errors
    await messenger.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon-48.png',
      title: 'Send and Archive - Archive Error',
      message: 'Message sent, but failed to archive original: ' + error.message
    });
  }
}

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

// Add menu item to File menu in compose windows
messenger.runtime.onInstalled.addListener(async () => {
  // Create a menu item in the compose window's Tools menu
  await messenger.menus.create({
    id: 'send-and-archive-menu',
    title: 'Send and Archive',
    contexts: ['compose_action_menu'],
    command: '_execute_compose_action'
  });
  
  // Note: Thunderbird doesn't allow adding items to the File menu directly via WebExtensions
  // The compose_action_menu context adds it to the toolbar button's context menu
  // Users can access it via the toolbar button or keyboard shortcut
  
  console.log('Send and Archive extension installed');
});

// Listen for menu item clicks
messenger.menus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'send-and-archive-menu') {
    console.log('Menu item clicked');
    await sendAndArchive(tab.id);
  }
});

console.log('Send and Archive background script loaded');
