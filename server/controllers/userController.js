const { User } = require('../models');  // Import from models/index.js

// Function to get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();  // Fetch all users from the database
    res.json(users);  // Return users as a JSON response
  } catch (error) {
    res.status(500).json({ message: 'Server error' });  // Handle server errors
  }
};

// Function to get a single user by ID
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);  // Find user by primary key (id)
    if (user) {
      res.json(user);  // Return the found user
    } else {
      res.status(404).json({ message: 'User not found' });  // Handle not found case
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });  // Handle server errors
  }
};

// Function to create a new user
const createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);  // Create a new user with the request body data
    res.status(201).json(newUser);  // Return the newly created user
  } catch (error) {
    res.status(400).json({ message: 'Bad request', error: error.message });  // Handle errors, e.g., validation issues
  }
};

// Function to update an existing user
const updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);  // Find the user by ID
    if (user) {
      await user.update(req.body);  // Update the user with the request body data
      res.json(user);  // Return the updated user
    } else {
      res.status(404).json({ message: 'User not found' });  // Handle not found case
    }
  } catch (error) {
    res.status(400).json({ message: 'Bad request', error: error.message });  // Handle errors, e.g., validation issues
  }
};

// Function to delete a user
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);  // Find the user by ID
    if (user) {
      await user.destroy();  // Delete the user
      res.json({ message: 'User deleted' });  // Return a success message
    } else {
      res.status(404).json({ message: 'User not found' });  // Handle not found case
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });  // Handle server errors
  }
};

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser };
