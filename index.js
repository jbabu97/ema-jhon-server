const express = require('express');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
// require('dotenv').config();
require('dotenv').config()

// console.log(process.env.DB_NAME);
// console.log(process.env.DB_PASS);
// console.log(process.env.DB_USER);

const uri = `mongodb+srv://emaJhon:jbabu1997@cluster0.7dhhj.mongodb.net/ema-jhon-eco?retryWrites=true&w=majority`;


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 5500;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("ema-jhon-eco").collection("products");
  const ordersCollection = client.db("ema-jhon-eco").collection("orders");

  app.post('/addOrder', (req, res) => {
    const order = req.body;
    console.log(order);
    ordersCollection.insertOne(order)
    .then(result => {
        res.send(result.insertedCount > 0)
    })
    .catch(err => {
        console.log(err);
    })
})
  
  app.post('/addProduct', (req, res) => {
      const products = req.body;
      console.log(products);
      productsCollection.insertMany(products)
      .then(result => {
          res.send(result.insertedCount)
      })
      .catch(err => {
          console.log(err);
      })
  })

  app.get('/items', (req, res) => {
    productsCollection.find({}).limit(20)
    .toArray((err, documents) => {
      res.send(documents)
    })
  })

  app.get('/items/:key', (req, res) => {
    productsCollection.find({key: req.params.key}).limit(20)
    .toArray((err, documents) => {
      res.send(documents[0])
    })
  })
  
  app.post('/itemsByKeys', (req, res) => {
    const productKeys = req.body;
    productsCollection.find({key: { $in: productKeys }})
    .toArray((err, documents) => {
      res.send(documents)
    })
  })

});


app.get('/', (req, res) => {
  res.send('Hello Ema-Jhon eco!')
})

app.listen(process.env.PORT || port, () => {
  console.log(`Listening at http://localhost:${port}`)
})