package org.eclipse.lsp4xml.extensions.synapse.definition;

import org.eclipse.lsp4j.InitializeParams;
import org.eclipse.lsp4j.WorkspaceFolder;
import org.eclipse.lsp4xml.commons.WorkspaceFolders;
import org.eclipse.lsp4xml.extensions.synapse.definition.pariticipants.SynapseReferencesDefinitionParticipant;
import org.eclipse.lsp4xml.services.extensions.IDefinitionParticipant;
import org.eclipse.lsp4xml.services.extensions.IXMLExtension;
import org.eclipse.lsp4xml.services.extensions.XMLExtensionsRegistry;
import org.eclipse.lsp4xml.services.extensions.save.ISaveContext;

import java.util.List;


public class SynapseXMLDefinitionPlugin implements IXMLExtension {

    private final IDefinitionParticipant definitionParticipant;
    private WorkspaceFolders workspaceFolders;

    public SynapseXMLDefinitionPlugin() {
        definitionParticipant = new SynapseReferencesDefinitionParticipant();
        workspaceFolders = WorkspaceFolders.getInstance();
    }

    @Override
    public void start(InitializeParams params, XMLExtensionsRegistry registry) {
        registry.registerDefinitionParticipant(definitionParticipant);

        List<WorkspaceFolder> workspaceFolderList = params.getWorkspaceFolders();
        for (int i = 0; i < workspaceFolderList.size(); i++) {
            workspaceFolders.addWorkspaceFolder(workspaceFolderList.get(i));
        }
    }

    @Override
    public void stop(XMLExtensionsRegistry registry) {
        registry.unregisterDefinitionParticipant(definitionParticipant);
    }

    @Override
    public void doSave(ISaveContext context) {

    }
}
