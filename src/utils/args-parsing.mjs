import { argv } from 'node:process'
import { InputError } from '../errors.mjs'

export function parseArgs () {
  if (argv.length > 2) 
    return argv.slice(2)
  throw new InputError('Please, specify the name of the packages that you want to install.')
}
