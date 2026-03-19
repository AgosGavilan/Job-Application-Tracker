# 📋 JobTracker

Una app fullstack para registrar y hacer seguimiento de tus postulaciones laborales. Centraliza el estado de cada proceso de selección, muestra estadísticas en tiempo real y tiene un calendario de actividad mensual.

> Proyecto de portafolio — construido con React, Node.js, PostgreSQL y Docker.

**[Ver app en producción](https://job-application-tracker-one-indol.vercel.app/)**

---

## ✨ Funcionalidades

- **Registro de postulaciones** — empresa, puesto, canal (LinkedIn, web, referido), fecha y notas
- **Estados del proceso** — Aplicado · En proceso · Entrevista · Rechazado · Oferta
- **Dashboard con estadísticas** — total por estado, tasa de respuesta y días promedio de respuesta
- **Calendario mensual** — visualizá los días en que postulaste con puntos de actividad
- **Autenticación segura** — registro y login con JWT y bcrypt
- **Diseño propio** — tipografía Outfit, paleta naranja, iconos Lucide, sin templates genéricos

---

## 🛠️ Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| Backend | Node.js + Express + TypeScript |
| Base de datos | PostgreSQL 16 |
| Auth | JWT + bcryptjs |
| Estilos | CSS-in-JS con variables CSS |
| Iconos | Lucide React |
| Gráficos | Recharts |
| DevOps | Docker + Docker Compose |
| Deploy frontend | Vercel |
| Deploy backend | Render |
| Deploy DB | Supabase |

---

## 🚀 Cómo correrlo localmente

### Requisitos previos

- [Node.js 20+](https://nodejs.org)
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Git](https://git-scm.com)

### Pasos

**1. Clonar el repositorio**

```bash
git clone https://github.com/AgosGavilan/Job-Application-Tracker.git
cd job-application-tracker
```

**2. Levantar la base de datos**

```bash
docker-compose up -d
```

**3. Configurar el backend**

```bash
cd backend
```

Creá un archivo `.env` con el siguiente contenido:

```
PORT=3000
DATABASE_URL=postgresql://admin:admin123@localhost:5432/job_tracker
JWT_SECRET=cambia_esto_por_un_secreto_largo
```

Instalá las dependencias y corré las migraciones:

```bash
npm install
npm run migrate
```

**4. Levantar el backend**

```bash
npm run dev
```

El servidor corre en `http://localhost:3000`

**5. Levantar el frontend**

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

La app corre en `http://localhost:5173`

---

## 📁 Estructura del proyecto

```
job-application-tracker/
├── frontend/
│   └── src/
│       ├── components/       # Navbar, ApplicationTable, StatsPanel, modals...
│       ├── pages/            # Login, Register, Home
│       ├── hooks/            # useAuth, useApplications, useStats
│       ├── services/         # api.ts — llamadas al backend con axios
│       ├── types/            # Interfaces TypeScript
│       └── utils/            # statusHelpers
├── backend/
│   └── src/
│       ├── controllers/      # auth.controller, applications.controller, stats.controller
│       ├── routes/           # auth.routes, applications.routes, stats.routes
│       ├── middleware/        # auth.middleware (JWT)
│       └── db/               # Conexión a PostgreSQL y migraciones
├── docker-compose.yml
└── README.md
```

---

## 🔌 API Endpoints

### Auth

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/register` | Registrar nuevo usuario |
| POST | `/api/auth/login` | Iniciar sesión, devuelve JWT |

### Applications *(requieren JWT)*

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/applications` | Listar todas las postulaciones |
| GET | `/api/applications/:id` | Ver detalle de una postulación |
| POST | `/api/applications` | Crear nueva postulación |
| PUT | `/api/applications/:id` | Editar una postulación |
| DELETE | `/api/applications/:id` | Eliminar una postulación |

### Stats *(requieren JWT)*

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/stats/summary` | Totales por estado y tasa de respuesta |
| GET | `/api/stats/weekly` | Postulaciones agrupadas por semana |

---

## 🗄️ Base de datos

El proyecto usa dos tablas principales:

**`users`** — almacena los usuarios registrados con password hasheado con bcrypt.

**`applications`** — almacena las postulaciones con estado, canal, fechas y notas. Cada postulación pertenece a un usuario mediante una foreign key con `ON DELETE CASCADE`.

Las migraciones se corren con `npm run migrate` y crean las tablas automáticamente si no existen.

---

## 🌐 Deploy
 
| Servicio | Plataforma | URL |
|----------|-----------|-----|
| Frontend | Vercel | [job-application-tracker-one-indol.vercel.app](https://job-application-tracker-one-indol.vercel.app/) |
| Backend | Render | https://job-tracker-backend-0czz.onrender.com |
| Base de datos | Supabase | — |
 
---

## 💡 Qué aprendí construyendo esto

- Cómo estructurar un proyecto fullstack separando frontend y backend desde el inicio
- Autenticación con JWT — generación, verificación y middleware para rutas protegidas
- Hashing de contraseñas con bcrypt y por qué nunca guardar passwords en texto plano
- Queries SQL con parámetros tipados para evitar SQL injection
- Interceptors de axios para manejar tokens y errores 401 globalmente
- Custom hooks en React para separar lógica de UI
- Context API para estado global (tema oscuro/claro)
- Diseño responsive con breakpoints manejados desde React
- Docker Compose para orquestar servicios de desarrollo
- Deploy fullstack con Vercel + Render + Supabase
- Variables de entorno para separar configuración de desarrollo y producción

---

## 📸 Capturas

| Dashboard | Login |
|-----------|-------|
| ![Dashboard](./assets/home.png) | ![Login](./assets/login.png) |

---

## 📄 Licencia

MIT — libre para usar y modificar.
