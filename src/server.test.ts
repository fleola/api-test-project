import supertest from "supertest";
import { prismaMock } from "./lib/prisma/client.mock"
import app from "./app"

const request = supertest(app)

// GET  /planets suite
describe("GET /planets", () => {
    test("Valid Request", async () => {
        const planets = [
            {
                "id": 1,
                "name": "Mercury",
                "description": null,
                "diameter": 1234,
                "moon": 12,
                "createdAt": "2022-08-24T13:44:38.572Z",
                "updatedAt": "2022-08-24T13:44:25.208Z"
            },
            {
                "id": 2,
                "name": "Venus",
                "description": null,
                "diameter": 5678,
                "moon": 2,
                "createdAt": "2022-08-24T13:44:50.269Z",
                "updatedAt": "2022-08-24T13:44:40.430Z"
            }
        ]

        //@ts-ignore
        prismaMock.planet.findMany.mockResolvedValue(planets)

        const response = await request
            .get("/planets")
            .expect(200)
            .expect("Content-Type", /application\/json/)

        expect(response.body).toEqual(planets)
    })
})

// GET /planets/:id suite
describe("GET /planets:id", () => {
    test("Valid Request", async () => {
        const planet = {
            id: 1,
            name: "Mercury",
            description: null,
            diameter: 1234,
            moon: 12,
            createdAt: "2022-08-24T13:44:38.572Z",
            updatedAt: "2022-08-24T13:44:25.208Z"
        };

        //@ts-ignore
        prismaMock.planet.findUnique.mockResolvedValue(planet)

        const response = await request
            .get("/planets/1")
            .expect(200)
            .expect("Content-Type", /application\/json/)

        expect(response.body).toEqual(planet)
    });

    test("Planet does not exist", async () => {
        //@ts-ignore
        prismaMock.planet.findUnique.mockResolvedValue(null)

        const response = await request
            .get("/planets/23")
            .expect(404)
            .expect("Content-Type", /text\/html/)

        expect(response.text).toContain("Cannot GET /planets/23")
    });

    test("Invalid planet ID", async () => {
        const response = await request
            .get("/planets/asdf")
            .expect(404)
            .expect("Content-Type", /text\/html/)

        expect(response.text).toContain("Cannot GET /planets/asdf")
    })
})

// POST /planets suite
describe("POST /planets", () => {
    test("Valid Request", async () => {
        const planet = {
            id: 3,
            name: "Mercury",
            description: null,
            diameter: 1234,
            moon: 12,
            createdAt: "2022-08-25T09:44:30.770Z",
            updatedAt: "2022-08-25T09:44:30.774Z"
        };

        //@ts-ignore
        prismaMock.planet.create.mockResolvedValue(planet)

        const response = await request
            .post("/planets")
            .send({
                name: "Mercury",
                diameter: 1234,
                moon: 12,
            })
            .expect(201)
            .expect("Content-Type", /application\/json/);

        expect(response.body).toEqual(planet)
    });

    test("Invalid Request", async () => {
        const planet = {
            diameter: 1234,
            moon: 12,
        }
        const response = await request
            .post("/planets")
            .send(planet)
            .expect(422)
            .expect("Content-Type", /application\/json/)
        expect(response.body).toEqual({
            errors: {
                body: expect.any(Array)
            }
        })
    })
});