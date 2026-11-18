import React, {useContext} from 'react';
import SchemaItem from '@theme-original/SchemaItem';
import {RequestBodyScope} from '@site/src/components/apiAnchorScope';

// Give every request body field its own linkable anchor, named by its path so nested fields never
// share one: #body-recipients, #body-recipients.email, #body-fields.template.anchor.
// Response schemas get none (they repeat across status tabs).

function Anchored({id, label, children}) {
  return (
    <div id={id} className="api-param-anchor">
      <a className="api-param-anchor__link" href={`#${id}`} aria-label={`Link to ${label}`}>
        #
      </a>
      {children}
    </div>
  );
}

// A nested object or array is a collapsible SchemaItem with no name prop; its name is on the
// Details summary the theme passes as its child (docusaurus-theme-openapi-docs 5.2.0 Schema).
const nestedName = (props) => props.children?.props?.summary?.props?.name;

// Field names are identifiers already; a free-form map key renders as "property name*", so keep ids URL-safe.
const slug = (name) => String(name).replace(/[^A-Za-z0-9_.-]+/g, '-').replace(/^-+|-+$/g, '');

export default function SchemaItemWrapper(props) {
  const prefix = useContext(RequestBodyScope);
  if (prefix === null) return <SchemaItem {...props} />;

  if (props.collapsible) {
    const name = nestedName(props);
    if (!name) return <SchemaItem {...props} />;
    const path = `${prefix}${slug(name)}`;
    return (
      <Anchored id={`body-${path}`} label={path}>
        <RequestBodyScope.Provider value={`${path}.`}>
          <SchemaItem {...props} />
        </RequestBodyScope.Provider>
      </Anchored>
    );
  }

  if (!props.name) return <SchemaItem {...props} />;
  const path = `${prefix}${slug(props.name)}`;
  return (
    <Anchored id={`body-${path}`} label={path}>
      <SchemaItem {...props} />
    </Anchored>
  );
}
