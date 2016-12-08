var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var app = express();

// parse application/json
app.use(bodyParser.json());

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);

var scoreSchema = mongoose.Schema({ name: String, value: Number },
                             { timestamps: true });
var score = mongoose.model("Score", 
                            scoreSchema);
                    


app.set('port', (process.env.PORT || 80));

app.get('/', (req, res) => {
    res.send("Hello world");
});

app.get('/scores', (req, res) => {
    score.find({}).sort({value: -1, createdAt: -1}).exec().then(results => {
        res.json({scores: results});
    })
})

app.post('/scores', (req, res) => {
    console.log(req.body.name);
    console.log(req.body.value);
    let s = new score({
                        name: req.body.name, 
                        value: req.body.value
                    }).save().then(result => {
                        console.log(result);
                        res.sendStatus(200);
                    }).catch(e => {
                        console.log(e);
                        res.sendStatus(500);
                    });
    
})

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
