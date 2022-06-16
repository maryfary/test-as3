const express = require('express')

const bodyparser = require('body-parser')

let error, status
const stripe = require("stripe")("sk_test_51L70jmKkNy0MMBNqseEqA2XWFzF8ZjRmb8U9kY9gR6K1SvIxjyVHf77Q3V6eToJQvYc1dwTaVvk9dUG7Fkv1uMnw00awMWSqHs")

const uuid = require('uuid').v4
const cors = require('cors')
const app = express();

app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())
app.use(cors())
 
// const PORT = 5000

// const stripe = require('stripe')('sk_test_51L70jmKkNy0MMBNqseEqA2XWFzF8ZjRmb8U9kY9gR6K1SvIxjyVHf77Q3V6eToJQvYc1dwTaVvk9dUG7Fkv1uMnw00awMWSqHs')


app.post('/checkout', async (req,res)=>{
    console.log(req.body)

    let error, status

        try {
           const {product,token} = req.body  
          

        const customer = await stripe.customer.create({
            email: token.email,
            source: token.id
        })

        const key = uuid()

        const charge = await stripe.charges.create(
            {
              amount: product.price * 100,
              currency: "usd",
              customer: customer.id,
              receipt_email: token.email,
              description: `Purchased the ${product.name}`,
              shipping: {
                name: token.card.name,
                address: {
                  line1: token.card.address_line1,
                  line2: token.card.address_line2,
                  city: token.card.address_city,
                  country: token.card.address_country,
                  postal_code: token.card.address_zip,
                },
              },
            },
            {
              key,
            }
          );

          console.log("Charge:", { charge });
          status = "success";
        
    } catch (error) {
        console.log(error)
        status = "failure";
    }

    res.json({error,status})

})

app.listen(5000)