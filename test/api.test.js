const request = require("supertest");
const app = require("../src/app");
test("POST /tareas crea la tarea y responde 201", async () => {
const res = await request(app).post("/tareas").send({ titulo: "Estudiar" });
expect(res.status).toBe(200);
expect(res.body).toHaveProperty("id");
});
test("POST /tareas sin título responde 400 y no crea nada", async () => {
const res = await request(app).post("/tareas").send({});
expect(res.status).toBe(400);
expect(res.body.error).toMatch(/titulo/);
});

test("GET /tareas devuelve las tareas registradas", async () => {
  // Preparar: crear una tarea
  await request(app)
    .post("/tareas")
    .send({ titulo: "Estudiar GitHub Actions" })
    .expect(201);

  // Ejecutar: consultar las tareas
  const res = await request(app).get("/tareas");

  // Verificar los resultados
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);

  expect(res.body).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        titulo: "Estudiar GitHub Actions",
        completada: false
      })
    ])
  );
});
