const express = require('express')
const { MongoClient } = require ('mongodb')

const app = express()
app.use(express.json())
const { ObjectId } = require('mongodb');
const PORT = process.env.PORT || 8080;
const HOST = "0.0.0.0";
let dbConnection

MongoClient.connect('mongodb://mongo:27017/bookstore')
    .then((client) => {
        dbConnection = client.db()
        app.listen(PORT, HOST, () => {
            console.log(`App listening on port ${PORT}`)
        })
    })
    .catch((err) => {
        console.log(err)
    })

//Read
app.get('/books', (req, res) => {
    let books = []
    dbConnection.collection('books')
        .find()
        .sort({ author: 1 })
        .forEach(book => books.push(book))
        .then(() => {
            res.status(200).json(books)
        })
        .catch(() => {
            res.status(500).json({ error: 'Could not found the documents' })
        })
})

//Create
app.post('/books', (req,res)=> {
    const book = req.body

    dbConnection.collection('books')
     .insertOne(book)
     .then(result => {
        res.status(201).json(result)
     })
     .catch(err => {
        res.status(500).json({err:'Could not create a new document'
        })
     })

})

app.delete('/books', (req, res) => {
    dbConnection.collection('books')
      .deleteMany({})
      .then(result => {
        res.status(200).json(result)
      })
      .catch(err => {
        res.status(500).json({ error: 'Could not delete documents' })
      })
  })

app.put('/books/:id', (req, res) => {
    const bookId = req.params.id;
    const updatedBook = req.body;
  
    dbConnection.collection('books')
      .findOneAndUpdate(
        { _id: ObjectId(bookId) },
        { $set: updatedBook },
        { returnOriginal: false }
      )
      .then(result => {
        res.status(200).json(result.value);
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({ error: 'Could not update the book' });
      });
  });
  


  










