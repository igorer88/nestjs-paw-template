import fs from 'node:fs'
import yaml from 'yaml'

const CONFIG_PATH = '.paw-tools/version-config.json'
const PACKAGE_JSON_PATH = './package.json'
const DOCKER_COMPOSE_PATH = './docker-compose.yml'

/**
 * Generates a calendar version (calver) based on the current date.
 * Format: YYYY.MM.DD
 *
 * @returns {string} The current date in calver format (e.g., "2026.04.04")
 */
function getCalverVersion() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}.${month}.${day}`
}

/**
 * Increments the semantic version based on the bump type.
 *
 * @param {string} currentVersion - The current semver version (e.g., "1.2.3")
 * @param {string} bumpType - The bump type: "patch", "minor", or "major"
 * @returns {string} The incremented version
 */
function getSemverVersion(currentVersion, bumpType = 'patch') {
  const parts = currentVersion.split('.')
  let [major, minor, patch] = parts.map(p => parseInt(p, 10))

  switch (bumpType) {
    case 'major':
      major += 1
      minor = 0
      patch = 0
      break
    case 'minor':
      minor += 1
      patch = 0
      break
    case 'patch':
    default:
      patch += 1
  }

  return `${major}.${minor}.${patch}`
}

/**
 * Increments a single digit version number.
 *
 * @param {string} currentVersion - The current single digit version (e.g., "5")
 * @returns {string} The incremented version (e.g., "6")
 */
function getSingleVersion(currentVersion) {
  const num = parseInt(currentVersion, 10) + 1
  return num.toString()
}

const COUNTER_PATH = '.paw-tools/version-counter.json'

/**
 * Reads the counter value from the counter file, or initializes to 1 if not exists.
 *
 * @returns {number} The current counter value
 */
function getCounter() {
  try {
    const counterData = JSON.parse(fs.readFileSync(COUNTER_PATH, 'utf8'))
    return counterData.value || 1
  } catch {
    return 1
  }
}

/**
 * Increments and saves the counter value to the counter file.
 *
 * @returns {number} The new counter value
 */
function incrementCounter() {
  const current = getCounter()
  const next = current + 1
  fs.writeFileSync(COUNTER_PATH, JSON.stringify({ value: next }, null, 2) + '\n')
  return next
}

/**
 * Generates a custom version based on a format string with placeholders.
 *
 * Placeholders:
 * - {{year}} - Full year (2026)
 * - {{month}} - Month with zero-padding (04)
 * - {{M}} - Month without padding (4)
 * - {{day}} - Day with zero-padding (03)
 * - {{D}} - Day without padding (3)
 * - {{counter}} - Auto-increment counter
 *
 * @param {string} format - The format string (e.g., "v{{year}}.{{counter}}")
 * @returns {string} The version string with placeholders replaced
 */
function getCustomVersion(format) {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const monthNoPad = now.getMonth() + 1
  const day = String(now.getDate()).padStart(2, '0')
  const dayNoPad = now.getDate()

  let version = format

  version = version.replace(/{{year}}/g, String(year))
  version = version.replace(/{{month}}/g, month)
  version = version.replace(/{{M}}/g, String(monthNoPad))
  version = version.replace(/{{day}}/g, day)
  version = version.replace(/{{D}}/g, String(dayNoPad))

  if (version.includes('{{counter}}')) {
    const counter = incrementCounter()
    version = version.replace(/{{counter}}/g, String(counter))
  }

  return version
}

/**
 * Reads the version configuration from .paw-tools/version-config.json.
 *
 * @returns {Object} The parsed configuration object
 * @throws {ProcessExit} If config file is not found
 */
function readConfig() {
  try {
    return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'))
  } catch {
    console.error(`Error: Config file not found at ${CONFIG_PATH}`)
    console.error('Please run the CLI setup to generate the version config.')
    process.exit(1)
  }
}

/**
 * Reads the package.json file.
 *
 * @returns {Object} The parsed package.json object
 * @throws {ProcessExit} If package.json cannot be read
 */
function readPackageJson() {
  try {
    return JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf8'))
  } catch (error) {
    console.error(`Error reading package.json: ${error.message}`)
    process.exit(1)
  }
}

/**
 * Calculates the new version based on the specified versioning scheme.
 *
 * @param {string} currentVersion - The current version string
 * @param {string} scheme - The versioning scheme ("semver", "calver", "single", or "custom")
 * @param {string} bumpType - The semver bump type: "patch", "minor", or "major"
 * @param {string} customFormat - The custom format string (only used for "custom" scheme)
 * @returns {string} The new version string
 */
function calculateNewVersion(currentVersion, scheme, bumpType = 'patch', customFormat = '') {
  switch (scheme) {
    case 'calver':
      return getCalverVersion()
    case 'single':
      return getSingleVersion(currentVersion)
    case 'custom':
      if (!customFormat) {
        console.error('Error: custom_format is required for custom versioning scheme')
        process.exit(1)
      }
      return getCustomVersion(customFormat)
    case 'semver':
    default:
      return getSemverVersion(currentVersion, bumpType)
  }
}

/**
 * Updates the version field in package.json.
 *
 * @param {string} newVersion - The new version to set
 */
function updatePackageJsonVersion(newVersion) {
  const packageJson = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf8'))
  packageJson.version = newVersion
  fs.writeFileSync(PACKAGE_JSON_PATH, JSON.stringify(packageJson, null, 2) + '\n')
  console.log(`Updated package.json version to: ${newVersion}`)
}

/**
 * Updates the docker-compose.yml file image tags for services that are built by the project.
 * Only updates services with a 'build' configuration (project-built images).
 *
 * @param {string} name - The project name from package.json
 * @param {string} version - The new version to append to image tags
 */
function updateDockerCompose(name, version) {
  try {
    const fileContents = fs.readFileSync(DOCKER_COMPOSE_PATH, 'utf8')
    const composeFile = yaml.parseDocument(fileContents)

    const services = composeFile.get('services')
    if (services) {
      for (const pair of services.items) {
        const serviceName = pair.key.value
        const service = pair.value
        if (service.has('build') && service.has('image')) {
          const currentImage = service.get('image')
          const imageParts = currentImage.split(':')
          const imageName = imageParts[0]
          const versionPrefix = version.startsWith('v') ? '' : 'v'
          const dockerImgVersion = `${imageName}:${versionPrefix}${version}`
          service.set('image', dockerImgVersion)
          console.log(
            `Updating docker-compose.yml: ${serviceName} image to ${dockerImgVersion}`
          )
        }
      }
    }

    if (composeFile.has('volumes') && composeFile.get('volumes')?.items.length === 0) {
      composeFile.delete('volumes')
    }
    if (composeFile.has('networks') && composeFile.get('networks')?.items.length === 0) {
      composeFile.delete('networks')
    }

    fs.writeFileSync(DOCKER_COMPOSE_PATH, composeFile.toString())
    console.log('Updated docker-compose.yml successfully!')
  } catch (error) {
    console.error(`Error updating docker-compose.yml: ${error.message}`)
  }
}

/**
 * Main function that orchestrates the version bump process.
 * Reads config, calculates new version, and updates both package.json and docker-compose.yml.
 *
 * @param {string} bumpType - Optional bump type: "patch", "minor", or "major" (defaults to "patch")
 */
function main(bumpType = 'patch') {
  const config = readConfig()
  const packageJson = readPackageJson()

  const currentVersion = packageJson.version
  const scheme = config.versioning_scheme
  const customFormat = config.custom_format || ''
  const newVersion = calculateNewVersion(currentVersion, scheme, bumpType, customFormat)

  console.log(`Current version: ${currentVersion}`)
  console.log(`Scheme: ${scheme}`)
  if (scheme === 'custom') {
    console.log(`Format: ${customFormat}`)
  }
  console.log(`Bump type: ${bumpType}`)
  console.log(`New version: ${newVersion}`)

  updatePackageJsonVersion(newVersion)
  updateDockerCompose(packageJson.name, newVersion)

  console.log(`\nVersion bumped to: ${newVersion}`)
}

const bumpTypeArg = process.argv[2] || 'patch'
main(bumpTypeArg)
