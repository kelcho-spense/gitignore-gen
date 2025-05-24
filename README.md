# GitIgnore Generator

A Visual Studio Code extension that automatically creates and populates `.gitignore` files based on your project type. Whether you're working with Node.js, Python, Java, .NET, or many other technologies, this extension streamlines the process of setting up your gitignore with the appropriate files and directories to ignore.

## Features

- **Automatic Project Detection**: Scans your workspace for project files (package.json, requirements.txt, etc.) to determine project type
- **Multi-Framework Support**: Supports 20+ programming languages and frameworks
- **Smart Auto-Population**: Creates an empty `.gitignore` file, and when you close it, automatically populates it with relevant entries
- **Context Menu Integration**: Right-click in the Explorer to create a `.gitignore` file
- **Comprehensive Coverage**: Includes entries for IDEs, build artifacts, dependencies, and environment files

## Supported Project Types

- **JavaScript/TypeScript**: Node.js, React, Next.js, Svelte
- **Python**: Standard Python projects with various package managers
- **Java**: Maven and Gradle projects
- **C#/.NET**: .NET Core and Framework projects
- **C++**: CMake and Makefile projects
- **PHP**: Standard PHP and Laravel projects
- **Ruby**: Gem-based projects
- **Go**: Go modules
- **Rust**: Cargo projects
- **Swift**: Swift Package Manager
- **Dart/Flutter**: Flutter and Dart projects
- **Kotlin**: Kotlin projects
- **Elixir**: Mix projects
- **Haskell**: Stack and Cabal projects
- **R**: R projects
- **Terraform**: Infrastructure as Code
- **Docker**: Containerized applications

## Usage

### Method 1: Command Palette
1. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
2. Type "Create .gitignore"
3. Select the command to create an empty `.gitignore` file
4. Close the file to automatically populate it with project-specific entries

### Method 2: Context Menu
1. Right-click on a folder in the Explorer
2. Select "Create .gitignore"
3. Close the file to automatically populate it

### How It Works
1. The extension creates an empty `.gitignore` file
2. When you close the file, it automatically scans your workspace for project indicators
3. Based on detected project types, it populates the `.gitignore` with appropriate entries
4. Shows a notification indicating which project types were detected

## Example Output

For a Node.js project with TypeScript, the extension will generate:

```gitignore
# General
.DS_Store
Thumbs.db
*.log
*.bak
*.swp
*.tmp

# IDE and Editor files
.vscode/
.idea/
*.sublime-*

# Node.js
node_modules/
npm-debug.log*
yarn-debug.log*
.npm
.eslintcache
.env
.env.local
dist/
build/
coverage/
```

## Requirements

- Visual Studio Code 1.100.0 or higher

## Extension Settings

This extension contributes the following settings:

* Currently no configurable settings (coming in future versions)

## Known Issues

- None currently reported

## Release Notes

### 0.0.1

Initial release with support for 20+ programming languages and frameworks.

---

## Contributing

Found a bug or want to request a new feature? Please create an issue in the repository.

**Enjoy automatic .gitignore generation!**

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow.

## Requirements

If you have any requirements or dependencies, add a section describing those and how to install and configure them.

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `myExtension.enable`: Enable/disable this extension.
* `myExtension.thing`: Set to `blah` to do something.

## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release of ...

### 1.0.1

Fixed issue #.

### 1.1.0

Added features X, Y, and Z.

---

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
* Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
* Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
