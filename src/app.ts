import express from "express"
import "express-async-errors"
import { validationErrorMiddleware } from "./lib/middleware/validation"
import planetRoutes from "./routes/planets"
import { initCorsMiddleware } from "./lib/middleware/cors"

const app = express()

app.use(express.json())

app.use(initCorsMiddleware())

app.use("/planets", planetRoutes)

app.use(validationErrorMiddleware);

export default app