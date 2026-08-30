import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { sanitizeRequest } from "../middlewares/sanitize.js";

const runMiddleware = (req) => {
  return new Promise((resolve) => {
    sanitizeRequest(req, {}, () => resolve());
  });
};

describe("sanitizeRequest", () => {
  test("strips top-level $-prefixed keys from req.body", async () => {
    const req = { body: { $where: "1==1", name: "Alice" }, params: {}, query: {} };
    await runMiddleware(req);
    assert.equal(req.body.$where, undefined);
    assert.equal(req.body.name, "Alice");
  });

  test("strips keys containing a dot", async () => {
    const req = { body: { "a.b": "nope", safe: "yes" }, params: {}, query: {} };
    await runMiddleware(req);
    assert.equal(req.body["a.b"], undefined);
    assert.equal(req.body.safe, "yes");
  });

  test("strips recursively in nested objects", async () => {
    const req = {
      body: { user: { $gt: "", name: "Bob", nested: { "$ne": null, ok: true } } },
      params: {},
      query: {},
    };
    await runMiddleware(req);
    assert.equal(req.body.user.$gt, undefined);
    assert.equal(req.body.user.name, "Bob");
    assert.equal(req.body.user.nested.$ne, undefined);
    assert.equal(req.body.user.nested.ok, true);
  });

  test("sanitizes req.params and req.query too", async () => {
    const req = { body: {}, params: { "$id": "x", id: "123" }, query: { "$or": "x", search: "term" } };
    await runMiddleware(req);
    assert.equal(req.params.$id, undefined);
    assert.equal(req.params.id, "123");
    assert.equal(req.query.$or, undefined);
    assert.equal(req.query.search, "term");
  });

  test("does not touch normal keys or values", async () => {
    const req = { body: { email: "a@b.com", age: 30, tags: ["a", "b"] }, params: {}, query: {} };
    await runMiddleware(req);
    assert.deepEqual(req.body, { email: "a@b.com", age: 30, tags: ["a", "b"] });
  });

  test("calls next() and tolerates missing body/params/query", async () => {
    const req = {};
    let called = false;
    await new Promise((resolve) => {
      sanitizeRequest(req, {}, () => {
        called = true;
        resolve();
      });
    });
    assert.equal(called, true);
  });
});
