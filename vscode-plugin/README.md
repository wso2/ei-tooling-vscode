# synapse-vscode README file

## Description:
This VS Code extension provides support for creating and editing Synapse XML documents, based on the [LSP4XML language server](https://github.com/angelozerr/lsp4xml) running with Java.

## Requirements:
- Java JDK 8 or more recent
- The `JAVA_HOME` environment variable must be set

## Features:

#### Suggestions and Auto-Completion: 
* <kbd>CTRL</kbd> + <kbd>SPACE</kbd>

![auto Completion](https://raw.githubusercontent.com/sajinieKavindya/vscode-synapse/master/vscode-plugin/docs/autocompletion.gif)

#### Goto Definition 
* Jump to source: <kbd>CTRL</kbd> + <kbd>Click</kbd>    
* Open to the side with <kbd>CTRL</kbd> + <kbd>ALT</kbd> + <kbd>Click</kbd>

![goto def](https://raw.githubusercontent.com/sajinieKavindya/vscode-synapse/master/vscode-plugin/docs/gotodef.gif)

#### Code Diagnostics
![goto def](https://raw.githubusercontent.com/sajinieKavindya/vscode-synapse/master/vscode-plugin/docs/gotodef.gif)

#### Hover Support
![goto def](https://raw.githubusercontent.com/sajinieKavindya/vscode-synapse/master/vscode-plugin/docs/hover.gif)

## Quick Start:
- Download the latest development VSIX achive [from here]()
- Install VS Code plugin
    - Go to Install from VSIX... command in the Extensions View command drop-down, or the Extensions: Install from VSIX... command in the Command Palette, and select the .vsix file to install. [More info](https://code.visualstudio.com/docs/editor/extension-gallery#_install-from-a-vsix)
- Open a Synapse project
    - Note: The workspace root folder should be the **_default_** folder
    - Example Path: `/WSO2/EnterpriseIntegrator/6.4.0/repository/deployment/server/synapse-configs/default`
