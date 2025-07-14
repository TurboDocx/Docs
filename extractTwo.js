const fs = require('fs');
const yaml = require('js-yaml');

// Helper function to convert raw JSON body to an object
function parseRawJsonBody(body) {
  if (body && body.mode === 'raw' && body.raw) {
    try {
      return JSON.parse(body.raw);
    } catch (e) {
      // Return the raw string if it's not valid JSON
      return body.raw;
    }
  }
  return null;
}

// Helper function to extract parameters from a request object
function extractParameters(request) {
  const parameters = {
    headers: [],
    query: [],
    body: null,
    urlParams: [],
  };

  // Extract headers
  if (request.header) {
    parameters.headers = request.header.map(header => ({
      key: header.key,
      value: header.value || '',
      example: header.examples ? header.examples[0].value : '',
    }));
  }

  // Extract query parameters
  if (request.url.query) {
    parameters.query = request.url.query.map(q => ({
      key: q.key,
      value: q.value || '',
      example: q.examples ? q.examples[0].value : '',
    }));
  }

  // Extract request body
  if (request.body) {
    parameters.body = parseRawJsonBody(request.body) || request.body;
  }

  // Extract URL parameters
  const urlPattern = /\{(.*?)\}/g;
  const urlParams = request.url.raw.match(urlPattern);
  if (urlParams) {
    parameters.urlParams = urlParams.map(param => param.slice(1, -1));
  }

  return parameters;
}

// Function to extract parameters from the OpenAPI YAML file
function extractFromOpenAPIYAML(filepath) {
  const fileContents = fs.readFileSync(filepath, 'utf8');
  const openAPI = yaml.load(fileContents);

  const result = [];

  for (const [path, pathItem] of Object.entries(openAPI.paths)) {
    for (const [method, operation] of Object.entries(pathItem)) {
      const apiItem = {
        path,
        method: method.toUpperCase(),
        summary: operation.summary || '',
        parameters: {
          headers: [],
          query: [],
          body: null,
          urlParams: [],
        },
      };

      // Extract headers
      if (operation.parameters) {
        apiItem.parameters.headers = operation.parameters
          .filter(param => param.in === 'header')
          .map(param => ({
            key: param.name,
            value: param.schema ? param.schema.default : '',
            example: param.examples ? param.examples[0].value : '',
          }));
      }

      // Extract query parameters
      if (operation.parameters) {
        apiItem.parameters.query = operation.parameters
          .filter(param => param.in === 'query')
          .map(param => ({
            key: param.name,
            value: param.schema ? param.schema.default : '',
            example: param.examples ? param.examples[0].value : '',
          }));
      }

      // Extract request body
      if (operation.requestBody) {
        apiItem.parameters.body = operation.requestBody;
      }

      // Extract URL parameters
      const urlPattern = /\{(.*?)\}/g;
      const urlParams = path.match(urlPattern);
      if (urlParams) {
        apiItem.parameters.urlParams = urlParams.map(param => param.slice(1, -1));
      }

      result.push(apiItem);
    }
  }

  return result;
}

// Function to extract parameters from the Postman collection
function extractFromPostmanCollection(filepath) {
  const fileContents = fs.readFileSync(filepath, 'utf8');
  const collection = JSON.parse(fileContents);

  const result = [];

  collection.item.forEach(item => {
    if (item.request) {
      const requestName = item.name;
      const parameters = extractParameters(item.request);
      const apiItem = {
        name: requestName,
        request: {
          url: item.request.url.raw,
          method: item.request.method.toUpperCase(),
          parameters,
        },
      };
      result.push(apiItem);
    } else if (item.item) {
      item.item.forEach(nestedItem => {
        if (nestedItem.request) {
          const requestName = `${item.name} > ${nestedItem.name}`;
          const parameters = extractParameters(nestedItem.request);
          const apiItem = {
            name: requestName,
            request: {
              url: nestedItem.request.url.raw,
              method: nestedItem.request.method.toUpperCase(),
              parameters,
            },
          };
          result.push(apiItem);
        }
      });
    }
  });

  return result;
}

// Function to merge OpenAPI YAML and Postman collection data
function mergeData(openAPIData, postmanData) {
  const mergedData = [];

  for (const openAPIItem of openAPIData) {
    const matchingPostmanItem = postmanData.find(
      item =>
        item.request.url.includes(openAPIItem.path) &&
        item.request.method === openAPIItem.method
    );

    if (matchingPostmanItem) {
      const mergedItem = {
        ...openAPIItem,
        request: matchingPostmanItem.request,
      };
      mergedData.push(mergedItem);
    } else {
      mergedData.push(openAPIItem);
    }
  }

  return mergedData;
}

function removeQuotes(jsonString) {
  try {
    const firstChar = jsonString.charAt(0);
    const lastChar = jsonString.charAt(jsonString.length - 1);
  
    if (
      (firstChar === "'" && lastChar === "'") ||
      (firstChar === '"' && lastChar === '"')
    ) {
      return jsonString.slice(1, -1);
    }
    return jsonString;

  } catch(e) {
    return jsonString
  }

}

