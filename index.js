const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lb4b8.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
app.use(bodyParser.json());
app.use(cors());






const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("EmaJhonSimple").collection("products");
  const orderCollection = client.db("EmaJhonSimple").collection("order");


  app.get('/',(req, res)=>{
    res.send("hello this site will be working")
  })
  app.post('/addProducts', (req, res) => {
      const product = req.body;
      productsCollection.insertOne(product)
      .then(result => {
          res.send(result.insertedCount)
      })
  })

  app.get('/products', (req, res) => {
    const search = req.query.search;
    productsCollection.find({name: {$regex: search} })
    .toArray((err, documents) => {
      res.send(documents)
    })
  })

  app.get('/product/:key', (req, res) => {
    productsCollection.find({key: req.params.key})
    .toArray((err, documents) => {
      res.send(documents[0])
    })
  })

  app.post('/productsByKeys', (req, res) => {
    const productKeys = req.body;
    productsCollection.find({key: { $in: productKeys} })
    .toArray( (err, documents) => {
        res.send(documents);
    })
})

app.post('/addOrder', (req, res) => {
  const order = req.body;
  orderCollection.insertOne(order)
  .then(result => {
      res.send(result.insertedCount > 0)
  })
})
});



app.listen(process.env.PORT || 5000)