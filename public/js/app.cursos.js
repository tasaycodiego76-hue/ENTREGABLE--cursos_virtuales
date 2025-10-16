const API_URL = 'http://localhost:3000/api/cursos'

const formulario = document.getElementById('form-curso')
const tabla = document.querySelector('#tabla-cursos tbody')

const idcurso = document.getElementById('idcurso')
const categoria_id = document.getElementById('categoria_id')
const subcategoria_id = document.getElementById('subcategoria_id')
const curso = document.getElementById('curso')
const docente_id = document.getElementById('docente_id')
const titulo = document.getElementById('titulo')
const descripcion = document.getElementById('descripcion')
const fecha_inicio = document.getElementById('fecha_inicio')
const fecha_fin = document.getElementById('fecha_fin')
const duracion_horas = document.getElementById('duracion_horas')
const precio = document.getElementById('precio')

const btnGuardar = document.getElementById('btnGuardar')
const btnCancelar = document.getElementById('btnCancelar')

let todasSubcategorias = []

btnCancelar.addEventListener('click', () => {
  btnGuardar.innerText = 'Guardar'
  resetearFormulario()
})

async function cargarCategorias() {
  try {
    const response = await fetch('http://localhost:3000/api/cursos/categorias/listar')
    const categorias = await response.json()
    
    categorias.forEach(cat => {
      const option = document.createElement('option')
      option.value = cat.id
      option.textContent = cat.nombre
      categoria_id.appendChild(option)
    })
  } catch (error) {
    console.error('Error al cargar categorías:', error)
  }
}

categoria_id.addEventListener('change', async (e) => {
  const categoriaId = e.target.value
  subcategoria_id.innerHTML = '<option value="">Seleccione</option>'
  
  subcategoria_id.disabled = true
  curso.disabled = true
  titulo.disabled = true
  descripcion.disabled = true
  fecha_inicio.disabled = true
  fecha_fin.disabled = true
  duracion_horas.disabled = true
  precio.disabled = true
  docente_id.disabled = true
  btnGuardar.disabled = true
  
  if (!categoriaId) return

  try {
    const response = await fetch('http://localhost:3000/api/cursos/subcategorias/listar')
    todasSubcategorias = await response.json()
    
    const subcategoriasFiltradas = todasSubcategorias.filter(
      sub => sub.categoria_id == categoriaId
    )

    subcategoriasFiltradas.forEach(sub => {
      const option = document.createElement('option')
      option.value = sub.id
      option.textContent = sub.nombre
      subcategoria_id.appendChild(option)
    })

    subcategoria_id.disabled = false
  } catch (error) {
    console.error('Error al cargar subcategorías:', error)
  }
})

subcategoria_id.addEventListener('change', (e) => {
  const subcategoriaId = e.target.value
  curso.disabled = !subcategoriaId
})

curso.addEventListener('input', (e) => {
  const tieneCurso = e.target.value.trim().length >= 3
  
  titulo.disabled = !tieneCurso
  descripcion.disabled = !tieneCurso
  fecha_inicio.disabled = !tieneCurso
  fecha_fin.disabled = !tieneCurso
  duracion_horas.disabled = !tieneCurso
  precio.disabled = !tieneCurso
  docente_id.disabled = !tieneCurso
  btnGuardar.disabled = !tieneCurso
})

async function cargarDocentes() {
  try {
    const response = await fetch('http://localhost:3000/api/cursos/docentes/listar')
    const docentes = await response.json()
    
    docentes.forEach(doc => {
      const option = document.createElement('option')
      option.value = doc.id
      option.textContent = `${doc.nombre} ${doc.apellido}`
      docente_id.appendChild(option)
    })
  } catch (error) {
    console.error('Error al cargar docentes:', error)
  }
}

