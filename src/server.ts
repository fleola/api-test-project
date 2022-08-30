import app from "./app"
import config from "./config"

const port = config.PORT

app.listen(port, () => {
    console.log(`[server]: Server running at https://localhost:${port}`)
})