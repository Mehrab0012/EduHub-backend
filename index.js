
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

//middleware

app.use(cors());
app.use(express.json())


const uri = "mongodb+srv://EduHub:3srD59nJyZPIMUcA@cluster0.pvnuook.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

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
        
        app.get('/courses', async (req, res) => {

            const newCourses = req.body;
            const result = await courses.find(newCourses).toArray();
            res.send(result);
        })
        app.get('/courses/:id', async(req,res)=>{
            const {id} = req.params
            console.log(id)

            const result = await courses.findOne({_id: new ObjectId(id)})
            res.send({
                success: true,
                result
            })
        })

        app.post('/courses' , async(req, res)=>{
            const newCourse = req.body;
            const result = courses.insertOne(newCourse);
            res.send(result);
        })


    } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}
run().catch(console.dir);



