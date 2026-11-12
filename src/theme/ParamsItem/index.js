import React from 'react';
import ParamsItem from '@theme-original/ParamsItem';

// Give every path/query/header param its own linkable anchor, e.g. #param-query-limit.
export default function ParamsItemWrapper(props) {
  const { name, in: location } = props.param ?? {};
  if (!name) return <ParamsItem {...props} />;
  const id = `param-${location}-${name}`;
  return (
    <div id={id} className="api-param-anchor">
      <a className="api-param-anchor__link" href={`#${id}`} aria-label={`Link to ${name}`}>
        #
      </a>
      <ParamsItem {...props} />
    </div>
  );
}
