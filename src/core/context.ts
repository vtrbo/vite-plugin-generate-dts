import type fs from 'node:fs'
import type { ResolvedConfig, ViteDevServer } from 'vite'
import fg from 'fast-glob'
import createDebugger from 'debug'
import { readFileSync } from 'fs-extra'
import type { Options, ResolvedOptions } from '../types'
import { parseEnv } from './env'
import { resolveOptions } from './options'
import { VITE_PLUGIN_NAME } from './constant'

const debug = createDebugger(`${VITE_PLUGIN_NAME}:context`)

export class Context {
  options: ResolvedOptions

  config: ResolvedConfig | Record<string, any> = {}

  private _generated = false

  private _server: ViteDevServer | undefined

  constructor(rawOptions: Options) {
    this.options = resolveOptions(rawOptions)
  }

  setViteConfig(rawConfig: ResolvedConfig) {
    this.config = rawConfig
  }

  addEnvDts(path: string) {

  }

  generate() {
    if (this._generated)
      return
    this.scanEnv()
  }

  scanEnv() {
    const { env } = this.options
    if (env.dts) {
      const envFiles = fg.sync(env.includes, {
        ignore: ['**/node_modules/**'],
        onlyFiles: true,
        cwd: this.config.root,
      })
      debug('envFiles =>', envFiles)
      envFiles.map((path) => {
        const content = readFileSync(path, 'utf-8')
        debug('content =>', content)
        const envMap = parseEnv(content)
        debug('envMap =>', envMap)
        return ''
      })
    }
  }

  setupViteServer(server: ViteDevServer) {
    if (this._server === server)
      return

    this._server = server
    this.setupWatcher(server.watcher)
  }

  setupWatcher(watcher: fs.FSWatcher) {
    watcher
      .on('add', (path) => {
        console.log('add')
        this.addEnvDts(path)
      })
      .on('change', (path) => {
        console.log('change')
      })
      .on('unlink', (path) => {
        console.log('unlink')
      })
  }
}
