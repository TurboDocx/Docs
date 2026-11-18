import {createContext} from 'react';

// Inside an API page's request body (see src/theme/RequestSchema): the dotted path of the object
// being rendered, '' at the body's top level. null everywhere else (response schemas get no anchors).
export const RequestBodyScope = createContext(null);
