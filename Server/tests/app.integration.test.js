import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import buildApp from "../services/expressApp.js";
import { config } from "../config.js";

let mongod;
let app;

const pad = (n) => String(n).padStart(2, "0");

// Builds {date, time} strings (local time, matching how the controller
// reconstructs `${date}T${time}:00`) for a Date some ms in the future/past.
const dateTimeFromNow = (offsetMs) => {
  const d = new Date(Date.now() + offsetMs);
  const date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const time = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  return { date, time };
};

before(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
  app = express();
  await buildApp(app);
});

after(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

describe("Patient signup", () => {
  const email = "patient.signup@example.com";

  test("rejects a weak password with 400", async () => {
    const res = await request(app).post("/patient/signup").send({
      name: "Alice Patient",
      email,
      password: "weak",
      phone: "9876543210",
    });
    assert.equal(res.status, 400);
  });

  test("valid signup succeeds with 201 and a token", async () => {
    const res = await request(app).post("/patient/signup").send({
      name: "Alice Patient",
      email,
      password: "GoodPass1",
      phone: "9876543210",
    });
    assert.equal(res.status, 201);
    assert.equal(typeof res.body.token, "string");
    assert.equal(res.body.email, email);
  });

  test("duplicate email returns 409", async () => {
    const res = await request(app).post("/patient/signup").send({
      name: "Alice Patient",
      email,
      password: "GoodPass1",
      phone: "9876543210",
    });
    assert.equal(res.status, 409);
  });
});

describe("Patient login", () => {
  const email = "patient.login@example.com";
  const password = "GoodPass1";

  before(async () => {
    await request(app).post("/patient/signup").send({
      name: "Login Patient",
      email,
      password,
      phone: "9876543211",
    });
  });

  test("wrong password returns 401", async () => {
    const res = await request(app).post("/patient/login").send({ email, password: "WrongPass1" });
    assert.equal(res.status, 401);
  });

  test("unknown user returns 404", async () => {
    const res = await request(app).post("/patient/login").send({ email: "nobody@example.com", password });
    assert.equal(res.status, 404);
  });

  test("correct credentials return 200 and a token", async () => {
    const res = await request(app).post("/patient/login").send({ email, password });
    assert.equal(res.status, 200);
    assert.equal(typeof res.body.token, "string");
  });

  describe("protected route", () => {
    test("no token returns 401", async () => {
      const res = await request(app).get("/patient/profile");
      assert.equal(res.status, 401);
    });

    test("valid token returns 200 with the patient's profile", async () => {
      // Re-login here so this sub-suite doesn't depend on sibling test order.
      const login = await request(app).post("/patient/login").send({ email, password });
      const token = login.body.token;
      const res = await request(app)
        .get("/patient/profile")
        .set("Authorization", `Bearer ${token}`);
      assert.equal(res.status, 200);
      assert.equal(res.body.email, email);
    });
  });
});

describe("Doctor signup/login", () => {
  const email = "doctor.one@example.com";
  const password = "GoodPass1";

  test("doctor signup succeeds with 201 and a token", async () => {
    const res = await request(app).post("/doctor/signup").send({
      name: "Dr. Bob",
      email,
      password,
      phone: "9876543212",
      gender: "male",
    });
    assert.equal(res.status, 201);
    assert.equal(typeof res.body.token, "string");
  });

  test("doctor login succeeds with 200 and a token", async () => {
    const res = await request(app).post("/doctor/login").send({ email, password });
    assert.equal(res.status, 200);
    assert.equal(typeof res.body.token, "string");
  });
});

describe("Admin doctor creation", () => {
  const doctorBody = {
    name: "Dr. Carol",
    email: "doctor.admin@example.com",
    password: "GoodPass1",
    phone: "9876543213",
    gender: "female",
    speciality: "Cardiology",
  };

  before(() => {
    config.ADMIN_API_KEY = "test-admin-key";
  });

  after(() => {
    config.ADMIN_API_KEY = undefined;
  });

  test("401 without an admin key header", async () => {
    const res = await request(app).post("/admin/doctor").send(doctorBody);
    assert.equal(res.status, 401);
  });

  test("401 with a wrong admin key", async () => {
    const res = await request(app)
      .post("/admin/doctor")
      .set("x-admin-key", "not-the-key")
      .send(doctorBody);
    assert.equal(res.status, 401);
  });

  test("201 with the correct admin key", async () => {
    const res = await request(app)
      .post("/admin/doctor")
      .set("x-admin-key", "test-admin-key")
      .send(doctorBody);
    assert.equal(res.status, 201);
    assert.equal(res.body.email, doctorBody.email);
    assert.equal(res.body.gender, doctorBody.gender);
  });
});

describe("Booking flow, confirmation and cancellation", () => {
  const patientEmail = "booking.patient@example.com";
  const doctorEmail = "booking.doctor@example.com";
  const password = "GoodPass1";

  let patientToken;
  let doctorToken;
  let doctorId;

  before(async () => {
    const patientSignup = await request(app).post("/patient/signup").send({
      name: "Booking Patient",
      email: patientEmail,
      password,
      phone: "9876543214",
    });
    patientToken = patientSignup.body.token;

    const doctorSignup = await request(app).post("/doctor/signup").send({
      name: "Dr. Dana",
      email: doctorEmail,
      password,
      phone: "9876543215",
      gender: "female",
    });
    doctorToken = doctorSignup.body.token;
    doctorId = jwt.decode(doctorToken)._id;
  });

  test("rejects booking in the past with 400", async () => {
    const res = await request(app)
      .post("/patient/create-appointment")
      .set("Authorization", `Bearer ${patientToken}`)
      .send({ doctorId, date: "2000-01-01", time: "10:00" });
    assert.equal(res.status, 400);
  });

  let bookedAppointmentId;
  let bookedSlot;

  test("books an appointment successfully with 201", async () => {
    bookedSlot = dateTimeFromNow(10 * 24 * 60 * 60 * 1000); // 10 days out
    const res = await request(app)
      .post("/patient/create-appointment")
      .set("Authorization", `Bearer ${patientToken}`)
      .send({ doctorId, ...bookedSlot });
    assert.equal(res.status, 201);
    assert.equal(res.body.status, "Pending");
    assert.equal(res.body.confirmed, false);
    bookedAppointmentId = res.body._id;
  });

  test("booking the same doctor/date/time again returns 409", async () => {
    const res = await request(app)
      .post("/patient/create-appointment")
      .set("Authorization", `Bearer ${patientToken}`)
      .send({ doctorId, ...bookedSlot });
    assert.equal(res.status, 409);
  });

  test("doctor confirms the appointment, status becomes Confirmed", async () => {
    const res = await request(app)
      .get(`/doctor/confirm-appointment/${bookedAppointmentId}`)
      .set("Authorization", `Bearer ${doctorToken}`);
    assert.equal(res.status, 200);
    assert.equal(res.body.status, "Confirmed");
    assert.equal(res.body.confirmed, true);
  });

  test("patient cancels a far-future appointment with 200 Cancelled", async () => {
    const farFutureSlot = dateTimeFromNow(15 * 24 * 60 * 60 * 1000); // 15 days out
    const booking = await request(app)
      .post("/patient/create-appointment")
      .set("Authorization", `Bearer ${patientToken}`)
      .send({ doctorId, ...farFutureSlot });
    assert.equal(booking.status, 201);

    const cancel = await request(app)
      .patch(`/patient/appointment/${booking.body._id}/cancel`)
      .set("Authorization", `Bearer ${patientToken}`);
    assert.equal(cancel.status, 200);
    assert.equal(cancel.body.status, "Cancelled");
  });

  test("patient cannot cancel an appointment ~1 hour from now (400, deadline rule)", async () => {
    const nearSlot = dateTimeFromNow(70 * 60 * 1000); // 70 minutes out
    const booking = await request(app)
      .post("/patient/create-appointment")
      .set("Authorization", `Bearer ${patientToken}`)
      .send({ doctorId, ...nearSlot });
    assert.equal(booking.status, 201);

    const cancel = await request(app)
      .patch(`/patient/appointment/${booking.body._id}/cancel`)
      .set("Authorization", `Bearer ${patientToken}`);
    assert.equal(cancel.status, 400);
  });
});

describe("Misc", () => {
  test("unknown route returns 404", async () => {
    const res = await request(app).get("/this-route-does-not-exist");
    assert.equal(res.status, 404);
  });

  test("getDoctors returns the paginated shape, not a bare array", async () => {
    const res = await request(app).get("/patient/getDoctors").query({ page: 1, limit: 5 });
    assert.equal(res.status, 200);
    assert.equal(Array.isArray(res.body.doctors), true);
    assert.equal(typeof res.body.pagination, "object");
    assert.equal(res.body.pagination.page, 1);
    assert.equal(res.body.pagination.limit, 5);
    assert.equal(typeof res.body.pagination.total, "number");
    assert.equal(typeof res.body.pagination.totalPages, "number");
  });
});
