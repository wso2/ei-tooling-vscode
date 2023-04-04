package org.eclipse.lsp4xml.extensions.synapse.syntaxmodel;

import org.eclipse.lsp4xml.dom.DOMAttr;
import org.eclipse.lsp4xml.dom.DOMDocument;
import org.eclipse.lsp4xml.dom.DOMElement;
import org.eclipse.lsp4xml.dom.DOMNode;
import org.eclipse.lsp4xml.dom.DOMProcessingInstruction;
import org.eclipse.lsp4xml.dom.DOMText;

import java.util.List;
import java.util.Objects;

public class SyntaxTree {

    SyntaxProcessingInstructionNode syntaxProcessingInstructionNode;
    SyntaxNode node;

    public SyntaxTree(SyntaxProcessingInstructionNode syntaxProcessingInstructionNode, SyntaxNode node) {

        this.syntaxProcessingInstructionNode = syntaxProcessingInstructionNode;
        this.node = node;
    }

    public SyntaxTree getSyntaxTree(DOMDocument document) {
        DOMProcessingInstruction processingInstruction = (DOMProcessingInstruction) document.getChild(0);
        SyntaxProcessingInstructionNode processingInstructionNode = new SyntaxProcessingInstructionNode(
                processingInstruction.getTarget(), processingInstruction.isProlog(),
                processingInstruction.isProcessingInstruction(), processingInstruction.getStartContent(),
                processingInstruction.getEndContent(), processingInstruction.getEndTagStart(),
                processingInstruction.getData(), processingInstruction.getNormalizedData(),
                processingInstruction.isWhitespace(), processingInstruction.isClosed(),
                processingInstruction.getStart(), processingInstruction.getEnd());

        if (processingInstruction.hasAttributes()) {
            List<DOMAttr> attributes = processingInstruction.getAttributeNodes();
            for (DOMAttr attr : attributes) {
                processingInstructionNode.addAttribute(new SyntaxNodeAttribute(attr.getName(), attr.getValue(), attr.getOriginalValue(),
                        attr.getNodeAttrName().getStart(), attr.getNodeAttrName().getEnd(),
                        attr.getNodeAttrValue().getStart(), attr.getNodeAttrValue().getEnd(),
                        attr.hasDelimiter(), attr.isClosed()));
            }
        }
        return new SyntaxTree(processingInstructionNode, traverse((DOMElement) document.getChild(1)));
    }

    private SyntaxNode traverse(DOMElement xmlNode) {
        SyntaxNode node = new SyntaxNode(xmlNode.getStartTagOpenOffset(), xmlNode.getStartTagCloseOffset(),
                xmlNode.getEndTagOpenOffset(), xmlNode.getEndTagCloseOffset(), xmlNode.getStart(), xmlNode.getEnd(),
                xmlNode.getTagName(), xmlNode.isSelfClosed());
        List<DOMNode> children = xmlNode.getChildren();

        if (Objects.nonNull(children) && !children.isEmpty()) {
            for (DOMNode child : children) {
                if (child instanceof DOMElement) {
                    node.addChild(traverse((DOMElement) child));
                } else if (child instanceof DOMText) {
                    DOMText text = (DOMText) child;
                    node.hasTextNode(true);
                    node.syntaxTextNode = new SyntaxTextNode(text.getStart(), text.getEnd(), text.getData(),
                            text.getNormalizedData(), text.isWhitespace());
                } else if (child instanceof DOMAttr) {
                    DOMAttr attr = (DOMAttr) child;
                    node.addAttribute(new SyntaxNodeAttribute(attr.getName(), attr.getValue(), attr.getOriginalValue(),
                            attr.getNodeAttrName().getStart(), attr.getNodeAttrName().getEnd(),
                            attr.getNodeAttrValue().getStart(), attr.getNodeAttrValue().getEnd(),
                            attr.hasDelimiter(), attr.isClosed()));
                }

            }
        }

        if (xmlNode.hasAttributes()) {
            List<DOMAttr> attributes = xmlNode.getAttributeNodes();
            for (DOMAttr attr : attributes) {
                node.addAttribute(new SyntaxNodeAttribute(attr.getName(), attr.getValue(), attr.getOriginalValue(),
                        attr.getNodeAttrName().getStart(), attr.getNodeAttrName().getEnd(),
                        attr.getNodeAttrValue().getStart(), attr.getNodeAttrValue().getEnd(),
                        attr.hasDelimiter(), attr.isClosed()));
            }
        }
        return node;
    }

    public SyntaxProcessingInstructionNode getProcessingInstructionNode() {

        return syntaxProcessingInstructionNode;
    }

    public void setProcessingInstructionNode(SyntaxProcessingInstructionNode syntaxProcessingInstructionNode) {

        this.syntaxProcessingInstructionNode = syntaxProcessingInstructionNode;
    }

    public SyntaxNode getNode() {

        return node;
    }

    public void setNode(SyntaxNode node) {

        this.node = node;
    }
}
