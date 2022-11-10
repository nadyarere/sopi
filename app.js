const express = require('express')
const app = express()
const session = require('express-session')
const bcrypt = require('bcryptjs');
const port = 3000

const {User} = require('./models/index')

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

app.get('/', (req, res) => {
    res.render('landingPage')
})

app.get('/login', (req, res) => {
    const error = req.query.error

    res.render('loginPage', {error})
})

app.post('/login', (req, res) => {
    const {email, password} = req.body

    User.findOne({
        where: {email}
    })
    .then((user) => {
        const isValidPassword = bcrypt.compareSync(password, user.password)
        
        if(isValidPassword){
            res.redirect('/products')
        } else {
            const error = 'Invalid Email and Password'
            res.redirect(`/login?error=${error}`)
        }
    }).catch((err) => {
        res.send(err)
    });
})

app.get('/register', (req, res) => {
    res.render('registerPage')
})

app.post('/register', (req, res) => {
    const {email, password, role, name} = req.body

    User.create({
        email,
        password,
        role,
        name
    })
    .then((result) => {
        res.send(result)
    }).catch((err) => {
        res.send(err)
    });
    
})

// const isCustomer = (req, res, next) => {
//    if(!req.session) 
// }

app.get('/products', (req, res) => {
    res.render('products')
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