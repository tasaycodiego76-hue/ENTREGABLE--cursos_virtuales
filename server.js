const express = require('express')
const cors = require('cors')
const path = require('path')

const cursoRoutes = require('./routes/cursoRoutes')

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
}))

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
  res.redirect('/cursos.html')
})

app.use(express.json())

app.use('/api/cursos', cursoRoutes)

app.listen(PORT, () => {
  console.log(`Servidor iniciado http://localhost:${PORT}`)
})