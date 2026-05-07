# 🚀 Propuesta de Plataforma Educativa: "FraccioNautas"

## 1. Concepto General
- **Nombre del Proyecto:** FraccioNautas (o Fractionauts)
- **Identidad:** Una aventura espacial donde los niños son astronautas explorando el "Universo Matemático". Su misión es reparar naves, alimentar alienígenas y descubrir nuevos planetas utilizando la "energía de las fracciones".
- **Temática Visual:** Espacio colorido, vibrante y amigable. Un estilo *cartoon* similar a juegos de móviles exitosos (ej. Duolingo, Brawl Stars).
- **Estilo Artístico:** *Flat Design 2D* moderno con *Glassmorphism* (paneles translúcidos), bordes muy redondeados, botones gruesos con efecto "aplastable", paleta de colores vibrantes (morados espaciales, cianes brillantes, naranjas cálidos) y una mascota robot llamada "Fracc" que los guía.

---

## 2. Experiencia de Usuario y UI (UX/UI)
La interfaz debe evitar sentirse como un "examen web". Debe ser un videojuego de navegador.

### Flujo de Pantallas
1. **Pantalla de Inicio (Centro de Mando):** 
   - Fondo espacial animado suavemente.
   - Input grande y centrado: *"¿Cómo te llamas, astronauta?"*
   - Botón *"¡Despegar!"* (desactivado hasta ingresar un nombre). Al hacer clic, hay una transición de "salto al hiperespacio".
2. **Mapa Estelar (Selección de Nivel):**
   - Los minijuegos son planetas en un mapa 2D. Se desbloquean en orden o se pueden elegir libremente.
3. **Pantalla de Minijuego:**
   - **HUD (Head-Up Display):** Minimalista. Arriba a la izquierda: Nombre y Puntos. Arriba a la derecha: Racha actual de aciertos (🔥 x3) y botón de Pausa.
   - Centro: Área de juego interactiva.
4. **Pantalla de Feedback (Micro-interacciones):**
   - Transiciones rápidas: Check mark verde con confeti y sonido alegre para aciertos; leve temblor rojo (*shake*) y sonido suave para errores.
5. **Pantalla de Resultados (Reporte de Misión):**
   - Estadísticas de la partida en tarjetas limpias, rango obtenido y botón para jugar de nuevo o salir.

---

## 3. Gameplay y Minijuegos
Los juegos se centran en interacción "Drag & Drop", toques rápidos e identificación visual.

### Ideas de Minijuegos
1. **Pizza Alienígena (Concepto y Numerador/Denominador):**
   - *Mecánica:* Un alienígena pide comida: "¡Dame 3/4 de esta pizza!". El jugador debe tocar 3 de los 4 trozos de una pizza dividida en la pantalla.
2. **Astros Gemelos (Fracciones Equivalentes y Relación):**
   - *Mecánica:* Juego tipo memoria o *Match-3*. Unir una tarjeta que dice "1/2" con una imagen de un vaso medio lleno, o con la tarjeta "2/4".
3. **Batalla de Meteoritos (Comparación):**
   - *Mecánica:* Dos meteoritos caen hacia la nave. Uno tiene la fracción 1/3 y otro 2/3. La computadora pide "¡Destruye el mayor!". El niño toca el meteorito correcto.
4. **Puente de Energía (Ordenamiento):**
   - *Mecánica:* Arrastrar bloques con fracciones a espacios vacíos de izquierda a derecha (de menor a mayor) para formar un puente por donde cruzará el robot Fracc.

### Dificultad Adaptativa
- Si el jugador responde bien rápido, el siguiente nivel presenta denominadores más complejos (ej. pasar de 2, 3, 4 a 6, 8, 10).
- Si el jugador falla 2 veces seguidas en la misma pregunta, el sistema muestra una ayuda visual fantasma (ej. sombrea levemente la respuesta correcta).

---

## 4. Arquitectura Técnica
Se utilizará un stack moderno y sin servidor (Local-first).

- **Frontend:** Next.js (App Router) + TypeScript.
- **Estilos:** TailwindCSS (para diseño rápido y utilitario).
- **Animaciones:** GSAP + Lenis (fundamental para dar "jugo" e interactividad a la UI).
- **Estado Global:** Zustand (ligero, fácil de usar, permite persistencia nativa).

