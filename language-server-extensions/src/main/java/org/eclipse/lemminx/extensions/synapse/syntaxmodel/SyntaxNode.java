package org.eclipse.lemminx.extensions.synapse.syntaxmodel;

import java.util.ArrayList;
import java.util.List;

public class SyntaxNode {

    public Integer startTagOpenOffset;
    public Integer startTagOffOffset;
    public Integer endTagOpenOffset;
    public Integer endTagOffOffset;
    public int start;
    public int end;
    public String tag;
    public boolean selfClosed;
    public boolean hasTextNode;
    List<SyntaxNode> children = new ArrayList<>();
    List<SyntaxNodeAttribute> attributes = new ArrayList<>();

    SyntaxTextNode syntaxTextNode;

    public SyntaxNode(Integer startTagOpenOffset, Integer startTagOffOffset, Integer endTagOpenOffset, Integer endTagOffOffset, int start, int end, String tag, boolean selfClosed) {

        this.startTagOpenOffset = startTagOpenOffset;
        this.startTagOffOffset = startTagOffOffset;
        this.endTagOpenOffset = endTagOpenOffset;
        this.endTagOffOffset = endTagOffOffset;
        this.start = start;
        this.end = end;
        this.tag = tag;
        this.selfClosed = selfClosed;
    }

    public void addChild(SyntaxNode child) {
        this.children.add(child);
    }

    public void addAttribute(SyntaxNodeAttribute attribute) {
        this.attributes.add(attribute);
    }

    public void hasTextNode(boolean hasTextNode) {

        this.hasTextNode = hasTextNode;
    }

}
