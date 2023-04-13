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

package org.eclipse.lemminx.extensions.synapse.contentmodel.participants.diagnostics;

import org.apache.xerces.impl.XMLEntityManager;
import org.apache.xerces.parsers.SAXParser;
import org.apache.xerces.util.URI;
import org.apache.xerces.xni.parser.XMLEntityResolver;
import org.eclipse.lemminx.dom.DOMAttr;
import org.eclipse.lemminx.dom.DOMDocument;
import org.eclipse.lemminx.dom.DOMDocumentType;
import org.eclipse.lemminx.dom.DOMElement;
import org.eclipse.lemminx.dom.NoNamespaceSchemaLocation;
import org.eclipse.lemminx.dom.SchemaLocationHint;
import org.eclipse.lemminx.dom.XMLModel;
import org.eclipse.lemminx.extensions.contentmodel.model.ContentModelManager;
import org.eclipse.lemminx.extensions.contentmodel.participants.XMLSyntaxErrorCode;
import org.eclipse.lemminx.extensions.contentmodel.participants.diagnostics.LSPSAXParser;
import org.eclipse.lemminx.extensions.contentmodel.participants.diagnostics.LSPXMLGrammarPool;
import org.eclipse.lemminx.extensions.contentmodel.participants.diagnostics.LSPXMLGrammarPoolWrapper;
import org.eclipse.lemminx.extensions.contentmodel.participants.diagnostics.LSPXMLParserConfiguration;
import org.eclipse.lemminx.extensions.contentmodel.participants.diagnostics.XMLValidator;
import org.eclipse.lemminx.extensions.contentmodel.settings.NamespacesEnabled;
import org.eclipse.lemminx.extensions.contentmodel.settings.SchemaEnabled;
import org.eclipse.lemminx.extensions.contentmodel.settings.XMLNamespacesSettings;
import org.eclipse.lemminx.extensions.contentmodel.settings.XMLSchemaSettings;
import org.eclipse.lemminx.extensions.synapse.contentmodel.model.SynapseContentModelManager;
import org.eclipse.lemminx.extensions.synapse.contentmodel.utils.SynapseDiagnosticException;
import org.eclipse.lemminx.extensions.synapse.utils.Constants;
import org.eclipse.lemminx.extensions.contentmodel.participants.diagnostics.LSPErrorReporterForXML;
import org.eclipse.lemminx.extensions.contentmodel.settings.ContentModelSettings;
import org.eclipse.lemminx.extensions.contentmodel.settings.XMLValidationSettings;
import org.eclipse.lemminx.extensions.xerces.LSPXMLEntityManager;
import org.eclipse.lemminx.extensions.xerces.ReferencedGrammarDiagnosticsInfo;
import org.eclipse.lemminx.services.extensions.diagnostics.LSPContentHandler;
import org.eclipse.lemminx.uriresolver.CacheResourceException;
import org.eclipse.lemminx.uriresolver.IExternalGrammarLocationProvider;
import org.eclipse.lemminx.utils.DOMUtils;
import org.eclipse.lemminx.utils.StringUtils;
import org.eclipse.lemminx.utils.XMLPositionUtility;
import org.eclipse.lsp4j.Diagnostic;
import org.eclipse.lsp4j.DiagnosticSeverity;
import org.eclipse.lsp4j.Position;
import org.eclipse.lsp4j.Range;
import org.eclipse.lsp4j.jsonrpc.CancelChecker;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;
import org.xml.sax.SAXNotRecognizedException;
import org.xml.sax.SAXNotSupportedException;
import org.xml.sax.XMLReader;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CancellationException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.parsers.SAXParserFactory;

/**
 * XML validator utilities class.
 */
class SynapseXMLValidator {

    private static final Logger LOGGER = Logger.getLogger(SynapseXMLValidator.class.getName());

