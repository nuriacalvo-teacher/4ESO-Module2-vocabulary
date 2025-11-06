# MODULE 2: VOCABULARY - Documentación

## Descripción
Aplicación web interactiva para aprender vocabulario en inglés con flashcards y ejercicios autocorregibles (MODULE 2: VOCABULARY, app made by Nuria Calvo).

## Características
- **Inicio**: Ingreso de nombre, apellido y curso (4ESO)
- **Flashcards**: Tarjetas con traducción en español (anverso) + frase de ejemplo en español, y palabra en inglés (reverso) + frase de ejemplo en inglés
- **3 Ejercicios autocorregibles**:
  1. **Multiple Choice (30)**: Elige 1 de 4 opciones para rellenar huecos; solo una es correcta
  2. **Fill Blanks (30)**: Escribe en inglés la palabra indicada en español (entre paréntesis)
  3. **Relativos (20)**: Traduce de español a inglés usando WHO, WHICH, WHOSE, WHERE, WHEN, WHY; "that" cuando se permita
- **Autocorrección**: Acepta respuestas sin distinguir mayúsculas/minúsculas, ni signos de puntuación
- **Puntuación**: Muestra notas parciales por ejercicio; rojo si <90%, verde si ≥90%
- **Mensajes motivacionales**:
  - ❌ Rojo (<90%): "No has alcanzado el nivel. Por favor, repite este ejercicio."
  - ✅ Verde (≥90%): "¡Felicidades! Has alcanzado el nivel."

## Archivos

### index.html
- HTML principal con estructura de la aplicación
- Enlazo a `styles.css` y `app.js`
- Todas las secciones: home, flashcards, exercises, exerciseBox, scores

### styles.css
- Estilos profesionales con interfaz azul clara y blanca (tal como se solicitó)
- Diseño responsive
- Colores: azul (#0f355f), botones claros, tarjetas blancas

### app.js
- Lógica completa:
  - Navegación entre secciones
  - Gestión de flashcards (anterior, siguiente, barajar, reiniciar)
  - Ejercicios con corrección automática
  - Cálculo de puntuaciones
  - Normalización de respuestas (mayúsculas, tildes, puntuación)

### vocabulary_scores.csv
- Archivo de ejemplo con estructura para guardar puntuaciones de estudiantes
- Campos: nombre, apellido, curso, ejercicio1_multiple_choice, ejercicio2_fill_blanks, ejercicio3_relativos, promedio_total, alcanzado_nivel

## Instrucciones de Uso en GitHub Pages

1. Crea un repositorio nuevo en GitHub llamado `module2-vocabulary`
2. Sube estos 3 archivos a la rama `main`:
   - `index.html`
   - `styles.css`
   - `app.js`
3. Ve a **Settings > Pages** y habilita GitHub Pages para la rama `main`
4. En pocos segundos, la app estará disponible en: `https://tu-usuario.github.io/module2-vocabulary/`
5. Los estudiantes acceden, ingresan nombre/apellido, y completan teoría y ejercicios

## Datos Incluidos

### Vocabulario (70 palabras y expresiones)
- Palabras básicas: attach, attempt, block of flats, brick, bright, check out, etc.
- Collocations: a close relationship, a close shave, at close range, close-up, etc.
- Phrasal verbs: make a point of, miss the point, prove one's point, put up, pull down, turn into, etc.
- Adjetivos de énfasis: amazing, outstanding, remarkable, fantastic, incredible, unbelievable

### Ejercicio 1 (30 preguntas Multiple Choice)
Frases gramaticalmente correctas; solo una opción válida; todas del vocabulario.
Ejemplo: "She always ____ being on time." → Correcta: "makes a point of"

### Ejercicio 2 (30 preguntas Fill Blanks)
Frases en inglés con pista en español; acepta sinónimos.
Ejemplo: "Please ____ the file to your message. (adjuntar)" → Respuestas: attach

### Ejercicio 3 (20 preguntas Relativos)
Traducciones de español a inglés con oraciones de relativo (WHO, WHICH, WHOSE, WHERE, WHEN, WHY).
Ejemplo: "La mujer que vive aquí es arquitecta." → Posibles: "The woman who/that lives here is an architect"

## Notas Importantes

- **Sin persistencia**: Las puntuaciones se guardan en la sesión actual (se pierden al recargar)
- Para guardar puntuaciones permanentemente, integra con Google Sheets o una base de datos
- Compatible con navegadores modernos (Chrome, Firefox, Safari, Edge)
- Interfaz profesional y pedagógica para estudiantes de 4ESO