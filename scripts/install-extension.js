#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Read package.json to get the current version
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

const name = packageJson.name;
const version = packageJson.version;
const vsixFileName = `${name}-${version}.vsix`;
const vsixPath = path.join(__dirname, '..', vsixFileName);

console.log(`📦 Extension: ${name}`);
console.log(`🔢 Version: ${version}`);
console.log(`📁 VSIX file: ${vsixFileName}`);

// Check if the VSIX file exists
if (!fs.existsSync(vsixPath)) {
    console.error(`❌ Error: VSIX file not found: ${vsixPath}`);
    console.log(`💡 Run 'pnpm run package-extension' first to create the VSIX file.`);
    process.exit(1);
}

try {
    // Install the extension
    console.log(`🚀 Installing extension: ${vsixFileName}`);
    execSync(`code --install-extension "${vsixPath}"`, {
        stdio: 'inherit',
        cwd: path.join(__dirname, '..')
    });
    console.log(`✅ Extension installed successfully!`);
} catch (error) {
    console.error(`❌ Error installing extension: ${error.message}`);
    process.exit(1);
}
