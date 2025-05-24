const fs = require('fs');
const path = require('path');

// Import the functions we need to test
const { detectProjectTypes, generateGitignoreContent } = require('./dist/extension.js');

// Test the detection and generation
const testFolder = './demo-workspace';
console.log('Testing project detection...');
const detectedTypes = detectProjectTypes(testFolder);
console.log('Detected types:', detectedTypes);

console.log('\nTesting content generation...');
const content = generateGitignoreContent(detectedTypes);
console.log('Generated content length:', content.length);
console.log('First 500 characters:', content.substring(0, 500));
