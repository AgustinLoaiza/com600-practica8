
const { MongoDBContainer } = require("@testcontainers/mongodb");
const { crearRepositorio } = require("../src/repositorio");

let contenedor;
let repo;

beforeAll(async () => {
  contenedor = await new MongoDBContainer("mongo:7").start();

  repo = await crearRepositorio(
    contenedor.getConnectionString() + "?directConnection=true"
  );
}, 540000);

afterAll(async () => {
  if (repo) {
    await repo.cerrar();
  }

  if (contenedor) {
    await contenedor.stop();
  }
}, 30000);

test("guarda una tarea y la recupera por título", async () => {
  await repo.guardar({
    titulo: "Leer Newman",
    completada: false
  });

  const encontrada = await repo.buscarPorTitulo("Leer Newman");

  expect(encontrada).not.toBeNull();
  expect(encontrada.completada).toBe(false);
});
