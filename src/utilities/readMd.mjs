import { readFile } from 'node:fs/promises'

export async function readMd(ruta) {
  try {
    const contenido = await readFile(ruta, 'utf-8')
    return contenido
  } catch (error) {
    console.error('Error al leer el archivo MD:', error.message)
    return null
  }
}