async function obtenerCursos() {
  const response = await fetch(API_URL, { method: 'get' })
  const cursos = await response.json()

  tabla.innerHTML = ''
  
  cursos.forEach(cursoItem => {
    const row = tabla.insertRow()

    row.insertCell().textContent = cursoItem.id
    row.insertCell().textContent = cursoItem.curso
    row.insertCell().textContent = cursoItem.titulo
    row.insertCell().textContent = cursoItem.categoria
    row.insertCell().textContent = cursoItem.subcategoria
    row.insertCell().textContent = cursoItem.fecha_inicio
    row.insertCell().textContent = cursoItem.fecha_fin
    row.insertCell().textContent = cursoItem.duracion_horas + ' hrs'
    row.insertCell().textContent = 'S/ ' + cursoItem.precio
    row.insertCell().textContent = cursoItem.docente
    
    const actionCell = row.insertCell()

    const editButton = document.createElement('button')
    editButton.textContent = 'Editar'
    editButton.classList.add('btn', 'btn-warning', 'btn-sm')
    editButton.onclick = () => cargarParaEdicion(cursoItem)

    const deleteButton = document.createElement('button')
    deleteButton.textContent = 'Eliminar'
    deleteButton.classList.add('btn', 'btn-danger', 'btn-sm')
    deleteButton.onclick = () => eliminarCurso(cursoItem.id, cursoItem.titulo)

    actionCell.appendChild(editButton)
    actionCell.appendChild(deleteButton)
  })
}

async function eliminarCurso(id, tituloCurso) {
  if (confirm(`¿Está seguro de eliminar el curso: ${tituloCurso}?`)) { 
    try {
      const response = await fetch(API_URL + `/${id}`, { method: 'delete' })
      
      if (!response.ok) {
        throw new Error(`Error al eliminar: ${tituloCurso}`)
      }

      const result = await response.json()
      console.log(result)
      alert(result.mensaje)
      obtenerCursos()

    } catch(e) {
      console.error(e)
    }
  }
}

async function cargarParaEdicion(cursoItem) {
  idcurso.value = cursoItem.id

  const responseSubcat = await fetch('http://localhost:3000/api/cursos/subcategorias/listar')
  todasSubcategorias = await responseSubcat.json()
  const subcategoria = todasSubcategorias.find(s => s.id == cursoItem.subcategoria_id)
  
  if (subcategoria) {
    categoria_id.value = subcategoria.categoria_id
    categoria_id.dispatchEvent(new Event('change'))
    
    setTimeout(() => {
      subcategoria_id.value = cursoItem.subcategoria_id
      subcategoria_id.dispatchEvent(new Event('change'))
      
      curso.value = cursoItem.curso
      curso.dispatchEvent(new Event('input'))
      
      titulo.value = cursoItem.titulo
      descripcion.value = cursoItem.descripcion
      fecha_inicio.value = cursoItem.fecha_inicio
      fecha_fin.value = cursoItem.fecha_fin
      duracion_horas.value = cursoItem.duracion_horas
      precio.value = cursoItem.precio
      docente_id.value = cursoItem.docente_id
    }, 100)
  }

  btnGuardar.innerText = 'Actualizar'
}

formulario.addEventListener('submit', async (event) => {
  event.preventDefault()

  const data = {
    curso: curso.value,
    titulo: titulo.value,
    descripcion: descripcion.value,
    fecha_inicio: fecha_inicio.value,
    fecha_fin: fecha_fin.value,
    duracion_horas: parseInt(duracion_horas.value),
    precio: parseFloat(precio.value),
    subcategoria_id: parseInt(subcategoria_id.value),
    docente_id: parseInt(docente_id.value)
  }

  try {
    let response = null

    if (idcurso.value === '') {
      response = await fetch(API_URL, { 
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
    } else {
      response = await fetch(API_URL + `/${idcurso.value}`, { 
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
    }
    
    const result = await response.json()
    console.log(result)
    alert(result.mensaje)
    btnGuardar.innerText = 'Guardar'
    formulario.reset()
    resetearFormulario()
    obtenerCursos()
  } catch(e) {
    console.error(e)
    alert('Error al procesar la solicitud')
  }
})

function resetearFormulario() {
  subcategoria_id.disabled = true
  curso.disabled = true
  titulo.disabled = true
  descripcion.disabled = true
  fecha_inicio.disabled = true
  fecha_fin.disabled = true
  duracion_horas.disabled = true
  precio.disabled = true
  docente_id.disabled = true
  btnGuardar.disabled = true
}

document.addEventListener('DOMContentLoaded', () => {
  cargarCategorias()
  cargarDocentes()
  obtenerCursos()
})