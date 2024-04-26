var Converter = require("openapi-to-postmanv2");
const fs = require("fs");
function parseOpenApiInfo(openapiData) {
   const operation = openapiData.api;
   const headers = {};
   const body = {};
   const query = {};
 
   // Parse security schemes
   if (operation.securitySchemes) {
     for (const [schemeName, schemeData] of Object.entries(operation.securitySchemes)) {
       switch (schemeData.type) {
         case "apiKey":
           if (schemeData.in === "header") {
             headers[schemeData.name] = "[API Key]"; // Placeholder for actual key
           }
           break;
         case "oauth2":
           // Handle OAuth2 details based on flow type
           break;
         default:
           // Handle other security scheme types
           break;
       }
     }
   }
 
   // Parse request body schema
   if (operation.requestBody) {
     const content = operation.requestBody.content["application/json"];
     if (content && content.schema) {
       const schema = content.schema;
       parseSchema(schema, "", body);
     }
   }
 
   // Parse path parameters (simulated as query for simplicity)
   const pathParams = operation.path.match(/\{[^}]+\}/g);
   if (pathParams) {
     for (const param of pathParams) {
       const paramName = param.slice(1, -1);
       query[paramName] = "[Path Parameter: " + paramName + "]"; // Placeholder
     }
   }
 
   // Parse query parameters (if any)
   // TODO: Implement logic to parse actual query parameters from request
 
   return { headers, body, query };
 }
 
 function parseSchema(schema, parentPath, targetObj) {
   if (schema.type === "object") {
     for (const [key, value] of Object.entries(schema.properties)) {
       const fullPath = parentPath ? `${parentPath}.${key}` : key;
       parseSchema(value, fullPath, targetObj);
     }
   } else if (schema.type === "array") {
     // Handle arrays (simple example, can be expanded)
     targetObj[parentPath] = "[Array]";
   } else {
     // Handle basic types (string, number, etc.)
     targetObj[parentPath] = "[Placeholder]";
   }
 }

 function flattenJson(obj, parentKey = '', result = {}) {
  
  try {
    if(typeof obj === 'string') obj = JSON.parse(obj)
  } catch (error) {
    // console.log("this is the error", error)
    return {}
  }
  // console.log("this is the object", obj)
  for (const [key, value] of Object.entries(obj)) {
      const newKey = parentKey ? `${parentKey}.${key}` : key;

      if (value && typeof value === 'object' && !Array.isArray(value)) {
          // Recursively flatten for nested objects
          flattenJson(value, newKey, result);
      } else {
          // Set the key in our result object to the value's type or placeholder
          if(newKey.includes(".")) {
            let splitKey = newKey.split(".")[0].trim()
            result[splitKey] = typeof value === 'string' ? value : typeof value;
          }
           else { result[newKey] = typeof value === 'string' ? value : typeof value}
      }
  }
  return result;
}




function findMatchingItem(items, metadata) {
    // Check if items is not an array or is empty
    if (!Array.isArray(items) || items.length === 0) {
        return null;
    }

    for (const item of items) {
        // Check if the item has a request and matches the metadata
        if (item?.request?.url?.path && metadata?.api?.path) {
            const pathMatches = `/${item.request.url.path.join("/")}` === metadata.api.path.replace(/{(\w+)}/g, ":$1");
            const methodMatches = item.request.method.toLowerCase() === metadata.api.method.toLowerCase();

            if (pathMatches && methodMatches) {
                return item;
            }
        }

        // If the current item has nested items, search recursively
        if (item.item) {
            // console.log("item.item", item.item)
            const foundItem = findMatchingItem(item.item, metadata);
            if (foundItem) {
                return foundItem;
            }
        }
    }

    let justUrls = items.map(item => {
      if(item?.request?.url?.path) {
          return `/${item.request.url.path.join("/")}`
      } else {
          return null
      }
   })

  //  console.log("this is justUrls", justUrls)
  //  console.log("this is metadata",  metadata.api.path)   

    // Return null if no matching item is found
    return null;
}

function generatePostmanItem(item, metadata) {
   try {
      const yamlData = fs.readFileSync(`examples/${item}.yaml`, "utf8");

      let conversionResult;
      let errorOccurred = false;

      Converter.convert(
        { type: "string", data: yamlData },
        {},
        (err, result) => {
          if (err) {
            console.error(err);
            errorOccurred = true;
          } else {
            conversionResult = result;
          }
        }
      );

      if (errorOccurred || !conversionResult) {
        return ""; // Return an empty string in case of error
      }
      let apiItems = conversionResult.output[0].data.item
      let flatItems = []
      for(let apiItem of apiItems) {
        flatItems = [...flatItems, ...apiItem.item]
      }

        let finalItem = findMatchingItem(flatItems, metadata);
        // console.log("finalItem", finalItem != undefined)
        // console.log("finalItem", finalItem)
        metadata.postmanItem = finalItem
        const template = generateTemplate(metadata.postmanItem, metadata);
        // console.log("this is the metadata", metadata)
        return template
     //  if(metadata.postmanItem) fs.writeFileSync("output.json", JSON.stringify(metadata, null, 2))
     //  return JSON.stringify(metadata, null, 2);
    } catch (err) {
      console.error(err);
      return ""; // Return an empty string in case of error
    }
}

