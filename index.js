const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const cors = require('cors');
//genarate unique key
// const { uuid } = require("uuid")
const app = express()
const port = process.env.PORT || 5000


// Midlleware
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Your server is Running')
})

// database 




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.0mrh6im.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const servicesCollections = client.db('dreamShop').collection('services');
const cartsCollections = client.db('dreamShop').collection('cart')
const blogsCollections = client.db('dreamShop').collection('blogs')
const usersCollections = client.db('dreamShop').collection('users')
const bookingsCollections = client.db('dreamShop').collection('bookings')
const sellesStepsCollections = client.db('dreamShop').collection('sellesSteps')
async function run() {
    try {
        app.get('/services', async (req, res) => {
            const query = {}
            const result = await servicesCollections.find(query).toArray();
            res.send(result)
        })
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const products = await servicesCollections.find(query).toArray()
            res.send(products)
        })
        app.post('/cart', async (req, res) => {
            const cart = req.body
            console.log(req.body)
            const result = await cartsCollections.insertOne(cart);
            res.send(result)
        })
        // sellesSteps get route 
        app.get('/sellessteps', async (req, res) => {
            const query = {}
            const sellesSteps = await sellesStepsCollections.find(query).toArray()
            res.send(sellesSteps)
        })

        app.get('/cart', async (req, res) => {
            const email = req.query.email
            let query = {}
            if (email) {
                query = {
                    email: email
                }
            }
            const result = await cartsCollections.find(query).toArray()
            res.send(result)
        })
        app.delete('/cart/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await cartsCollections.deleteOne(query)
            res.send(result)
        })
        app.get('/blogs', async (req, res) => {
            const query = {}
            const result = await blogsCollections.find(query).toArray()
            res.send(result)
        })
        app.post('/users', async (req, res) => {
            const user = req.body
            const result = await usersCollections.insertOne(user);
            res.send(result);
        })
        app.get('/users', async (req, res) => {
            const query = { seller: 'user' } // shoud be role user
            const result = await usersCollections.find(query).toArray()
            res.send(result)
        })
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await usersCollections.deleteOne(query);
            res.send(result)
        })
        // admin route 
        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const user = await usersCollections.findOne(query);
            res.send({ isAdmin: user?.role === 'admin' })

        })
        // seller route get by email
        app.get('/users/seller/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const user = await usersCollections.findOne(query);
            res.send({ isSeller: user?.seller === 'seller' })
        })
        app.post('/booking', async (req, res) => {
            const booking = req.body;
            const result = await bookingsCollections.insertOne(booking);
            res.send(result)
        })
        app.get('/booking', async (req, res) => {
            const email = req.query.email
            let query = {}
            if (email) {
                query = {
                    email: email
                }
            }
            const booking = await bookingsCollections.find(query).toArray();
            res.send(booking)
        })
        app.delete('/booking/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await bookingsCollections.deleteOne(query);
            res.send(result)
        })

        // get all seller 
        app.get('/sellers', async (req, res) => {
            const query = { seller: 'seller' }
            const sellers = await usersCollections.find(query).toArray()
            res.send(sellers)
        })

        //seller verify route 
        app.put('/seller/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: ObjectId(id) }
            const options = { upset: true }
            const updateDoc = {
                $set: {
                    stutas: true,
                }

            }
            const result = await usersCollections.updateOne(filter, updateDoc, options)
            res.send(result)
        })

        // seller verifyed update 
        app.get('/sellers/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const seller = await usersCollections.find(query).toArray()
            res.send(seller)
        })

        // sellers delete 
        app.delete('/sellers/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await usersCollections.deleteOne(query)
            res.send(result)
        })

        // add product *****
        app.put('/services/:catagoray', async (req, res) => {
            const service = req.body
            const catagoray = req.params.catagoray
            const filter = { catagoray: catagoray }
            const options = { upset: true }
            const updateDoc = {
                $push: {
                    service: service,
                }

            }
            const result = await servicesCollections.updateOne(filter, updateDoc, options)
            res.send(result)
        })

    }
    finally {

    }

}


run().catch(err => console.error(err))

// client.connect(err => {
//     const collection = client.db("test").collection("devices");
//     // perform actions on the collection object
//     client.close();
// });





app.listen(port, () => {
    console.log(`your server running on port ${port}`)
})