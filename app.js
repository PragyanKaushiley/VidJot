const path = require('path');
const express = require('express');
const exphbs  = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');

const app = express();

//routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//passport
require('./config/passport')(passport);
//DBconfig
const db = require('./config/database');
// require('./config/database')(database);

//Map global promise
mongoose.Promise = global.Promise;

//connect to mongoose
mongoose.connect(db.mongoURI,{
  useMongoClient: true
})
.then( () => console.log('Mongodb connected...'))
.catch(err => console.log(err));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//path
app.use(express.static(path.join(__dirname, 'public')));

//handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//method override middleware
app.use(methodOverride('_method'));

//Express session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));

//passport session middleware; always after express middleware
app.use(passport.initialize());
  app.use(passport.session());

//flash middleware
app.use(flash());

//global vars
app.use( (req,res,next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

//Index
app.get('/', (req,res) => {
  const title = 'Welcome';
  res.render('index', { title })
});

//About
app.get('/about', (req,res) => {
  const title = 'About';
  res.render('about', {title})
});

//use routes
app.use('/ideas', ideas);
app.use('/users', users);

//connection
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Starting on ${port}`);
});
