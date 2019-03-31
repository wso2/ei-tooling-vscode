import { mavenOutputChannel } from "./mavenOutputChannel";
import { Settings } from "./Settings";
import { executeCommand } from "../utils/cpUtils";
import { ArchetypeModule } from "../archetype/ArchetypeModule";
import { Runner } from "../mavenInternals/mavenRunner";

export function getCommand(cmd: string): string {
    if (process.platform === "win32") {
        switch (currentWindowsShell()) {
            case "PowerShell":
                return `cmd /c ${cmd}`; // PowerShell
            default:
                return cmd; // others, try using common one.
        }
    } else {
        return cmd;
    }
}

export async function getCDCommand(cwd: string): Promise<string> {
    if (process.platform === "win32") {
        switch (currentWindowsShell()) {
            case "Git Bash":
                return `cd "${cwd.replace(/\\+$/, "")}"`; // Git Bash: remove trailing '\'
            case "PowerShell":
                return `cd "${cwd}"`; // PowerShell
            case "Command Prompt":
                return `cd /d "${cwd}"`; // CMD
            case "WSL Bash":
                return `cd "${await toWslPath(cwd)}"`; // WSL
            default:
                return `cd "${cwd}"`; // Unknown, try using common one.
        }
    } else {
        return `cd "${cwd}"`;
    }
}

export async function getPathCommand(path: string) {
    if (process.platform === "win32") {
        switch (currentWindowsShell()) {
            case "Git Bash":
                return `"${path.replace(/\\+$/, "")}"`; // Git Bash: remove trailing '\'
            case "PowerShell":
                return `"${path}"`; // PowerShell
            case "Command Prompt":
                return `"${path}"`; // CMD
            case "WSL Bash":
                return `"${await toWslPath(path)}"`; // WSL
            default:
                return `"${path}"`; // Unknown, try using common one.
        }
    } else {
        return `"${path}"`;
    }
}

function currentWindowsShell(): string | undefined {
    const currentWindowsShellPath: string | undefined = Settings.External.defaultWindowsShell();
    if(typeof currentWindowsShellPath !== "undefined") {
        if (currentWindowsShellPath.endsWith("cmd.exe")) {
            return "Command Prompt";
        } else if (currentWindowsShellPath.endsWith("powershell.exe")) {
            return "PowerShell";
        } else if (currentWindowsShellPath.endsWith("bash.exe") || currentWindowsShellPath.endsWith("wsl.exe")) {
            if (currentWindowsShellPath.includes("Git")) {
                return "Git Bash";
            }
            return "WSL Bash";
        } else {
            return "Others";
        }
    }
    
}

function toDefaultWslPath(p: string): string {
    const arr: string[] = p.split(":\\");
    if (arr.length === 2) {
        const drive: string = arr[0].toLowerCase();
        const dir: string = arr[1].replace(/\\/g, "/");
        return `/mnt/${drive}/${dir}`;
    } else {
        return p.replace(/\\/g, "/");
    }
}

export async function toWslPath(path: string): Promise<string> {
    try {
        return (await executeCommand("wsl", ["wslpath", "-u", `"${path.replace(/\\/g, "/")}"`])).trim();
    } catch (error) {
        mavenOutputChannel.appendLine(error, "WSL");
        return toDefaultWslPath(path);
    }
}

export async function toWinPath(path: string): Promise<string> {
    return (await executeCommand("wsl", ["wslpath", "-w", `"${path}"`])).trim();
}

export async function  executeCommandHandler(newProject: ArchetypeModule.ESBProject, cwd: string) {

    let commandRunner: Runner = new Runner();
    await getCDCommand(cwd).then((cdCommand) => {
        let cmd = cdCommand + " && " + getMavenGenerateCommand(newProject); 
        const newWorkingDir: string = generateDirectoryPath([cwd, newProject.artifactId]);
        
        commandRunner.runCommand(cmd, [], newWorkingDir, cwd);
    });
}

function getMavenGenerateCommand(newProject: ArchetypeModule.ESBProject): string {
    const mavenCommand: string = [
        "mvn",
        "archetype:generate",
        `-DarchetypeArtifactId=${newProject.archetypeArtifactId}`,
        `-DarchetypeGroupId=${newProject.archetypeGroupId}`,
        `-DgroupId=${newProject.groupId}`,
        `-DartifactId=${newProject.artifactId}`,
        `-DinteractiveMode=false`
    ].join(" ");
    return mavenCommand;
}

function generateDirectoryPath(path: string[]): string {
    let fullPath: string;
    if (process.platform === "win32") {
        fullPath = path.join("\\");
    }else {
        fullPath = path.join("/");
    }
    return fullPath;
}
