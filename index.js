const express = require('express')
require('dotenv').config()
const bodyParser = require('body-parser')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;


const app = express()

app.use(cors())
app.use(bodyParser.json())

const port = 5000

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cxw2z.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });




client.connect(err => {
  const collection = client.db("emJohnEStore").collection("products");
  const orderCollection = client.db("emJohnEStore").collection("order");

  app.post('/addProduct', (req,res) =>{
      const product = req.body;
    //   console.log(product)
      collection.insertOne(product)
      .then((result => {
          res.send(result.insertedCount)
      }))
  })

 app.get('/products' , (req, res) => {
     collection.find({}).limit(20)
     .toArray((error, document) =>{
         res.send(document)
     })
 })

 app.get('/product/:key', (req, res) => {
     collection.find({key : req.params.key})
     .toArray((error, document) =>{
         res.send(document[0])
     })
 })

 app.post('/productsKeys' , (req,res) =>{
     const productKeys = req.body;
     collection.find({key: {$in : productKeys}})
     .toArray((err ,documents) =>{
         res.send(documents)
     })
 })

 app.post('/addOrder', (req,res) =>{
    const orders = req.body;
  //   console.log(product)
    orderCollection.insertOne(orders)
    .then((result => {
        res.send(result.insertedCount > 0)
    }))
})


  console.log('data base connent succesfullly')
});


app.listen(port, () => {
  console.log("ema john server is running")
})