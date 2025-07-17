const request = require("supertest");
const app = require("../src/app");
const mongoose = require("mongoose");
const Sweet = require("../src/models/Sweet");
const Customer = require("../src/models/Customer");
const Purchase = require("../src/models/Purchase");

let ownerToken;
let customerToken;

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(
      process.env.MONGO_URL || "mongodb://localhost:27017/sweetshop_test"
    );
  }
  const res = await request(app)
    .post("/api/owner/login")
    .send({ username: "shopowner", password: "ownerpass" });
  ownerToken = res.body.token;
});

beforeEach(async () => {
  await Sweet.deleteMany({});
  await Customer.deleteMany({});
  await Purchase.deleteMany({});
  const customerRes = await request(app)
    .post("/api/customers/login")
    .send({ name: "Buyer", mobile: "9998887777" });
  customerToken = customerRes.body.token;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Purchase API", () => {
  it("should purchase sweet and decrease stock", async () => {
    const uniqueName = "Test Sweet " + Date.now();
    const sweetRes = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({ name: uniqueName, category: "barfi", price: 10, quantity: 5 });
    expect(sweetRes.statusCode).toBe(201);
    const sweetId = sweetRes.body._id;
    expect(sweetId).toBeDefined();
    // Confirm sweet exists in DB
    const sweet = await Sweet.findById(sweetId);
    expect(sweet).not.toBeNull();
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ quantity: 2 });
    expect(res.statusCode).toBe(201);
    expect(res.body.purchase.quantity).toBe(2);
    expect(res.body.purchase.totalPrice).toBe(20);
    const updatedSweet = await Sweet.findById(sweetId);
    expect(updatedSweet).not.toBeNull();
    expect(updatedSweet.quantity).toBe(3);
  });

  it("should not allow purchase if not enough stock", async () => {
    const uniqueName = "Low Stock Sweet " + Date.now();
    const sweetRes = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({ name: uniqueName, category: "barfi", price: 10, quantity: 1 });
    expect(sweetRes.statusCode).toBe(201);
    const sweetId = sweetRes.body._id;
    expect(sweetId).toBeDefined();
    const sweet = await Sweet.findById(sweetId);
    expect(sweet).not.toBeNull();
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ quantity: 2 });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/not enough stock/i);
  });

  it("should return error for invalid customer token", async () => {
    const sweetRes = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({ name: "Test Sweet", category: "barfi", price: 10, quantity: 5 });
    expect(sweetRes.statusCode).toBe(201);
    const sweetId = sweetRes.body._id;
    expect(sweetId).toBeDefined();
    const sweet = await Sweet.findById(sweetId);
    expect(sweet).not.toBeNull();
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set("Authorization", `Bearer invalidtoken`)
      .send({ quantity: 1 });
    expect(res.statusCode).toBe(401);
  });

  it("should return error for invalid sweet", async () => {
    const res = await request(app)
      .post(`/api/sweets/507f1f77bcf86cd799439011/purchase`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ quantity: 1 });
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toMatch(/sweet not found/i);
  });

  it("should return error if quantity is missing", async () => {
    const sweetRes = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({ name: "Test Sweet", category: "barfi", price: 10, quantity: 5 });
    expect(sweetRes.statusCode).toBe(201);
    const sweetId = sweetRes.body._id;
    expect(sweetId).toBeDefined();
    const sweet = await Sweet.findById(sweetId);
    expect(sweet).not.toBeNull();
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/quantity/);
  });

  it("should return error if customer is not found (token valid but deleted)", async () => {
    const sweetRes = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({ name: "Test Sweet", category: "barfi", price: 10, quantity: 5 });
    expect(sweetRes.statusCode).toBe(201);
    const sweetId = sweetRes.body._id;
    expect(sweetId).toBeDefined();
    const sweet = await Sweet.findById(sweetId);
    expect(sweet).not.toBeNull();
    await Customer.deleteMany({});
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ quantity: 1 });
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toMatch(/customer not found/i);
  });
});
