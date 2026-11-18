import React from 'react';
import {useDoc} from '@docusaurus/plugin-content-docs/client';

// Replaces the theme's one-line "AUTHORIZATION: HTTP" summary with the exact headers every request
// needs. The inputs Try it uses stay in the request form below (its Auth section opens by default):
// they need that form's context, so they cannot render here.
// Operations that delete, send email or re-deliver (x-hide-send-button in tdocxcollection.yml) have no
// Send button, so their hint points to the code samples instead.
export default function SecuritySchemes() {
  const {frontMatter} = useDoc();
  return (
    <section className="api-auth" aria-labelledby="api-auth-title">
      <h3 id="api-auth-title" className="api-auth__title">
        Credentials
      </h3>
      <pre className="api-auth__headers">
        <code>
          Authorization: Bearer {'<API key>'}
          {'\n'}x-rapiddocx-org-id: {'<organization ID>'}
        </code>
      </pre>
      <p className="api-auth__hint">
        {frontMatter.hide_send_button
          ? 'Try it cannot send this request, because it changes live data. Use a code sample with your own key.'
          : 'Enter both in Try it below to send a live request.'}
      </p>
    </section>
  );
}
