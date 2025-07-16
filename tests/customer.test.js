const request = require("supertest");
const app = require("../src/app");
const mongoose = require("mongoose");
const Customer = require("../src/models/Customer");

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017/sweetshop_test");
  }
  try {
    await mongoose.connection.collection("customers").createIndex({ mobile: 1 }, { unique: true });
  } catch (err) {}
});

beforeEach(async () => {
  await Customer.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Customer API", () => {
  it("should create a new customer", async () => {
    const res = await request(app)
      .post("/api/customers/login")
      .send({ name: "Alice", mobile: "1234567890" });
    expect(res.statusCode).toBe(201);
    expect(res.body.customer.name).toBe("Alice");
    expect(res.body.customer.mobile).toBe("1234567890");
    expect(res.body.token).toBeDefined();
  });

  it("should not allow duplicate mobile for different name", async () => {
    await request(app)
      .post("/api/customers/login")
      .send({ name: "David", mobile: "3334445555" });
    const res2 = await request(app)
      .post("/api/customers/login")
      .send({ name: "Eve", mobile: "3334445555" });
    expect(res2.statusCode).toBe(400);
    expect(res2.body.error).toMatch(/already in use/);
  });

  it("should allow same name with different mobile", async () => {
    await request(app)
      .post("/api/customers/login")
      .send({ name: "Frank", mobile: "4445556666" });
    const res = await request(app)
      .post("/api/customers/login")
      .send({ name: "Frank", mobile: "5556667777" });
    expect(res.statusCode).toBe(201);
    expect(res.body.customer.name).toBe("Frank");
    expect(res.body.customer.mobile).toBe("5556667777");
  });

  it("should allow login for same customer (same name and mobile)", async () => {
    await request(app)
      .post("/api/customers/login")
      .send({ name: "Grace", mobile: "7778889999" });
    const res = await request(app)
      .post("/api/customers/login")
      .send({ name: "Grace", mobile: "7778889999" });
    expect(res.statusCode).toBe(200);
    expect(res.body.customer.name).toBe("Grace");
    expect(res.body.customer.mobile).toBe("7778889999");
    expect(res.body.token).toBeDefined();
  });

  it("should return error if name or mobile is missing", async () => {
    const res = await request(app)
      .post("/api/customers/login")
      .send({ name: "Frank" });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it("should return error if mobile is not unique (case: create, then update name)", async () => {
    await request(app)
      .post("/api/customers/login")
      .send({ name: "Original", mobile: "8888888888" });
    // Try to register with same mobile, different name
    const res = await request(app)
      .post("/api/customers/login")
      .send({ name: "Changed", mobile: "8888888888" });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/already in use/);
  });

  it("should not allow empty name or mobile", async () => {
    const res = await request(app)
      .post("/api/customers/login")
      .send({ name: "", mobile: "" });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});