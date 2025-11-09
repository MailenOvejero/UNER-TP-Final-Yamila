//limpiamos consola antes de que inicie el server
try {
  console.clear();
  console.log(" Consola limpia. Iniciando servidor...");
} catch (error) {
  console.error("No se pudo limpiar la consola:", error);
}
