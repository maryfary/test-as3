// import './App.css';
import StripeCheckout from 'react-stripe-checkout'
import { useState } from 'react'  
import axios from 'axios'
import {toast} from 'react-toastify'
// import "react-toastify/dist/ReactToastify.css";

function App() {

  const [product] = useState({
    name: 'test',
    price: '120',
    description: 'This is a test app for stripe'
  })

  async function handleToken(token,addresses){ // propeties automatically pass to this function
  const response = await axios.post('http://localhost:5000/checkout',{token,product})

    console.log(response.status)

          if(response.status === 200){

            toast("Success Payment is completed",
            {   type:'success',
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined
            }
            )

            console.log('successsssssssss')

        }else{
           toast("Payment Failed",{type:'error'})

            console.log('faileeeeeeeeeeeeeeeeeeeeeed')
        }
  }

  return (
    <div className="App">
      <div className='container'>
        <br/><br/><br/>
        <h1 className='text-center'>Stripe Payement Checkout Test</h1>
        <br/><br/><br/>
        <div className='form-group container'>
          <StripeCheckout
            className="center"
            stripeKey='pk_test_51L70jmKkNy0MMBNqwSUOyYXksMEavP5vKZQuY5xKJSSCoUGK2NLLRu1PPUrmhCzKj5vSkQA85tVyjTQ0ITbEB762000u0R7gIv'
            token={handleToken}
            amount={product.price * 100}
            name={product.name}
            billingAddress
            shippingAddress
          />
        </div>
      </div>
    </div>
  );
}

export default App;
