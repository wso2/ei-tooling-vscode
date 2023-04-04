package org.eclipse.lemminx.extensions.synapse.syntaxmodel;

public class SyntaxNodeAttribute {

    public String name;
    public String quotelessValue;
    public String originalValue;
    public Integer nameTagOpenOffset;
    public Integer nameTagOffOffset;
    public Integer valueTagOpenOffset;
    public Integer valueTagOffOffset;
    boolean hasDelimiter;
    boolean closed;

    public SyntaxNodeAttribute(String name, String quotelessValue, String originalValue, Integer nameTagOpenOffset,
                               Integer nameTagOffOffset, Integer valueTagOpenOffset, Integer valueTagOffOffset,
                               boolean hasDelimiter, boolean closed) {

        this.name = name;
        this.quotelessValue = quotelessValue;
        this.originalValue = originalValue;
        this.nameTagOpenOffset = nameTagOpenOffset;
        this.nameTagOffOffset = nameTagOffOffset;
        this.valueTagOpenOffset = valueTagOpenOffset;
        this.valueTagOffOffset = valueTagOffOffset;
        this.hasDelimiter = hasDelimiter;
        this.closed = closed;
    }
}
