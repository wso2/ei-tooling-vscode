package org.eclipse.lsp4xml.extensions.synapse.contentmodel.completions;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

public class SnippetProvider {

    public static final Map<String, String> snippets;

    static {
        snippets = new HashMap<>();

//        for(Snippet snippet: Snippet.values()) {
//            snippets.put(snippet.getTagName(), snippet.get().getString(true));
//        }

        Properties prop = new Properties();
        InputStream input = null;
        try {
            SnippetProvider snip = new SnippetProvider();

            input = snip.getClass().getClassLoader().getResourceAsStream("configuration.properties");
            if (input != null) {
                prop.load(input);

                for (Enumeration<?> e = prop.propertyNames(); e.hasMoreElements(); ) {
                    String name = (String)e.nextElement();
                    String value = prop.getProperty(name);
                    snippets.put(name, value);
                }
            } else {
                throw new FileNotFoundException("property file not found in the classpath");
            }

        } catch (Exception ex) {
            ex.printStackTrace();
        } finally {
            if (input != null) {
                try {
                    input.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    private SnippetProvider(){}
}
