# PepFlash Electron

Electron application with native Pepper Flash (PepFlash) support using the official Adobe Flash Player plugin.

## Features

- **Native Flash Support** - Uses real Adobe Flash Player (PepFlash) instead of emulation
- **PepFlash Plugin Integration** - Loads `libpepflashplayer.so` for authentic Flash experience
- **TypeScript** - Full TypeScript support with latest features
- **React 19** - Modern UI built with React 19
- **Tailwind CSS v4** - Utility-first styling
- **Debugger Integration** - Chrome DevTools for element inspection and input simulation

## Tech Stack

- **Electron 11.5.0** - Desktop framework (last version with PPAPI Flash support)
- **PepFlash Plugin** - Native Adobe Flash Player plugin
- **React 19** - UI library
- **TypeScript** - Type-safe development
- **Vite** - Build tool for renderer process
- **Tailwind CSS v4** - Styling
- **Radix UI + shadcn/ui** - UI components

## Prerequisites

1. **Node.js** (latest LTS)
2. **pnpm** package manager
3. **PepFlash Plugin** (`libpepflashplayer.so`)

## Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Download Pepper Flash Plugin

The Pepper Flash plugin (`libpepflashplayer.so`) must be downloaded separately due to Adobe licensing.

#### Option A: Manual Download

Download from the Chromium reference builds:
https://chromium.googlesource.com/chromium/reference_builds/chrome_linux/+/70a399ab20a884acff94450ba10fb6e2934b8a29/PepperFlash/libpepflashplayer.so

Place the file in:
- **Development**: `./resources/libpepflashplayer.so`
- **Production**: The file will be bundled in `resources/`

#### Option B: Using the Setup Script

```bash
# Download the Flash plugin to resources folder
node scripts/download-flash.js
```

### 3. Development

```bash
pnpm dev
```

### 4. Build

```bash
# Build for Linux
pnpm dist:linux

# Build for Windows
pnpm dist:win

# Build for macOS
pnpm dist:mac

# Build for all platforms
pnpm dist:all
```

## Project Structure

```
pepflash-electron/
├── src/
│   ├── main/              # Electron main process
│   │   ├── index.ts       # Main entry with PepFlash setup
│   │   ├── constants.ts   # Window/constants config
│   │   ├── debugger.ts    # Chrome DevTools debugger
│   │   └── debugger-handler.ts  # Input simulation
│   ├── preload/           # Preload scripts
│   ├── renderer/          # React UI
│   └── assets/            # App icons
├── resources/             # Flash plugin goes here
├── out/                   # Build output
└── dist/                  # Distribution packages
```

## Pepper Flash Configuration

The app configures Pepper Flash in `src/main/index.ts`:

```typescript
function setupPepFlash(): void {
  const pepFlashPath = join(process.resourcesPath, 'libpepflashplayer.so')
  
  // Register the plugin
  app.commandLine.appendSwitch('ppapi-flash-path', pepFlashPath)
  app.commandLine.appendSwitch('ppapi-flash-version', '32.0.0.465')
  
  // Enable Flash
  app.commandLine.appendSwitch('enable-plugins')
  app.commandLine.appendSwitch('allow-outdated-plugins')
}
```

## Important Notes

- **Electron 11.5.0** is the last version that supports the Pepper Flash plugin (Chrome 87 was the last to support Flash, removed in Chrome 88/Electron 12+)
- The Flash plugin must be downloaded separately (Adobe licensing restrictions)
- Flash content must be loaded from local files or allowed domains
- Some modern websites may block Flash content

## Code Quality

```bash
# Type checking
pnpm typecheck

# Linting
pnpm lint

# Formatting
pnpm format
```

## License

MIT License - See LICENSE file for details

## Acknowledgments

- Adobe Flash Player - The original Flash runtime
- Electron - Desktop application framework
