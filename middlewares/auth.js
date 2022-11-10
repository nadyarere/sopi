// isadmin
// isuser

const isUser = (req, res, next) => {
    if (!req.session.user) {
        const error = 'You need to register first'
        res.redirect(`/login?error=${error}`)
    } else {
        next()
    }
}

const isLoggin = (req, res, next) => {
    if (req.session.user) {
        res.redirect(`/products`)
    } else {
        next()
    }
}


module.exports = {
    isUser,
    isLoggin
}