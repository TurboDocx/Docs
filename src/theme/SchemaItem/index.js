import React, {useContext} from 'react';
import SchemaItem from '@theme-original/SchemaItem';
import {RequestBodyScope} from '@site/src/components/apiAnchorScope';

// Give every request body field its own linkable anchor, e.g. #body-recipients.
// Response schemas get none (they repeat across status tabs).
// ponytail: id is the field name only, so a nested field sharing a top-level name, or the same
// field under a second content type (multipart and JSON), reuses the anchor and the first one wins.
// Thread the parent path through if that ever matters.
export default function SchemaItemWrapper(props) {
  const inRequestBody = useContext(RequestBodyScope);
  if (!props.name || !inRequestBody) return <SchemaItem {...props} />;
  const id = `body-${props.name}`;
  return (
    <div id={id} className="api-param-anchor">
      <a className="api-param-anchor__link" href={`#${id}`} aria-label={`Link to ${props.name}`}>
        #
      </a>
      <SchemaItem {...props} />
    </div>
  );
}
