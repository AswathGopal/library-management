const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors =require('cors');
const app = express();
const port = 8000;
app.use(cors());

// Create MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root@123',
  database: 'library_management'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Routes
app.get('/',(req,res)=>{
  res.send('working')
})

app.get('/library',(req,res)=>{
    const sql="SELECT * FROM books";
    connection.query(sql,(err,result)=>{
        if(err) return res.json({Status:false,Error:"Query Error"})
        return res.json({Status:true,Result:result})
    })
})

app.post('/librarysubmit', (req, res) => {
  const { name, author, subject, date, count} = req.body;
 console.log(req.body)
  // Validation
  if (!name || !author || !subject || !date || !count) {
    return res.status(400).send('Please fill in all fields');
  }

  // Insert into database
  const sql = `INSERT INTO books (title,author, subject, date,count) VALUES (?, ?, ?, ?, ?)`;
  connection.query(sql, [name, author,subject,date,count], (err, result) => {
    if (err) throw err;
    console.log('book added to database');
    res.status(200).send('book added successfully');
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
