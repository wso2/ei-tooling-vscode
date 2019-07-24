# WSO2 EI Tooling Extension for Visual Studio Code

## Description:
This VS Code extension provides support for creating and editing WSO2 EI Projects and Synapse XML documents, based on the Synapse Language Server extension written on [LSP4XML language server](https://github.com/angelozerr/lsp4xml). 

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
| WSO2EI: Create New ESB Project  | Create a new WSO2 ESB project.  | 
| WSO2EI: Create New API Artifact  | Create a new API artifact in the project.  | 
| WSO2EI: Create New Proxy Artifact | Create a new proxy artifact in the project.  | 
| WSO2EI: Create New Endpoint Artifact | Create a new endpoint artifact in the project.  | 
| WSO2EI: Create New Inbound-Endpoint Artifact | Create a new inbound-endpoint artifact in the project.  | 
| WSO2EI: Create New Local-Entry Artifact | Create a new local-entry artifact in the project.  | 
| WSO2EI: Create New Message-Store Artifact | Create a new message-store artifact in the project.  | 
| WSO2EI: Create New Message-Processor Artifact | Create a new message-processor artifact in the project.  | 
| WSO2EI: Create New Template Artifact | Create a new template artifact in the project.  | 
| WSO2EI: Create New Sequence Artifact | Create a new sequence artifact in the project.  | 
| WSO2EI: Build Project  | Create the deployable .car file from the opened Synapse project.  | 


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
