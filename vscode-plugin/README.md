# WSO2 EI Tooling Extension for Visual Studio Code

## Description:
This VS Code extension provides support for creating and editing WSO2 EI Projects and Synapse XML documents, based on the Synapse Language Server extension written on [LSP4XML language server](https://github.com/angelozerr/lsp4xml). 

#### Currently supporting project types:
* Composite Exporter
* ESB Configs
* Registry Resources
* Connector Exporter
* Data Service Project
* Mediator Project

#### Composite Exporter
* pom.xml file will be updated in Composite Exporter when new artifact is added to the workspace.
* When deleting an artifact, related information will be deleted from Composite Exporter.

#### ESB Configs
* ESB artifact can be added to the ESB Configs through command palette commands or by right clicking the relevant artifact folder.

#### Registry Resources
* Command pallet command can be used to add new registry resources into Registry Resources project by using available templates.

#### Connector Exporter
* Command palette command can be used to add a new connector to the Connector Exporter. User can enter a keyword for a particular connector and extension will give a list of suggested connectors. User can select one of the suggested connectors and it will be added to the Connector Exporter.

#### Data Service Project
* By right clicking the dataservice sub-folder within a Data Service project, a new data service can be added.

#### Mediator Project
* By using the command palette command, new Mediator Project can be added to the workspace.
 
This extension also can be used to generate an Integration Project from capp(.car) file.

## Requirements:
- Java JDK 8 at least
- The `JAVA_HOME` environment variable must be set
- **Note:** The path should end at the parent folder that contains the `bin `folder.
    - **Example Path:** `/usr/lib/jvm/java-1.8.0` if `bin` exists at `/usr/lib/jvm/java-1.8.0/bin`
- [Maven 3.5.0 or later](https://maven.apache.org/download.cgi)

## Quick Start:
- **Step 1.** Install the Synapse extension for Visual Studio Code.
- **Step 2.** Open or create a Synapse Project and start integration!
    - Extension is activated when you first access an xml file or via the command `WSO2EI: Activate WSO2 EI Tooling` through command palette


## Useful Commands:
Open the Command Palette ( [Command] + [Shift] + [P] on macOS and [Ctrl] + [Shift] + [P] on Windows/Linux) and type in one of the following commands:

| Command  | Description |
| ------------- | ------------- | 
| WSO2EI: Activate WSO2 EI Tooling  |  Activate WSO2 EI Tooling.| 
| WSO2EI: Change Language to SynapseXml  | Change language mode to SynapseXml. |
| WSO2EI: Create New Integration Project | Create new integration project which consists ESB Configs, Composite Exporter, Registry Resources, and Connector Exporter. | 
| WSO2EI: Create New ESB Project  | Create a new WSO2 ESB project.  |
| WSO2EI: Create New Composite Exporter Project | Create a new WSO2 ESB Composite Exporter project. |
| WSO2EI: Create New Registry Resources Project | Create a new WSO2 Registry Resources project. |
| WSO2EI: Create New Connector Exporter Project | Create a new WSO2 Connector Exporter project. |
| WSO2EI: Create New Data Service Project | Create a new WSO2 Data Service  project. |
| WSO2EI: Create New Mediator Project | Create a new WSO2 Mediator project. | 
| WSO2EI: Create New API Artifact  | Create a new API artifact in the project.  | 
| WSO2EI: Create New Proxy Artifact | Create a new proxy artifact in the project.  | 
| WSO2EI: Create New Endpoint Artifact | Create a new endpoint artifact in the project.  | 
| WSO2EI: Create New Inbound-Endpoint Artifact | Create a new inbound-endpoint artifact in the project.  | 
| WSO2EI: Create New Local-Entry Artifact | Create a new local-entry artifact in the project.  | 
| WSO2EI: Create New Message-Store Artifact | Create a new message-store artifact in the project.  | 
| WSO2EI: Create New Message-Processor Artifact | Create a new message-processor artifact in the project.  | 
| WSO2EI: Create New Template Artifact | Create a new template artifact in the project.  | 
| WSO2EI: Create New Sequence Artifact | Create a new sequence artifact in the project.  |
| WSO2EI: Create New Task | Create a new scheduled task artifact in the ESB project. |
| WSO2EI: Create New Registry Resource | Create a registry resource artifact in the Registry Resources project. |
| WSO2EI: Add New Connector | Download and add a new connector to the Connector Exporter Project. |
| WSO2EI: Import Connector From File System | Import a new connector from the file system. | 
| WSO2EI: Build Integration Project  | Create the deployable .car file from the opened Integration project. |
| WSO2EI: Build Integration Project from CApp | Build a WSO2 integration project from a .car archive. |
| WSO2EI: Import Integration Project | Import WSO2 integration project into VS Code workspace. |
| WSO2EI: Create Zip Archive | Create ZIP archive from WSO2 integration project. |
| WSO2EI: Import Zip Archive | Extract WSO2 integration project from ZIP archive. |

## Features:

#### Suggestions and Auto-Completion: 
* <kbd>CTRL</kbd> + <kbd>SPACE</kbd>

![alt text](https://raw.githubusercontent.com/wso2/ei-tooling-vscode/master/vscode-plugin/docs/AutoCompletion.gif "Auto Completion")

#### Goto Definition 
* Jump to source: <kbd>CTRL</kbd> + <kbd>Click</kbd>    
* Open to the side with: <kbd>CTRL</kbd> + <kbd>ALT</kbd> + <kbd>Click</kbd>

![alt text](https://raw.githubusercontent.com/wso2/ei-tooling-vscode/master/vscode-plugin/docs/GotoDef.gif "Go to Definition")

#### Code Diagnostics
![alt text](https://raw.githubusercontent.com/wso2/ei-tooling-vscode/master/vscode-plugin/docs/Diagnostics.gif "Diagnostics")

#### Hover Support
![alt text](https://raw.githubusercontent.com/wso2/ei-tooling-vscode/master/vscode-plugin/docs/HoverGif.gif "Hover")

#### Change Language to SynapseXml
![alt text](https://raw.githubusercontent.com/wso2/ei-tooling-vscode/master/vscode-plugin/docs/ChangeLangtoSynapse.gif "Change Language to Synapse")

## License:

WSO2 EI Tooling VSCode is licensed under [Apache license 2.0](https://github.com/wso2/ei-tooling-vscode/blob/master/LICENSE).
