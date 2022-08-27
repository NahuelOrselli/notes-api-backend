const express = require('express')
const cors = require('cors')



const app =  express()
const logger = require('./requests/loggerMiddleware')

app.use(cors())
//CORS es un middleware que lo que hace por defecto es que cualquier origen funcione en nuestra api

//La app tiene que usar el modulo express .json, 
// por lo tanto soporta las request que se le pasan aun objeto y lo parsea
// para tenerlo disponible en el request.body
// en veriosnes mas viejas hay que usar 'json body parser' npm install body-parser > const bodyParser = require('body-parser')

app.use(express.json())

app.use(logger)

// Un Middleware

// app.use((request,response,next)=>{
//   console.log(request.method)
//   console.log(request.path)
//   console.log(request.body)
//   console.log('---------')
//   next()
// })

// http para el servidor de Node
// const http = require('http')

let notes = [
  {
    id:1,
    content: 'HTML is easy',
    date: '2019-05-30T17:30:31.098Z',
    important: true,
    categories: ['sports','musical']
  },
  {
    id:2,
    content: 'Browser can execute only JavaScript',
    date: '2019-05-30T18:39:34.091Z',
    important: false
  },
  {
    id:3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    date: '2019-05-30T19:20:14.298Z',
    important: true,
    categories: ['action','food']
  }
]

// servidor con Node
// const app = http.createServer((request,response) => {
//     response.writeHead(200, {'Content-Type': 'application/json'})
//     response.end(JSON.stringify(notes))
// })

app.get('/', (request,response)=>{
  response.send('<h1>Hello World</h1>')
})

app.get('/api/notes', (request,response)=>{
  response.json(notes)
})

//Devolver una nota especifica, obteniendo un dato dinamico (id) de la URL 
app.get('/api/notes/:id', (request,response)=>{
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)

  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

// Hacer un POST

app.post('/api/notes', (request,response) =>{
  const note = request.body

  if(!note || !note.content){
    return response.status(400).json({
      error: 'note.content is missing'
    })
  }

  const ids = notes.map(note => note.id)
  const maxId = Math.max(...ids)

  const newNote = {
    id: maxId + 1,
    content: note.content,
    important: typeof note.important !== 'undefined' ? note.important : false,
    date: new Date().toISOString()
  }

  notes = [...notes, newNote]

  response.status(201).json(newNote)
})




// Eliminar nota
app.delete('/api/notes/:id', (request,response)=>{
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)
  response.status(204).end()
})


const PORT = process.env.PORT || 3001

// Levantar servidor en Express
app.listen(PORT,()=>{
  console.log(`Server running on port ${PORT}`)
})



// Levantar servidor de Node
// app.listen(PORT)
// console.log(`Server running on port ${PORT}`)