import React from 'react';
import ParamsItem from '@theme-original/ParamsItem';

// Give every path/query/header param an id, e.g. #param-query-limit, so links can point at it.
// No visible "#" link: the anchor is for linking from other pages, not part of the row.
export default function ParamsItemWrapper(props) {
  const { name, in: location } = props.param ?? {};
  if (!name) return <ParamsItem {...props} />;
  return (
    <div id={`param-${location}-${name}`} className="api-param-anchor">
      <ParamsItem {...props} />
    </div>
  );
}
