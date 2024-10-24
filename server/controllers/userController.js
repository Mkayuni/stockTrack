const { User } = require('../models');  // Import from models/index.js
const bcrypt = require('bcrypt');  // Import bcrypt for password hashing
const jwt = require('jsonwebtoken');  // Import jsonwebtoken for JWT token generation

// Function to create a new user with password hashing
const createUser = async (req, res) => {
  console.log(req.body);  // Debugging: Log the request body to ensure it is being received

  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ message: 'Password is required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);  // Hash the password with bcrypt
    const newUser = await User.create({ ...req.body, password: hashedPassword });

    // Exclude the password from the response by renaming the destructured password variable
    const { password: hashed, ...userWithoutPassword } = newUser.dataValues;

    res.status(201).json(userWithoutPassword);  // Return the user without the password
  } catch (error) {
    res.status(400).json({ message: 'Bad request', error: error.message });  // Handle errors
  }
};

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

// Function to login a user (Login Route) with JWT token generation
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });

    // If user is not found
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    
    if (user && await bcrypt.compare(password, user.password)) {
      // Generate a JWT token valid for 1 hour using the secret key from the .env file
      const token = jwt.sign({ id: user.id, role: user.role }, process.env.YOUR_SECRET_KEY, { expiresIn: '1h' });
      res.json({ message: 'Login successful', token });  // Send back the token and success message
    } else {
      res.status(401).json({ message: 'Invalid credentials' });  // Handle invalid login
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });  // Handle server errors
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

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser, loginUser};
