const request = require("supertest");
const app = require("../src/app");
const mongoose = require("mongoose");
const Sweet = require("../src/models/Sweet");

let ownerToken;

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017/sweetshop_test");
  }
  const res = await request(app)
    .post("/api/owner/login")
    .send({ username: "shopowner", password: "ownerpass" });
  ownerToken = res.body.token;
});

beforeEach(async () => {
  await Sweet.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Sweet Shop API", () => {
  it("should add a new sweet", async () => {
    const sweet = {
      name: "Milk Chocolate",
      category: "chocolate",
      price: 2.5,
      quantity: 100,
    };
    const res = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${ownerToken}`)
      .send(sweet);
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("Milk Chocolate");
    expect(res.body.category).toBe("chocolate");
    expect(res.body.price).toBe(2.5);
    expect(res.body.quantity).toBe(100);
  });

  it("should not add sweet without auth", async () => {
    const sweet = {
      name: "No Auth Sweet",
      category: "barfi",
      price: 10,
      quantity: 5,
    };
    const res = await request(app)
      .post("/api/sweets")
      .send(sweet);
    expect(res.statusCode).toBe(401);
  });

  it("should return error for invalid category", async () => {
    const sweet = {
      name: "Gummy Bear",
      category: "biscuit",
      price: 1.5,
      quantity: 50,
    };
    const res = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${ownerToken}`)
      .send(sweet);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/category/);
  });

  it("should return error if quantity is not a number", async () => {
    const sweet = {
      name: "Lollipop",
      category: "candy",
      price: 0.5,
      quantity: "ten",
    };
    const res = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${ownerToken}`)
      .send(sweet);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/quantity/);
  });

  it("should return error if required fields are missing", async () => {
    const sweet = { name: "Brownie" };
    const res = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${ownerToken}`)
      .send(sweet);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it("should return error if price or quantity is negative", async () => {
    const sweet = {
      name: "Dark Chocolate",
      category: "chocolate",
      price: -5,
      quantity: -10,
    };
    const res = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${ownerToken}`)
      .send(sweet);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/price|quantity/);
  });

  describe("DELETE /api/sweets/:id", () => {
    let sweetId;
    beforeEach(async () => {
      await Sweet.deleteMany({});
      const uniqueName = "Test Sweet " + Date.now();
      const sweet = {
        name: uniqueName,
        category: "barfi",
        price: 10,
        quantity: 5,
      };
      const res = await request(app)
        .post("/api/sweets")
        .set("Authorization", `Bearer ${ownerToken}`)
        .send(sweet);
      sweetId = res.body._id;
    });

    it("should delete a sweet by id", async () => {
      const res = await request(app)
        .delete(`/api/sweets/${sweetId}`)
        .set("Authorization", `Bearer ${ownerToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toMatch(/deleted/i);
    });

    it("should return 404 if sweet does not exist", async () => {
      const fakeId = "507f1f77bcf86cd799439011";
      const res = await request(app)
        .delete(`/api/sweets/${fakeId}`)
        .set("Authorization", `Bearer ${ownerToken}`);
      expect(res.statusCode).toBe(404);
      expect(res.body.error).toMatch(/not found/i);
    });

    it("should return 400 for invalid sweet id format", async () => {
      const res = await request(app)
        .delete(`/api/sweets/invalid-id`)
        .set("Authorization", `Bearer ${ownerToken}`);
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toMatch(/invalid/i);
    });

    it("should return 404 if id is missing", async () => {
      const res = await request(app)
        .delete(`/api/sweets/`)
        .set("Authorization", `Bearer ${ownerToken}`);
      expect(res.statusCode).toBe(404);
    });
  });
  describe("GET /api/sweets", () => {
    beforeEach(async () => {
      await Sweet.deleteMany({});
    });

    it("should return an empty array if no sweets exist", async () => {
      const res = await request(app).get("/api/sweets");
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(0);
    });

    it("should return all sweets", async () => {
      const sweet1 = {
        name: "Sweet1",
        category: "barfi",
        price: 5,
        quantity: 10,
      };
      const sweet2 = {
        name: "Sweet2",
        category: "laddu",
        price: 7,
        quantity: 20,
      };
      await request(app)
        .post("/api/sweets")
        .set("Authorization", `Bearer ${ownerToken}`)
        .send(sweet1);
      await request(app)
        .post("/api/sweets")
        .set("Authorization", `Bearer ${ownerToken}`)
        .send(sweet2);
      const res = await request(app).get("/api/sweets");
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
    });
  });
});