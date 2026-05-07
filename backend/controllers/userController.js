const User = require("../models/userModel");
const validator = require("validator");
// const bcrypt = require('bcrypt');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRES = "24h";

// function to create token
const createToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES });
};

//-------------- SIGNUP FUNCTION ------------------------
exports.signUp = async (req, res) => {
  try {
    //exctract data
    console.log("req body :-", req.body);
    const { name, email, password } = req.body;
    console.log(name, email, password);

    // check if anyone is empty
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // if email pattern is invalid
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email",
      });
    }

    // checking password length
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "password must be atleast 8 characters long",
      });
    }
    // checking for existing user or not
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exist",
      });
    }

    // hashing password
    const hashedPassword = await bcrypt.hash(password, 10);
    // creating user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // create token
    const token = createToken(newUser._id);

    res.status(201).json({
      success: true,
      token: token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(501).json({
      success: false,
      message: "internal server error",
    });
  }
};

// ------------------ LOGIN Function --------------------
exports.login = async (req, res) => {
  try {
    // extracting email pass from req.body
    const { email, password } = req.body;

    // checking if email or pass is empty
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the details",
      });
    }

    // finding user
    const userExist = await User.findOne({ email });

    // user not exist
    if (!userExist) {
      return res.status(404).json({
        success: false,
        message: "User not found !",
      });
    }

    // matching password
    const isMatch = await bcrypt.compare(password, userExist.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password !",
      });
    }

    const token = createToken(userExist._id); // creating token

    res.status(201).json({
      success: true,
      token: token,
      user: {
        name: userExist.name,
        email: userExist.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error !",
    });
  }
};

// GET CURRENT USER
exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;

    // finding user by id and extracting "name" and "email"
    const user = await User.findById(userId).select("name email imageUrl");

    // when user not found
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found !",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: " Interval server error !",
    });
  }
};

// UPDATE USER PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    // validation
    if (!name || !email || !validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid name or email!",
      });
    }

    const emailExist = await User.findOne({ email, _id: { $ne: req.user.id } });

    // if email already in use by another account
    if (emailExist) {
      return res.status(400).json({
        success: false,
        message: "Email already in use !",
      });
    }

    // update user details
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: " Interval server error !",
    });
  }
};

// UPDATE PASSWORD
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword || newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password length is small",
      });
    }

    const user = await User.findById(req.user.id).select("password");

    // if user not found
    if (!user) {
      return res.json(400).json({
        success: false,
        message: "User not found !",
      });
    }

    // matching currentpassword
    if (!bcrypt.compare(currentPassword, user.password)) {
      return res.status(401).json({
        success: false,
        message: "current password is incorrect",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();
    res.json({
      success: true,
      message: "Password changed successfully !",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: " Interval server error !",
    });
  }
};

// checking is file type supported or not
function isFileTypeSupported(type, supportedTypes) {
  return supportedTypes.includes(type.toLowerCase());
}

// function to upload file on cloudinary (file, folder name to store)
async function uploadFileToCloudinary(file, folder) {
  const options = { folder };
  options.resource_type = "auto";

  return await cloudinary.uploader.upload(file.tempFilePath, options);
}

// image upload handler
exports.imageUpload = async (req, res) => {
  try {
    // image fetching
    const file = req.files.imageFile;
    console.log(file);
    if (!req.files || !req.files.imageFile) {
      return res.status(400).json({
        success: false,
        message: "No file to upload",
      });
    }

    // validation
    // supported file type
    const supportedTypes = ["jpg", "jpeg", "png"];
    const fileType = file.name.split(".").pop().toLowerCase(); // extracting file type

    if (!isFileTypeSupported(fileType, supportedTypes)) {
      return res.status(400).json({
        success: false,
        message: "File type not supported",
      });
    }

    const user = await User.findById(req.user.id).select("imageUrl public_id");

    // if user not found
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found !",
      });
    }

    // file format supported hai to
    // upload to cloudinary, new image
    const response = await uploadFileToCloudinary(file, "taskManager");
    console.log(response);

    // If user already has an image, delete it from Cloudinary
    if (user.public_id) {
      const cloudinary = require("cloudinary").v2;
      await cloudinary.uploader.destroy(user.public_id);
    }

    // Save new image info
    user.public_id = response.public_id;
    user.imageUrl = response.secure_url;

    await user.save();
    res.json({
      success: true,
      imageUrl: response.secure_url,
      message: "profile picture changed successfully !",
    });
  } catch (error) {
    console.error(error.message);
    return res.status(400).json({
      success: false,
      message: "something went wrong",
    });
  }
};

// remove image
exports.removeImage = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("imageUrl ,public_id");

    // if user not found
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found !",
      });
    }

    // If user already has an image, delete it from Cloudinary
    if (user.public_id) {
      const cloudinary = require("cloudinary").v2;
      await cloudinary.uploader.destroy(user.public_id);
    }

    // set image url as empty String
    user.imageUrl = "";
    user.public_id = "";

    await user.save();
    res.json({
      success: true,
      imageUrl: "",
      message: "profile picture changed successfully !",
    });
  } catch (error) {
    console.error(error.message);
    return res.status(400).json({
      success: false,
      message: "something went wrong",
    });
  }
};
