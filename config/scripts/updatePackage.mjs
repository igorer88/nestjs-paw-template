import fs from 'node:fs'
import yaml from 'js-yaml'
import { rl } from './utils.mjs'

/**
 * Updates the package.json file with provided values.
 * Optionally installs dependencies after updating the package.json file.
 *
 * @param {Object} params - The parameters for updating package.json.
 * @param {string} params.name - The project name.
 * @param {string} params.description - The project description.
 * @param {string} params.version - The project version.
 * @param {string} params.author - The project author.
 */
export const updatePackageJson = async ({
  name,
  description,
  version,
  author
}) => {
  try {
    const packageJsonPath = './package.json'
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

    packageJson.name = name
    packageJson.description = description
    packageJson.version = version
    packageJson.author = author

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
    console.log('package.json updated successfully!')

    updateDockerCompose(name)
  } catch (error) {
    console.error('Error updating package.json:', error)
  } finally {
    rl.close()
  }
}

/**
 * Updates the docker-compose.yml file with the provided service name and image version.
 * Optionally changes the PNPM_REGISTRY to the specified package manager registry.
 *
 * @param {string} serviceName - The name of the service to update.
 * @param {string} [dockerComposePath='./docker-compose.yml'] - The path to the docker-compose.yml file.
 * @param {string} [dockerImageVersion='latest'] - The version of the Docker image.
 * @param {string} [packageManager='pnpm'] - The package manager to use for the registry.
 * @param {string} [registryUrl='https://registry.npmjs.org/'] - The registry URL to use.
 */
export const updateDockerCompose = (
  serviceName,
  dockerComposePath = './docker-compose.yml',
  dockerImageVersion = 'latest',
  packageManager = 'pnpm',
  registryUrl = 'https://registry.npmjs.org/'
) => {
  try {
    const dockerCompose = yaml.load(fs.readFileSync(dockerComposePath, 'utf8'))
    const dockerImgVersion = `${serviceName}:${dockerImageVersion}`

    dockerCompose.services[serviceName].container_name = serviceName
    dockerCompose.services[serviceName].image = dockerImgVersion

    if (packageManager !== 'pnpm') {
      dockerCompose.services[serviceName].build.args[
        `${packageManager}_REGISTRY`
      ] = registryUrl
    }

    fs.writeFileSync(dockerComposePath, yaml.dump(dockerCompose))
    console.log('docker-compose.yml updated successfully!')
  } catch (error) {
    console.error('Error updating docker-compose.yml:', error)
  }
}
