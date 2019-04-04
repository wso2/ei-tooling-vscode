/**
 *  Copyright (c) 2018 Angelo ZERR.
 *  All rights reserved. This program and the accompanying materials
 *  are made available under the terms of the Eclipse Public License v2.0
 *  which accompanies this distribution, and is available at
 *  http://www.eclipse.org/legal/epl-v20.html
 *
 *  Contributors:
 *  Angelo Zerr <angelo.zerr@gmail.com> - initial API and implementation
 */
package org.eclipse.lsp4xml.extensions.synapse.xsd;

import org.eclipse.lsp4j.InitializeParams;
import org.eclipse.lsp4xml.dom.DOMDocument;
import org.eclipse.lsp4xml.extensions.contentmodel.model.ContentModelProvider;
import org.eclipse.lsp4xml.extensions.synapse.contentmodel.model.SynapseContentModelManager;
import org.eclipse.lsp4xml.extensions.synapse.xsd.contentmodel.SynapseCMXSDContentModelProvider;
import org.eclipse.lsp4xml.extensions.synapse.xsd.participants.SynapseXSDCompletionParticipant;
import org.eclipse.lsp4xml.extensions.synapse.xsd.participants.diagnostics.SynapseXSDDiagnosticsParticipant;
import org.eclipse.lsp4xml.services.extensions.ICompletionParticipant;
import org.eclipse.lsp4xml.services.extensions.IXMLExtension;
import org.eclipse.lsp4xml.services.extensions.XMLExtensionsRegistry;
import org.eclipse.lsp4xml.services.extensions.diagnostics.IDiagnosticsParticipant;
import org.eclipse.lsp4xml.services.extensions.save.ISaveContext;
import org.eclipse.lsp4xml.utils.DOMUtils;

/**
 * XSD plugin.
 */
public class SynapseXSDPlugin implements IXMLExtension {

	private final ICompletionParticipant completionParticipant;

	private final IDiagnosticsParticipant diagnosticsParticipant;

	private SynapseXSDURIResolverExtension uiResolver;

	public SynapseXSDPlugin() {
		completionParticipant = new SynapseXSDCompletionParticipant();
		diagnosticsParticipant = new SynapseXSDDiagnosticsParticipant();
	}

	@Override
	public void doSave(ISaveContext context) {
		String documentURI = context.getUri();
		DOMDocument document = context.getDocument(documentURI);
		if(DOMUtils.isXSD(document)) {
			context.collectDocumentToValidate(d -> {
				DOMDocument xml = context.getDocument(d.getDocumentURI());
				return xml.usesSchema(context.getUri());
			});
		}
	}

	@Override
	public void start(InitializeParams params, XMLExtensionsRegistry registry) {
		// Register resolver
		uiResolver = new SynapseXSDURIResolverExtension(registry.getDocumentProvider());
		registry.getResolverExtensionManager().registerResolver(uiResolver);
		// register XSD content model provider
		ContentModelProvider modelProvider = new SynapseCMXSDContentModelProvider(registry.getResolverExtensionManager());
		SynapseContentModelManager modelManager = registry.getComponent(SynapseContentModelManager.class);
		modelManager.registerModelProvider(modelProvider);
		// register completion, diagnostic particpant
		registry.registerCompletionParticipant(completionParticipant);
		registry.registerDiagnosticsParticipant(diagnosticsParticipant);
	}

	@Override
	public void stop(XMLExtensionsRegistry registry) {
		registry.getResolverExtensionManager().unregisterResolver(uiResolver);
		registry.unregisterDiagnosticsParticipant(diagnosticsParticipant);
	}
}