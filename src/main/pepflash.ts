/** biome-ignore-all lint/style/useNodejsImportProtocol: we need to use node.js import protocol for fs */

import { app } from 'electron'
import { join } from 'path'

// Using clean-flash-builds: https://github.com/darktohka/clean-flash-builds
export function setupPepFlash(): void {
  const pluginDir = 'ppapi-plugins'

  const pluginMap: Record<string, { file: string; version: string }> = {
    win32: { file: join('win', 'libpepflashplayer.dll'), version: '34.0.0.376' },
    darwin: { file: join('mac', 'libpepflashplayer.plugin'), version: '34.0.0.231' },
    linux: { file: join('linux', 'libpepflashplayer.so'), version: '34.0.0.137' },
  }

  console.log(
    `[AQW Refracted] Setting up Pepper Flash plugin for platform: ${process.platform} ${process.arch}`,
  )
  const platformConfig = pluginMap[process.platform]
  if (!platformConfig) {
    console.error('[AQW Refracted] Unsupported platform:', process.platform)
    return
  }

  const possiblePaths = [
    join(process.cwd(), 'resources', pluginDir, platformConfig.file),
    join(process.resourcesPath, pluginDir, platformConfig.file),
    join(app.getAppPath(), 'resources', pluginDir, platformConfig.file),
  ]

  const fs = require('fs')
  const flashPluginPath = possiblePaths.find((p: string) => fs.existsSync(p))

  if (!flashPluginPath) {
    console.error('[AQW Refracted] Plugin not found in any of:', possiblePaths)
    return
  }

  app.commandLine.appendSwitch('ppapi-flash-path', flashPluginPath)
  app.commandLine.appendSwitch('ppapi-flash-version', platformConfig.version)

  app.commandLine.appendSwitch('enable-plugins')
  app.commandLine.appendSwitch('allow-outdated-plugins')

  console.log(`[AQW Refracted] Plugin v${platformConfig.version} loaded from: ${flashPluginPath}`)
}
