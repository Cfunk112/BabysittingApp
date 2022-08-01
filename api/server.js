const express = require("express")
const app = express()
const cors = require("cors")
const moment = require('moment')
const e = require("express")
const { min } = require("moment")
app.use(cors())


app.get("/", async function(req, res) {
    res.send() // Should be json format
  })
  
  
  app.listen(3000, () => {
    console.log("app listening on port 3000")
  })