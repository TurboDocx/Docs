const yaml = require('js-yaml');
const fs = require('fs');

// Helper function to extract parameters from a given path object
function extractParameters(pathObj) {
  const parameters = {};

  if (pathObj.parameters) {
    pathObj.parameters.forEach(param => {
      if (param.in === 'query') {
        if (!parameters.query) parameters.query = [];
        parameters.query.push(param.name);
      } else if (param.in === 'header') {
        if (!parameters.headers) parameters.headers = [];
        parameters.headers.push(param.name);
      }
    });
  }

  return parameters;
}

// Helper function to extract request body from a given operation object
function extractRequestBody(operationObj) {
  if (operationObj.requestBody && operationObj.requestBody.content) {
    const contentTypes = Object.keys(operationObj.requestBody.content);
    const bodies = {};

    contentTypes.forEach(type => {
      bodies[type] = operationObj.requestBody.content[type].schema;
    });

    return bodies;
  }

  return null;
}

// Main function to extract parameters and request bodies from the OpenAPI file
function extractFromOpenAPI(filepath) {
  const fileContents = fs.readFileSync(filepath, 'utf8');
  const openApiSpec = yaml.load(fileContents);

  const result = {};

  for (const [path, pathObj] of Object.entries(openApiSpec.paths)) {
    for (const [method, operationObj] of Object.entries(pathObj)) {
      const parameters = extractParameters(operationObj);
      const requestBodies = extractRequestBody(operationObj);

      result[`${method.toUpperCase()} ${path}`] = {
        parameters,
        requestBodies,
      };
    }
  }

  return result;
}

// Example usage
const openApiFilePath = 'path/to/your/openapi.yaml';
const extractedData = extractFromOpenAPI(openApiFilePath);
console.log(JSON.stringify(extractedData, null, 2));