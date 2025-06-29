import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db.js'
import './config/instrument.js'
import * as Sentry from "@sentry/node";
import { clerkWebhooks } from './controllers/webhooks.js'
import bodyParser from 'body-parser';


//Initialize express
const app = express()

//Connect to Database
await connectDB()

// 🔥 Register raw-body webhook FIRST (before express.json)
app.post('/webhooks', bodyParser.raw({ type: 'application/json' }), clerkWebhooks);
//Middlewares
app.use(cors())
app.use(express.json())

//Routes
app.get('/', (req, res) => res.send("API Working"))
app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});


//Port
const PORT = process.env.PORT || 5000

Sentry.setupExpressErrorHandler(app);


app.listen(PORT, () => {
    console.log(`Server is Running on port ${PORT}`);
})