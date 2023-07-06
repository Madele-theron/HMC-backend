const express = require('express')
const mongoose = require('mongoose')
const HouseSitter = require('./models/HouseSitter.js')
const app = express()

// middleware to interperet json
app.use(express.json())
app.use(express.urlencoded({extended: false}))

// routes

// fetch
app.get('/', (req, res) => {
  res.send('Hello World')
})

app.get('/blog', (req, res) => {
  res.send('Hello Blog, my name is Madele')
})

app.get('/housesitters', async(req, res) => {
  try {
    const housesitters = await HouseSitter.find({})
    res.status(200).json(housesitters)
  } catch (error) {
    res.status(500).json({message: error.message})
  }
})

app.get('/housesitters/:id', async(req, res) => {
  try {
    const {id} = req.params;
    const housesitter = await HouseSitter.findById(id)
    res.status(200).json(housesitter)
  } catch (error) {
      res.status(500).json({message: error.message})
  }
})

// add
app.post('/housesitters', async(req, res) => {
  try {
    const housesitter = await HouseSitter.create(req.body)
    res.status(200).json(housesitter);
  } catch (error) {
      console.log(error.message)
      res.status(500).json({message: error.message})
  }
})

// update
app.put('/housesitters/:id', async(req, res) => {
  try {
    const {id} = req.params;
    const housesitter = await HouseSitter.findByIdAndUpdate(id, req.body);
    // cannot find housesitter to update
    if(!housesitter){
      return res.status(404).json({message: `cannot find any product with ID ${id}`})
    }
    const UpdatedHouseSitter = await HouseSitter.findById(id);
    res.status(200).json(UpdatedHouseSitter)
  } catch (error) {
      res.status(500).json({message: error.message})
  }
})

// delete
app.delete('/housesitters/:id', async(req, res) => {
  try {
    const {id} = req.params;
    const housesitter = await HouseSitter.findByIdAndDelete(id);
    if(!housesitter){
      return res.status(404).json({message: `cannot find any product with ID ${id}`})
    }
    res.status(200).json(housesitter);
    
  } catch (error) {
      res.status(500).json({message: error.message})
  }
})

mongoose.set("strictQuery", false)
mongoose.
connect('mongodb+srv://madele:Z1cj516x@hsc-api.q5hrtyr.mongodb.net/HSC-API?retryWrites=true&w=majority')
.then(() => {
  console.log("Connected to MongoDB")
  app.listen(3000, () => {
    console.log("Node API app is running on port 3000")
  });
}).catch((error) => {
  console.log(error)
})