var express = require('express');
var router = express.Router();
let roleSchema = require('../schemas/roles')

///api/v1/roles
router.get('/', async function (req, res, next) {
  let result = await roleSchema.find({ isDeleted: false });
  res.send(result);
});

///api/v1/roles/:id
router.get('/:id', async function (req, res, next) {
  try {
    let result = await roleSchema.findOne({
      _id: req.params.id,
      isDeleted: false
    });
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

router.post('/', async function (req, res, next) {
  try {
    let newObj = new roleSchema({
      name: req.body.name,
      description: req.body.description
    })
    await newObj.save()
    res.send(newObj);
  } catch (error) {
    res.status(404).send(error.message);
  }
})

router.put('/:id', async function (req, res, next) {
  try {
    let result = await roleSchema.findByIdAndUpdate(req.params.id,
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
    let result = await roleSchema.findByIdAndUpdate(req.params.id,
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