### Estructura de Carpetas Propuesta (React/Next.js)
```text
/src
 ├── /app (o /pages)       # Rutas: /, /map, /game, /results
 ├── /components
 │   ├── /ui               # Botones, inputs, tarjetas (componentes genéricos)
 │   ├── /games            # Componentes específicos de cada minijuego
 │   └── /layout           # Contenedores, fondos animados, HUD
 ├── /store
 │   └── useGameStore.ts   # Estado de Zustand (puntos, nombre, rachas)
 ├── /data
 │   └── questionBank.json # Banco local de preguntas
 ├── /utils
 │   ├── randomizer.ts     # Lógicas de shuffle y selección aleatoria
 │   └── mathUtils.ts      # Funciones para evaluar fracciones
 └── /hooks
     └── useAudio.ts       # Hook para manejar SFX
```

### El Banco de Preguntas Dinámico
No será un array fijo. Almacenaremos un `JSON` agrupado por tipos de competencia.
```json
{
  "identify": [
    { "type": "pie", "numerator": 3, "denominator": 4, "options": [...] },
    { "type": "objects", "numerator": 1, "denominator": 2, "options": [...] }
  ],
  "compare": [
    { "f1": [1, 3], "f2": [2, 3], "question": "greater" }
  ]
}
```
**Randomización:**
Al cargar un minijuego, un utilitario en el frontend toma el arreglo del JSON, utiliza el algoritmo de **Fisher-Yates Shuffle** para mezclar el orden de las preguntas, y además mezcla dinámicamente las posiciones del arreglo de `options` para que la respuesta correcta nunca esté en el mismo botón.

### Sistema de Puntuación (Zustand + LocalStorage)
Usando el middleware `persist` de Zustand, los datos sobreviven al recargar la página.
- **Puntuación Base:** +100 puntos por acierto.
- **Rachas (Streak):** 3 aciertos seguidos = multiplicador x1.5 (+150 pts). 5 aciertos = x2.
- **Errores:** Rompen la racha de combos (vuelve a x1). No restan puntos para no frustrar al niño.

---

## 5. Gamificación y Feedback
- **Efectos Visuales (Juice):** Framer Motion se usa para que cada botón presionado se reduzca a un 95% de tamaño (`whileTap={{ scale: 0.95 }}`). Las transiciones de pantalla deben deslizarse (slide) o desvanecerse (fade).
- **Medallas e Insignias:** Almacenadas en el estado local. Ejemplos: "Primera Estrella" (jugar por primera vez), "Mente Veloz" (responder en menos de 5 segundos), "Invicto" (racha de 10).
- **Rango Final:** Dependiendo del porcentaje de aciertos (`correct / total * 100`):
  - 90% - 100% -> 🌟 **Maestro de las Fracciones**
  - 70% - 89%  -> 🚀 **Explorador Matemático**
  - 50% - 69%  -> 🛠️ **Aprendiz Espacial**
  - < 50%      -> 🌱 **Cadete en Entrenamiento**

---

## 6. Sistema Educativo y Progresión Pedagógica
La plataforma sigue la teoría del *Andamiaje (Scaffolding)* de Vygotsky:
1. **Fase Visual-Concreta:** Todo es comida u objetos (ej. rebanadas de pizza).
2. **Fase Simbólica:** Relacionar el objeto visual con el número (a/b).
3. **Fase Abstracta:** Comparar y ordenar números de fracciones directamente sin tanto apoyo visual (o apoyo visual que aparece solo si el niño tarda en responder).

---

## 7. Roadmap del Desarrollo

### 📍 Fase 1: MVP Funcional (1-2 Semanas)
- Estructura base del proyecto (Next.js + Tailwind + Zustand).
- Pantalla de inicio con guardado de nombre.
- Banco de preguntas en JSON y algoritmo de randomización.
- **1er Minijuego:** "Pizza Alienígena" (Identificación y relación visual/número).
- Pantalla final de resultados básica (Rango, Puntuación, Porcentaje).

### 📍 Fase 2: Expansión de Jugabilidad (2 Semanas)
- Agregar 2 minijuegos extra (Comparación y Equivalencias).
- Implementación de Framer Motion (micro-interacciones, físicas de rebote en botones).
- Sistema de rachas y combos integrado en el HUD.

### 📍 Fase 3: Pulido y Experiencia Premium (1 Semana)
- Implementación de Sonidos (SFX para aciertos, errores, clics y música de fondo suave).
- Pantalla de Mapa Estelar para navegación.
- Tarjetas resumen para el profesor (que muestren claramente dónde falló más el alumno para poder ayudarlo).
