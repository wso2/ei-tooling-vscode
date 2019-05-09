# WSO2 EI Tooling VSCode

WSO2 EI Tooling VSCode is an open source and lightweight Visual Studio Code extension that provides VSCode-based development environment for EI projects and artifact creation.

## Contributing

If you are planning on contributing to the development efforts of WSO2 EI Tooling VSCode, you can do that by checking out the latest development version. The master branch holds the latest unreleased source code.

## Building from the source

#### Prerequisites

* [Oracle JDK 8](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) or [OpenJDK 8](http://openjdk.java.net/install/)
* [Maven 3.5.0 or later](https://maven.apache.org/download.cgi)
* [Node (v10.15.x) + npm (v6.4.1 or later)](https://nodejs.org/en/download/)

Please follow the steps below to build WSO2 EI Tooling VSCode from source code.

1. Clone this repository using the following command:

   ```bash 
    git clone --recursive https://github.com/wso2/ei-tooling-vscode.git
   ``` 
   
   If you download the sources, you need to update the git submodules using the following command.
    
    ```bash
    cd ei-tooling-vscode
    git submodule update --init --recursive
    ```
    
2. Build project with maven using the following command:

    ```bash
    mvn clean install -Dmaven.test.skip=true
    ```
    
After a successful build, generated VSIX file can be found at `ei-tooling-vscode/vscode-plugin/wso2ei-<version>.vsix`.

If you do changes only in the `ei-tooling-vscode/vscode-plugin/` package, you can create the VSIX file by running the following command in the extension root folder (`ei-tooling-vscode/vscode-plugin/`):

  ```
  vsce-package
  ```
## License
  
WSO2 EI Tooling VSCode is licensed under [Apache license 2.0](https://github.com/wso2/ei-tooling-vscode/blob/master/LICENSE).

## Copyright

(c) 2019, [WSO2 Inc.](http://www.wso2.org) All Rights Reserved.
    
