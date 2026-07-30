import { cp, mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'

const source = resolve('frontend/dist')
const destination = resolve('public/site')

await mkdir(destination, { recursive: true })
await cp(source, destination, { recursive: true, force: true })
