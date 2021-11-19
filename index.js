const express = require('express')
const app = express()
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5000


//middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hqjve.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db("productDB");
        const productCollection = database.collection("products");
        const orderCollection = database.collection("orders");
        const reviewCollection = database.collection("reviews");
        const userCollection = database.collection("users");


        //GET API

        //GET ALL PRODUCTS
        app.get('/products', async (req, res) => {
            const cursor = productCollection.find({})
            const products = await cursor.toArray();
            res.json(products)

        })

        //GET SINGLE PRODUCT
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await productCollection.findOne(query)
            res.json(result)

        })

        //GET ALL ORDERS
        app.get('/orders', async (req, res) => {
            const cursor = orderCollection.find({})
            const orders = await cursor.toArray();
            res.json(orders)
        })

        //GET SINGLE ORDER
        app.get('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const order = await orderCollection.findOne(query);
            res.json(order)
        })

        //GET ALL REVIEWS
        app.get('/reviews', async (req, res) => {
            const cursor = reviewCollection.find({})
            const reviews = await cursor.toArray();
            res.json(reviews)
        })

        //GET ALL USERS
        app.get('/users', async (req, res) => {
            const cursor = userCollection.find({})
            const users = await cursor.toArray();
            res.json(users)
        })

        //GET USERS BY EMAIL
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email
            const query = { email: email }
            const user = await userCollection.findOne(query)
            let isAdmin = false
            if (user?.role === 'admin') {
                isAdmin = true
            }
            res.json({ admin: isAdmin })
        })



        //POST API

        //POST PRODUCTS
        app.post('/products', async (req, res) => {
            const product = req.body
            const result = await productCollection.insertOne(product);
            res.json(result)
        })

        //POST ORDERS
        app.post('/orders', async (req, res) => {
            const order = req.body
            const result = await orderCollection.insertOne(order);
            res.json(result)
        })

        //POST REVIEWS
        app.post('/reviews', async (req, res) => {
            const review = req.body
            const result = await reviewCollection.insertOne(review);
            res.json(result)
        })

        //POST USERS
        app.post('/users', async (req, res) => {
            const user = req.body
            const result = await userCollection.insertOne(user);
            res.json(result)
        })




        //UPDATE API
        //UPDATE ORDERS
        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id;
            console.log(req.body);
            const options = { upsert: true };
            const filter = { _id: ObjectId(id) };
            const updateDoc = {
                $set: {
                    status: "Shipped"
                },
            };
            const result = await orderCollection.updateOne(filter, updateDoc, options)
            res.json(result)
        })


        //UPDATE ADMIN
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email }
            const updateDoc = { $set: { role: 'admin' } }
            const result = await userCollection.updateOne(filter, updateDoc)
            res.json(result)

        })



        //DELETE API

        //DELETE PRODUCTS
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.deleteOne(query);
            res.json(result)
        })

        //DELETE ORDERS
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.json(result)
        })

    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log('port', port)
})


