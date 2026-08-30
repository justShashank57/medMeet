import { test, describe, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { requireAdminKey } from "../middlewares/requireAdminKey.js";
import { config } from "../config.js";

const makeRes = () => {
  const res = {};
  res.statusCode = null;
  res.body = null;
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (payload) => {
    res.body = payload;
    return res;
  };
  return res;
};

describe("requireAdminKey", () => {
  let originalKey;

  beforeEach(() => {
    originalKey = config.ADMIN_API_KEY;
  });

  afterEach(() => {
    config.ADMIN_API_KEY = originalKey;
  });

  test("returns 503 when ADMIN_API_KEY is not configured", () => {
    config.ADMIN_API_KEY = undefined;
    const req = { headers: {} };
    const res = makeRes();
    let nextCalled = false;
    requireAdminKey(req, res, () => (nextCalled = true));

    assert.equal(res.statusCode, 503);
    assert.equal(nextCalled, false);
  });

  test("returns 401 when the provided key is wrong", () => {
    config.ADMIN_API_KEY = "correct-key";
    const req = { headers: { "x-admin-key": "wrong-key" } };
    const res = makeRes();
    let nextCalled = false;
    requireAdminKey(req, res, () => (nextCalled = true));

    assert.equal(res.statusCode, 401);
    assert.equal(nextCalled, false);
  });

  test("returns 401 when no key header is provided at all", () => {
    config.ADMIN_API_KEY = "correct-key";
    const req = { headers: {} };
    const res = makeRes();
    let nextCalled = false;
    requireAdminKey(req, res, () => (nextCalled = true));

    assert.equal(res.statusCode, 401);
    assert.equal(nextCalled, false);
  });

  test("calls next() when the provided key matches", () => {
    config.ADMIN_API_KEY = "correct-key";
    const req = { headers: { "x-admin-key": "correct-key" } };
    const res = makeRes();
    let nextCalled = false;
    requireAdminKey(req, res, () => (nextCalled = true));

    assert.equal(nextCalled, true);
    assert.equal(res.statusCode, null);
  });
});
