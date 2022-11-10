const express = require('express')
const app = express()
const session = require('express-session')
const bcrypt = require('bcryptjs');
const port = 3000

const { User, Product, Category } = require('./models/index');
const { isUser, isAdmin } = require('./middlewares/auth');

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

app.get('/login', (req, res) => {
    const error = req.query.errors
    res.render('loginPage', { error })
    // res.send(error)
})

app.post('/login', (req, res) => {
    const { email, password } = req.body

    User.findOne({
        where: { email }
    })
        .then((user) => {
            if (!user) {
                res.redirect('/products')
            } else {
                const isValidPassword = bcrypt.compareSync(password, user.password)

                if (isValidPassword) {
                    const { id, role } = user

                    req.session.user = { id, role }
                    res.redirect('/products')
                } else {
                    res.redirect(`/login?error=${'Invalid Email or Password'}`)
                }
            }
        }).catch((err) => {
            console.log(err);
        });
})

app.get('/register', (req, res) => {
    const errors = req.query.errors
    res.render('registerPage', { errors })
})

app.post('/register', (req, res) => {
    const { email, password, role, name } = req.body

    User.create({
        email,
        password,
        role,
        name
    })
        .then((result) => {
            res.redirect('/login')
        }).catch((err) => {
            if (err.name === "SequelizeValidationError") {
                let listOfErrors = err.errors.map(el => {
                    return el.message
                })

                res.redirect(`/login?errors=${listOfErrors}`)
            }
        });

})


app.get('/products', isUser, (req, res) => {
    const id = req.session.user.id
    let user = {}


    User.findByPk(id)
        .then((result) => {
            res.render('products', { user: result })
        }).catch((err) => {

        });
})

app.get('/products/add', isUser, isAdmin, (req, res) => {

    Category.findAll({
        attributes: ['id', 'name']
    })
        .then((result => {
            res.render('addProduct', { result })
        }))
        .catch(err => {
            res.send(err)
        })

})

app.post('/products/add', isUser, isAdmin, (req, res) => {
    const { name, description, price, CategoryId } = req.body

    Product.create({
        name,
        description,
        price,
        CategoryId
    })
        .then((_) => {
            res.redirect('/products')
        })
        .catch(err => {
            if (err.name === "SequelizeValidationError") {
                let listOfErrors = err.errors.map(el => {
                    return el.message
                })

                res.redirect(`/products?errors=${listOfErrors}`)
            }
        })
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