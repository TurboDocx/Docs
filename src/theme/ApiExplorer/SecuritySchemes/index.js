import React from 'react';

// Replaces the theme's one-line "AUTHORIZATION: HTTP" summary with the exact headers every request
// needs. The inputs Try it uses stay in the request form below (its Auth section opens by default):
// they need that form's context, so they cannot render here.
export default function SecuritySchemes() {
  return (
    <section className="api-auth" aria-labelledby="api-auth-title">
      <h3 id="api-auth-title" className="api-auth__title">
        Authentication
      </h3>
      <pre className="api-auth__headers">
        <code>
          Authorization: Bearer {'<API key>'}
          {'\n'}x-rapiddocx-org-id: {'<organization ID>'}
        </code>
      </pre>
      <p className="api-auth__hint">Enter both in Try it below to send a live request.</p>
    </section>
  );
}
