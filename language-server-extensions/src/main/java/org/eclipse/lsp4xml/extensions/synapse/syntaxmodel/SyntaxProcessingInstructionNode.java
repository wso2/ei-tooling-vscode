package org.eclipse.lsp4xml.extensions.synapse.syntaxmodel;

import java.util.ArrayList;
import java.util.List;

public class SyntaxProcessingInstructionNode {

    String target;
    boolean prolog;
    boolean processingInstructions;
    int startContent;
    int endContent;
    Integer endTagOpenOffset;
    String data;
    String normalizedData;
    boolean isWhitesSpace;
    boolean closed;
    int start;
    int end;
    List<SyntaxNodeAttribute> attributes = new ArrayList<>();

    public SyntaxProcessingInstructionNode(String target, boolean prolog, boolean processingInstructions, int startContent, int endContent, Integer endTagOpenOffset, String data, String normalizedData, boolean isWhitesSpace, boolean closed, int start, int end) {

        this.target = target;
        this.prolog = prolog;
        this.processingInstructions = processingInstructions;
        this.startContent = startContent;
        this.endContent = endContent;
        this.endTagOpenOffset = endTagOpenOffset;
        this.data = data;
        this.normalizedData = normalizedData;
        this.isWhitesSpace = isWhitesSpace;
        this.closed = closed;
        this.start = start;
        this.end = end;
    }

    public void addAttribute(SyntaxNodeAttribute attribute) {
        this.attributes.add(attribute);
    }
}
