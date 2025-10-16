const express = require('express')
const router = express.Router()
const cursoController = require('../controllers/cursoController')

// Rutas para CRUD de cursos
router.post('/', cursoController.crearCurso)
router.get('/', cursoController.obtenerCursos)
router.get('/:id', cursoController.obtenerCursoPorId)
router.put('/:id', cursoController.actualizarCurso)
router.delete('/:id', cursoController.eliminarCurso)

// Rutas para obtener datos de dropdowns
router.get('/categorias/listar', cursoController.obtenerCategorias)
router.get('/subcategorias/listar', cursoController.obtenerSubcategorias)
router.get('/docentes/listar', cursoController.obtenerDocentes)

module.exports = router 