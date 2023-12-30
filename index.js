const express = require(`express`)
const cors = require(`cors`)
const { default: mongoose } = require('mongoose')
const User = require('./models/user')
const dotenv = require(`dotenv`).config()
const bcrypt = require(`bcryptjs`)
const jwt = require(`jsonwebtoken`)
const cookieParser = require(`cookie-parser`)

const app = express()

app.use(express.json())
app.use(cors({ origin: `http://localhost:5173`, credentials: true }))
app.use(cookieParser())

const bcryptSalt = bcrypt.genSaltSync(10)
const jwtSecret = `kjhsj59479fjhfdkjjfhdkj29skkfjfjzfhuisrwe`

//mongodb+srv://ndubest56:11111234Aa@airbnb-booking.dzugygr.mongodb.net/?retryWrites=true&w=majority

app.post(`/register`, async (req, res) => {
  const { password, ...user } = req.body
  const userDoc = await User.create({ ...user, password: bcrypt.hashSync(password, bcryptSalt) })
  res.json(userDoc)
})

app.post(`/login`, async (req, res) => {
  const { email, password } = req.body
  const userDoc = await User.findOne({ email })
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password)
    if (passOk) {
      jwt.sign(
        { email: userDoc.email, id: userDoc._id, name: userDoc.name },
        jwtSecret,
        {},
        (err, token) => {
          if (err) throw err
          res.cookie(`token`, token).json(userDoc)
        }
      )
    } else {
      res.status(422).json(`pass not ok`)
    }
  } else {
    res.tjson(`user not found`)
  }
})

app.get(`/profile`, (req, res) => {
  const { token } = req.cookies
  if (token) {
    jwt.verify(token, jwtSecret, {}, (err, userDoc) => {
      if (err) throw err
      res.json(userDoc)
    })
  } else {
    res.json(`no user`)
  }
})

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log(`Database connect`)
    app.listen(4000, () => console.log(`connected on port 4000`))
  })
  .catch((error) => console.log(`no connection`))
