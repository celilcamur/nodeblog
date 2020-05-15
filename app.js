

const express = require('express')
const exphbs = require('express-handlebars')
const app = express()
const port = 3000
const hostname = '127.0.0.1' //local hostun bulundugu adres, yazmasakta olurdu
const mongoose = require('mongoose'); //mongoose require edildi
const bodyParser = require('body-parser') //body-parser require edildi (gonderilen verilerin yakalanması saglandı)
const fileUpload = require('express-fileupload')
const { generateDate, limit, truncate } = require('./helpers/hbs')

const expressSession = require('express-session')
const connectMongo = require('connect-mongo')
const methodOverride = require('method-override')


mongoose.connect('mongodb://127.0.0.1/nodeblog_db', { //böyle veritabanı(nodeblog_db) yok ancak olmadıgı gorulunce mongoose otomatık oluturacak
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

const mongoStore = connectMongo(expressSession)

app.use(expressSession({
  secret: 'testotesto', //güvenlik anahtarı, ne yazacagın sana kalmıs
  resave: false,
  saveUninitialized: true,
  store: new mongoStore({ mongooseConnection: mongoose.connection }) //sessionları db ye kaydetmek icin gerekli baglantıları yaptık
}))




app.use(fileUpload())
app.use(express.static('public'))
app.use(methodOverride('_method'))


 
//handlebars helpers
const hbs = exphbs.create({
  helpers: {
    generateDate: generateDate,
    limit: limit,
    truncate: truncate
  }
})



app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


//DISPLAY LINK Middleware

app.use((req, res, next) => {
  const { userId } = req.session
  if (userId) {
    res.locals = {
      displayLink: true
    }
  }
  else {
    res.locals = {
      displayLink: false
    }

  }
  next()  //islem yapıldıktan sonra devam et, calısmaya devam et
})

// Flash - Message Middleware ( bildirim mesajı yapıyoz)
app.use((req, res, next) => {
  res.locals.sessionFlash = req.session.sessionFlash //mesajı res'e gönder
  delete req.session.sessionFlash //mesajı kullandıktan sonra sil
  next() // devam et 

})



const main = require('./routes/main')
const posts = require('./routes/posts')
const users = require('./routes/users')
const admin = require('./routes/admin/index')
const contact = require('./routes/contact')

app.use('/', main)
app.use('/posts', posts)
app.use('/users', users)
app.use('/admin', admin)
app.use('/contact', contact)


app.listen(port, hostname, () => console.log(`Server calisiyor, http://${hostname}:${port}`))
