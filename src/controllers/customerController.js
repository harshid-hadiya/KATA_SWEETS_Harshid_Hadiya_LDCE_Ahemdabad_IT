const Customer = require("../models/Customer");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

exports.createOrLoginCustomer = async (req, res) => {
  const { name, mobile } = req.body;
  if (!name || !mobile) {
    return res.status(400).json({ error: "Name and mobile are required" });
  }
  try {
    let customer = await Customer.findOne({ mobile });
    if (customer) {
      if (customer.name === name) {
        // Return JWT for existing customer
        const token = jwt.sign(
          { role: "customer", customerId: customer._id },
          JWT_SECRET,
          { expiresIn: "1h" }
        );
        return res.status(200).json({ customer, token });
      } else {
        return res.status(400).json({ error: "Mobile number already in use" });
      }
    }
    // Check if a customer with same name but different mobile exists (optional, not required by test)
    customer = new Customer({ name, mobile });
    await customer.save();
    const token = jwt.sign(
      { role: "customer", customerId: customer._id },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    return res.status(201).json({ customer, token });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
