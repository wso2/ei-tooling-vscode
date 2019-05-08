# synapse-vscode README file

## Description:
This VS Code extension provides support for creating and editing WSO2 EI Projects and Synapse XML documents, based on the Synapse Language Server extension written on [LSP4XML language server](https://github.com/angelozerr/lsp4xml). 

## Requirements:
- Java JDK 8 at least
- The `JAVA_HOME` environment variable must be set
- **Note:** The path should end at the parent folder that contains the `bin `folder.
    - **Example Path:** `/usr/lib/jvm/java-1.8.0` if `bin` exists at `/usr/lib/jvm/java-1.8.0/bin`
- Maven

## Quick Start:
- **Step 1.** Install the Synapse extension for Visual Studio Code.
- **Step 2.** Open or create a Synapse Project and start integration!
    - Extension is activated when you first access an xml file or via the command `Synapse: Activate Synapse Extension` through command palette


## Useful Commands:
Open the Command Palette ( [Command] + [Shift] + [P] on macOS and [Ctrl] + [Shift] + [P] on Windows/Linux) and type in one of the following commands:

| Command  | Description |
| ------------- | ------------- | 
| Synapse: Activate Synapse Extension  |  Activate Synapse Extension.| 
| Synapse: Change Language to Synapse  | Change language mode to SynapseXml. | 
| Synapse: Create Deployable Archive  | Create the deployable .car archive from the opened Synapse project.  | 
| Synapse: Create New ESB Project  | Create a new WSO2 ESB project.  | 
| Synapse: Create New API Artifact  | Create a new API artifact in the project.  | 
| Synapse: Create New Proxy Artifact | Create a new proxy artifact in the project  | 
| Synapse: Create New Endpoint Artifact | Create a new endpoint artifact in the project  | 
| Synapse: Create New Inbound-Endpoint Artifact | Create a new inbound-endpoint artifact in the project  | 
| Synapse: Create New Local-Entry Artifact | Create a new local-entry artifact in the project  | 
| Synapse: Create New Message-Store Artifact | Create a new message-store artifact in the project  | 
| Synapse: Create New Message-Processor Artifact | Create a new message-processor artifact in the project  | 
| Synapse: Create New Template Artifact | Create a new template artifact in the project  | 
| Synapse: Create New Sequence Artifact | Create a new sequence artifact in the project  | 


## Features:

#### Suggestions and Auto-Completion: 
* <kbd>CTRL</kbd> + <kbd>SPACE</kbd>

![alt text](./docs/autoCompletionSnippets.gif "Auto Completion")

#### Goto Definition 
* Jump to source: <kbd>CTRL</kbd> + <kbd>Click</kbd>    
* Open to the side with: <kbd>CTRL</kbd> + <kbd>ALT</kbd> + <kbd>Click</kbd>

![alt text](./docs/gotoDefinition.gif "Go to Definition")

#### Code Diagnostics
![alt text](./docs/diagnostic.gif "Diagnostics")

#### Hover Support
![alt text](./docs/hover1.gif "Hover")

<!-- #### Automatic Node Intentation
![indentation]()

#### Code Formatting
![formatting]() -->

#### Change Language to SynapseXml
![alt text](./docs/changeLang.gif?raw=true "Change Language to Synapse")

## License:

Synapse Visual Studio Code plugin source is available under the Apache 2.0 License.
