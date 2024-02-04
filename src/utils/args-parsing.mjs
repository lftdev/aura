import { InputError } from '../errors.mjs'

function getOptionIndex (args, option) {
  const shortIndex = args.indexOf(option.short)
  const longIndex = args.indexOf(option.long)
  if (shortIndex !== -1) return shortIndex
  else if (longIndex !== -1) return longIndex
  return -1
}

function parseArray (args, option) {
  const elements = []
  const optionIndex = getOptionIndex(args, option)

  if (optionIndex === -1) throw new InputError(`I need you to specify values for ${option.short}/${option.long} option.`)

  for (let index = optionIndex + 1; index < args.length; index++) {
    const current = args[index]
    if (current.startsWith('-')) break
    elements.push(current)
  }
  return elements
}

export function parseArguments () {
  const args = process.argv.slice(2)
  const installOption = {
    short: '-i',
    long: '--install'
  }

  if (args.length === 0) throw new InputError(`Please, specify the name of the packages that you want to install using ${installOption.short}/${installOption.long} option.`)

  return parseArray(args, installOption)
}
