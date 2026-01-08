import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
	console.log('GitIgnore Generator extension is now active!');

	// Register the command to create .gitignore
	let createGitignoreCommand = vscode.commands.registerCommand('gitignore-gen.createGitignore', async () => {
		console.log('Create .gitignore command triggered');
		await createGitignoreFile();
	});

	// Watch for .gitignore file creation and closure
	let fileWatcher = vscode.workspace.onDidSaveTextDocument(async (document: vscode.TextDocument) => {
		if (document.fileName.endsWith('.gitignore')) {
			const content = document.getText().trim();
			console.log('🔍 File saved:', document.fileName, 'Content length:', content.length);
			if (content === '') {
				console.log('✅ Empty .gitignore detected on save, populating...');
				// Add a small delay to ensure file operations are complete
				setTimeout(async () => {
					await populateGitignoreFile(document.uri.fsPath);
				}, 100);
			}
		}
	});

	// Watch for when files are closed - this is the main trigger
	let closeWatcher = vscode.workspace.onDidCloseTextDocument(async (document: vscode.TextDocument) => {
		if (document.fileName.endsWith('.gitignore')) {
			const content = document.getText().trim();
			console.log('🔍 File closed:', document.fileName, 'Content length:', content.length);
			if (content === '') {
				console.log('✅ Empty .gitignore detected on close, populating...');
				// Add a small delay to ensure file operations are complete
				setTimeout(async () => {
					await populateGitignoreFile(document.uri.fsPath);
				}, 100);
			}
		}
	});

	// Also watch for file system changes to catch manual .gitignore creation
	let fsWatcher = vscode.workspace.createFileSystemWatcher('**/.gitignore');
	fsWatcher.onDidCreate(async (uri) => {
		console.log('🔍 .gitignore file created:', uri.fsPath);
		// Small delay to let VS Code finish creating the file
		setTimeout(async () => {
			const content = fs.readFileSync(uri.fsPath, 'utf8').trim();
			if (content === '') {
				console.log('✅ Empty .gitignore detected via file system watcher, populating...');
				await populateGitignoreFile(uri.fsPath);
			}
		}, 200);
	});

	context.subscriptions.push(createGitignoreCommand, fileWatcher, closeWatcher, fsWatcher);
}

async function createGitignoreFile() {
	const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;

	if (!workspaceFolder) {
		vscode.window.showErrorMessage('No workspace folder is open.');
		return;
	}

	const gitignorePath = path.join(workspaceFolder, '.gitignore');
	console.log('Creating .gitignore at:', gitignorePath);

	if (fs.existsSync(gitignorePath)) {
		const choice = await vscode.window.showWarningMessage(
			'.gitignore already exists. Do you want to overwrite it?',
			'Yes', 'No'
		);
		if (choice !== 'Yes') {
			return;
		}
	}

	// Create empty .gitignore file
	fs.writeFileSync(gitignorePath, '');
	console.log('Empty .gitignore created');

	// Open the file
	const document = await vscode.workspace.openTextDocument(gitignorePath);
	await vscode.window.showTextDocument(document);

	vscode.window.showInformationMessage('Empty .gitignore created. Close the file to auto-populate it based on your project type.');
}

