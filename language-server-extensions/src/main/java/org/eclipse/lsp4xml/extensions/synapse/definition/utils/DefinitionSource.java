package org.eclipse.lsp4xml.extensions.synapse.definition.utils;

public enum DefinitionSource {

    SEQUENCE("sequence", "key", "name"),

    ENDPOINT("endpoint", "key", "name");

    private String key;
    private String from;
    private String to;


    DefinitionSource(String key, String from, String to) {
        this.key = key;
        this.from = from;
        this.to = to;
    }

    public String getKey(){
        return this.key;
    }

    public String getFrom(){
        return this.from;
    }

    public String getTo(){
        return this.to;
    }
}
