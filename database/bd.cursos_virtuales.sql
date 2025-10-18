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

-- Insertar Categorías 
INSERT INTO categoria (nombre) VALUES 
('Matemáticas'),
('Informática'),
('Idiomas'),
('Negocios');

-- Insertar Subcategorías
INSERT INTO subcategoria (nombre, categoria_id) VALUES 
('Geometría', 1),
('Estadística', 1),
('Lenguajes de Programación', 2),
('Bases de Datos', 2),
('Inglés', 3),
('Francés', 3),
('Marketing', 4),
('Finanzas', 4);

-- Insertar Docentes
INSERT INTO docente (nombre, apellido, email) VALUES 
('Juan', 'Pérez', 'juan.perez@email.com'),
('María', 'García', 'maria.garcia@email.com'),
('Carlos', 'López', 'carlos.lopez@email.com'),
('Ana', 'Martínez', 'ana.martinez@email.com'),
('Luis', 'Rodríguez', 'luis.rodriguez@email.com'),
('Sofia', 'Fernández', 'sofia.fernandez@email.com');

-- Insertar Cursos
INSERT INTO curso (curso, fecha_inicio, fecha_fin, duracion_horas, precio, subcategoria_id, docente_id) VALUES 
('Geometría Analítica', '2025-11-01', '2025-12-15', 40, 199.99, 1, 1),
('Estadística Aplicada', '2025-11-10', '2025-12-20', 45, 249.99, 2, 2),
('Python', '2025-11-05', '2025-12-10', 35, 179.99, 3, 3),
('JavaScript', '2025-11-15', '2026-01-10', 50, 299.99, 3, 2),
('MySQL', '2025-11-01', '2026-02-28', 80, 349.99, 4, 4),
('Inglés Básico', '2025-11-20', '2026-01-15', 30, 189.99, 5, 5),
('Marketing Digital', '2025-12-01', '2026-01-20', 40, 229.99, 7, 6),
('Java', '2025-11-08', '2025-12-22', 45, 259.99, 3, 1);

SELECT * FROM vista_cursos;