function handleQuery(url) {
  // console.log("this is the url query", url)
  if(!url.query) return {}
  let queryJson = {}
  for (let queryItem of url?.query) {
    queryJson[queryItem.key] = queryItem
  }
  // console.log("this is the", queryJson)
  return queryJson
}

function handleHeaders(headers) {
  if(!headers) return {}
  let headerJson = {}
  for (let header of headers) {
    headerJson[header.key] = header
  }
  // console.log("this is the", headerJson )
  return headerJson 
}

function handleMetadataBody(bodyJson, decodedJSON) {
  console.log("this is the decodedJSON", decodedJSON)

  try {
    if(!decodedJSON) return bodyJson
    if (!decodedJSON["application/json"]?.schema) return bodyJson
    let schema = decodedJSON["application/json"].schema;
    let propertiesSchemaKeys = Object.keys(schema);
  console.log(schema)
    let propertiesItem;
    if(schema.properties) {
      propertiesItem = schema
    } else if(schema.items) {
      propertiesItem = schema.items
    } else {
      for (let i = 0; i < propertiesSchemaKeys.length; i++) {
        let key = propertiesSchemaKeys[i];
        let value = schema[key].find(
          (item) => item.properties != undefined
        );
        if (value) propertiesItem = value;
      }
    }
  
  
    let { properties } = propertiesItem;
    // let descriptions = [];
    for (let [key, value] of Object.entries(properties)) {
      console.log("this is the bodyJson", bodyJson[key])
      bodyJson[key] = {...value, type: bodyJson[key] }
    }
    return bodyJson

  } catch(e) {
    console.log(e)
    return bodyJson
  }


}

function generateTemplate(data, metadata) {
try {
  // console.log("this is the data", data)
  if(!data) return ""
  // console.log(data)
  let bodyJsonPlacehoder;
  if(data?.request?.body?.raw) {
    bodyJsonPlacehoder = flattenJson(data?.request?.body?.raw)
  } else {
    bodyJsonPlacehoder = {}
  }
  let bodyJson = bodyJsonPlacehoder  || {}
  if(Object.keys(bodyJson).length > 0) bodyJson = handleMetadataBody(bodyJson, metadata?.api?.requestBody?.content)

  var bodyData = JSON.stringify(bodyJson);
  let query = handleQuery(data?.request?.url)
  let headersData = handleHeaders(data?.request?.header)
  let url = JSON.stringify(query|| {})
  let headers = JSON.stringify(headersData|| {})
  let fullMetadataBody = JSON.stringify(metadata?.api?.requestBody || {})

  var encodedBodyData = Buffer.from(bodyData).toString('base64');
  
  var encodedUrlData = Buffer.from(url).toString('base64');
  console.log("what is the encoded string query", encodedUrlData)
  var encodedHeadersData = Buffer.from(headers).toString('base64');
  var encodedMetadata = Buffer.from(fullMetadataBody).toString('base64')

   return `

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

# ${metadata.title}

${metadata.description}

<DisplayEndpoint method="${metadata.api.method}" endpoint="${metadata.api.path}"/>
<QueryTable title="query" data="${encodedUrlData}" />
<HeadersTable title="headers" data="${encodedHeadersData}" />
<BodyTable title="body" data="${encodedBodyData}" />
<DisplayJson title="Whole Request" data="${encodedMetadata}" />             


   `;

} catch(e) {
  console.log(e)
}

   
}


const apiConfig = {
  petstore: {
    // the <id> referenced when running CLI commands
    specPath: "examples/pestore.yaml", // path to OpenAPI spec, URLs supported
    outputDir: "docs/api/petstore", // output directory for generated files
    sidebarOptions: {
      // optional, instructs plugin to generate sidebar.js
      groupPathsBy: "tag", // group sidebar items by operation "tag"
    },
    markdownGenerators: {
      createApiPageMD: (metadata) => {
         return generatePostmanItem("pestore", metadata)
         // console.log("metadata", metadata);
         
      },
    },
  },
};

module.exports = {
  config: apiConfig,
};