    private SynapseXMLValidator() {
    }

//    static void validate(DOMDocument document, XMLEntityResolver entityResolver, List<Diagnostic> diagnostics,
//                         ContentModelSettings contentModelSettings, CancelChecker monitor)
//            throws SynapseDiagnosticException {
//
//        SAXParserFactory factory = SAXParserFactory.newInstance();
//        factory.setNamespaceAware(true);
//        factory.setValidating(true);
//        javax.xml.parsers.SAXParser parser;
//
//        try {
//            parser = factory.newSAXParser();
//
//            parser.setProperty("http://java.sun.com/xml/jaxp/properties/schemaLanguage",
//                               "http://www.w3.org/2001/XMLSchema");
//            parser.setProperty("http://java.sun.com/xml/jaxp/properties/schemaSource",
//                               Constants.SCHEMA_LOCATION);
//
//            parser.setProperty("http://apache.org/xml/properties/internal/error-reporter",
//                               new LSPErrorReporterForXML(document, diagnostics));
//
//            XMLReader reader = parser.getXMLReader();
//
//            reader.setFeature("http://apache.org/xml/features/continue-after-fatal-error", false); //$NON-NLS-1$
//            reader.setFeature("http://xml.org/sax/features/namespace-prefixes",
//                              true /* document.hasNamespaces() */); //$NON-NLS-1$
//            reader.setFeature("http://xml.org/sax/features/namespaces",
//                              true /* document.hasNamespaces() */); //$NON-NLS-1$
//            reader.setFeature("http://apache.org/xml/features/validate-annotations", true);
//
//            reader.setContentHandler(new LSPContentHandler(monitor));
//
//            if (entityResolver != null) {
//                reader.setProperty("http://apache.org/xml/properties/internal/entity-resolver",
//                                   entityResolver); //$NON-NLS-1$
//            }
//
//            // If diagnostics for Schema preference is enabled
//            XMLValidationSettings validationSettings = contentModelSettings != null
//                    ? contentModelSettings.getValidation() : null;
//            if ((validationSettings == null) || validationSettings.isSchema()) {
//                checkExternalSchema(document.getExternalSchemaLocation(), (SAXParser) reader);
//            }
//
//            String content = document.getText();
//            String uri = document.getDocumentURI();
//            InputSource inputSource = new InputSource();
//            inputSource.setByteStream(new ByteArrayInputStream(content.getBytes(StandardCharsets.UTF_8)));
//            inputSource.setSystemId(uri);
//
//            reader.parse(inputSource);
//
//            List<Diagnostic> newDiagnostic = new ArrayList<>();
//            int initialNoOfDiagnostics = diagnostics.size();
//            for (int i = 0; i < initialNoOfDiagnostics; i++) {
//                Diagnostic diagnostic = diagnostics.get(i);
//                String errorCode = diagnostic.getCode();
//                if (errorCode.equals("sch-props-correct.2") || errorCode.equals("cos-all-limited.1.2") ||
//                        errorCode.equals("src-resolve") || errorCode.equals("src-resolve.4.2")) {
//                    newDiagnostic.add(diagnostic);
//                }
//            }
//            diagnostics.removeAll(newDiagnostic);
//        } catch (IOException e) {
//            throw new SynapseDiagnosticException("Synapse Schema validation failed", e);
//        } catch (ParserConfigurationException | SAXException e) {
//            // ..
//        }
//    }
//
//    private static void checkExternalSchema(Map<String, String> result, SAXParser reader)
//            throws SAXNotRecognizedException, SAXNotSupportedException {
//        if (result == null) {
//            return;
//        }
//        String noNamespaceSchemaLocation = result.get(IExternalSchemaLocationProvider.NO_NAMESPACE_SCHEMA_LOCATION);
//        if (noNamespaceSchemaLocation != null) {
//            reader.setProperty(IExternalSchemaLocationProvider.NO_NAMESPACE_SCHEMA_LOCATION,
//                               noNamespaceSchemaLocation);
//        }
//    }


    public static void doDiagnostics(DOMDocument document, XMLEntityResolver entityResolver,
                                     List<Diagnostic> diagnostics, XMLValidationSettings validationSettings,
                                     SynapseContentModelManager contentModelManager, CancelChecker monitor)
            throws SynapseDiagnosticException {

        LSPXMLGrammarPool pool = contentModelManager.getGrammarPool();
        LSPXMLGrammarPoolWrapper grammarPool = pool != null ? new LSPXMLGrammarPoolWrapper(pool) : null;
        Map<String, ReferencedGrammarDiagnosticsInfo> referencedGrammarDiagnosticsInfoCache = new HashMap<>();
        final LSPErrorReporterForXML reporterForXML = new LSPErrorReporterForXML(document, diagnostics,
                contentModelManager, validationSettings != null ? validationSettings.isRelatedInformation() : false,
                referencedGrammarDiagnosticsInfoCache);
        // When referenced grammar (XSD, DTD) have an error (ex : syntax error), the
        // error must be reported.
        // We create a reporter for grammar since Xerces reporter stores the XMLLocator
        // for XML and Grammar.
        final LSPErrorReporterForXML reporterForGrammar = new LSPErrorReporterForXML(document, diagnostics,
                contentModelManager, validationSettings != null ? validationSettings.isRelatedInformation() : false,
                referencedGrammarDiagnosticsInfoCache);
        LSPXMLEntityManager entityManager = new LSPXMLEntityManager(reporterForXML, grammarPool);
        try {

            LSPXMLParserConfiguration configuration = new LSPXMLParserConfiguration(grammarPool,
                    isDisableOnlyDTDValidation(document), reporterForXML, reporterForGrammar, entityManager,
                    validationSettings);

            if (entityResolver != null) {
                configuration.setProperty("http://apache.org/xml/properties/internal/entity-resolver", entityResolver); //$NON-NLS-1$
            }

            SAXParser parser = new LSPSAXParser(reporterForXML, configuration, grammarPool, document);

            parser.setProperty("http://java.sun.com/xml/jaxp/properties/schemaSource",
                    Constants.SCHEMA_LOCATION);

            // Add LSP content handler to stop XML parsing if monitor is canceled.
            parser.setContentHandler(new LSPContentHandler(monitor));

            // warn if XML document is not bound to a grammar according the settings
            warnNoGrammar(document, diagnostics, validationSettings);
            // Update external grammar location (file association)
            updateExternalGrammarLocation(document, parser);

            boolean hasSchemaLocation = document.hasSchemaLocation();
            boolean hasNoNamespaceSchemaLocation = document.hasNoNamespaceSchemaLocation();
            boolean hasSchemaGrammar = hasSchemaLocation || hasNoNamespaceSchemaLocation
                    || hasExternalSchemaGrammar(document);
            boolean schemaValidationEnabled = (hasSchemaGrammar
                    && isSchemaValidationEnabled(document, validationSettings)
                    || (hasNoNamespaceSchemaLocation
                    && isNoNamespaceSchemaValidationEnabled(document, validationSettings)));
            parser.setFeature("http://apache.org/xml/features/validation/schema", schemaValidationEnabled); //$NON-NLS-1$

            boolean hasRelaxNG = hasRelaxNGReference(document, parser);
            boolean hasGrammar = document.hasDTD() || hasSchemaGrammar
                    || (!hasRelaxNG && document.hasExternalGrammar());
            if (hasSchemaGrammar && !schemaValidationEnabled) {
                hasGrammar = false;
            }
            parser.setFeature("http://xml.org/sax/features/validation", hasGrammar); //$NON-NLS-1$

            boolean namespacesValidationEnabled = isNamespacesValidationEnabled(document, validationSettings,
                    hasRelaxNG);
            parser.setFeature("http://xml.org/sax/features/namespace-prefixes", false); //$NON-NLS-1$
            parser.setFeature("http://xml.org/sax/features/namespaces", namespacesValidationEnabled); //$NON-NLS-1$

            // Parse XML
            InputSource input = DOMUtils.createInputSource(document);
            parser.parse(input);

            List<Diagnostic> newDiagnostic = new ArrayList<>();
            int initialNoOfDiagnostics = diagnostics.size();
            for (int i = 0; i < initialNoOfDiagnostics; i++) {
                Diagnostic diagnostic = diagnostics.get(i);
                String errorCode = diagnostic.getCode().getLeft();
                if (errorCode.equals("sch-props-correct.2") || errorCode.equals("cos-all-limited.1.2") ||
                        errorCode.equals("src-resolve") || errorCode.equals("src-resolve.4.2")) {
                    newDiagnostic.add(diagnostic);
                }
            }
            diagnostics.removeAll(newDiagnostic);
        } catch (IOException | SAXException | CancellationException exception) {
            // ignore error
        } catch (CacheResourceException e) {
            throw new SynapseDiagnosticException("Synapse Schema validation failed", e);
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Unexpected XMLValidator error", e);
        } finally {
            reporterForXML.endReport();
            reporterForGrammar.endReport();
            // remove DTD grammars cache which are not completely loaded (because of some
            // downloading of included DTD which is not finished)
            entityManager.dispose();
        }
    }

