// src/scripts/clean-console.js
// Limpia la consola antes de iniciar el servidor (opcional)

try {
  console.clear();
  console.log("🧹 Consola limpia. Iniciando servidor...");
} catch (error) {
  console.error("No se pudo limpiar la consola:", error);
}
