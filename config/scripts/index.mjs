import fs from 'node:fs';
import readline from 'node:readline';
import { exec } from 'node:child_process';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (query, currentValue) => new Promise(resolve => {
  rl.question(`${query} (current: ${currentValue}): `, (answer) => {
    resolve(answer.trim() === '' ? currentValue : answer);
  });
});

const askYesNoQuestion = (query) => new Promise(resolve => {
  rl.question(`${query} (y/n): `, (answer) => {
    resolve(answer.trim().toLowerCase() === 'y');
  });
});

const updatePackageJson = async () => {
  try {
    const packageJsonPath = './package.json';
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    const name = await askQuestion('Enter project name', packageJson.name);
    const description = await askQuestion('Enter project description', packageJson.description);
    const version = await askQuestion('Enter project version', packageJson.version);
    const author = await askQuestion('Enter project author', packageJson.author);

    packageJson.name = name;
    packageJson.description = description;
    packageJson.version = version;
    packageJson.author = author;

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('package.json updated successfully!');

    const installDependencies = await askYesNoQuestion('Do you want to install dependencies now?');
    if (installDependencies) {
      exec('pnpm install', (error, stdout, stderr) => {
        if (error) {
          console.error(`Error installing dependencies: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
      });
    }
  } catch (error) {
    console.error('Error updating package.json:', error);
  } finally {
    rl.close();
  }
};

updatePackageJson();
