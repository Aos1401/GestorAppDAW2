# * GestorAppDAW2

GestorAppDAW2 es una aplicación web desarrollada con *Java* y *Spring Boot*, creada como parte del ciclo de *Desarrollo de Aplicaciones Web (DAW)*.  
Su propósito es facilitar el registro, la edición y la gestión de ingresos de forma sencilla y ordenada.

---

## * Tecnologías utilizadas

- Java 23
- Spring Boot 3.5.6
- Spring Data JPA
- Hibernate ORM
- MySQL
- Maven
- IntelliJ IDEA

---

## * Estructura del proyecto

El proyecto está organizado siguiendo una estructura modular que separa la lógica en capas claras:

```bash
GestorAppDAW2
│
├── src/
│   └── main/
│       └── java/
│           └── com/
│               └── DAW/
│                   └── GestorApp/
│                       ├── Ingresos/
│                       │   ├── add/         # Crear nuevos ingresos
│                       │   ├── list/        # Listar ingresos
│                       │   ├── modify/      # Modificar ingresos
│                       │   ├── delete/      # Eliminar ingresos
│                       │   └── common/      # Entidad, DTOs y repositorio base
│                       │
│                       └── GestorAppApplication.java  # Punto de arranque
│
└── src/main/resources/
    ├── application.properties
    └── data.sql   # Datos de prueba (opcional)

```
---

## * Base de datos

Estructura de la tabla principal utilizada por la aplicación:

CREATE TABLE ingreso (
id INT NOT NULL AUTO_INCREMENT,
descripcion VARCHAR(255),
monto DECIMAL(16,2) NOT NULL,
fecha DATE NOT NULL,
PRIMARY KEY (id)
);

Registros de ejemplo:

INSERT INTO ingreso (descripcion, monto, fecha)
VALUES
('Pago mensual', 1200.00, '2025-10-01'),
('Venta de producto', 250.50, '2025-10-10'),
('Reembolso transporte', 80.00, '2025-10-15');

---

## * Configuración

1. Clonar el repositorio

git clone https://github.com/tuusuario/GestorAppDAW2.git
cd GestorAppDAW2

2. Configurar la conexión a la base de datos

Editar el archivo src/main/resources/application.properties:

spring.datasource.url=jdbc:mysql://localhost:3306/gestorapp?useSSL=false
spring.datasource.username=root
spring.datasource.password=tu_contraseña

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

3. Ejecutar el proyecto

mvn clean install
mvn spring-boot:run

La aplicación quedará disponible en  
http://localhost:8080

---

## * Endpoints principales

| Método | Endpoint             | Descripción                   |
|--------|----------------------|-------------------------------|
| GET    | /ingresos            | Lista todos los ingresos      |
| GET    | /ingresos/{id}       | Obtiene un ingreso por ID     |
| POST   | /ingresos            | Crea un nuevo ingreso         |
| PUT    | /ingresos/{id}       | Actualiza un ingreso          |
| DELETE | /ingresos/{id}       | Elimina un ingreso            |

Ejemplo de POST:

{
"descripcion": "Venta online",
"monto": 150.75,
"fecha": "2025-10-29"
}

---

## * Autoría

Proyecto desarrollado dentro del módulo de *Programación en Entorno Servidor*  
del ciclo formativo *DAW (Desarrollo de Aplicaciones Web)*.

---

## * Licencia

Este proyecto tiene fines educativos y puede ser utilizado libremente con propósitos de aprendizaje o práctica personal.