    private static boolean isNamespacesValidationEnabled(DOMDocument document,
                                                         XMLValidationSettings validationSettings, boolean hasRelaxNG) {
        if (hasRelaxNG) {
            return true;
        }
        if (validationSettings == null) {
            return true;
        }
        NamespacesEnabled enabled = NamespacesEnabled.always;
        XMLNamespacesSettings namespacesSettings = validationSettings.getNamespaces();
        if (namespacesSettings != null && namespacesSettings.getEnabled() != null) {
            enabled = namespacesSettings.getEnabled();
        }
        switch (enabled) {
            case always:
                return true;
            case never:
                return false;
            case onNamespaceEncountered:
                return document.hasNamespaces();
            default:
                return true;
        }
    }

    private static boolean hasRelaxNGReference(DOMDocument document, SAXParser parser) {
        try {
            if (parser.getProperty(IExternalGrammarLocationProvider.RELAXNG) != null) {
                return true;
            }
        } catch (Exception e) {
            // Do nothing
        }
        List<XMLModel> models = document.getXMLModels();
        for (XMLModel xmlModel : models) {
            if (DOMUtils.isRelaxNGUri(xmlModel.getHref())) {
                return true;
            }
        }
        return false;
    }

    private static boolean isSchemaValidationEnabled(DOMDocument document, XMLValidationSettings validationSettings) {
        if (validationSettings == null) {
            return true;
        }
        SchemaEnabled enabled = SchemaEnabled.always;
        XMLSchemaSettings schemaSettings = validationSettings.getSchema();
        if (schemaSettings != null && schemaSettings.getEnabled() != null) {
            enabled = schemaSettings.getEnabled();
        }
        switch (enabled) {
            case always:
                return true;
            case never:
                return false;
            case onValidSchema:
                return isValidSchemaLocation(document);
            default:
                return true;
        }
    }

    /**
     * Returns true if the given DOM document declares a xsi:schemaLocation hint for
     * the document root element is valid and false otherwise.
     *
     * The xsi:schemaLocation is valid if:
     *
     * <ul>
     * <li>xsi:schemaLocation defines an URI for the namespace of the document
     * element.</li>
     * <li>the URI can be opened</li>
     * </ul>
     *
     * @param document the DOM document.
     * @return true if the given DOM document declares a xsi:schemaLocation hint for
     *         the document root element is valid and false otherwise.
     */
    private static boolean isValidSchemaLocation(DOMDocument document) {
        if (!document.hasSchemaLocation()) {
            return false;
        }
        String namespaceURI = document.getNamespaceURI();
        SchemaLocationHint hint = document.getSchemaLocation().getLocationHint(namespaceURI);
        if (hint == null) {
            return false;
        }
        String location = hint.getHint();
        return isValidLocation(document.getDocumentURI(), location);
    }

    private static boolean isNoNamespaceSchemaValidationEnabled(DOMDocument document,
                                                                XMLValidationSettings validationSettings) {
        if (validationSettings == null) {
            return true;
        }
        SchemaEnabled enabled = SchemaEnabled.always;
        XMLSchemaSettings schemaSettings = validationSettings.getSchema();
        if (schemaSettings != null && schemaSettings.getEnabled() != null) {
            enabled = schemaSettings.getEnabled();
        }
        switch (enabled) {
            case always:
                return true;
            case never:
                return false;
            case onValidSchema:
                return isValidNoNamespaceSchemaLocation(document);
            default:
                return true;
        }
    }

    /**
     * Returns true if the given DOM document declares a
     * xsi:noNamespaceSchemaLocation which is valid and false otherwise.
     *
     * The xsi:noNamespaceSchemaLocation is valid if:
     *
     * <ul>
     * <li>xsi:noNamespaceSchemaLocation defines an URI.</li>
     * <li>the URI can be opened</li>
     * </ul>
     *
     * @param document the DOM document.
     * @return true if the given DOM document declares a xsi:schemaLocation hint for
     *         the document root element is valid and false otherwise.
     */
    private static boolean isValidNoNamespaceSchemaLocation(DOMDocument document) {
        NoNamespaceSchemaLocation noNamespaceSchemaLocation = document.getNoNamespaceSchemaLocation();
        if (noNamespaceSchemaLocation == null) {
            return false;
        }
        String location = noNamespaceSchemaLocation.getLocation();
        return isValidLocation(document.getDocumentURI(), location);
    }

