import { app } from 'electron'

export function setupGpu(): void {
  app.commandLine.appendSwitch('ignore-gpu-blocklist')
  app.commandLine.appendSwitch('enable-gpu-rasterization')
  app.commandLine.appendSwitch('enable-oop-rasterization')
  app.commandLine.appendSwitch('enable-accelerated-video-decode')
  app.commandLine.appendSwitch('disable-software-rasterizer')
  app.commandLine.appendSwitch('disable-gpu-sandbox')

  // Only use if you still see "Software Only" for Video Decode on Linux
  // app.commandLine.appendSwitch('use-gl', 'egl');

  app.commandLine.appendSwitch('disable-frame-rate-limit');
}
