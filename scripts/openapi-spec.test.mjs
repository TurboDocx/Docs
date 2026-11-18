// Run: node --test scripts/openapi-spec.test.mjs
// The API reference is generated from tdocxcollection.yml, so these checks keep the spec honest:
// valid structure, no copied browser leftovers, and the facts the API enforces (QA of PR #276,
// checked against the backend's validation on staging).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import yaml from 'js-yaml';

const raw = fs.readFileSync(new URL('../tdocxcollection.yml', import.meta.url), 'utf8');
const spec = yaml.load(raw);
const METHODS = ['get', 'post', 'put', 'patch', 'delete'];
const ops = Object.entries(spec.paths).flatMap(([path, item]) =>
  Object.entries(item)
    .filter(([method]) => METHODS.includes(method))
    .map(([method, op]) => ({ method, path, op })),
);
const op = (method, path) => spec.paths[path]?.[method];
const jsonSchema = (o, status) =>
  o.responses?.[status]?.content?.['application/json']?.schema ?? {};
const bodySchema = (o, type = 'application/json') => o.requestBody?.content?.[type]?.schema ?? {};

test('request bodies hold only OpenAPI request body keys', () => {
  for (const { method, path, op: o } of ops) {
    if (!o.requestBody) continue;
    const extra = Object.keys(o.requestBody).filter((k) => !['content', 'description', 'required'].includes(k));
    assert.deepEqual(extra, [], `${method.toUpperCase()} ${path} requestBody has ${extra.join(', ')}`);
  }
});

test('no copied browser headers or Postman placeholders are left', () => {
  assert.doesNotMatch(raw, /sec-fetch-|sec-ch-ua|^\s*- name: referer/m);
  assert.doesNotMatch(raw, /\{\{[A-Za-z ]+\}\}/);
});

test('the multipart TurboSign sends have a cURL sample with the file, recipients and fields', () => {
  for (const path of ['/turbosign/single/prepare-for-review', '/turbosign/single/prepare-for-signing']) {
    const curl = (op('post', path)['x-codeSamples'] ?? []).find((s) => s.lang === 'cURL');
    assert.ok(curl, `${path} has no cURL sample`);
    for (const part of ['-F "file=@', '-F \'recipients=', '-F \'fields=']) {
      assert.ok(curl.source.includes(part), `${path} cURL sample lacks ${part}`);
    }
  }
});

test('Try it cannot send destructive or billable requests', () => {
  const risky = [
    ['delete', '/Variable/bulk/action'],
    ['delete', '/Tag/bulk/action'],
    ['delete', '/template/{TemplateId}'],
    ['delete', '/api/webhooks/signature'],
    ['delete', '/v1/deliverable/{id}'],
    ['post', '/api/webhooks/signature/regenerate'],
    ['post', '/api/webhooks/signature/notify'],
    ['post', '/api/webhooks/signature/replay'],
    ['post', '/turbosign/single/prepare-for-signing'],
    ['post', '/turbosign/documents/{documentId}/void'],
    ['post', '/turbosign/documents/{documentId}/resend-email'],
    ['post', '/turbosign/documents/{documentId}/send-reminder'],
  ];
  for (const [method, path] of risky) {
    assert.equal(op(method, path)?.['x-hide-send-button'], true, `${method.toUpperCase()} ${path} can be sent from Try it`);
  }
});

test('Update Variable requires id, mimeType and text, and has no stray properties', () => {
  const schema = bodySchema(op('put', '/Variable/{VariableId}'));
  assert.deepEqual([...(schema.required ?? [])].sort(), ['id', 'mimeType', 'text']);
  assert.ok(schema.properties.id, 'id is not documented');
  assert.equal(schema.properties.items, undefined, 'a stray "items" property renders as a body field');
});

test('recipient colors are hex, as the API validates them', () => {
  assert.doesNotMatch(raw, /hsl\(/);
});

test('Edit Template Metadata takes tags as {id} objects and answers 200 with text', () => {
  const o = op('patch', '/template/{TemplateId}');
  const props = bodySchema(o).properties;
  assert.equal(props.tag, undefined, 'the API reads "tags", not "tag"');
  assert.ok(props.tags?.items?.properties?.id, 'tags must be objects with an id');
  assert.ok(props.description && props.templateFolderId, 'description and templateFolderId are accepted');
  assert.deepEqual(Object.keys(o.responses['200'].content ?? {}), ['text/plain']);
});

test('Test and Notify Webhook have optional eventType and payload', () => {
  for (const path of ['/api/webhooks/signature/test', '/api/webhooks/signature/notify']) {
    assert.deepEqual(bodySchema(op('post', path)).required ?? [], [], `${path} marks optional fields required`);
  }
});

test('webhook responses are wrapped in data, as the API sends them', () => {
  for (const path of ['/api/webhooks/signature', '/api/webhooks/signature/deliveries', '/api/webhooks/signature/stats']) {
    assert.ok(jsonSchema(op('get', path), '200').properties?.data, `GET ${path} 200 schema has no data wrapper`);
  }
});

test('every JSON response example only uses keys its schema documents', () => {
  const misses = [];
  for (const { method, path, op: o } of ops) {
    for (const [status, response] of Object.entries(o.responses ?? {})) {
      const content = response.content?.['application/json'];
      const props = content?.schema?.properties;
      if (!props) continue;
      const examples = [
        ...(content.example && typeof content.example === 'object' ? [['example', content.example]] : []),
        ...Object.entries(content.examples ?? {}).map(([name, e]) => [name, e.value]),
      ];
      for (const [name, value] of examples) {
        if (!value || typeof value !== 'object' || Array.isArray(value)) continue;
        const extra = Object.keys(value).filter((k) => !(k in props));
        if (extra.length) misses.push(`${method.toUpperCase()} ${path} ${status} [${name}]: ${extra.join(', ')}`);
      }
    }
  }
  assert.deepEqual(misses, []);
});
