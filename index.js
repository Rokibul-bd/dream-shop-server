const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000


// Midlleware
app.use(cors())
app.use(express())

app.get('/', (req, res) => {
    res.send('Your server is Running')
})

// database 




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.0mrh6im.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const servicesCollections = client.db('dreamShop').collection('services');

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
            const result = await servicesCollections.find(query).toArray()
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