function generateMdxTemplate(item) {
    try {
        const { path, method, summary, parameters } = item;
        const { headers, query, body, urlParams } = parameters;
        let jsonBody
        let bodyContent = body?.content || {}
        if(bodyContent['*/*']) {
            let cleanExample = bodyContent['*/*']?.schema?.example || bodyContent['multipart/form-data'].schema.properties
            let json = JSON.parse(cleanExample)
            jsonBody = Buffer.from(JSON.stringify(json)).toString('base64');
        }
        if(bodyContent['multipart/form-data']) {
          
          let json = bodyContent['multipart/form-data'].schema.properties
          jsonBody = Buffer.from(JSON.stringify(json)).toString('base64');
        }
        if(bodyContent["application/json"]) {
          let json = bodyContent["application/json"].schema.properties
          jsonBody = Buffer.from(JSON.stringify(json)).toString('base64');
        }
        const metadata = {
          title: summary,
          description: `${method.toUpperCase()} ${path}`,
          api: {
            method: method.toUpperCase(),
            path: path,
          },
        };
        let encodedBodyData;
        let encodedUrlData;
        let encodedHeadersData;
        let encodedMetadata;
        // console.log("what is the body", bodyContent)
        encodedUrlData = Buffer.from(JSON.stringify(query)).toString('base64');
        
        encodedHeadersData = Buffer.from(JSON.stringify(headers)).toString('base64');
        if(jsonBody) encodedBodyData = jsonBody
       
       
      
    let template = `
  
  import ApiTabs from "@theme/ApiTabs";
  import DiscriminatorTabs from "@theme/DiscriminatorTabs";
  import MethodEndpoint from "@theme/ApiExplorer/MethodEndpoint";
  import SecuritySchemes from "@theme/ApiExplorer/SecuritySchemes";
  import MimeTabs from "@theme/MimeTabs";
  import ParamsItem from "@theme/ParamsItem";
  import ResponseSamples from "@theme/ResponseSamples";
  import SchemaItem from "@theme/SchemaItem";
  import SchemaTabs from "@theme/SchemaTabs";
  
  import JsonToTable from '@site/src/components/JsonToTable';
  import BodyTable from '@site/src/components/BodyTable';
  import QueryTable from '@site/src/components/QueryTable';
  import HeadersTable from '@site/src/components/HeadersTable';
  import DisplayJson from '@site/src/components/DisplayJson';
  import DisplayEndpoint from '@site/src/components/DisplayEndpoint';

  # ${metadata.title.replace(/[{}]/g, '')}
  
  ${item.summary}
  
  <DisplayEndpoint method="${metadata.api.method}" endpoint="${metadata.api.path}"/>
  <QueryTable title="query" data="${encodedUrlData}" />
  <HeadersTable title="headers" data="${encodedHeadersData}" />
  <BodyTable title="body" data="${encodedBodyData}" />
           
  
  
     `;
     return template

    

    } catch(e) {
      console.error("Error generating template for path:", item.summary)
        console.error(e)
    }
   
  }

  function findMatchingItem(items, metadata) {
  
    // Check if items is not an array or is empty
    if (!Array.isArray(items) || items.length === 0) {
        // console.log("is this true...")
        // console.log(typeof items)
      return null;
    }
  
    const pathRegex = new RegExp(`^${metadata.api.path.toLowerCase().replace(/\{(\w+)\}/g, '(\\w+)')}$`);
    // console.log("what is the path regex", pathRegex)
    // console.log("-dskiofghiosdhgfuodbsigj")
    for (const item of items) {
        // console.log(item)
      // Check if the item has a request and matches the metadata
      if (item?.path && metadata?.api?.path) {
        const methodMatches = item.method.toLowerCase() === metadata.api.method.toLowerCase();
        const pathMatches = item.path.toLowerCase() == metadata?.api?.path.toLowerCase()


        
  
        if (pathMatches && methodMatches) {
          return item;
        }
      }
  
      // If the current item has nested items, search recursively
      if (item.item) {
        const foundItem = findMatchingItem(item.item, metadata);
        if (foundItem) {
          return foundItem;
        }
      }
    }
  
    // Return null if no matching item is found
    return null;
  }

function generateTempates(yamlFilePath, metadata, options = {}) {
    try {
        const openAPIYAMLPath = yamlFilePath
        const postmanCollectionPath = options?.postmanCollectionPath
        const openAPIData = extractFromOpenAPIYAML(openAPIYAMLPath);
        const postmanData = []
        const mergedData = mergeData(openAPIData, postmanData)
        let foundItem = findMatchingItem(mergedData, metadata)
        // console.log("what is the metadata", metadata)

        // console.log("is there a foundItem", foundItem)
        // if(foundItem == undefined) console.log("missing match", metadata)
        let template = generateMdxTemplate(foundItem)
        return template
    } catch(e) {
        console.error(e)
    }

    // console.log(mergedData)
}


module.exports = {
    extractFromOpenAPIYAML,
    extractFromPostmanCollection,
    mergeData,
    generateTempates
};

// Example usage
// const openAPIYAMLPath = './tdocxcollection.yml';
// const postmanCollectionPath = './tdocxpostman.json';

// const openAPIData = extractFromOpenAPIYAML(openAPIYAMLPath);
// const postmanData = extractFromPostmanCollection(postmanCollectionPath);

// const mergedData = mergeData(openAPIData, postmanData);
// console.log(JSON.stringify(mergedData, null, 2));