// src/controllers/customer.controller.js

const CustomerService = require('../services/customer.service');

exports.createCustomer = async (req, res) => {
  try {
    const { accountId, firstname, lastname } = req.body;
    const customer = await CustomerService.createCustomer({ accountId, firstname, lastname });
    return res.status(201).json(customer);
  } catch (err) {
    console.error("createCustomer error:", err);
    return res.status(400).json({ error: err.message });
  }
};

exports.getCustomerByAccountId = async (req, res) => {
  try {
    const accountId = req.params.accountId;
    const customer = await CustomerService.getCustomerByAccountId(accountId);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    return res.status(200).json(customer);
  } catch (err) {
    console.error("getCustomerByAccountId error:", err);
    return res.status(400).json({ error: err.message });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const accountId = req.params.accountId;
    const data = req.body; // { firstname, lastname, etc. }
    const updated = await CustomerService.updateCustomer(accountId, data);
    if (!updated) {
      return res.status(404).json({ error: "Customer not found" });
    }
    return res.status(200).json(updated);
  } catch (err) {
    console.error("updateCustomer error:", err);
    return res.status(400).json({ error: err.message });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const accountId = req.params.accountId;
    const deleted = await CustomerService.deleteCustomer(accountId);
    if (!deleted) {
      return res.status(404).json({ error: "Customer not found" });
    }
    return res.status(200).json({ message: "Customer deleted successfully" });
  } catch (err) {
    console.error("deleteCustomer error:", err);
    return res.status(400).json({ error: err.message });
  }
};

// Optionnel : liste de tous les clients (réservé Admin)
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await CustomerService.getAllCustomers();
    return res.status(200).json(customers);
  } catch (err) {
    console.error("getAllCustomers error:", err);
    return res.status(500).json({ error: err.message });
  }
};


exports.addAddress = async (req, res) => {
    try {
      const accountId = req.params.accountId;
      const address = req.body; // { street, city, zip, country }
  
      const updated = await CustomerService.addAddress(accountId, address);
      return res.status(200).json(updated);
    } catch (err) {
      console.error("addAddress error:", err);
      return res.status(400).json({ error: err.message });
    }
  };
  
  exports.removeAddress = async (req, res) => {
    try {
      const accountId = req.params.accountId;
      const { index } = req.params; // /customers/:accountId/address/:index
  
      const updated = await CustomerService.removeAddress(accountId, parseInt(index, 10));
      return res.status(200).json(updated);
    } catch (err) {
      console.error("removeAddress error:", err);
      return res.status(400).json({ error: err.message });
    }
  };
  
  // Upload d'un avatar
  exports.uploadAvatar = async (req, res) => {
    try {
      const accountId = req.params.accountId;
      // Multer a stocké le fichier -> req.file.path
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      const filePath = req.file.path; 
      const updated = await CustomerService.uploadAvatar(accountId, filePath);
      return res.status(200).json(updated);
    } catch (err) {
      console.error("uploadAvatar error:", err);
      return res.status(400).json({ error: err.message });
    }
  };