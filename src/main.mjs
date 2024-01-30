import { execSync } from 'node:child_process'
import { existsSync, mkdir, readdirSync } from 'node:fs'
import { homedir } from 'node:os'
import { InitError } from './errors.mjs'
import { parseArgs } from './utils/args-parsing.mjs'

const AUR_LINK = 'https://aur.archlinux.org/'
const AURA_DIR = `${homedir()}/aura`

function main () {
  const packages = parseArgs()
  if (packages.length === 0)
    throw new InitError('Please specify the name of the packages that you want to install.')

  console.log(`Looking for ${AURA_DIR} directory...`)
  if (!existsSync(AURA_DIR)) {
    console.log(`Creating ${AURA_DIR} directory...`)
    mkdir(AURA_DIR, undefined, err => {if (err) throw err})
  }
  
  packages.forEach(pkg => {
    const git_pkg = `${AUR_LINK}${pkg}.git`
    console.log(`Clonning ${pkg} package from ${git_pkg}.`)
    execSync(`git clone ${git_pkg}`, { cwd: AURA_DIR })
  })
  
  packages.forEach(pkg => {
    console.log(`Building ${pkg} package and installing its dependencies.`)
    const pkg_path = `${AURA_DIR}/${pkg}`
    execSync('makepkg -s', { cwd: pkg_path })
    const zst = readdirSync(pkg_path).find(file => file.endsWith('.zst'))
    if (zst) {
      console.log(`Installing ${pkg}.`)
      execSync(`sudo pacman --noconfirm --needed -U ${zst}`, { cwd: pkg_path })
    }
  })
}

main()
