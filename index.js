const express = require(`express`)
const cors = require(`cors`)
const { default: mongoose } = require('mongoose')
const User = require('./models/user')
const dotenv = require(`dotenv`).config()
const bcrypt = require(`bcryptjs`)
const jwt = require(`jsonwebtoken`)

const app = express()

app.use(express.json())
app.use(cors({ origin: `http://localhost:5173`, Credential: true }))

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
      jwt.sign({ email: userDoc.email, id: userDoc._id }, jwtSecret, {}, (err, token) => {})
      res.json(`ok`)
    } else {
      res.json(`pass not ok`)
    }
  } else {
    res.json(`not ok`)
  }
})

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log(`Database connect`)
    app.listen(4000, () => console.log(`connected on port 4000`))
  })
  .catch((error) => console.log(`no connection`))
