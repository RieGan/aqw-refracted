/** biome-ignore-all lint/style/useNodejsImportProtocol: we need to use node.js import protocol for fs */

import { app } from 'electron'
import { join } from 'path'

// Using clean-flash-builds: https://github.com/darktohka/clean-flash-builds
export function setupPepFlash(): void {
  const pluginDir = 'ppapi-plugins'

  const pluginMap: Record<string, { file: string; version: string }> = {
    win32: { file: join('win', 'libpepflashplayer.dll'), version: '34.0.0.376' },
    darwin: { file: join('mac', 'libpepflashplayer.plugin'), version: '34.0.0.376' },
    linux: { file: join('linux', 'libpepflashplayer.so'), version: '34.0.0.137' },
  }

  const platformConfig = pluginMap[process.platform]
  if (!platformConfig) {
    console.error('[PepFlash] Unsupported platform:', process.platform)
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
    console.error('[PepFlash] Plugin not found in any of:', possiblePaths)
    return
  }

  app.commandLine.appendSwitch('ppapi-flash-path', flashPluginPath)
  app.commandLine.appendSwitch('ppapi-flash-version', platformConfig.version)

  app.commandLine.appendSwitch('enable-plugins')
  app.commandLine.appendSwitch('allow-outdated-plugins')

  console.log(`[PepFlash] Plugin v${platformConfig.version} loaded from: ${flashPluginPath}`)
}
