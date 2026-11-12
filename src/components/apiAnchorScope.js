import {createContext} from 'react';

// True inside an API page's request body (see src/theme/RequestSchema).
export const RequestBodyScope = createContext(false);
