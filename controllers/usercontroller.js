const router = require("express").Router();
const { UniqueConstraintError } = require("sequelize/lib/errors");
const { UserModel } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

router.post("/register", async (req, res) => {
  let { username, password } = req.body.user;
  try {
    const User = await UserModel.create({
      username,
      password: bcrypt.hashSync(password, 13),
    });

    let token = jwt.sign({id: User.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});
   

    res.status(201).json({
      message: "user successfully registered",
      user: User,
      sessionToken: token 
    });
  } catch (err) {
    if (err instanceof UniqueConstraintError) {
      res.status(409).json({
        message: "username already in use",
      });
    } else {
      res.status(500).json({
        message: "Failed to register user",
      });
    }
  }
}, 

  router.post("/login", async (req, res) => {
    let { username, password } = req.body.user;
  
   try {
    let loginUser = await UserModel.findOne({
     where: { 
        username: username, 
     },
    });
    if (loginUser) {
    let passwordComparison = await bcrypt.compare(password,loginUser.password);

      if (passwordComparison) {

      let token = jwt.sign({id: loginUser.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});
      res.status(200).json({ 
        user: loginUser,
        message: "user successfully logged in!",
        sessionToken: token
      });
    } else {
      res.status(401).json({
        message: "Incorrect email or password"
      })
    }


     } else {
       res.status(401).json({
         message: 'incorrect email or password'
       });
      }
      } catch (err) {
        res.status(500).json({
        message: "failure to log user in"
        })
      }
      },
    )
  ),
  module.exports = router

