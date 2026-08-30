import { test, describe } from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";
import {
  generateSalt,
  generateHash,
  validatePassword,
  createToken,
} from "../utility/passUtility.js";
import { config } from "../config.js";

describe("passUtility", () => {
  test("generateHash/validatePassword round-trip: correct password validates true", async () => {
    const salt = await generateSalt();
    const hash = await generateHash("Sup3rSecret!", salt);
    const ok = await validatePassword("Sup3rSecret!", hash);
    assert.equal(ok, true);
  });

  test("validatePassword returns false for a wrong password", async () => {
    const salt = await generateSalt();
    const hash = await generateHash("Sup3rSecret!", salt);
    const ok = await validatePassword("WrongPassword1", hash);
    assert.equal(ok, false);
  });

  test("createToken produces a JWT verifiable with config.JWT_SECRET", async () => {
    const payload = { _id: "abc123", email: "user@example.com" };
    const token = await createToken(payload);
    assert.equal(typeof token, "string");

    const decoded = jwt.verify(token, config.JWT_SECRET);
    assert.equal(decoded._id, payload._id);
    assert.equal(decoded.email, payload.email);
  });

  test("createToken result fails verification with the wrong secret", async () => {
    const token = await createToken({ _id: "abc123" });
    assert.throws(() => jwt.verify(token, "not-the-right-secret"));
  });
});
