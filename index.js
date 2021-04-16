const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.k1cqz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express()

app.use(express.json());
app.use(cors());
app.use(express.static('services'));
app.use(fileUpload());

const port = 5000;

app.get('/', (req, res) => {
    res.send("hello from db it's working working")
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const bookingCollection = client.db("powerGym").collection("booking");
  // perform actions on the collection object
//   client.close();

app.post('/addBooking', (req, res) => {
    const booking = req.body;
    // console.log(appointment)
    bookingCollection.insertOne(booking)
    .then(result => {
        res.send(result.insertCount > 0)
    })
});

app.get('/bookings', (req, res) => {
    bookingCollection.find({})
    .toArray((err, documents) => {
        res.send(documents)
    })
})

app.post('/bookingsByDate', (req, res) => {
    const date = req.body;
    console.log(date.date)
    bookingCollection.find({date: date.date})
    .toArray((err, documents) => {
        res.send(documents);
    })
})


app.post('./addAService', (req, res) => {
    const file = req.file.file;
    const name = req.files.name;
    const description = req.body.description;
    console.log(name, description, file)
})

});

app.listen(process.env.PORT || port)