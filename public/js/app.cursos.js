document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "http://localhost:3000/api/cursos"
  const form = document.querySelector("#form-curso")
  const tablaCursos = document.querySelector("#tabla-cursos tbody")
  const btnCancelar = document.querySelector("#btnCancelar")
  const btnGuardar = document.querySelector("#btnGuardar")
  
  const selectCategoria = document.querySelector("#categoria_id")
  const selectSubcategoria = document.querySelector("#subcategoria_id")
  const inputCurso = document.querySelector("#curso")
  const selectDocente = document.querySelector("#docente_id")
  const inputTitulo = document.querySelector("#titulo")
  const inputDescripcion = document.querySelector("#descripcion")
  const inputFechaInicio = document.querySelector("#fecha_inicio")
  const inputFechaFin = document.querySelector("#fecha_fin")
  const inputDuracion = document.querySelector("#duracion_horas")
  const inputPrecio = document.querySelector("#precio")

  let editando = false
  let todasSubcategorias = []

  cargarCategorias()
  cargarDocentes()
  listarCursos()

  async function cargarCategorias() {
    try {
      const response = await fetch("http://localhost:3000/api/categorias")
      const categorias = await response.json()
      
      categorias.forEach(cat => {
        const option = document.createElement("option")
        option.value = cat.id
        option.textContent = cat.nombre
        selectCategoria.appendChild(option)
      })
    } catch (error) {
      console.error("Error al cargar categorías:", error)
    }
  }

  selectCategoria.addEventListener("change", async (e) => {
    const categoriaId = e.target.value
    selectSubcategoria.innerHTML = '<option value="">Seleccione</option>'
    
    selectSubcategoria.disabled = true
    inputCurso.disabled = true
    inputTitulo.disabled = true
    inputDescripcion.disabled = true
    inputFechaInicio.disabled = true
    inputFechaFin.disabled = true
    inputDuracion.disabled = true
    inputPrecio.disabled = true
    selectDocente.disabled = true
    btnGuardar.disabled = true
    
    if (!categoriaId) return

    try {
      const response = await fetch("http://localhost:3000/api/subcategorias")
      todasSubcategorias = await response.json()
      
      const subcategoriasFiltradas = todasSubcategorias.filter(
        sub => sub.categoria_id == categoriaId
      )

      subcategoriasFiltradas.forEach(sub => {
        const option = document.createElement("option")
        option.value = sub.id
        option.textContent = sub.nombre
        selectSubcategoria.appendChild(option)
      })

      selectSubcategoria.disabled = false
    } catch (error) {
      console.error("Error al cargar subcategorías:", error)
    }
  })

  selectSubcategoria.addEventListener("change", (e) => {
    const subcategoriaId = e.target.value
    
    inputCurso.disabled = !subcategoriaId
    
    if (subcategoriaId) {
      inputCurso.focus()
    }
  })

  inputCurso.addEventListener("input", (e) => {
    const tieneCurso = e.target.value.trim().length >= 3
    
    inputTitulo.disabled = !tieneCurso
    inputDescripcion.disabled = !tieneCurso
    inputFechaInicio.disabled = !tieneCurso
    inputFechaFin.disabled = !tieneCurso
    inputDuracion.disabled = !tieneCurso
    inputPrecio.disabled = !tieneCurso
    selectDocente.disabled = !tieneCurso
    btnGuardar.disabled = !tieneCurso
    
    if (tieneCurso) {
      inputTitulo.focus()
    }
  })

  async function cargarDocentes() {
    try {
      const response = await fetch("http://localhost:3000/api/docentes")
      const docentes = await response.json()
      
      docentes.forEach(doc => {
        const option = document.createElement("option")
        option.value = doc.id
        option.textContent = `${doc.nombre} ${doc.apellido}`
        selectDocente.appendChild(option)
      })
    } catch (error) {
      console.error("Error al cargar docentes:", error)
    }
  }

  async function listarCursos() {
    try {
      const response = await fetch(API_URL)
      const cursos = await response.json()

      tablaCursos.innerHTML = ""

      cursos.forEach((curso) => {
        const fila = document.createElement("tr")
        fila.innerHTML = `
          <td>${curso.id}</td>
          <td>${curso.curso}</td>
          <td>${curso.titulo}</td>
          <td>${curso.categoria}</td>
          <td>${curso.subcategoria}</td>
          <td>${curso.fecha_inicio}</td>
          <td>${curso.fecha_fin}</td>
          <td>${curso.duracion_horas} hrs</td>
          <td>S/ ${curso.precio}</td>
          <td>${curso.docente}</td>
          <td>
            <button class="btn btn-sm btn-warning" onclick="editarCurso(${curso.id})">Editar</button>
            <button class="btn btn-sm btn-danger" onclick="eliminarCurso(${curso.id})">Eliminar</button>
          </td>
        `
        tablaCursos.appendChild(fila)
      })
    } catch (error) {
      console.error("Error al listar cursos:", error)
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault()

    const datos = {
      curso: inputCurso.value,
      titulo: inputTitulo.value,
      descripcion: inputDescripcion.value,
      fecha_inicio: inputFechaInicio.value,
      fecha_fin: inputFechaFin.value,
      duracion_horas: inputDuracion.value,
      precio: inputPrecio.value,
      subcategoria_id: selectSubcategoria.value,
      docente_id: selectDocente.value
    }

    try {
      let response

      if (editando) {
        const id = document.querySelector("#idcurso").value
        response = await fetch(`${API_URL}/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datos)
        })
      } else {
        response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datos)
        })
      }

      const resultado = await response.json()

      if (response.ok) {
        alert(resultado.mensaje)
        resetearFormulario()
        listarCursos()
      } else {
        alert(resultado.mensaje)
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error al procesar la solicitud")
    }
  })

  btnCancelar.addEventListener("click", () => {
    resetearFormulario()
  })

  function resetearFormulario() {
    form.reset()
    editando = false
    document.querySelector("#idcurso").value = ""
    
    selectSubcategoria.disabled = true
    inputCurso.disabled = true
    inputTitulo.disabled = true
    inputDescripcion.disabled = true
    inputFechaInicio.disabled = true
    inputFechaFin.disabled = true
    inputDuracion.disabled = true
    inputPrecio.disabled = true
    selectDocente.disabled = true
    btnGuardar.disabled = true
  }

  window.editarCurso = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`)
      const curso = await response.json()

      document.querySelector("#idcurso").value = curso.id

      const responseSubcat = await fetch("http://localhost:3000/api/subcategorias")
      todasSubcategorias = await responseSubcat.json()
      const subcategoria = todasSubcategorias.find(s => s.id == curso.subcategoria_id)
      
      if (subcategoria) {
        selectCategoria.value = subcategoria.categoria_id
        selectCategoria.dispatchEvent(new Event('change'))
        
        setTimeout(() => {
          selectSubcategoria.value = curso.subcategoria_id
          selectSubcategoria.dispatchEvent(new Event('change'))
          
          inputCurso.value = curso.curso
          inputCurso.dispatchEvent(new Event('input'))
          
          inputTitulo.value = curso.titulo
          inputDescripcion.value = curso.descripcion
          inputFechaInicio.value = curso.fecha_inicio
          inputFechaFin.value = curso.fecha_fin
          inputDuracion.value = curso.duracion_horas
          inputPrecio.value = curso.precio
          selectDocente.value = curso.docente_id
        }, 100)
      }

      editando = true
    } catch (error) {
      console.error("Error al editar:", error)
    }
  }

  window.eliminarCurso = async (id) => {
    if (!confirm("¿Está seguro de eliminar este curso?")) return

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
      })

      const resultado = await response.json()

      if (response.ok) {
        alert(resultado.mensaje)
        listarCursos()
      } else {
        alert(resultado.mensaje)
      }
    } catch (error) {
      console.error("Error al eliminar:", error)
    }
  }
})