import { cp, rm } from 'node:fs/promises'
import { relative, resolve } from 'node:path'

const source = resolve('frontend/dist')
const destination = resolve('dist')

if (relative(process.cwd(), destination) !== 'dist') {
  throw new Error('Refusing to replace an unexpected build directory')
}

await rm(destination, { recursive: true, force: true })
await cp(source, destination, { recursive: true })
