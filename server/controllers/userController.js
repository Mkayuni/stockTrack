const { User } = require('../models');  // Import from models/index.js
const bcrypt = require('bcrypt');  // Import bcrypt for password hashing
const jwt = require('jsonwebtoken');
const {Op} = require ("sequelize");  // Import jsonwebtoken for JWT token generation

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
  const userIdFromToken = req.user.id;

  if (userIdFromToken !== id) {
    return res.status(403).json({ message: 'Access Denied. You can only access your own information.' });
  }


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

// Function to get user information from token
const getUserByToken = async (req, res) => {
  const userID = req.user.id;

  return await getUserById({params: {id: userID}, user:req.user}, res);
};

// Function that returns true if the email is in the system
const isEmailTaken = async (req, res) => {
  const { email } = req.params;
  try {
    const user = await User.findOne({where: {email: email}});

    if (user) {
      res.json({found: true});  // Return if email is in the system
    } else {
      res.status(404).json({found: false, message: 'Email is not in the system'}); // If Email is not in system
    }
  } catch (error) {
    res.status(500).json({found: false, message: 'Server error'});  // Handle server errors
  }
}

// Function that returns true if a username is in the system
const isUsernameTaken = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({where: {username: username}});

    if (user) {
      res.json({found: true});  // Return if username is in the system
    } else {
      res.status(404).json({found: false, message: 'Username is not in the system'}); // If username is not in system
    }
  } catch (error) {
    res.status(500).json({found: false, message: 'Server error'});  // Handle server errors
  }
}

// Function to login a user (Login Route) with JWT token generation
const loginUser = async (req, res) => {
  const { email, username, password } = req.body;
  try {

    const user = await User.findOne({
      where: {
        [Op.or]: [
          { email: email || null },
          { username: username || null }
        ]
      }
    });

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

  const userID = req.user.id;
  const { id } = req.params;

  if (userID !== id)  res.status(401).json({ message: 'Invalid credentials' })

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

// Function to verify codes and return user if codes match
const verifyCode = async (req, res) => {
  const { code } = req.params;
  const { verificationCode, email, password} = req.body;

  const hash_code = await bcrypt.hash(code, 12);

  // Check if codes matched
  if (hash_code !== verificationCode) res.status(401).json({ matched: false, message: 'Invalid credentials' });

  // If password empty - just send if it failed or not
  if (password === ""){
    res.json({ matched: true })
  }
  // Else - change the password
  else {
   try {

     const user = await User.findOne({where: {email: email}});
     user.password = password;

     res.json({matched: true, message: "Password has been updated"})

   } catch (e) {
     res.status(500).json({ message: 'Server error' });
   }
  }


}

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser, loginUser, isEmailTaken, isUsernameTaken, getUserByToken, verifyCode};