    private static boolean isValidLocation(String documentURI, String location) {
        String resolvedLocation = getResolvedLocation(documentURI, location);
        if (resolvedLocation == null) {
            return false;
        }
        try (InputStream is = new URL(resolvedLocation).openStream()) {
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private static String getResolvedLocation(String documentURI, String location) {
        if (StringUtils.isBlank(location)) {
            return null;
        }
        try {
            return XMLEntityManager.expandSystemId(location, documentURI, false);
        } catch (URI.MalformedURIException e) {
            return location;
        }
    }

    private static boolean hasExternalSchemaGrammar(DOMDocument document) {
        if (DOMUtils.isXSD(document.getExternalGrammarFromNamespaceURI())) {
            return true;
        }
        Map<String, String> externalGrammarLocation = document.getExternalGrammarLocation();
        if (externalGrammarLocation == null) {
            return false;
        }
        return externalGrammarLocation.containsKey(IExternalGrammarLocationProvider.NO_NAMESPACE_SCHEMA_LOCATION)
                || externalGrammarLocation.containsKey(IExternalGrammarLocationProvider.SCHEMA_LOCATION);
    }

    /**
     * Returns true is DTD validation must be disabled and false otherwise.
     *
     * @param document the DOM document
     * @return true is DTD validation must be disabled and false otherwise.
     */
    private static boolean isDisableOnlyDTDValidation(DOMDocument document) {
        Map<String, String> externalGrammarLocation = document.getExternalGrammarLocation();
        if (externalGrammarLocation != null
                && externalGrammarLocation.containsKey(IExternalGrammarLocationProvider.DOCTYPE)) {
            return true;
        }

        // When XML declares a DOCTYPE only to define entities like
        // <!DOCTYPE root [
        // <!ENTITY foo "Bar">
        // ]>
        // Xerces try to validate the XML and report an error on each XML elements
        // because they are not declared in the DOCTYPE.
        // In this case, DTD validation must be disabled.
        if (!document.hasDTD()) {
            return true;
        }
        DOMDocumentType docType = document.getDoctype();
        if (docType.getKindNode() != null) {
            return false;
        }
        // Disable the DTD validation only if there are not <!ELEMENT or an <!ATTRLIST
        return !docType.getChildren().stream().anyMatch(node -> node.isDTDElementDecl() || node.isDTDAttListDecl());
    }

    /**
     * Warn if XML document is not bound to a grammar according the settings
     *
     * @param document           the XML document
     * @param diagnostics        the diagnostics list to populate
     * @param validationSettings the settings to use to know the severity of warn.
     */
    private static void warnNoGrammar(DOMDocument document, List<Diagnostic> diagnostics,
                                      XMLValidationSettings validationSettings) {
        boolean hasGrammar = document.hasGrammar();
        if (hasGrammar) {
            return;
        }
        if (DOMUtils.isRelaxNG(document)) {
            return;
        }
        // By default "hint" settings.
        DiagnosticSeverity severity = XMLValidationSettings.getNoGrammarSeverity(validationSettings);
        if (severity == null) {
            // "ignore" settings
            return;
        }
        if (!hasGrammar) {
            // No grammar, add a warn diagnostic with the severity coming from the settings.
            Range range = null;
            DOMElement documentElement = document.getDocumentElement();
            if (documentElement != null) {
                range = XMLPositionUtility.selectStartTagName(documentElement);
            }
            if (range == null) {
                range = new Range(new Position(0, 0), new Position(0, 0));
            }
            diagnostics.add(new Diagnostic(range, "No grammar constraints (DTD or XML Schema).", severity, "xml",
                    XMLSyntaxErrorCode.NoGrammarConstraints.name()));
        }
    }

    private static void updateExternalGrammarLocation(DOMDocument document, SAXParser reader)
            throws SAXNotRecognizedException, SAXNotSupportedException {
        String relaxng = null;
        Map<String, String> externalGrammarLocation = document.getExternalGrammarLocation();
        if (externalGrammarLocation != null) {
            String xsd = externalGrammarLocation.get(IExternalGrammarLocationProvider.NO_NAMESPACE_SCHEMA_LOCATION);
            if (xsd != null) {
                // Try to get the xmlns attribute (default namespace) value from the DOM
                // document
                String defaultNamespace = null;
                DOMElement documentElement = document.getDocumentElement();
                if (documentElement != null) {
                    defaultNamespace = documentElement.getAttribute(DOMAttr.XMLNS_ATTR);
                }
                if (StringUtils.isEmpty(defaultNamespace)) {
                    // The DOM document has no namespace, we consider that it's the same thing than
                    // xsi:noNamespaceSchemaLocation
                    String noNamespaceSchemaLocation = xsd;
                    reader.setProperty(IExternalGrammarLocationProvider.NO_NAMESPACE_SCHEMA_LOCATION,
                            noNamespaceSchemaLocation);
                } else {
                    // The DOM document has namespace, we consider that it's the same thing than
                    // xsi:schemaLocation
                    String schemaLocation = defaultNamespace + " " + xsd;
                    reader.setProperty(IExternalGrammarLocationProvider.SCHEMA_LOCATION, schemaLocation);
                }
            } else {
                String doctype = externalGrammarLocation.get(IExternalGrammarLocationProvider.DOCTYPE);
                if (doctype != null) {
                    reader.setProperty(IExternalGrammarLocationProvider.DOCTYPE, doctype);
                } else {
                    relaxng = externalGrammarLocation.get(IExternalGrammarLocationProvider.RELAXNG);
                }
            }
        }
        if (relaxng == null) {
            relaxng = DOMUtils.isRelaxNGUri(document.getExternalGrammarFromNamespaceURI())
                    ? document.getExternalGrammarFromNamespaceURI()
                    : null;
        }
        if (relaxng != null) {
            reader.setProperty(IExternalGrammarLocationProvider.RELAXNG, relaxng);
        }
    }
}
