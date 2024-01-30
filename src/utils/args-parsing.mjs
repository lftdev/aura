import { argv } from 'node:process'

export const parseArgs = () =>
  argv.length > 2 ? argv.slice(2) : []
