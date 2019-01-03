const expess = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const db = require('./config/keys').mongoURI;

const app = expess();
const users = require('./routes/api/users');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


// connnect to mongodb
mongoose.connect(db)
        .then(() => {
            console.log('mongodb connected success!');
        })
        .catch((err) => {
            console.log(err);
        })

// passport 初始化
app.use(passport.initialize());
require('./config/passport')(passport);


app.use('/api/users',users);
const port  = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})