async function populateGitignoreFile(gitignorePath: string) {
	const workspaceFolder = path.dirname(gitignorePath);

	try {
		console.log('🚀 Starting populateGitignoreFile for:', gitignorePath);
		console.log('📁 Workspace folder:', workspaceFolder);

		// Check if file exists and is empty
		if (!fs.existsSync(gitignorePath)) {
			console.log('❌ Gitignore file does not exist:', gitignorePath);
			return;
		}

		// Read file content from disk (not from VS Code document)
		const currentContent = fs.readFileSync(gitignorePath, 'utf8').trim();
		console.log('📄 Current file content length:', currentContent.length);

		if (currentContent !== '') {
			console.log('⚠️ Gitignore file is not empty, skipping population. Content:', currentContent.substring(0, 50));
			return;
		}

		console.log('🔍 Detecting project types for workspace:', workspaceFolder);
		const projectTypes = detectProjectTypes(workspaceFolder);
		console.log('🎯 Detected project types:', projectTypes);

		if (projectTypes.length === 0) {
			console.log('⚠️ No project types detected, using generic');
			projectTypes.push('generic');
		}

		const gitignoreContent = generateGitignoreContent(projectTypes);
		console.log('📝 Generated content length:', gitignoreContent.length);
		console.log('📝 Content preview:', gitignoreContent.substring(0, 100) + '...');

		// Write the content to the file
		fs.writeFileSync(gitignorePath, gitignoreContent);
		console.log('✅ Content written to file');

		const detectedTypesString = projectTypes.length > 0 ? projectTypes.join(', ') : 'generic';

		// Show success message
		vscode.window.showInformationMessage(
			`🎉 .gitignore populated for detected project type(s): ${detectedTypesString}`
		);

		console.log('🎉 Successfully populated .gitignore with types:', detectedTypesString);
	} catch (error) {
		console.error('💥 Error populating .gitignore:', error);
		vscode.window.showErrorMessage(`Error populating .gitignore: ${error}`);
	}
}

export function detectProjectTypes(workspaceFolder: string): string[] {
	const detectedTypes: string[] = [];

	// Check for multiple project types in the same workspace

	// Node.js / JavaScript / TypeScript
	if (fs.existsSync(path.join(workspaceFolder, 'package.json'))) {
		const packageJsonPath = path.join(workspaceFolder, 'package.json');
		try {
			const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

			// Check for specific frameworks
			if (packageJson.dependencies?.['next'] || packageJson.devDependencies?.['next']) {
				detectedTypes.push('nextjs');
			} else if (packageJson.dependencies?.['svelte'] || packageJson.devDependencies?.['svelte']) {
				detectedTypes.push('svelte');
			} else if (packageJson.dependencies?.['react'] || packageJson.devDependencies?.['react']) {
				detectedTypes.push('react');
			} else {
				detectedTypes.push('node');
			}
		} catch {
			detectedTypes.push('node');
		}
	}

	// TypeScript
	if (fs.existsSync(path.join(workspaceFolder, 'tsconfig.json'))) {
		if (!detectedTypes.includes('node') && !detectedTypes.includes('nextjs') &&
			!detectedTypes.includes('svelte') && !detectedTypes.includes('react')) {
			detectedTypes.push('typescript');
		}
	}

	// Python
	if (fs.existsSync(path.join(workspaceFolder, 'requirements.txt')) ||
		fs.existsSync(path.join(workspaceFolder, 'setup.py')) ||
		fs.existsSync(path.join(workspaceFolder, 'Pipfile')) ||
		fs.existsSync(path.join(workspaceFolder, 'pyproject.toml'))) {
		detectedTypes.push('python');
	}

	// Java
	if (fs.existsSync(path.join(workspaceFolder, 'pom.xml'))) {
		detectedTypes.push('java-maven');
	} else if (fs.existsSync(path.join(workspaceFolder, 'build.gradle')) ||
		fs.existsSync(path.join(workspaceFolder, 'build.gradle.kts'))) {
		detectedTypes.push('java-gradle');
	}

	// .NET (C#)
	const csprojFiles = fs.readdirSync(workspaceFolder).filter(file => file.endsWith('.csproj'));
	if (csprojFiles.length > 0 || fs.existsSync(path.join(workspaceFolder, 'global.json'))) {
		detectedTypes.push('csharp');
	}

	// C++
	if (fs.existsSync(path.join(workspaceFolder, 'CMakeLists.txt')) ||
		fs.existsSync(path.join(workspaceFolder, 'Makefile'))) {
		detectedTypes.push('cpp');
	}

	// PHP
	if (fs.existsSync(path.join(workspaceFolder, 'composer.json'))) {
		// Check for Laravel
		try {
			const composerJson = JSON.parse(fs.readFileSync(path.join(workspaceFolder, 'composer.json'), 'utf8'));
			if (composerJson.require?.['laravel/framework']) {
				detectedTypes.push('laravel');
			} else {
				detectedTypes.push('php');
			}
		} catch {
			detectedTypes.push('php');
		}
	} else if (fs.existsSync(path.join(workspaceFolder, 'index.php')) ||
		fs.existsSync(path.join(workspaceFolder, 'artisan'))) {
		detectedTypes.push('php');
	}

	// Ruby
	if (fs.existsSync(path.join(workspaceFolder, 'Gemfile'))) {
		detectedTypes.push('ruby');
	}

	// Go
	if (fs.existsSync(path.join(workspaceFolder, 'go.mod'))) {
		detectedTypes.push('go');
	}

	// Rust
	if (fs.existsSync(path.join(workspaceFolder, 'Cargo.toml'))) {
		detectedTypes.push('rust');
	}

	// Swift
	if (fs.existsSync(path.join(workspaceFolder, 'Package.swift'))) {
		detectedTypes.push('swift');
	}

	// Dart/Flutter
	if (fs.existsSync(path.join(workspaceFolder, 'pubspec.yaml'))) {
		detectedTypes.push('dart');
	}

	// Kotlin
	const gradleFiles = fs.readdirSync(workspaceFolder).filter(file =>
		file === 'build.gradle.kts' || (file === 'build.gradle' &&
			fs.readFileSync(path.join(workspaceFolder, file), 'utf8').includes('kotlin'))
	);
	if (gradleFiles.length > 0) {
		detectedTypes.push('kotlin');
	}

	// Elixir
	if (fs.existsSync(path.join(workspaceFolder, 'mix.exs'))) {
		detectedTypes.push('elixir');
	}

	// Haskell
	if (fs.existsSync(path.join(workspaceFolder, 'stack.yaml')) ||
		fs.existsSync(path.join(workspaceFolder, 'cabal.project'))) {
		detectedTypes.push('haskell');
	}

	// R
	if (fs.existsSync(path.join(workspaceFolder, 'DESCRIPTION')) ||
		fs.existsSync(path.join(workspaceFolder, '.Rproj'))) {
		detectedTypes.push('r');
	}

	// Terraform
	const tfFiles = fs.readdirSync(workspaceFolder).filter(file => file.endsWith('.tf'));
	if (tfFiles.length > 0) {
		detectedTypes.push('terraform');
	}

	// Docker
	if (fs.existsSync(path.join(workspaceFolder, 'Dockerfile')) ||
		fs.existsSync(path.join(workspaceFolder, 'docker-compose.yml'))) {
		detectedTypes.push('docker');
	}

	return detectedTypes.length > 0 ? detectedTypes : ['generic'];
}

