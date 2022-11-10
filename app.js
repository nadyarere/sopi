const express = require('express')
const app = express()
const session = require('express-session')
const bcrypt = require('bcryptjs');
const port = 3000

const { User, Product } = require('./models/index');
const { isUser, isLoggin} = require('./middlewares/auth');

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))

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

app.get('/login', isLoggin, (req, res) => {
    const error = req.query.error
    res.render('loginPage', { error })
})


app.post('/login', (req, res) => {
    const { email, password } = req.body

    User.findOne({
        where: { email }
    })
        .then((user) => {
            if(!user){
                res.redirect('/products')
            } else {
                const isValidPassword = bcrypt.compareSync(password, user.password)
    
                if (isValidPassword) {
                    const {id, role} = user

                    req.session.user = {id, role}
                    res.redirect('/products')
                } else {
                    res.redirect(`/login?error=${'Invalid Email or Password'}`)
                }
            }
        }).catch((err) => {
            res.send(err)
        });
})

app.get('/register', isLoggin, (req, res) => {
    res.render('registerPage')
})

app.post('/register', (req, res) => {
    const { email, password, role, name } = req.body

    User.create({
        email,
        password,
        role,
        name
    })
        .then(() => {
            res.redirect('/login')
        }).catch((err) => {
            res.send(err)
        });

})


app.get('/products', isUser,  (req, res) => {
    const id = req.session.user.id
    let user = {}

    User.findByPk(id)
    .then((result) => {
        user = result
        return Product.findAll()
    })
    .then((result) => {
        res.render('products', { user, products: result})
    })
    .catch((err) => {
        res.send(err)
    });
})

app.get('/logout', (req,res) => {
    if(req.session){
        req.session.destroy()
        res.redirect('/')
    }
})

app.get('/products/:productId/delete', (req,res)=>{
    
})





//userid pake session
/**
 * /products list kategory dan products yang diliat sama customer klo admin 
 * /products/:productId (detail product)
 * /checkout (dilihat sama customer) //create order middle cutomer
 * /orders (diliat admin) //findall order 
 * /products/add (diliat admin)
 * /products/:productId/delete (diliat admin)
 * /products/:productId/edit (admin)
 */

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})