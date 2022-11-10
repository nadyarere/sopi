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

module.exports = {
    isUser
}