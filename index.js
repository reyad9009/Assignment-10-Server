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

        const EquipmentCollection = client.db('equipmentsDB').collection('equipments');

        //post data in mongodb
        app.post('/equipments', async (req, res) => {
            const newAddedEquipment = req.body;
            console.log(newAddedEquipment)
            const result = await EquipmentCollection.insertOne(newAddedEquipment);
            res.send(result);
        })

        //get data from mongodb
        app.get('/equipments', async (req, res) => {
            const cursor = EquipmentCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        //get all data by id from mongodb
        app.get('/all-sports-equipments/details/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await EquipmentCollection.findOne(query);
            res.send(result);
        })

        /**********  this task for only logged user  **************************/

        // Get equipment data by logged-in user's email
        app.get('/my-equipments/:email', async (req, res) => {
            const email = req.params.email;
            const filter = { email: email };
            const result = await EquipmentCollection.find(filter).toArray();
            res.send(result)
        });

        //Get equipment for update data by logged-in user's email
        app.get('/my-equipments/update/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await EquipmentCollection.findOne(query);
            res.send(result);
        })

        // update equipment by logged-in user only her equipment
        app.put('/my-equipments/update/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedEquipment = req.body; // Corrected from res.body to req.body
            const equipment = {
                $set: {
                    image: updatedEquipment.image,
                    itemName: updatedEquipment.itemName,
                    categoryName: updatedEquipment.categoryName,
                    description: updatedEquipment.description,
                    price: updatedEquipment.price,
                    rating: updatedEquipment.rating,
                    customization: updatedEquipment.customization,
                    processingTime: updatedEquipment.processingTime,
                    stockStatus: updatedEquipment.stockStatus,
                    email: updatedEquipment.email,
                    name: updatedEquipment.name
                },
            };
            const result = await EquipmentCollection.updateOne(filter, equipment, options);
            res.send(result);
        });










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





// _id: ObjectId('67538476e7c808f5ca22bb29')
// image: "https://example.com/images/table-tennis-paddle.jpg",
// itemName: "Table Tennis Paddle",
// categoryName: "Table Tennis",
// description: "Ergonomic paddle with high-speed rubber.",
// price: "1000",
// rating: "4.4",
// customization: "Handle wrap",
// processingTime: "2-3 days",
// stockStatus: "40"
// userEmail: "tarekhossen105@gmail.com"
// userName: "Tarek Rahman"

// _id: ObjectId('67538476e7c808f5ca26562bb29')
// image: "https://example.com/images/table-tennis-paddle2.jpg",
// itemName: "Table Tennis Paddle",
// categoryName: "Table Tennis",
// description: "Ergonomic paddle with high-speed rubber.",
// price: "1000",
// rating: "4.4",
// customization: "Handle wrap",
// processingTime: "2-3 days",
// stockStatus: "80"
// userEmail: "reyad900@gmail.com"
// userName: "Reyad"
