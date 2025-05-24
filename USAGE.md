# GitIgnore Generator Extension - Usage Instructions

## Quick Start

1. **Install the Extension**: This extension is now ready to use in VS Code
2. **Create .gitignore**: Use one of these methods:
   - Command Palette: `Ctrl+Shift+P` → "Create .gitignore"
   - Right-click in Explorer → "Create .gitignore"
3. **Auto-Populate**: Close the empty .gitignore file and it will automatically populate based on your project type

## Test the Extension

### Method 1: Command Palette
1. Open the `demo-workspace` folder in VS Code
2. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
3. Type "Create .gitignore" and select the command
4. Close the empty .gitignore file
5. The file should auto-populate with React and Python entries

### Method 2: Context Menu
1. Right-click on the `demo-workspace` folder in Explorer
2. Select "Create .gitignore"
3. Close the empty file
4. Watch it auto-populate!

## Expected Output

For the demo workspace (which has both React and Python), you should see:

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

# React
node_modules/
build/
.env*
npm-debug.log*
yarn-debug.log*
yarn-error.log*
coverage/
.eslintcache

# Python
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
dmypy.json
```

## Development

To package and install:
```bash
pnpm install
pnpm run compile
# Package with vsce (if available)
```

The extension detects 20+ project types automatically!
