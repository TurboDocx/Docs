import React from 'react';
import RequestSchema from '@theme-original/RequestSchema';
import {RequestBodyScope} from '@site/src/components/apiAnchorScope';

// Mark the request body subtree so SchemaItem only adds #body-<field> anchors to request fields,
// never to response schemas (which would duplicate ids across status tabs).
export default function RequestSchemaWrapper(props) {
  return (
    <RequestBodyScope.Provider value={true}>
      <RequestSchema {...props} />
    </RequestBodyScope.Provider>
  );
}
