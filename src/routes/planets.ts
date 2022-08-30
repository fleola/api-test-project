import express, { Router } from "express"
import prisma from "../lib/prisma/client"
import {
    validate,
    PlanetData,
    planetSchema,
} from "../lib/middleware/validation"
import { initMulterMiddleware } from "../lib/middleware/multer"

const upload = initMulterMiddleware()

const router = Router()
//GET all planets route
router.get("/", async (request, response) => {
    const planets = await prisma.planet.findMany()

    response.json(planets)
})

//GET a planet route
router.get("/:id(\\d+)", async (request, response, next) => {
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
router.post("/", validate({ body: planetSchema }), async (request, response) => {
    const planetData: PlanetData = request.body;

    const planet = await prisma.planet.create({
        data: planetData
    });

    response.status(201).json(planet)
});

//PUT modify a planet
router.put("/:id(\\d+)", validate({ body: planetSchema }), async (request, response, next) => {
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
router.delete("/:id(\\d+)", async (request, response, next) => {
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

//POST a photo
router.post("/:id(\\d+)/photo", upload.single("photo"), async (request, response, next) => {
    if (!request.file) {
        response.status(400)
        return next("No photo file uploaded.")
    }

    const planetId = Number(request.params.id)
    const photoFilename = request.file.filename
    try {
        await prisma.planet.update({
            where: { id: planetId },
            data: { photoFilename }
        })
        response.status(201).json({ photoFilename })
    } catch (error) {
        response.status(404)
        next(`Cannot POST /planets/${planetId}/photo`)
    }
})

router.use("/photos", express.static("uploads"))

export default router