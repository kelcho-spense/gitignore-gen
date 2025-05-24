import { detectProjectTypes, generateGitignoreContent } from '../src/extension';

// Test our demo workspace
const demoPath = 'd:\\PersonalProjects\\gitignore-gen\\gitignore-gen\\demo-workspace';
const projectTypes = detectProjectTypes(demoPath);
console.log('Detected project types:', projectTypes);

const gitignoreContent = generateGitignoreContent(projectTypes);
console.log('\nGenerated .gitignore content:');
console.log('='.repeat(50));
console.log(gitignoreContent);
console.log('='.repeat(50));
