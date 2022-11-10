const express = require('express')
const app = express()
const session = require('express-session')
const bcrypt = require('bcryptjs');
const port = 3000

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended:true}))
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        sameSite: true
    }
  }))

// / landing page logo deskripsi ada loginnya ada register tombol


app.get('/login', (req, res) => {
    res.render('loginPage')
})

app.post('/login', (req, res) => {
    res.send(req.body)
})

app.get('/register', (req, res) => {
    res.render('registerPage')
})

app.post('/register', (req, res) => {
    res.send(req.body)
})


//userid pake session
/**
 * /products list kategory dan products yang diliat sama customer klo admin 
 * /products/:productId (detail product)
 * /checkout (dilihat sama customer) //create order
 * /orders (diliat admin) //findall order
 * /products/add (diliat admin)
 * /products/:productId/delete (diliat admin)
 * /products/:productId/edit (admin)
 */

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})