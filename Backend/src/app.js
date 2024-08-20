import express from "express"
import cors from "cors"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({
    limit: "16kb"
}))

app.use(express.urlencoded({
    limit: "16kb",
    extended: true
}))

app.use(express.static("public"))

//import routes
import visualizationRoutes from "./routes/visualization.routes.js";

app.use('/api/visualizations', visualizationRoutes);

export { app }
