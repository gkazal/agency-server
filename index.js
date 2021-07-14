const express = require('express')
const app = express()
const  MongoClient  = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID


const cors = require('cors');
const bodyParser = require('body-parser')
require('dotenv').config()



const port = process.env.PORT || 8088;

app.use(cors());
app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uhlcz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const serviceCollection = client.db("agency").collection("services");
  const registerServiceCollection = client.db("agency").collection("serviceRegister")
  const feedbackCollection = client.db("agency").collection("feedback")


    // add service from admin to database from Service.js
  app.post('/addServices', (req, res) => {
      const newServices = req.body;
      console.log('adding new service', newServices)
      serviceCollection.insertOne(newServices)
      .then(result => {
          console.log('inserted count', result.insertedCount)
          res.send(result.insertedCount > 0)
      })
  })

  // show services in the home page from workType.js
  app.get('/services', (req, res) => {
    serviceCollection.find()
      .toArray((err, items) => {
        console.log('from database', items)
        res.send(items)
    })

  } )

  app.post('/addRegisterService', (req, res) => {
      const newRegisterService = req.body
      console.log(newRegisterService)
      registerServiceCollection.insertOne(newRegisterService)
      .then(result => {
          console.log('insertedCount', result.insertedCount)
          res.send(result.insertedCount > 0)
      })

  })

  // get serviceRegister info from specific email
  app.get('/serviceRegister', (req, res) => {
    registerServiceCollection.find({email: req.query.email})
    .toArray((err, documents) =>{
        res.send(documents)
    })
})

// add feedback from user to DB in feedback.js
app.post('/addFeedback', (req, res) => {
    const newFeedback = req.body
    console.log(newFeedback)
    feedbackCollection.insertOne(newFeedback)
    .then(result => {
        console.log('insertedCount', result.insertedCount)
        res.send(result.insertedCount > 0)
    })

})
// show feedback from DB to Home page from showFeedback.js
app.get('/showFeedback', (req, res) => {
    feedbackCollection.find()
    .toArray((err, documents) =>{
        res.send(documents)
    })
})
 


  console.log('database connected')
});













app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })