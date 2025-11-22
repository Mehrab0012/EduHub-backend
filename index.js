
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

//middleware

app.use(cors());
app.use(express.json())


//firebase Admin

const admin = require("firebase-admin");

const serviceAccount = require("./serviceKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});


const uri = "mongodb+srv://EduHub:3srD59nJyZPIMUcA@cluster0.pvnuook.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

//middleware
const middleware = async (req, res, next) => {
    const authorization = req.headers.authorization;


    if(!authorization){
        return res.status(401).send({
            message: "Unauthorized access."
        })
    }
    const token = authorization.split(' ')[1]
    try {
        await admin.auth().verifyIdToken(token);
        next();
    }
    catch(error){
        res.status(401).send({
            message: "Unauthorized access."
        })
    }
        

}

async function run() {
    try {

        await client.connect().then(async () => {


            app.get('/', (req, res) => {
                res.send('running')
            })

            app.listen(port, () => {
                console.log(`Server is running on http://localhost:${port}`);
            })
        })

        const db = client.db('EduHub');
        const courses = await db.collection('courses');
        const enrolledCollection = await db.collection('enrolled');

        app.get('/enrolled', async (req, res) => {
            const email = req.query.email;
            const query = {};
            if (email) {
                query.email = email;
            }
            const result = await enrolledCollection.find(query).toArray();
            res.send(result)
        })

        app.get('/courses', async (req, res) => {
            const email = req.query.email;
            const query = {};
            if (email) {
                query.email = email;
            }
            const result = await courses.find(query).toArray();
            res.send(result);
        })
        app.get('/courses/:id', middleware, async (req, res) => {
            const { id } = req.params


            const result = await courses.findOne({ _id: new ObjectId(id) })
            res.send({
                success: true,
                result
            })
        })


        app.post('/courses', async (req, res) => {
            const newCourse = req.body;
            const result = courses.insertOne(newCourse);
            res.send(result);
        })

        //update method
        app.put('/courses/:id', async (req, res) => {
            try {
                const { id } = req.params;
                const data = req.body;

                const objectId = new ObjectId(id);

                const result = await courses.updateOne(
                    { _id: objectId },
                    { $set: data }
                );

                res.send({
                    success: true,
                    result
                });

            } catch (error) {
                console.log(error);
                res.status(500).send({ success: false, error });
            }
        });

        app.delete('/courses/:id', async (req, res) => {
            const { id } = req.params
            const objectId = new ObjectId(id)
            const filter = { _id: objectId }

            const result = await courses.deleteOne(filter)

            res.send({
                success: true,
                result
            })
        })

        app.get('/latest-courses', async (req, res) => {
            const result = await courses.find().sort({ date: 'desc' })
                .limit(6).toArray()

            res.send(result)
        })

        // enrolled course system
        app.post('/enrolled', async(req, res)=>{
            const data = req.body;
            const result = await enrolledCollection.insertOne(data)
            res.send(result);
        })



    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
}
run().catch(console.dir);



