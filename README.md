[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-c66648af7eb3fe8bc4f294546bfd86ef473780cde1dea487d3c4ff354943c9ae.svg)](https://classroom.github.com/online_ide?assignment_repo_id=7970945&assignment_repo_type=AssignmentRepo)
# CPSC 2650 Assignment 3

## Lab 3 extension

### Setup

Optional: Install Google Cloud Shell and run the below steps in the google cloud shell:

Change to the frontend directory and install the dependencies and build the frontend as follows:

    cd auth2/frontend
    yarn install
    yarn build

Start a new terminal. Start and run the Feathers backend as follows:

    cd auth2/backend
    export MONGODBURI='your mongodb connection string goes here'
    npm install
    PORT=8080 npm run dev

Test the backend by visiting the following URL:

`https://8080-dot-...` OR localhost:8080

You should see the shopping list form.

Add a few items to the shopping list. They don’t show on the frontend, but you can see them at the following URL:

`http://8080-dot-.../items` OR localhost:8080

### Adding Authentication

We are going to modify the application so that it requires the user to authenticate before adding items to the list.

#### Initial Changes to Backend

In the terminal where the backend is runnig, stop it (Ctrl-C).

Add a new service to the application:

    feathers generate service

Answer the prompts as follows:

    What kind of service is it? Mongoose
    What is the name of the service? moreitems
    Which path should the service be registered on? /moreitems
    Does the service require authentication? Yes
    

Update `backend/src/models/moreitems.model.ts` so that it has “description” and “quantity” fields just like the “items” model.

Examine `backend/src/services/moreitems/moreitems.hooks.ts`

Restart the backend (e.g. `PORT=8080 npm run dev`).

#### Initial Changes to Frontend

Convince yourself that the authentication hook is working by replacing `items` with `moreitems` in the frontend. On or about line 35 in `frontend/src/shoppinglist.js` replace `client.service('items')` with `client.service('moreitems')`. EVERY TIME YOU MAKE A CHANGE TO THE FRONTEND CODE, you will have to rebuild it by running the following command in the terminal where you last built the frontend:

    yarn build
    

Refresh the application in the browser. Open the web console. Try to add a new item. Note the error in the web console.

Create `frontend/src/loading.js` as follows:

    import React, { Component } from 'react';
    
    class Loading extends Component {
      render() {
        return(<h1>Loading...</h1>);
      }
    }
    
    export default Loading;

Create `frontend/src/login.js` as follows:

    import React, { Component } from 'react';
    
    class Login extends Component {
      render() {
        return(<h1>(login page goes here)</h1>);
      }
    }
    
    export default Login;

Update `frontend/src/application.js` as follows:

    import React, { Component } from 'react';
    import Shoppinglist from './shoppinglist';
    import Loading from './loading';
    import Login from './login';
    import client from './feathers';
    
    class Application extends Component {
      constructor(props) {
        super(props);
    
        this.state = {};
      }
      
      render() {
        if ( this.state.login === undefined) {
          return(<Loading />);
        } else if ( this.state.login ) {
          return(<Shoppinglist />);
        }
        return(<Login />);
      }
    }
    
    export default Application;

Rebuild the frontend. Now if you refresh the application page, you should see the “Loading” message. The next step is to test to see if the user is already logged in during the “Loading” phase. Add this method to the `Application` class:

      componentDidMount() {
        // Try to authenticate with the JWT stored in localStorage
        client.authenticate().catch(() => this.setState({ login: null }));
      }

Now if you refresh the application page, you should see the placeholder for the login page. The next step is to create a button to login with Google. Update the `render` method of the `Login` class as follows (be sure to update “NN” with your own digits):

      render() {
        return(
          <a className="btn btn-primary" 
             href="/oauth/google" 
             role="button">Login with Google</a>);
      }

Now is you refresh the application page, you should see a “Login with Google” button. If you click it, you will get an error page. The next step is to register our application with Google.

#### Final Changes to Backend

Go to the [GCP Credentials Dashboard](https://console.cloud.google.com/apis/credentials).

Click on “Create Credentials | OAuth client ID”. If you haven’t done so already, you will have to create an “OAuth Consent screen”. Fill out as follows:

    Application name: CPSC 2650 Test
    Support email: your email
    Authorised domains: 4949NN.xyz
    Application home page: https://app1.4949NN.xyz
    

Save the changes to the consent screen. Back on the OAuth client ID page, choose “Web application” for application type. For name, choose whatever you want. For authorised redirect URIs, add:

    https://8080-dot-...appspot.com/oauth/google/callback OR your localhost URL
    

(Obviously here, you are going to use your actual web preview domain). Finally click on the “Create” button. Enter the “Client ID” and “Client secret” in `backend/config/default.json` for google key and secret respectively. You probably don’t want to put the secret directly in the file. Use an environment variable like `GOOGLE_OAUTH_SECRET` instead.

You will have to make some other changes to this file because our front and back ends are running on different domains. The value for oauth.redirect needs to be `https://8080-dot-...appspot.com`. In the “google” section you also need to set:

    "redirect_uri": "https://8080-dot-...appspot.com/oauth/google/callback", // OR localhost URL
    "host": "8080-dot-...appspot.com",
    "callback": "/oauth/google/authenticate",
    

Lastly, we need to make sure the email associated with the Google account is collected when the user logs in. Basically, you can update `backend/src/authentication.ts` exactly as [for GitLab in the tutorial](https://docs.feathersjs.com/guides/basics/authentication.html#github-login-oauth). Just rename “GitHubStrategy” with “GoogleStrategy” and call `authentication.register` for “google” instead of “gitlab”.

#### Final Changes to Frontend

If you restart the backend and refresh the application page, you should be able to log in with your Google account, but will end up back on the application page, but stuck in the “Loading…” state. The last thing we need to do is detect that the user has authenticated and update the application state.

Add the following in the `componentDidMount` method of the `Application` class right after the call to `client.authenticate()`:

        // On successfull login ...
        client.on('authenticated', login => {
          
          // ... update the state
          this.setState({ login });
        });

At this point, if you refresh the application page, you should be taken to the shopping list and able to add items.

## Extension for assignment 3

### Prerequisites
- Create free account on Stripe as individual / individual business
- Create free account on Sendgrid and read their documentation (https://docs.sendgrid.com/for-developers/sending-email/quickstart-nodejs) - you can use localhost url in the domain authentication phase
- Create free account on Twillio and read their documentation (https://www.twilio.com/docs/sms/quickstart/node)

### Integrations
- Integrate stripe checkout page service or any payment service that you'd like to your e-commerce website
- Send email to users when their order is placed successfully
- Send sms to users about their order on their phone
