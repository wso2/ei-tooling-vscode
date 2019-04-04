package org.eclipse.lsp4xml.extensions.synapse.contentmodel.utils;

import org.eclipse.lsp4j.WorkspaceFolder;

import java.util.ArrayList;
import java.util.List;

public class SynapseWorkspace {

    private static final SynapseWorkspace INSTANCE = new SynapseWorkspace();

    private List<WorkspaceFolder> xmlWorkspaceFolders;

    private SynapseWorkspace() {
        xmlWorkspaceFolders = new ArrayList<>();
    }

    public static SynapseWorkspace getInstance() {
        return INSTANCE;
    }

    public void addWorkspaceFolder(WorkspaceFolder workspaceFolder) {
        this.xmlWorkspaceFolders.add(workspaceFolder);
    }

    public List<WorkspaceFolder> getWorkspaceFolders() {
        return this.xmlWorkspaceFolders;
    }

    public  void removeWorkspaceFolder(WorkspaceFolder workspaceFolder) {
        this.xmlWorkspaceFolders.remove(workspaceFolder);
    }
}
