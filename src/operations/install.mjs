import { execSync } from 'node:child_process'
import { readdirSync } from 'node:fs'

export function cloneGitPackage (link, pkg, targetDir) {
  const gitPkg = `${link}/${pkg}.git`
  console.log(`Clonning ${pkg} package from ${gitPkg}.`)
  execSync(`git clone ${gitPkg}`, { cwd: targetDir })
}

export function buildPackage (pkg, dir) {
  console.log(`Building ${pkg} package and installing its dependencies.`)
  const pkgPath = `${dir}/${pkg}`
  execSync('makepkg -s', { cwd: pkgPath })
}

export function installPackage (pkg, dir) {
  const pkgPath = `${dir}/${pkg}`
  const zst = readdirSync(pkgPath).find(file => file.endsWith('.zst'))
  if (zst) {
    console.log(`Installing ${pkg}.`)
    execSync(`sudo pacman --noconfirm --needed -U ${zst}`, { cwd: pkgPath })
  }
}
