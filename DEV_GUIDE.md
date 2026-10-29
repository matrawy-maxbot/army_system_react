# Development Guide

## The Problem (Why You Were Getting Errors)

The error `Cannot read properties of undefined (reading 'selectFile')` happened because:

1. You were running `npm run dev` which only starts Vite and opens the app in a **web browser**
2. In a web browser, `window.electronAPI` doesn't exist (it only exists in Electron)
3. The React components tried to call `window.electronAPI.selectFile()`, etc., but found `undefined`

## The Solution

This is an **Electron app**, not a web app. It must run inside Electron to access:
- File system operations
- Native dialogs (file picker, folder picker)
- IPC communication between renderer and main process
- All the `window.electronAPI` methods defined in `preload.js`

## How to Run the App Correctly

### Development Mode (with hot reload)

```bash
npm run electron:dev
```

This command:
1. ✅ Starts Vite dev server on http://localhost:3000
2. ✅ Waits for the server to be ready
3. ✅ Launches Electron and loads the app
4. ✅ Opens DevTools automatically
5. ✅ Supports hot-reload (changes refresh automatically)

### What NOT to Do

❌ **Don't run**: `npm run dev` (opens in browser, no Electron APIs)
❌ **Don't open**: http://localhost:3000 in Chrome/Edge (same problem)

### Production Build

```bash
npm run electron:build
```

This will:
1. Build the Vite app to `/dist`
2. Package it with Electron Builder
3. Create an installable executable

## How It Works

### Architecture

```
┌─────────────────────┐
│   Electron Main     │  ← electron/main.js (Node.js APIs)
│   Process           │     
└──────────┬──────────┘
           │ IPC
           │ (Inter-Process Communication)
┌──────────┴──────────┐
│   Renderer Process  │  ← React App (browser-like environment)
│   (React UI)        │     Can only access electronAPI via preload
└─────────────────────┘
```

### File Structure

- **electron/main.js**: Main Electron process (creates windows, handles system)
- **electron/preload.js**: Bridge that exposes safe APIs to React (`window.electronAPI`)
- **electron/ipc/**: IPC handlers for file, data, settings, documents, etc.
- **src/**: React application code
- **vite.config.js**: Vite bundler configuration

### The electronAPI

Defined in `electron/preload.js` using `contextBridge.exposeInMainWorld('electronAPI', {...})`:

```javascript
// Available in React components:
window.electronAPI.selectFile()
window.electronAPI.loadData()
window.electronAPI.saveData(data)
window.electronAPI.printFile(path)
// ... and many more
```

## Common Issues

### Issue: "window.electronAPI is undefined"
**Cause**: Running in web browser instead of Electron
**Fix**: Use `npm run electron:dev` instead of `npm run dev`

### Issue: Port 3000 already in use
**Cause**: Another process using port 3000
**Fix**: 
```bash
# Kill the process using port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Issue: Electron window doesn't open
**Cause**: Vite server not ready when Electron starts
**Fix**: The `wait-on` package now handles this automatically

## Debugging

### React DevTools
Already open automatically in development mode

### Check if electronAPI is available
In the Electron DevTools console:
```javascript
console.log(window.electronAPI);
// Should show an object with all the methods
```

### Check Electron vs Browser
```javascript
console.log(window.electronAPI ? 'Running in Electron' : 'Running in Browser');
```

## Next Steps

1. Stop any running `npm run dev` processes
2. Run `npm run electron:dev`
3. The app should open in an Electron window (not browser)
4. All the errors should be gone ✅
