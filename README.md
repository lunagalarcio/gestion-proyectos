
# Sistema de Gestión de Proyectos

## Descripción

Sistema integral de gestión de proyectos, recursos, empleados y clientes con frontend Angular moderno y backend Node.js/Express.

## Tech Stack

### Frontend
- **Angular 20** - Framework frontend
- **Tailwind CSS 4** - Estilos y diseño
- **TypeScript** - Lenguaje de programación

### Backend
- **Node.js** - Entorno de ejecución
- **Express** - Framework web
- **PostgreSQL** - Base de datos
- **bcrypt** - Encriptación de contraseñas

## Estructura del Proyecto

```
gestion-proyectos/
├── frontend/                 # Aplicación Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/   # Componentes Angular
│   │   │   │   ├── dashboard/    # Dashboard con métricas
│   │   │   │   ├── proyectos/   # Gestión de proyectos
│   │   │   │   ├── empleados/   # Gestión de empleados
│   │   │   │   ├── clientes/   # Gestión de clientes
│   │   │   │   ├── tareas/     # Gestión de tareas
│   │   │   │   ├── recursos/   # Gestión de recursos
│   │   │   │   ├── presupuestos/ # Gestión de presupuestos
│   │   │   │   ├── gastos/     # Registro de gastos
│   │   │   │   ├── reportes/   # Generación de reportes
│   │   │   │   ├── asignaciones/ # Asignaciones empleado-tarea
│   │   │   │   ├── login/      # Inicio de sesión
│   │   │   │   ├── register/   # Registro de usuarios
│   │   │   │   └── home/       # Landing page
│   │   │   ├── services/      # Servicios HTTP
│   │   │   ├── interfaces/    # Tipos TypeScript
│   │   │   └── layout/        # Layout principal (sidebar)
│   │   └── styles.css        # Estilos globales
│   └── package.json
│
├── backend/                  # API Node.js (en raíz)
│   ├── routes/
│   │   └── users.routes.js   # Todas las rutas API
│   ├── db.js                 # Configuración de BD
│   ├── config.js             # Configuración del servidor
│   └── index.js              # Punto de entrada
│
└── package.json              # Configuración raíz
```

## Instalación

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm o yarn

### Backend

```bash
# Instalar dependencias del backend
npm install

# Configurar base de datos PostgreSQL
# Editar config.js con tus credenciales

# Iniciar servidor backend
node index.js
```

El backend corre en `http://localhost:3000`

### Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start
```

El frontend corre en `http://localhost:4200`

## API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/users` | Listar usuarios |
| POST | `/api/register` | Registrar usuario |
| POST | `/api/login` | Iniciar sesión |
| GET | `/api/proyectos` | Listar proyectos |
| POST | `/api/proyectos` | Crear proyecto |
| DELETE | `/api/proyectos/:id` | Eliminar proyecto |
| GET | `/api/empleados` | Listar empleados |
| GET | `/api/clientes` | Listar clientes |
| GET | `/api/tareas` | Listar tareas |
| GET | `/api/recursos` | Listar recursos |
| GET | `/api/presupuestos` | Listar presupuestos |
| GET | `/api/gastos` | Listar gastos |
| GET | `/api/asignaciones` | Listar asignaciones |
| GET | `/api/departamentos` | Listar departamentos |

## Diseño UI/UX

### Sistema de Diseño

El proyecto implementa un sistema de diseño oscuro tipo SaaS premium:

- **Colores**: Fondo negro (#050507), acentos morados/violetas
- **Glassmorphism**: Cards con blur y transparencia
- **Gradientes**: Botones y elementos decorativos
- **Glow effects**: Sombras suaves y luminosas
- **Tipografía**: Inter / Segoe UI

### Páginas

- **Landing Page** (`/`) - Hero con esfera glow, secciones informativas
- **Login** (`/login`) - Formulario con glassmorphism
- **Registro** (`/register`) - Crear cuenta de cliente/empleado
- **Dashboard** (`/dashboard`) - Métricas y estadísticas en tiempo real
- **Proyectos** - CRUD de proyectos
- **Empleados** - Gestión de empleados y departamentos
- **Clientes** - Lista de clientes con proyectos
- **Tareas** - Registro y seguimiento de tareas
- **Recursos** - Materiales y equipos
- **Presupuestos** - Asignación de presupuesto por proyecto
- **Gastos** - Registro de gastos
- **Reportes** - Generación de reportes
- **Asignaciones** - Asignar tareas a empleados

## Scripts Disponibles

### Frontend
```bash
npm start          # Iniciar servidor dev
npm run build      # Compilar para producción
npm run watch      # Compilación watch mode
```

### Backend
```bash
node index.js      # Iniciar servidor API
```

## Contribución

1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Add nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## Licencia

MIT License
=======
# Gestión de Proyectos

API REST para la gestión de proyectos, tareas, trabajadores y clientes.

## Tecnologías

- **Backend**: Express.js (Node.js)
- **Base de datos**: PostgreSQL
- **Autenticación**: JWT (JSON Web Token)
- **Encriptación**: bcryptjs

## Instalación

```bash
npm install
```

## Configuración

Crear archivo `.env` con las variables:

```
PORT=3000
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=tu_password
DB_NAME=gestion_proyectos
DB_PORT=5432
JWT_SECRET=tu_secreto
```

## Ejecución

```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## Endpoints

### Usuarios
- `POST /api/users/register` - Registrar usuario
- `POST /api/users/login` - Iniciar sesión
- `GET /api/users` - Listar usuarios
- `GET /api/users/:id` - Obtener usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

## Licencia

ISC
>>>>>>> bf58083 (Ajuste en botones de eliminar)
