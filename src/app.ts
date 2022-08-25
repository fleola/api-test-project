import express from "express"
import "express-async-errors"
import prisma from "./lib/prisma/client"
import cors from "cors"
import {
    validate,
    PlanetData,
    planetSchema,
    validationErrorMiddleware
} from "./lib/validation"

const app = express()

const corsOptions = {
    origin: "http://localhost:8080"
}
app.use(express.json())

app.use(cors(corsOptions))

//GET all planets route
app.get("/planets", async (request, response) => {
    const planets = await prisma.planet.findMany()

    response.json(planets)
})

//GET a planet route
app.get("/planets/:id(\\d+)", async (request, response, next) => {
    const planetId = Number(request.params.id)

    const planet = await prisma.planet.findUnique({
        where: { id: planetId }
    })

    if (!planet) {
        response.status(404)
        return next(`Cannot GET /planets/${planetId}`)
    }

    response.json(planet)
})

//POST a planet route
app.post("/planets", validate({ body: planetSchema }), async (request, response) => {
    const planetData: PlanetData = request.body;

    const planet = await prisma.planet.create({
        data: planetData
    });

    response.status(201).json(planet)
});

//PUT modify a planet
app.put("/planets/:id(\\d+)", validate({ body: planetSchema }), async (request, response, next) => {
    const planetId = Number(request.params.id)
    const planetData: PlanetData = request.body

    try {
        const planet = await prisma.planet.update({
            where: { id: planetId },
            data: planetData
        })
        response.status(200).json(planet)
    } catch (error) {
        response.status(404)
        next(`Cannot PUT /planets/${planetId}`)
    }
})

//DELETE a planet
app.delete("/planets/:id(\\d+)", async (request, response, next) => {
    const planetId = Number(request.params.id)

    try {
        const planet = await prisma.planet.delete({
            where: { id: planetId },
        })
        response.status(204).end()
    } catch (error) {
        response.status(404)
        next(`Cannot DELETE /planets/${planetId}`)
    }
})

app.use(validationErrorMiddleware);

export default app