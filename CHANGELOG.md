# Change Log

All notable changes to the "gitignore-gen" extension will be documented in this file.

## [0.0.1] - 2025-05-25

### Added
- Initial release of GitIgnore Generator extension
- Automatic project type detection for 20+ programming languages and frameworks
- Support for Node.js, TypeScript, React, Next.js, Svelte projects
- Support for Python projects with various package managers
- Support for Java (Maven and Gradle), C#/.NET, C++, PHP, Laravel projects  
- Support for Ruby, Go, Rust, Swift, Dart/Flutter, Kotlin projects
- Support for Elixir, Haskell, R, Terraform, Docker projects
- Command palette integration: "Create .gitignore"
- Context menu integration in Explorer
- Auto-population workflow: create empty .gitignore → close file → auto-populate
- Comprehensive .gitignore templates with IDE, build artifacts, and environment files
- Multi-project type detection (e.g., full-stack Node.js + Python projects)
- Extensive test suite covering project detection and content generation

### Features
- **Smart Detection**: Scans workspace for project indicators (package.json, requirements.txt, etc.)
- **Auto-Population**: Creates empty .gitignore file, auto-populates when closed
- **Multi-Framework**: Supports combinations of technologies in the same project
- **Comprehensive Templates**: Includes entries for dependencies, build outputs, IDE files, logs
- **User-Friendly**: Simple workflow - create, close, done!

### Supported Project Types
- JavaScript/TypeScript (Node.js, React, Next.js, Svelte)
- Python (pip, conda, poetry)
- Java (Maven, Gradle)
- C#/.NET (Core, Framework)
- C++ (CMake, Makefile)
- PHP (Standard, Laravel)
- Ruby (Gems)
- Go (Modules)
- Rust (Cargo)
- Swift (Package Manager)
- Dart/Flutter
- Kotlin
- Elixir (Mix)
- Haskell (Stack, Cabal)
- R
- Terraform
- Docker