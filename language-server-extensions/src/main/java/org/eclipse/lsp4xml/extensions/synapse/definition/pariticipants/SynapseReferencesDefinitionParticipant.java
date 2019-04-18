/*
Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
*
* WSO2 Inc. licenses this file to you under the Apache License,
* Version 2.0 (the "License"); you may not use this file except
* in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied. See the License for the
* specific language governing permissions and limitations
* under the License.
*/

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

/**
 * Extension to support XML goto definition based on pre-defined reference key set
 * in Synapse XML
 */
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
