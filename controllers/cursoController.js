const db = require('../config/db')

exports.crearCurso = async (req, res) => {
  const {curso, fecha_inicio, fecha_fin, duracion_horas, precio, subcategoria_id, docente_id} = req.body

  if (!curso || !fecha_inicio || !fecha_fin || !duracion_horas || !precio || subcategoria_id == undefined || docente_id == undefined){
    return res.status(400).json({mensaje: 'Falta completar los campos obligatorios'})
  }

  const sql = "INSERT INTO curso (curso, fecha_inicio, fecha_fin, duracion_horas, precio, subcategoria_id, docente_id) VALUES (?,?,?,?,?,?,?)"

  try{
    const [result] = await db.query(sql, [curso, fecha_inicio, fecha_fin, duracion_horas, precio, subcategoria_id, docente_id])

    res.status(201).json({
      id: result.insertId,
      mensaje: 'Curso registrado correctamente'
    })
  }catch(e){
    console.error(e)
    res.status(500).json({mensaje: 'Error interno del servidor'})
  }
}

exports.obtenerCursos = async (req, res) => {
  const sql = "SELECT * FROM vista_cursos ORDER BY id DESC"

  try{
    const [cursos] = await db.query(sql)
    res.status(200).json(cursos)
  }catch(e){
    console.error(e)
    res.status(500).json({mensaje: 'Error interno del servidor'})
  }
}

exports.obtenerCursoPorId = async (req, res) => {
  const { id } = req.params
  const sql = "SELECT * FROM vista_cursos WHERE id = ?"

  try{
    const [cursos] = await db.query(sql, [id])

    if (cursos.length === 0){
      return res.status(404).json({mensaje: 'No encontramos el curso'})
    }

    res.status(200).json(cursos[0])
  }catch(e){
    console.error(e)
    res.status(500).json({mensaje: 'Error interno del servidor'})
  }
}

exports.actualizarCurso = async (req, res) => {
  const { id } = req.params
  const { curso, fecha_inicio, fecha_fin, duracion_horas, precio, subcategoria_id, docente_id } = req.body

  if (!curso || !fecha_inicio || !fecha_fin || !duracion_horas || !precio || subcategoria_id == undefined || docente_id == undefined){
    return res.status(400).json({mensaje: 'Debe ingresar los campos obligatorios'})
  }

  const sql = "UPDATE curso SET curso = ?, fecha_inicio = ?, fecha_fin = ?, duracion_horas = ?, precio = ?, subcategoria_id = ?, docente_id = ? WHERE id = ?"

  try{
    const [result] = await db.query(sql, [curso, fecha_inicio, fecha_fin, duracion_horas, precio, subcategoria_id, docente_id, id])

    if (result.affectedRows === 0){
      return res.status(404).json({mensaje: 'No encontramos el curso con ese ID'})
    }

    res.status(200).json({mensaje: 'Curso actualizado correctamente'})
  }catch(e){
    console.error(e)
    res.status(500).json({mensaje: 'Error interno del servidor'})
  }
}

exports.eliminarCurso = async (req, res) => {
  const { id } = req.params
  const sql = "DELETE FROM curso WHERE id = ?"

  try{
    const [result] = await db.query(sql, [id])

    if (result.affectedRows === 0){
      return res.status(404).json({mensaje: 'Curso no encontrado para eliminar'})
    }

    res.status(200).json({mensaje: 'Curso eliminado correctamente'})
  }catch(e){
    console.error(e)
    res.status(500).json({mensaje: 'Error interno del servidor'})
  }
}

exports.obtenerCategorias = async (req, res) => {
  const sql = "SELECT id, nombre FROM categoria ORDER BY nombre"

  try{
    const [categorias] = await db.query(sql)
    res.status(200).json(categorias)
  }catch(e){
    console.error(e)
    res.status(500).json({mensaje: 'Error interno del servidor'})
  }
}

exports.obtenerSubcategorias = async (req, res) => {
  const sql = "SELECT id, nombre, categoria_id FROM subcategoria ORDER BY nombre"

  try{
    const [subcategorias] = await db.query(sql)
    res.status(200).json(subcategorias)
  }catch(e){
    console.error(e)
    res.status(500).json({mensaje: 'Error interno del servidor'})
  }
}

exports.obtenerDocentes = async (req, res) => {
  const sql = "SELECT id, nombre, apellido, email FROM docente ORDER BY apellido, nombre"

  try{
    const [docentes] = await db.query(sql)
    res.status(200).json(docentes)
  }catch(e){
    console.error(e)
    res.status(500).json({mensaje: 'Error interno del servidor'})
  }
}