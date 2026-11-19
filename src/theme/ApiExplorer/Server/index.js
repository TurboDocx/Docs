import React, {useEffect} from 'react';
import FormItem from '@theme/ApiExplorer/FormItem';
import {useTypedDispatch, useTypedSelector} from '@theme/ApiItem/hooks';
import {setServer} from '@theme-original/ApiExplorer/Server/slice';

// Try it always calls the TurboDocx API, the spec's only server (https://api.turbodocx.com).
// Show that URL read-only: no Edit/Hide toggle, server picker or server description.
export default function Server() {
  const value = useTypedSelector((state) => state.server.value);
  const options = useTypedSelector((state) => state.server.options);
  const dispatch = useTypedDispatch();
  const server = options.find((option) => option.url === value?.url) ?? options[0];

  useEffect(() => {
    if (server && server.url !== value?.url) {
      dispatch(setServer(JSON.stringify(server)));
    }
  }, [server, value, dispatch]);

  if (!server) {
    return null;
  }
  const url = server.url.replace(/\/$/, '');
  return (
    <div className="openapi-explorer__floating-btn">
      <FormItem>
        <span className="openapi-explorer__server-url" title={url}>
          {url}
        </span>
      </FormItem>
    </div>
  );
}
