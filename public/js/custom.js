/**
 * Clientside helper functions
 */

$(document).ready(function () {
  var amounts = document.getElementsByClassName('amount')

  // iterate through all "amount" elements and convert from cents to dollars
  for (var i = 0; i < amounts.length; i++) {
    amount = amounts[i].getAttribute('data-amount') / 100
    amounts[i].innerHTML = amount.toFixed(2)
  }
})

// Card error display helper function
function displayErrorMessage(message) {
  var displayError = document.getElementById('card-errors')
  displayError.textContent = message
}

// Additional Stripe payment scripts
$(document).ready(async function () {
  const { publishiableKey } = await fetch('/config').then((r) => r.json())
  if (!publishiableKey) {
    console.log('Stripe API key not found')
    alert(
      'Stripe API keys not found - Please retrieve your test API keys from your Stripe dashboard and create a .env file in this project\'s root directory.\n\nAdd your Stripe publishable and secret keys to your .env file as follows: \n\nSTRIPE_SECRET_KEY = sk_test_... \nSTRIPE_PUBLISHABLE_KEY = pk_test_...'
    )
  }

  const stripeApiKey = publishiableKey

  // Checkout page script
  if (top.location.pathname === '/checkout') {
    var stripe = Stripe(stripeApiKey)
    // Set up Stripe.js and Elements to use in checkout form
    var elements = stripe.elements()
    var style = {
      base: {
        color: '#32325d',
      },
    }

    var card = elements.create('card', { style: style })

    card.mount('#card-element')
    card.on('change', function (event) {
      if (event.error) {
        displayErrorMessage(event.error.message)
      } else {
        displayErrorMessage('')
      }
    })

    var form = document.getElementById('checkout-form')
    var processingMessage = document.getElementById('processing-message')
    form.addEventListener('submit', async function (ev) {
      ev.preventDefault()
      // If the client secret was rendered server-side as a data-secret attribute
      // on the <form> element, you can retrieve it here by calling `form.dataset.secret`
      // getting the value
      var email = $('#email').val()
      var client_secret = form.dataset.secret
      console.log('confirming payment...')
      processingMessage.style.visibility = 'visible';
      await stripe
        .confirmCardPayment(client_secret, {
          payment_method: {
            card: card,
            billing_details: {
              email: email,
            },
          },
        })
        .then(function (result) {
          processingMessage.style.visibility = 'hidden';
          if (result.error) {
            // Display payment error to user
            displayErrorMessage(result.error.message)
          } else {
            // The payment has been processed!
            if (result.paymentIntent.status === 'succeeded') {
              // Show redirect to payment success page with form submission action
              console.log('payment succeeded!')
              $('<input />')
                .attr('type', 'hidden')
                .attr('name', 'client_secret')
                .attr('value', client_secret)
                .appendTo(form)
              form.submit()
            }
          }
        })
    })
  }

  // Success page script
  if (top.location.pathname === '/success') {
    var paymentDetails = document.getElementById('payment-details')
    var stripe = Stripe(stripeApiKey)
    const paymentIntent = (
      await stripe.retrievePaymentIntent(paymentDetails.dataset.secret)
    ).paymentIntent
    $('#payment-details').html(
      `<div class='mt-20 text-info'>ID: ${paymentIntent.id} <br/> Total: $${(
        paymentIntent.amount / 100
      ).toFixed(2)}</span></div>`,
    )
  }
})
