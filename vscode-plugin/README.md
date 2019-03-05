# synapse-vscode README file

## Description:
This VS Code extension provides support for creating and editing Synapse XML documents, based on the [LSP4XML language server](https://github.com/angelozerr/lsp4xml) running with Java.

## Requirements:
- Java JDK 8 or more recent
- The `JAVA_HOME` environment variable must be set
- **Note:** The path should end at the parent folder that contains the `bin `folder.
    - **Example Path:** `/usr/lib/jvm/java-1.8.0` if `bin` exists at `/usr/lib/jvm/java-1.8.0/bin`

## Features:

#### Suggestions and Auto-Completion: 
* <kbd>CTRL</kbd> + <kbd>SPACE</kbd>

![auto Completion](https://raw.githubusercontent.com/sajinieKavindya/vscode-synapse/master/vscode-plugin/docs/autoCompletionSnippets.gif)

#### Goto Definition 
* Jump to source: <kbd>CTRL</kbd> + <kbd>Click</kbd>    
* Open to the side with: <kbd>CTRL</kbd> + <kbd>ALT</kbd> + <kbd>Click</kbd>

![goto def](https://raw.githubusercontent.com/sajinieKavindya/vscode-synapse/master/vscode-plugin/docs/gotoDefinition.gif)

#### Code Diagnostics
![goto def](https://raw.githubusercontent.com/sajinieKavindya/vscode-synapse/master/vscode-plugin/docs/diagnostic.gif)

#### Hover Support
![goto def](https://raw.githubusercontent.com/sajinieKavindya/vscode-synapse/master/vscode-plugin/docs/hover1.gif)

## Quick Start:
- Download the latest development VSIX archive [from here](https://github.com/sajinieKavindya/vscode-synapse/blob/master/vscode-plugin/synapse-vscode-0.0.1.vsix)`(vscode-xml-XXX.vsix)`
    - After any changes, re-build the project and get the latest VSIX from `vscode-synapse/vscode-plugin/synapse-vscode-0.0.1.vsix`
- Install VS Code plugin
    - Go to Install from VSIX... command in the Extensions View command drop-down, or the Extensions: Install from VSIX... command in the Command Palette, and select the .vsix file to install. [More info](https://code.visualstudio.com/docs/editor/extension-gallery#_install-from-a-vsix)
- Open a **Synapse** project
    - **Note:** The workspace root folder should be the **_default_** folder
    - **Example Path:** `/WSO2/EnterpriseIntegrator/6.4.0/repository/deployment/server/synapse-configs/default`
    - **Note:** The Language Mode should be changed as **_SynpaseXml_** at the bottom of the editor. To forcefully change the language mode, go to `Change Language to Synapse` command in the Command Palette

#### Change Language to SynapseXml

![change Language to Synapse](https://raw.githubusercontent.com/sajinieKavindya/vscode-synapse/master/vscode-plugin/docs/changeLang.gif)

## License:

Ballerina Visual Studio Code plugin source is available under the [Eclipse Public License 1.0](https://github.com/redhat-developer/vscode-xml/blob/master/LICENSE)