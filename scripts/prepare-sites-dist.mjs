import { cp, mkdir, rm } from 'node:fs/promises'
import { relative, resolve } from 'node:path'

const source = resolve('frontend/dist')
const destination = resolve('dist')

if (relative(process.cwd(), destination) !== 'dist') {
  throw new Error('Refusing to replace an unexpected build directory')
}

await rm(destination, { recursive: true, force: true })
await mkdir(resolve(destination, 'client'), { recursive: true })
await mkdir(resolve(destination, 'server'), { recursive: true })
await mkdir(resolve(destination, '.openai'), { recursive: true })

await cp(source, resolve(destination, 'client'), { recursive: true })
await cp(
  resolve('scripts/sites-static-worker.mjs'),
  resolve(destination, 'server/index.js'),
)
await cp(
  resolve('.openai/hosting.json'),
  resolve(destination, '.openai/hosting.json'),
)
