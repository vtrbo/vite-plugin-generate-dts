import path from 'node:path'
import { ensureFileSync, readFileSync } from 'fs-extra'

export function generateEnvDts(root: string, dts: string) {
  const envDtsPath = path.resolve(root, dts)
  ensureFileSync(envDtsPath)
  const code = readFileSync(envDtsPath, 'utf-8')
}

export function parseEnvDts() {

}
