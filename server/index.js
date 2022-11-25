require('dotenv').config()
const bcrypt = require('bcryptjs')
const cookieParser = require('cookie-parser')

const register = require('./model/user')
const auth = require('./middleware/auth')
const upload = require('./middleware/multer')

const express = require('express')
const app = express()
const port = process.env.PORT

app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())

// routes
app.get('/', (req, resp) => {
    resp.render('register')
})
app.get('/register', (req, resp) => {
    resp.render('register')
})
app.get('/login', (req, resp) => {
    resp.render('login')
})
app.get('/uploadFiles',auth, (req, resp) => {
    resp.render('uploadFiles')
})
app.get('/logout', auth, async (req, resp) => {
    try {
        // //logout from current device
        // req.user.tokens = req.user.tokens.filter((currentToken) => {
        //     return currentToken.token != req.token;
        // })

        // logout from all devices and delete all tokens from database
        req.user.tokens = []
        resp.clearCookie('jwt')
        await req.user.save()
        resp.render('logout')
    } catch (error) {
        resp.status(500).send(error)
    }
})

// set registeration data
app.post('/register', async (req, resp) => {
    try {
        const password = req.body.password;
        const Cpassword = req.body.confirmPassword;

        if (password === Cpassword) {
            const employData = new register({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                password: password,
                confirmPassword: Cpassword,
                email: req.body.email,
                phone: req.body.phone,
                gender: req.body.gender,
                age: req.body.age
            })
            await employData.save()
            resp.render('login')
        } else {
            resp.send('Password are not matching...')
        }
    } catch (error) {
        resp.status(401).send(error)
    }
})

// login check
app.post('/login', async (req, resp) => {
    try {
        let email = req.body.email
        let password = req.body.password
        let userEmail = await register.findOne({ email: email })

        //match hash password
        const isMatch = await bcrypt.compare(password, userEmail.password)

        if (isMatch) {
            //token
            let token = await userEmail.generateAuthToken()
            //cookies
            resp.cookie('jwt', token, { expires: new Date(Date.now() + 60000), httpOnly: true })
            resp.send('ACCESS GRANTED')
        } else {
            resp.send('ERROR')
        }
    } catch (error) {
        resp.status(401).send(error)
    }
})

//upload file
app.post("/uploadFiles", upload, async (req, resp) => {
    resp.render('uploadFiles')
})



//server is running on this port
app.listen(port, () => {
    console.log(`Server is listening to the port ${port}`)
});  