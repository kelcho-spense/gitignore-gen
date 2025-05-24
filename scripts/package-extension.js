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

console.log(`📦 Packaging extension: ${name}`);
console.log(`🔢 Version: ${version}`);
console.log(`📁 Output file: ${vsixFileName}`);

// Remove old VSIX files (optional cleanup)
const projectRoot = path.join(__dirname, '..');
const existingVsixFiles = fs.readdirSync(projectRoot)
    .filter(file => file.endsWith('.vsix') && file.startsWith(name));

if (existingVsixFiles.length > 0) {
    console.log(`🧹 Cleaning up old VSIX files:`);
    existingVsixFiles.forEach(file => {
        const filePath = path.join(projectRoot, file);
        fs.unlinkSync(filePath);
        console.log(`   🗑️  Removed: ${file}`);
    });
}

try {
    // Package the extension
    console.log(`🔨 Building and packaging extension...`);
    execSync('vsce package --allow-missing-repository', {
        stdio: 'inherit',
        cwd: projectRoot
    });

    console.log(`✅ Extension packaged successfully: ${vsixFileName}`);
    console.log(`💡 Run 'pnpm run install-extension' to install it in VS Code.`);
} catch (error) {
    console.error(`❌ Error packaging extension: ${error.message}`);
    process.exit(1);
}
