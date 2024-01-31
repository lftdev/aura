#!/usr/bin/env node
import { existsSync, mkdirSync } from 'node:fs'
import { homedir } from 'node:os'
import { parseArgs } from './utils/args-parsing.mjs'
import { buildPackage, cloneGitPackage, installPackage } from './operations/install.mjs'

const AUR_LINK = 'https://aur.archlinux.org'
const AURA_DIR = `${homedir()}/aura`

function createDirectory (dir) {
  console.log(`Creating ${dir} directory...`)
  mkdirSync(dir, undefined, err => {if (err) throw err})
}

function main () {
  try {
    const packages = parseArgs()

    console.log(`Looking for ${AURA_DIR} directory...`)
    if (!existsSync(AURA_DIR)) createDirectory(AURA_DIR)

    packages.forEach(pkg => cloneGitPackage(AUR_LINK, pkg, AURA_DIR))
    packages.forEach(pkg => buildPackage(pkg))
    packages.forEach(pkg => installPackage(pkg))
  } catch (error) {
    if (error.name === 'InputError') console.error(error.message)
    else console.error('Unknown error.')
  }
}

main()