export function generateGitignoreContent(projectTypes: string[]): string {
	const sections: string[] = [];

	// Add general entries that apply to all projects
	sections.push(`# General
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db
*.log
*.bak
*.swp
*.tmp
*~

# IDE and Editor files
.vscode/
.idea/
*.sublime-*
*.iml
.vs/
.viminfo`);

	for (const projectType of projectTypes) {
		sections.push(getProjectTypeContent(projectType));
	}

	return sections.filter(section => section.trim()).join('\n\n') + '\n';
}

function getProjectTypeContent(projectType: string): string {
	switch (projectType) {
		case 'node':
		case 'typescript':
			return `# Node.js
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*
.npm
.eslintcache
.node_repl_history
*.tgz
.yarn-integrity
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
dist/
build/
coverage/`;

		case 'nextjs':
			return `# Next.js
node_modules/
.next/
out/
.env*
.vercel
*.tgz
npm-debug.log*
yarn-debug.log*
yarn-error.log*`;

		case 'react':
			return `# React
node_modules/
build/
.env*
npm-debug.log*
yarn-debug.log*
yarn-error.log*
coverage/
.eslintcache`;

		case 'svelte':
			return `# Svelte
node_modules/
.svelte-kit/
build/
.env*
package/
.vercel`;

		case 'python':
			return `# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg
MANIFEST
.env
.venv
env/
venv/
ENV/
env.bak/
venv.bak/
.pytest_cache/
.tox/
.coverage
htmlcov/
.nyc_output
.cache
nosetests.xml
coverage.xml
*.cover
.hypothesis/
.mypy_cache/
.dmypy.json
dmypy.json`;

		case 'java-maven':
			return `# Java Maven
target/
*.class
*.jar
*.war
*.ear
*.nar
hs_err_pid*
.classpath
.project
.settings/
.metadata/
.recommenders/
.factorypath`;

		case 'java-gradle':
			return `# Java Gradle
.gradle/
build/
*.class
*.jar
*.war
*.ear
*.nar
hs_err_pid*
.classpath
.project
.settings/
.metadata/
.recommenders/
.factorypath
gradle-app.setting`;

		case 'csharp':
			return `# .NET
bin/
obj/
.vs/
*.user
*.suo
*.userosscache
*.sln.docstates
*.userprefs
.nuget/
project.lock.json
project.fragment.lock.json
artifacts/
TestResults/
[Dd]ebug/
[Dd]ebugPublic/
[Rr]elease/
[Rr]eleases/
x64/
x86/
bld/
[Bb]in/
[Oo]bj/
[Ll]og/`;

		case 'cpp':
			return `# C++
*.o
*.obj
*.elf
*.ilk
*.map
*.exp
*.gch
*.pch
*.lib
*.a
*.la
*.lo
*.dll
*.so
*.so.*
*.dylib
*.exe
*.out
*.app
CMakeCache.txt
CMakeFiles/
cmake_install.cmake
Makefile
*.cmake
build/
.vs/`;

		case 'php':
			return `# PHP
vendor/
composer.lock
.env
*.log
.phpunit.result.cache
.php_cs.cache
.php-cs-fixer.cache`;

		case 'laravel':
			return `# Laravel
vendor/
node_modules/
public/hot
public/storage
storage/*.key
.env
.env.backup
.phpunit.result.cache
Homestead.json
Homestead.yaml
npm-debug.log
yarn-error.log
.php_cs.cache
.php-cs-fixer.cache`;

		case 'ruby':
			return `# Ruby
*.gem
*.rbc
/.config
/coverage/
/InstalledFiles
/pkg/
/spec/reports/
/spec/examples.txt
/test/tmp/
/test/version_tmp/
/tmp/
.bundle/
.byebug_history
.rspec
.rvmrc
.ruby-version
.ruby-gemset
Gemfile.lock
vendor/bundle
log/
.env`;

		case 'go':
			return `# Go
*.exe
*.exe~
*.dll
*.so
*.dylib
*.test
*.out
go.work
vendor/
.env`;

		case 'rust':
			return `# Rust
target/
Cargo.lock
**/*.rs.bk
*.pdb
.env`;

		case 'swift':
			return `# Swift
.build/
.swiftpm/
*.xcodeproj/
*.xcworkspace/
DerivedData/
*.resolved
.DS_Store`;

		case 'dart':
			return `# Dart/Flutter
.dart_tool/
.flutter-plugins
.flutter-plugins-dependencies
.packages
.pub-cache/
.pub/
build/
.env
*.g.dart
*.freezed.dart
*.gr.dart`;

		case 'kotlin':
			return `# Kotlin
.gradle/
build/
*.class
*.jar
*.war
*.ear
*.nar
.kotlin/
kotlin-js-store/`;

		case 'elixir':
			return `# Elixir
_build/
deps/
*.ez
*.beam
/config/*.secret.exs
.fetch
erl_crash.dump
*.plt
*.plt.hash
.env`;

		case 'haskell':
			return `# Haskell
.stack-work/
dist/
dist-newstyle/
*.hi
*.o
*.p_hi
*.p_o
*.dyn_hi
*.dyn_o
.hpc/
.hsenv/
cabal-dev/
.cabal-sandbox/
cabal.sandbox.config
.ghc.environment.*`;

		case 'r':
			return `# R
.Rhistory
.Rapp.history
.RData
.Ruserdata
.Rproj.user/
.Renviron
*.Rcheck/
*.tar.gz
*.tgz
packrat/lib*/
packrat/src/`;

		case 'terraform':
			return `# Terraform
.terraform/
*.tfstate
*.tfstate.*
*.tfvars
crash.log
crash.*.log
.terraformrc
terraform.rc`;

		case 'docker':
			return `# Docker
.dockerignore
docker-compose.override.yml
.env`;

		case 'generic':
		default:
			return `# Environment variables
.env
.env.local
.env.*.local

# Temporary files
*.tmp
*~
*.bak`;
	}
}

export function deactivate() { }
