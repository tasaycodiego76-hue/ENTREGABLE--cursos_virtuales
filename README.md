# Procedimientos 
1. Clonar el repositorio
git clone https://...
2. 📚 Restaurar la BD
```sql
CREATE DATABASE cursos_virtuales;
USE cursos_virtuales;

CREATE TABLE categoria (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE subcategoria (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    categoria_id INT NOT NULL,
    FOREIGN KEY (categoria_id) REFERENCES categoria(id)
);

CREATE TABLE docente (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL
);

CREATE TABLE curso (
    id INT PRIMARY KEY AUTO_INCREMENT,
    curso VARCHAR(100) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    duracion_horas INT NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    subcategoria_id INT NOT NULL,
    docente_id INT NOT NULL,
    FOREIGN KEY (subcategoria_id) REFERENCES subcategoria(id),
    FOREIGN KEY (docente_id) REFERENCES docente(id)
);

CREATE VIEW vista_cursos AS
SELECT 
  c.id, 
  c.curso,
  c.fecha_inicio, 
  c.fecha_fin, 
  c.duracion_horas, 
  c.precio,
  c.subcategoria_id,
  c.docente_id,
  cat.nombre as categoria,
  s.nombre as subcategoria,
  CONCAT(d.nombre, ' ', d.apellido) as docente
FROM curso c
INNER JOIN subcategoria s ON c.subcategoria_id = s.id
INNER JOIN categoria cat ON s.categoria_id = cat.id
INNER JOIN docente d ON c.docente_id = d.id;

```

3.Abrir el proyecto _biblioteca_ en VSCode

4. Abrir la terminal **CTRL + Ñ** escribir: 
```
npm install
```
Se ejecutara la instalacion de todas las dependencias definidas en **package.json**

5. Crear e Ingresar los parametros en el archivo **.env**

6. Ejecutar el servidor (_nodemon)
```
nodemon server
```
7. 📁 Estructura del Proyecto
```
cursos-virtuales/
├── config/
│   └── db.js                     # Configuración de conexión a MySQL
├── controllers/
│   └── cursoController.js        # Lógica de negocio (CRUD de cursos)
├── node_modules/                 # Dependencias (generado por npm install)
├── public/
│   ├── js/
│   │   └── app.cursos.js         # Lógica del frontend
│   └── cursos.html               # Interfaz de usuario
├── routes/
│   └── cursoRoutes.js            # Definición de rutas API
├── .env                          # Variables de entorno
├── .gitignore                    # Archivos ignorados por Git
├── package.json                  # Dependencias del proyecto
├── server.js                     # Servidor principal
└── README.md                     # Documentación del proyecto
```
8. 🛠️ Tecnologías Utilizadas

```
Node.js - Entorno de ejecución
Express - Framework web
MySQL2 - Driver para MySQL con soporte de promesas
Dotenv - Gestión de variables de entorno
Nodemon - Reinicio automático del servidor
```