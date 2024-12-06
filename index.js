const express = require('express');
const cors = require('cors');
require('dotenv').config();
// form mongodb
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// mongodb code
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jx9i0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri)
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const coffeeCollection = client.db('equipmentsDB').collection('equipments');

        //post data in to mongodb
        app.post('/equipments', async (req, res) => {
            const newAddedEquipment = req.body;
            console.log(newAddedEquipment)
            const result = await coffeeCollection.insertOne(newAddedEquipment);
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        //await client.close();
    }
}
run().catch(console.dir);
// mongodb code

app.get('/', (req, res) => {
    res.send('Sports Equipments server is running');
})

app.listen(port, () => {
    console.log(`Sports Equipments server is running on port: ${port}`);
})