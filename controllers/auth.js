const mysql = require("mysql2")
const path = require("path")
const fs = require("fs")
const bcrypt = require("bcrypt")
require("dotenv").config({ path: "../.env" })

const db = mysql.createConnection({
    host: process.env.host,
    user: process.env.dbuser,
    password: process.env.dbpass,
    database: process.env.database,
    port: process.env.port,
    ssl: {
        ca: fs.readFileSync(path.join(__dirname, "../ca.pem")),
        rejectUnauthorized: true,
        minVersion: 'TLSv1.2'
    }
})
// login query
exports.login = (req,res) => {
    const {username, password} = req.body 
    

    db.query("SELECT username, password, role, id FROM users WHERE username = ? AND password = ?", [username,password], async (error,results) => {
        if(error){
            console.log(error)
            return res.status(500).json({success:false,message:error})
        }
        if(results.length === 0){
            return res.status(401).json({success:false, message:'Incorrect password or username'})
            
        }
        
        const user = results[0]
        res.json({
            success:true,
            userId: user.id,
            role:user.role,
            username:user.username,
        }) 
       
        /* let hashedpassword = await bcrypt.hash(password, 10)
        console.log(hashedpassword) */
    })    
}

// complaint submission query

exports.complaints = (req,res) =>{
    const {userId, title, description} = req.body;
    
    db.query("INSERT INTO complaints (user_id, title, description) VALUES (?,?,?)", [userId, title, description], async (error,results) => {
        if(error){
            return res.status(500).json({success:false, message:error})
        }
        console.log(results)
        res.json({success:true, message:'complaint submitted!' })
         
    })
}

// show complaints on admin page

exports.admin = (req,res) => {
    
    db.query("SELECT c.*, u.username FROM complaints c JOIN users u ON c.user_id = u.id ORDER BY c.created_at DESC", (error,results) => {
        if(error){
            return res.status(500).json({success:false, message:error})
        }
        console.log(results)
        res.json({success:true, complaints:results})
    })
}

// delete complaint

exports.deleteComplaint = (req,res) => {
     const complaintId = req.params.id
    db.query("DELETE FROM complaints WHERE id = ?", [complaintId], (error,results) => {
        if(error){
            res.status(500).json({success:false, message:error })
        }
            res.json({success:true, message:"complaint deleted!"})
    })
}
