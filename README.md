# FIFA Tournament Manager ⚽

Una aplicación web moderna para organizar y gestionar torneos de FIFA con facilidad. Perfecta para organizar competencias entre amigos, en el trabajo, o eventos comunitarios.

## 🌟 Características

### 📋 Gestión de Participantes
- Agregar, editar y eliminar jugadores
- Sistema de selección de jugadores para torneos
- Validación de nombres únicos
- Persistencia local de datos

### 🏆 Formatos de Torneo
- **Formato Liga**: Todos contra todos (Round-robin)
- **Formato Eliminación Directa**: Bracket de eliminación simple
- **Formato Híbrido**: Fase de grupos + eliminatorias (próximamente)

### 🎮 Gestión de Partidos
- Interfaz intuitiva para registrar resultados
- Seguimiento automático de progreso del torneo
- Cálculo automático de ganadores
- Historial completo de partidos

### 📊 Estadísticas y Tablas
- Tabla de posiciones para formato liga
- Bracket visual para eliminatorias
- Estadísticas detalladas: puntos, diferencia de goles, partidos jugados
- Sistema de desempates automático

### 💾 Persistencia Local
- Almacenamiento en localStorage del navegador
- No requiere servidor ni base de datos
- Datos persistentes entre sesiones
- Capacidad de exportar/importar datos

## 🛠️ Tecnologías

- **React 19** - Framework de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Zustand** - Gestión de estado global
- **HeroUI** - Sistema de componentes UI
- **TailwindCSS** - Estilos y diseño responsivo

## 🏗️ Arquitectura

La aplicación sigue un patrón de arquitectura estricto:

```
Components (Atómicos/Reutilizables)
    ↓ (solo consume stores)
Zustand Stores (Estado Global)
    ↓ (única conexión permitida)
Service Layer (localStorage)
    ↓
LocalStorage (Persistencia)
```

### Componentes Atómicos
- `PlayerCard` - Tarjeta individual de jugador
- `TournamentCard` - Tarjeta de torneo
- `MatchCard` - Tarjeta de partido
- `FormatSelector` - Selector de formato de torneo

### Componentes Moleculares
- `PlayerManager` - Gestión completa de jugadores
- `LeagueTable` - Tabla de posiciones
- `KnockoutBracket` - Bracket de eliminación

### Componentes Organismos
- `TournamentCreator` - Creador de torneos
- `TournamentView` - Vista principal del torneo

## 🚀 Inicio Rápido

1. **Instala dependencias**
   ```bash
   npm install
   ```

2. **Inicia el servidor de desarrollo**
   ```bash
   npm run dev
   ```

3. **Abre tu navegador**
   ```
   http://localhost:5173
   ```

## 📖 Cómo Usar

### 1. Gestionar Jugadores
1. Ve a la pestaña "Player Management"
2. Agrega jugadores usando el formulario
3. Edita o elimina jugadores existentes

### 2. Crear Torneo
1. Ve a "Create Tournament"
2. Ingresa el nombre del torneo
3. Selecciona el formato (Liga, Eliminación Directa, etc.)
4. Elige los jugadores participantes
5. Haz clic en "Create Tournament"

### 3. Gestionar Partidos
1. Ve a "Current Tournament"
2. Haz clic en "Start Tournament" para generar partidos
3. Registra resultados usando los botones "Enter Result"
4. La aplicación calculará automáticamente ganadores y posiciones

### 4. Ver Historial
1. Ve a "Tournament History"
2. Revisa torneos anteriores
3. Selecciona cualquier torneo para verlo en detalle

## 🎯 Formatos de Torneo Explicados

### Liga (Round-Robin)
- **Ideal para**: 4-8 jugadores
- **Partidos**: N*(N-1)/2
- **Ventajas**: Más justo, todos juegan la misma cantidad
- **Desventajas**: Muchos partidos para grupos grandes

### Eliminación Directa
- **Ideal para**: 8-32 jugadores
- **Partidos**: N-1
- **Ventajas**: Rápido, emocionante, menos partidos
- **Desventajas**: Menos oportunidades, un mal partido elimina

## 📊 Sistema de Puntuación

### Liga
- **Victoria**: 3 puntos
- **Empate**: 1 punto
- **Derrota**: 0 puntos

### Criterios de Desempate
1. Puntos totales
2. Diferencia de goles
3. Goles a favor
4. Enfrentamiento directo

## 🔧 Desarrollo

### Scripts Disponibles
```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build para producción
npm run lint     # Linting de código
npm run preview  # Preview del build
```

### Estructura del Proyecto
```
src/
├── components/
│   ├── atoms/          # Componentes básicos reutilizables
│   ├── molecules/      # Combinaciones de átomos
│   └── organisms/      # Componentes de página completos
├── services/           # Capa de servicios (localStorage)
├── stores/             # Stores de Zustand
├── types/              # Definiciones TypeScript
└── utils/              # Utilidades generales
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Reglas de Desarrollo

### Componentes
- Componentes atómicos SOLO pueden usar props, no stores
- SOLO stores pueden consumir servicios
- Usar TypeScript estricto
- Componentes deben ser reutilizables

### Estado
- Toda la lógica de negocio en stores de Zustand
- Persistencia SOLO a través del service layer
- Estados de error manejados globalmente

## 🗺️ Roadmap

- [x] ✅ Formato Liga completo
- [x] ✅ Formato Eliminación Directa
- [ ] ⏳ Formato Híbrido
- [ ] ⏳ Tema oscuro/claro
- [ ] ⏳ Exportar resultados a PDF
- [ ] ⏳ Estadísticas avanzadas
- [ ] ⏳ Notificaciones push
- [ ] ⏳ Modo multijugador online

## 🐛 Problemas Conocidos

- Los datos se almacenan localmente (se pierden al limpiar navegador)
- No hay validación de empates en eliminación directa
- Formato híbrido aún no implementado

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👨‍💻 Autor

Desarrollado con ❤️ para la comunidad FIFA

---

¿Listo para organizar tu próximo torneo de FIFA? ¡Comienza ahora! ⚽🏆
