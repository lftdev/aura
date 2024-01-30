import { execSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync } from 'node:fs'
import { homedir } from 'node:os'
import { parseArgs } from './utils/args-parsing.mjs'

const AUR_LINK = 'https://aur.archlinux.org'
const AURA_DIR = `${homedir()}/aura`

function createDirectory (dir) {
  console.log(`Creating ${dir} directory...`)
  mkdirSync(dir, undefined, err => {if (err) throw err})
}

function cloneGitPackage (link, pkg, targetDir) {
  const git_pkg = `${link}/${pkg}.git`
  console.log(`Clonning ${pkg} package from ${git_pkg}.`)
  execSync(`git clone ${git_pkg}`, { cwd: targetDir })
}

function buildPackage (pkg) {
  console.log(`Building ${pkg} package and installing its dependencies.`)
  const pkg_path = `${AURA_DIR}/${pkg}`
  execSync('makepkg -s', { cwd: pkg_path })
}

function installPackage(pkg) {
  const pkg_path = `${AURA_DIR}/${pkg}`
  const zst = readdirSync(pkg_path).find(file => file.endsWith('.zst'))
  if (zst) {
    console.log(`Installing ${pkg}.`)
    execSync(`sudo pacman --noconfirm --needed -U ${zst}`, { cwd: pkg_path })
  }
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
