import { test } from 'node:test';
import assert from 'node:assert';
import { validateSubmissionPayload } from './validation/submissionValidator.js';

test('validateSubmissionPayload - valid submission', async () => {
  const body = {
    name: 'John Doe',
    message: 'This is a test message',
    file: { data: 'base64data', name: 'test.pdf' },
  };
  const errors = await validateSubmissionPayload(body);
  assert.deepStrictEqual(errors, {});
});

test('validateSubmissionPayload - missing name', async () => {
  const body = {
    name: '',
    message: 'This is a test message',
    file: { data: 'base64data', name: 'test.pdf' },
  };
  const errors = await validateSubmissionPayload(body);
  assert.ok(errors.name);
});

test('validateSubmissionPayload - name too short', async () => {
  const body = {
    name: 'J',
    message: 'This is a test message',
    file: { data: 'base64data', name: 'test.pdf' },
  };
  const errors = await validateSubmissionPayload(body);
  assert.ok(errors.name);
});

test('validateSubmissionPayload - message too short', async () => {
  const body = {
    name: 'John Doe',
    message: 'Short',
    file: { data: 'base64data', name: 'test.pdf' },
  };
  const errors = await validateSubmissionPayload(body);
  assert.ok(errors.message);
});

test('validateSubmissionPayload - missing file', async () => {
  const body = {
    name: 'John Doe',
    message: 'This is a test message',
  };
  const errors = await validateSubmissionPayload(body);
  assert.ok(errors.file);
});

test('validateSubmissionPayload - invalid file name', async () => {
  const body = {
    name: 'John Doe',
    message: 'This is a test message',
    file: { data: 'base64data', name: 'test@#$.pdf' },
  };
  const errors = await validateSubmissionPayload(body);
  assert.ok(errors.file);
});
