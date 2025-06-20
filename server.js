const express = require("express")
const mysql = require("mysql2")
const path = require("path")
const dotenv = require("dotenv")
const fs = require("fs")

//private environment for passwords

dotenv.config({path: './.env'})

const app = express()

//database
const db = mysql.createConnection({
    host: process.env.host,
    user: process.env.dbuser,
    password: process.env.dbpass,
    database: process.env.database,
    port: process.env.port,
    ssl: {
        ca: fs.readFileSync(path.join(__dirname, "ca.pem")),
        rejectUnauthorized: true,
        minVersion: 'TLSv1.2'
    }
}
)
// navigate to hbs and css
const publicDirectory = path.join(__dirname,'./public')
app.use(express.static(publicDirectory))

app.set('view engine', 'hbs')

db.connect((error) => {
    if(error){
        console.log(error)
    }
    else{
        console.log("MYSQL connected!")
    }
})

app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.use("/", require("./routes/pages"))
app.use("/auth", require("./routes/auth"))


// server port
const dbport = process.env.PORT || 26894
app.listen(dbport, () => {
    console.log(`Server started on port ${dbport}.`)
})
