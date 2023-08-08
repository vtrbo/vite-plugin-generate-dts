import type { PluginOption } from 'vite'
import chokidar from 'chokidar'
import type { Options } from './types'
import { Context } from './core/context'
import { VITE_PLUGIN_NAME } from './core/constant'

function createVitePlugin(options?: Options): PluginOption {
  const ctx = new Context(options || {})
  return {
    name: VITE_PLUGIN_NAME,
    enforce: 'pre',
    configResolved(config) {
      ctx.setViteConfig(config)

      ctx.generate()

      if (config.build.watch && config.command === 'build')
        ctx.setupWatcher(chokidar.watch([...ctx.options.env.includes]))
    },
    configureServer(server) {
      ctx.setupViteServer(server)
    },
  }
}

export default createVitePlugin
