import type { PluginOption } from 'vite'
import type { Options } from './types'

function createVitePlugin(options?: Options): PluginOption {
  return {
    name: 'vite-plugin-generate-dts',
    transform(code, id: string) {
      if (id.endsWith('main.ts'))
        return code.replace('__VITE_PLUGIN__', `Hello Vite Plugin! ${options}`)
      return null
    },
  }
}

export default createVitePlugin
