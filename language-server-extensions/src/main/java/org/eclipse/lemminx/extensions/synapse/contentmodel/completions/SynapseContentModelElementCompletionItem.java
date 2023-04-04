package org.eclipse.lemminx.extensions.synapse.contentmodel.completions;

import org.eclipse.lemminx.extensions.contentmodel.model.CMElementDeclaration;
import org.eclipse.lemminx.extensions.contentmodel.utils.XMLGenerator;
import org.eclipse.lemminx.services.extensions.completion.AbstractElementCompletionItem;
import org.eclipse.lemminx.services.extensions.completion.ICompletionRequest;
import org.eclipse.lsp4j.MarkupContent;

/**
 * Element completion item created from a content model (schema/grammar element
 * declaration).
 *
 */
public class SynapseContentModelElementCompletionItem extends AbstractElementCompletionItem<CMElementDeclaration, XMLGenerator> {

    public SynapseContentModelElementCompletionItem(String tagName, CMElementDeclaration elementDeclaration, boolean rootElement,
                                             XMLGenerator generator, ICompletionRequest request) {
        super(tagName, elementDeclaration, generator, request);
    }

    @Override
    protected MarkupContent generateDocumentation() {
        CMElementDeclaration elementDeclaration = getSourceElement();
        ICompletionRequest request = getRequest();
        return XMLGenerator.createMarkupContent(elementDeclaration, request);
    }

    @Override
    protected String generateFullElementContent(boolean generateEndTag) {
        CMElementDeclaration elementDeclaration = getSourceElement();
        String tagName = getTagName();
        String prefix = null;
        int index = tagName.indexOf(':');
        if (index != -1) {
            prefix = tagName.substring(0, index);
        }
        XMLGenerator generator = getGenerator();

        String completionItem = SnippetProvider.getSnippets().get(tagName);
        if (completionItem == null) {
            completionItem = generator.generate(elementDeclaration, prefix, generateEndTag);
        }

        return completionItem;
    }
}
