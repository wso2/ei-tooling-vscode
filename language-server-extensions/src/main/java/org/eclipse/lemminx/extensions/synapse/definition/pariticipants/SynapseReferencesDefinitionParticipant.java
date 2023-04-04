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

package org.eclipse.lemminx.extensions.synapse.definition.pariticipants;

import org.eclipse.lemminx.extensions.references.XMLReferencesPlugin;
import org.eclipse.lemminx.extensions.references.search.SearchEngine;
import org.eclipse.lemminx.extensions.references.search.SearchQuery;
import org.eclipse.lemminx.extensions.references.search.SearchQueryFactory;
import org.eclipse.lemminx.extensions.synapse.definition.SynapseXMLDefinitionManager;
import org.eclipse.lemminx.commons.BadLocationException;
import org.eclipse.lemminx.dom.DOMDocument;
import org.eclipse.lemminx.dom.DOMNode;
import org.eclipse.lemminx.extensions.synapse.definition.SynapseXMLDefinitionPlugin;
import org.eclipse.lemminx.services.extensions.AbstractDefinitionParticipant;
import org.eclipse.lemminx.services.extensions.IDefinitionParticipant;
import org.eclipse.lemminx.services.extensions.IDefinitionRequest;
import org.eclipse.lemminx.utils.XMLPositionUtility;
import org.eclipse.lsp4j.Location;
import org.eclipse.lsp4j.LocationLink;
import org.eclipse.lsp4j.Position;
import org.eclipse.lsp4j.Range;
import org.eclipse.lsp4j.jsonrpc.CancelChecker;

import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Extension to support XML goto definition based on pre-defined reference key set in Synapse XML.
 */
public class SynapseReferencesDefinitionParticipant extends AbstractDefinitionParticipant {

    private static final Logger LOGGER = Logger.getLogger(SynapseReferencesDefinitionParticipant.class.getName());

    private final SynapseXMLDefinitionPlugin plugin;

    public SynapseReferencesDefinitionParticipant(SynapseXMLDefinitionPlugin plugin) {

        this.plugin = plugin;
    }

    //    @Override
//    public void findDefinition(DOMDocument document, Position position, List<Location> locations) {
//
//        try {
//            int offset = document.offsetAt(position);
//            DOMNode node = document.findNodeAt(offset);
//
//            if (node != null) {
//                SynapseXMLDefinitionManager.getInstance().collect(node, n -> {
//                    DOMDocument doc = n.getOwnerDocument();
//                    Range range = XMLPositionUtility.createRange(n.getStart(), n.getEnd(), doc);
//                    locations.add(new Location(doc.getDocumentURI(), range));
//                });
//            }
//        } catch (BadLocationException e) {
//            LOGGER.log(Level.SEVERE, "Attempt to access non-existing position " + position + " in document " + document,
//                       e);
//        }
//    }

    @Override
    protected boolean match(DOMDocument document) {
        return true;
    }

    @Override
    protected void doFindDefinition(IDefinitionRequest request, List<LocationLink> locations,
                                    CancelChecker cancelChecker) {
        // Create the from query for the node which needs to perform the search.
        SearchQuery query = SearchQueryFactory.createFromQuery(request.getNode(), request.getOffset(),
                plugin.getReferencesSettings());
        if (query == null) {
            // The query cannot be created because:
            // - the node is neither a text nor an attribute
            // - it doesn't exists some expressions for the DOM document of the node.
            // - there are none expressions which matches the node.
            return;
        }
        query.setMatchNode(true);
        query.setSearchInIncludedFiles(true);

        SearchEngine.getInstance().search(query,
                (fromSearchNode, toSearchNode, expression) -> {
                    LocationLink location = XMLPositionUtility.createLocationLink(
                            XMLPositionUtility.createRange(fromSearchNode),
                            toSearchNode);
                    locations.add(location);
                }, cancelChecker);
    }
}
