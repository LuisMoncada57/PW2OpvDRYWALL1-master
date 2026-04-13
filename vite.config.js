import { defineConfig } from 'vite'
import path, { resolve } from 'node:path'
import * as glob from 'glob'
import purgecss from 'vite-plugin-purgecss'
import handlebars from 'vite-plugin-handlebars'

// Función de tu maestro para encontrar automáticamente todos los HTML
function obtenerHtmlFiles() {
  return Object.fromEntries(
    glob.sync('./**/*.html', {
      ignore: ['./dist/**', './node_modules/**']
    }).map((file) => {
      return [
        // Quita la extensión .html para el nombre de la entrada
        file.slice(0, file.length - path.extname(file).length),
        resolve(__dirname, file)
      ]
    })
  )
}

export default defineConfig(({ command }) => ({
  // Mantenemos tu lógica de base para GitHub Pages
  base: command === 'build' ? '/PW2OpvDRYWALL1-master/' : '/',

  build: {
    cssMinify: true,
    cssCodeSplit: false, // ✅ un solo archivo CSS como querías
    rollupOptions: {
      // Usamos la función automática aquí
      input: obtenerHtmlFiles(),
    }
  },

  server: {
    port: 5173,
  },

  plugins: [
    handlebars({
      // Mantenemos tu carpeta 'partials'
      partialDirectory: resolve(__dirname, 'partials'),
    }),
    purgecss({
      content: [
        './index.html',
        './html/**/*.html',
        './javascript/**/*.js',
        './src/**/*.js', // Agregamos src por si acaso
      ],
    }),
  ],
}))