
# Installation Instructions

## Method 1: Load as Temporary Add-on (Development/Testing)

1. Open Thunderbird
2. Go to **Tools** → **Add-ons and Themes** (or press `Ctrl+Shift+A`)
3. Click the **gear icon** ⚙️ and select **"Debug Add-ons"**
4. Click **"Load Temporary Add-on"**
5. Navigate to the extension directory and select `manifest.json`
6. The extension will be loaded and active until Thunderbird is restarted

## Method 2: Install from XPI File

### Building the XPI

```bash
cd thunderbird-send-and-archive
chmod +x build.sh
./build.sh
```

This creates `send-and-archive.xpi` in the current directory.

### Installing the XPI

1. Open Thunderbird
2. Go to **Tools** → **Add-ons and Themes** (or press `Ctrl+Shift+A`)
3. Click the **gear icon** ⚙️ and select **"Install Add-on From File..."**
4. Select the `send-and-archive.xpi` file
5. Click **"Add"** when prompted
6. The extension will be permanently installed

## Verification

After installation:

1. Open a compose window (reply to any message or create a new message)
2. Look for the "Send and Archive" button in the toolbar
3. Try the keyboard shortcut: `Ctrl+Alt+Enter`
4. Access settings: Tools → Add-ons and Themes → Send and Archive → Options

## Troubleshooting

### Extension doesn't load
- Check that you're using Thunderbird 128.0 or higher
- Look for errors in the Browser Console (Tools → Developer Tools → Browser Console)

### Button doesn't appear
- Make sure you're in a compose window, not the main window
- Try restarting Thunderbird after installation

### Permissions warning
- The extension requires several permissions to function:
  - **compose**: To send messages
  - **messagesRead**: To read message details
  - **messagesMove**: To archive messages
  - **accountsRead**: To access account information
  - **storage**: To save preferences
  - **notifications**: To show notifications

## Uninstallation

1. Go to **Tools** → **Add-ons and Themes**
2. Find "Send and Archive" in the list
3. Click the three dots **⋯** next to it
4. Select **"Remove"**

## Development Mode

For development, use Method 1 (temporary add-on) so you can make changes and reload:

1. Make changes to the extension files
2. Go to **about:debugging** in Thunderbird
3. Click **"Reload"** next to the extension
4. Test your changes

No need to restart Thunderbird between changes when using temporary add-on mode.
