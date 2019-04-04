package org.eclipse.lsp4xml.extensions.synapse.definition.pariticipants;

import org.eclipse.lsp4j.Location;
import org.eclipse.lsp4j.Position;
import org.eclipse.lsp4j.Range;
import org.eclipse.lsp4xml.commons.BadLocationException;
import org.eclipse.lsp4xml.dom.DOMDocument;
import org.eclipse.lsp4xml.dom.DOMNode;
import org.eclipse.lsp4xml.extensions.synapse.definition.SynapseXMLDefinitionManager;
import org.eclipse.lsp4xml.services.extensions.IDefinitionParticipant;
import org.eclipse.lsp4xml.utils.XMLPositionUtility;

import java.util.List;

public class SynapseReferencesDefinitionParticipant implements IDefinitionParticipant {
    @Override
    public void findDefinition(DOMDocument document, Position position, List<Location> locations) {

        try {
            int offset = document.offsetAt(position);
            DOMNode node = document.findNodeAt(offset);

            if (node != null) {
                SynapseXMLDefinitionManager.getInstance().collect(node, n -> {
                    DOMDocument doc = n.getOwnerDocument();
                    Range range = XMLPositionUtility.createRange(n.getStart(), n.getEnd(), doc);
                    locations.add(new Location(doc.getDocumentURI(), range));
                });
            }
        } catch (BadLocationException e) {

        }
    }
}
