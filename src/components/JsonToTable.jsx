import React, { useState, useEffect } from 'react';
import pako from 'pako';
// import { useDoc } from '@docusaurus/theme-common/internal';
import { useAllDocsData } from '@docusaurus/plugin-content-docs/client';
import { useLocation } from '@docusaurus/router';

const JsonToTable = () => {
  const [decodedData, setDecodedData] = useState({});

  const allDocsData = useAllDocsData();
  const location = useLocation();

  // Assuming only one docs plugin instance (e.g., "default")
  const docs = allDocsData.default;
  const currentPath = location.pathname;
  const currentDoc = Object.values(docs.versions[0].docs).find(
    (doc) => doc.permalink === currentPath
  );

  const frontMatter = currentDoc?.frontMatter || {};

  console.log(frontMatter);

  useEffect(() => {
    if (frontMatter.api) {
      try {
        // Convert base64 to binary data
        const binaryString = atob(frontMatter.api);
        const binaryData = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          binaryData[i] = binaryString.charCodeAt(i);
        }

        // Decompress using pako
        const decompressed = pako.inflate(binaryData, { to: 'string' });
        let decodedJSON = JSON.parse(decompressed);

        decodedJSON.requestBodyValues = extractPropertiesAndExamples(decodedJSON);
        setDecodedData(decodedJSON);
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    }
  }, [frontMatter.api]);

  const extractPropertiesAndExamples = (json) => {
    try {
      if (!json || !json.requestBody || !json.requestBody.content) return {};

      const content = json.requestBody.content['application/json'];
      if (!content || !content.schema) return {};

      const schema = content.schema;
      let properties = {};

      // Function to extract properties
      const extract = (schema) => {
        if (schema.properties) {
          Object.assign(properties, schema.properties);
        }

        ['allOf', 'anyOf', 'oneOf'].forEach((key) => {
          if (schema[key]) {
            schema[key].forEach(subSchema => extract(subSchema));
          }
        });

        if (schema.$ref) {
          // Here you should resolve the reference. This is a placeholder logic.
          // Reference found: ${schema.$ref}. Implement reference resolution logic.
        }
      };

      extract(schema);

      // Extract examples if available
      let exampleObject = content.example || {};
      Object.keys(properties).forEach((key) => {
        if (exampleObject[key]) {
          properties[key].example = exampleObject[key];
        }
      });

      return properties;
    } catch (error) {
      console.error('Error extracting properties and examples:', error);
      return {};
    }
  };

  return (
    <div>
      <div>
        {decodedData.info && (
          <>
            <h2>{decodedData.info.title}</h2>
            <p>{decodedData.info.description}</p>
          </>
        )}
        {decodedData.parameters && decodedData.parameters.length > 0 && (
          <>
            <h3>Parameters:</h3>
            <ul>
              {decodedData.parameters.map((param) => (
                <li key={param.name}>
                  <strong>{param.name}:</strong> {param.description}
                </li>
              ))}
            </ul>
          </>
        )}
        {decodedData?.requestBodyValues && Object.keys(decodedData.requestBodyValues).length > 0 && (
          <>
            <h3>Request Body</h3>
            {Object.entries(decodedData.requestBodyValues).map(([key, value]) => (
              <div style={{ borderTop: '1px solid #eaecef', margin: '24px 0' }} aria-hidden="true" key={key}>
                <strong>{key}:</strong>
                <p>{value.description}</p>
                <br></br>
                Extra Context {JSON.stringify(value)}
              </div>
            ))}
          </>
        )}
        {decodedData.securitySchemes && Object.keys(decodedData.securitySchemes).length > 0 && (
          <>
            <h3>Security Schemes:</h3>
            <ul>
              {Object.entries(decodedData.securitySchemes).map(([key, value]) => (
                <li key={key}>
                  <strong>{key}:</strong> {value.description}
                </li>
              ))}
            </ul>
          </>
        )}
        {decodedData.postman && decodedData.postman.description && (
          <>
            <h3>Postman Configuration:</h3>
            <p>{decodedData.postman.description.content}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default JsonToTable;