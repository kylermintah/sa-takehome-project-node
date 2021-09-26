const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
require('dotenv').config();
const Stripe = require('stripe')
const stripe = Stripe(
  process.env.STRIPE_SECRET_KEY,
)

var app = express()

// view engine setup (Handlebars)
app.engine(
  'hbs',
  exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
  }),
)
app.set('view engine', 'hbs')
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

/**
 * Home route
 */
app.get('/', function (req, res) {
  res.render('index')
})

/**
 * Checkout route
 */
app.get('/checkout', async function (req, res) {
  // Just hardcoding amounts here to avoid using a database
  const item = req.query.item
  var title, amount, error

  switch (item) {
    case '1':
      title = 'The Art of Doing Science and Engineering'
      amount = 2300
      break
    case '2':
      title = 'The Making of Prince of Persia: Journals 1985-1993'
      amount = 2500
      break
    case '3':
      title = 'Working in Public: The Making and Maintenance of Open Source'
      amount = 2800
      break
    default:
      // Included in layout view, feel free to assign error
      error = 'No item selected'
      break
  }

  let params = {
    amount: amount,
    currency: 'usd',
    metadata: { integration_check: 'accept_a_payment' },
    payment_method_types: ['card'],
  }

  // Creating payment intent server-side
  const paymentIntent = await stripe.paymentIntents.create(params)

  res.render('checkout', {
    title: title,
    amount: amount,
    error: error,
    client_secret: paymentIntent.client_secret,
  })
})

/**
 * Success GET route
 */
app.get('/success', function (req, res) {
  res.status(404).send('<h1>404 - Page Not Found<h1>')
})

/**
 * Success POST route
 */
app.post('/success', function (req, res) {
  res.render('success', req.body) 
})

/**
 * Config route
 */
 app.get('/config', function (req, res) {
  res.send({publishiableKey: process.env.STRIPE_PUBLISHABLE_KEY})
})

/**
 * Start server
 */
app.listen(3000, () => {
  console.log('Getting served on port 3000')
})
