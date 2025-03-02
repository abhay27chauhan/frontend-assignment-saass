import express from "express"
import cors from "cors"

const app = express()

app.use(cors())
app.use(express.static("public"))

app.get("*", (req, res, next) => {

    res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Frontend Assignment</title>
          <script src="/bundle.js" defer></script>
        </head>

        <body>
          <div id="app"></div>
        </body>
      </html>
    `)
})

app.listen(3000, () => {
  console.log(`Server is listening on port: 3000`)
})