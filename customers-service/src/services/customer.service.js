// src/services/customer.service.js
const Customer = require('../models/customer.model');

exports.createCustomer = async ({ accountId, firstname, lastname }) => {
  // Vérifier si on n'a pas déjà un client pour ce accountId
  const existing = await Customer.findOne({ accountId });
  if (existing) {
    throw new Error("Customer already exists for this account");
  }
  const customer = new Customer({ accountId, firstname, lastname });
  await customer.save();
  return customer;
};

exports.getCustomerByAccountId = async (accountId) => {
  return Customer.findOne({ accountId });
};

exports.updateCustomer = async (accountId, data) => {
  // data peut contenir { firstname, lastname, ... }
  return Customer.findOneAndUpdate({ accountId }, data, { new: true });
};

exports.deleteCustomer = async (accountId) => {
  return Customer.findOneAndDelete({ accountId });
};

exports.getAllCustomers = async () => {
  return Customer.find();
};

// --- Nouvelles fonctions ---

exports.addAddress = async (accountId, address) => {
    const customer = await Customer.findOne({ accountId });
    if (!customer) throw new Error("Customer not found");
  
    customer.addresses.push(address);
    await customer.save();
    return customer;
  };
  
  exports.removeAddress = async (accountId, addressIndex) => {
    const customer = await Customer.findOne({ accountId });
    if (!customer) throw new Error("Customer not found");
  
    if (addressIndex < 0 || addressIndex >= customer.addresses.length) {
      throw new Error("Address index out of range");
    }
    customer.addresses.splice(addressIndex, 1);
    await customer.save();
    return customer;
  };
  
  exports.uploadAvatar = async (accountId, filePath) => {
    const customer = await Customer.findOne({ accountId });
    if (!customer) throw new Error("Customer not found");
  
    customer.avatarUrl = filePath; // ex: "src/uploads/avatar_<accountId>.png"
    await customer.save();
    return customer;
  };
