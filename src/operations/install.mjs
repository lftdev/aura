import { execSync } from 'node:child_process'
import { readdirSync } from 'node:fs'

export function cloneGitPackage (link, pkg, targetDir) {
  const git_pkg = `${link}/${pkg}.git`
  console.log(`Clonning ${pkg} package from ${git_pkg}.`)
  execSync(`git clone ${git_pkg}`, { cwd: targetDir })
}

export function buildPackage (pkg, dir) {
  console.log(`Building ${pkg} package and installing its dependencies.`)
  const pkg_path = `${dir}/${pkg}`
  execSync('makepkg -s', { cwd: pkg_path })
}

export function installPackage(pkg, dir) {
  const pkg_path = `${dir}/${pkg}`
  const zst = readdirSync(pkg_path).find(file => file.endsWith('.zst'))
  if (zst) {
    console.log(`Installing ${pkg}.`)
    execSync(`sudo pacman --noconfirm --needed -U ${zst}`, { cwd: pkg_path })
  }
}