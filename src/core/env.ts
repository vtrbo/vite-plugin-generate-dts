import createDebugger from 'debug'
import { VITE_PLUGIN_NAME } from './constant'
import { getLikeType } from './utils'

const debug = createDebugger(`${VITE_PLUGIN_NAME}:context`)

export interface Env {
  remark: string
  value: string
  likely: 'string' | 'boolean' | 'number'
}

export type EnvMap = Record<string, Env>

export function parseEnv(data: string): EnvMap {
  data = data.replace(/\r\n?/gm, '\n')
  const regexp = /(?:^|^)\s*((?:\s*#.+\n)*)?(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?[^#\r\n]*(#.*)?(?:$|$)/gm

  const env: EnvMap = {}
  let match: RegExpExecArray | null
  // eslint-disable-next-line no-cond-assign
  while ((match = regexp.exec(data)) !== null) {
    // 注释
    const remark = match[1] || match[4]

    // 变量名
    const label = match[2].trim()

    // 变量值
    let value = (match[3] || '').trim()

    // 引号开头
    const quoteRegExp = /^(['"`])([\s\S]*)\1$/gm
    const isString = quoteRegExp.test(value)

    if (isString)
      value = value.replace(quoteRegExp, '$2').replace(/\\n/g, '\n').replace(/\\r/g, '\r')

    env[label] = {
      remark,
      value,
      likely: isString ? 'string' : getLikeType(value),
    }
  }

  return env
}
