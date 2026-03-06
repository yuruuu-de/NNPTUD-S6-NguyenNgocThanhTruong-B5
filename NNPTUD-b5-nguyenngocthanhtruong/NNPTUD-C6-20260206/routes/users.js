var express = require('express');
var router = express.Router();
let userSchema = require('../schemas/users')

///api/v1/users
router.get('/', async function (req, res, next) {
  let result = await userSchema
    .find({ isDeleted: false })
    .populate({ path: 'role', select: 'name description' });
  res.send(result);
});

router.post('/', async function (req, res, next) {
  try {
    let newObj = new userSchema({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      status: req.body.status,
      role: req.body.roleId,
      loginCount: req.body.loginCount
    })
    await newObj.save()
    res.send(newObj);
  } catch (error) {
    res.status(404).send(error.message);
  }
})

///api/v1/users/enable
router.post('/enable', async function (req, res, next) {
  try {
    let email = (req.body.email || '').toString().trim().toLowerCase();
    let username = (req.body.username || '').toString().trim();

    if (!email || !username) {
      return res.status(400).send({ message: "email and username are required" })
    }

    let result = await userSchema.findOneAndUpdate(
      { email: email, username: username, isDeleted: false },
      { status: true },
      { new: true }
    );

    if (result) {
      res.status(200).send(result)
    } else {
      res.status(404).send({ message: "USER NOT FOUND" })
    }
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
})

///api/v1/users/disable
router.post('/disable', async function (req, res, next) {
  try {
    let email = (req.body.email || '').toString().trim().toLowerCase();
    let username = (req.body.username || '').toString().trim();

    if (!email || !username) {
      return res.status(400).send({ message: "email and username are required" })
    }

    let result = await userSchema.findOneAndUpdate(
      { email: email, username: username, isDeleted: false },
      { status: false },
      { new: true }
    );

    if (result) {
      res.status(200).send(result)
    } else {
      res.status(404).send({ message: "USER NOT FOUND" })
    }
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
})

///api/v1/users/:id
router.get('/:id', async function (req, res, next) {
  try {
    let result = await userSchema
      .findOne({ _id: req.params.id, isDeleted: false })
      .populate({ path: 'role', select: 'name description' });
    if (result) {
      res.status(200).send(result)
    } else {
      res.status(404).send({
        message: "ID NOT FOUND"
      })
    }
  } catch (error) {
    res.status(404).send({
      message: "ID NOT FOUND"
    })
  }
});

router.put('/:id', async function (req, res, next) {
  try {
    let result = await userSchema.findByIdAndUpdate(req.params.id,
      req.body, {
      new: true
    })
    if (result && !result.isDeleted) {
      res.status(200).send(result)
    } else {
      res.status(404).send({
        message: "ID NOT FOUND"
      })
    }
  } catch (error) {
    res.status(404).send({
      message: "ID NOT FOUND"
    })
  }
})

router.delete('/:id', async function (req, res, next) {
  try {
    let result = await userSchema.findByIdAndUpdate(req.params.id,
      { isDeleted: true }, {
      new: true
    })
    if (result) {
      res.status(200).send(result)
    } else {
      res.status(404).send({
        message: "ID NOT FOUND"
      })
    }
  } catch (error) {
    res.status(404).send({
      message: "ID NOT FOUND"
    })
  }
})

module.exports = router;
