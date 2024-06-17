const express = require('express');
const cors = require('cors')
const port = 8000;
const app = express();
require('dotenv').config()

const mainRouter = require('./route')

var options = {
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
}
app.use(express.json());
app.use(cors(options))
app.use("/api/scheduler", mainRouter)
// app.options('*', cors())
// app.use('/api/users', users);
// app.use('/api/chats', checkAuth, chats);
// app.use('/api/feedback', checkAuth, feedback);

const serve = async () => {
    try {
        app.listen(port, () => {
            console.log(`Server up and listening on port ${port}`)
        })
    }
    catch (error){
        console.log(error);
    }
}

serve()