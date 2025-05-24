import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

// Import the functions from extension
import { detectProjectTypes, generateGitignoreContent } from '../extension';

suite('GitIgnore Generator Tests', () => {
    let tempDir: string;

    setup(() => {
        // Create a temporary directory for testing
        tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gitignore-test-'));
    });

    teardown(() => {
        // Clean up temporary directory
        if (fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true, force: true });
        }
    });

    test('Should detect Node.js project', () => {
        // Create package.json
        const packageJson = {
            name: 'test-project',
            version: '1.0.0',
            dependencies: {
                express: '^4.18.0'
            }
        };
        fs.writeFileSync(path.join(tempDir, 'package.json'), JSON.stringify(packageJson, null, 2));

        const result = detectProjectTypes(tempDir);
        assert.strictEqual(result.includes('node'), true);
    });

    test('Should detect Python project', () => {
        // Create requirements.txt
        fs.writeFileSync(path.join(tempDir, 'requirements.txt'), 'django==4.0.0\nrequests==2.28.0');

        const result = detectProjectTypes(tempDir);
        assert.strictEqual(result.includes('python'), true);
    });

    test('Should detect Next.js project', () => {
        // Create package.json with Next.js
        const packageJson = {
            name: 'test-nextjs',
            version: '1.0.0',
            dependencies: {
                next: '^13.0.0',
                react: '^18.0.0'
            }
        };
        fs.writeFileSync(path.join(tempDir, 'package.json'), JSON.stringify(packageJson, null, 2));

        const result = detectProjectTypes(tempDir);
        assert.strictEqual(result.includes('nextjs'), true);
    });

    test('Should detect multiple project types', () => {
        // Create both package.json and requirements.txt
        const packageJson = {
            name: 'test-fullstack',
            version: '1.0.0',
            dependencies: {
                express: '^4.18.0'
            }
        };
        fs.writeFileSync(path.join(tempDir, 'package.json'), JSON.stringify(packageJson, null, 2));
        fs.writeFileSync(path.join(tempDir, 'requirements.txt'), 'django==4.0.0');

        const result = detectProjectTypes(tempDir);
        assert.strictEqual(result.includes('node'), true);
        assert.strictEqual(result.includes('python'), true);
    });

    test('Should generate appropriate gitignore content for Node.js', () => {
        const content = generateGitignoreContent(['node']);
        assert.strictEqual(content.includes('node_modules/'), true);
        assert.strictEqual(content.includes('.env'), true);
        assert.strictEqual(content.includes('npm-debug.log'), true);
    });

    test('Should generate combined content for multiple project types', () => {
        const content = generateGitignoreContent(['node', 'python']);
        assert.strictEqual(content.includes('node_modules/'), true);
        assert.strictEqual(content.includes('__pycache__/'), true);
        assert.strictEqual(content.includes('.env'), true);
    });

    test('Should default to generic when no project type detected', () => {
        const result = detectProjectTypes(tempDir);
        assert.strictEqual(result.includes('generic'), true);
    });
});
