import React from 'react';
import SchemaItem from '@theme-original/SchemaItem';

// Give every body field its own linkable anchor, e.g. #body-recipients.
// ponytail: id is the field name only, so two nested fields with the same name share an anchor
// (the first one wins). Thread the parent path through if that ever matters.
export default function SchemaItemWrapper(props) {
  if (!props.name) return <SchemaItem {...props} />;
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
