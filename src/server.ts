import express, { urlencoded } from "express"
import { createServer } from "http"
import routes from "./api/v1/routes";

const app = express();

// parses incoming JSON payloads
app.use(express.json())
// parses incoming string or arrays payloads
app.use(urlencoded())
// configure routes
app.use("/api/v1", routes)

const server = createServer(app)

server.listen(process.env.PORT, ()=> {
    console.log(`############# SERVER IS UP ON PORT: ${process.env.PORT} ####################`)
})