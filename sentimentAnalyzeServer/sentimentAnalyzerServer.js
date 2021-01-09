const express = require('express');
const app = new express();

const NLUAuth = require('./NLUAuth');

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

app.get("/", (req, res) => {
    res.render('index.html');
});

app.get("/url/emotion", (req, res) => {
    //get the url query param
    const url = req.query.url;
    //return error if url is not present
    if (!url) {
        res.status(400).send({ err: 'Bad request. Query param "url" is not present' });
    }

    const analyzeParams = {
        url: url,
        features: {
            emotion: {}
        }
    };

    const NLUInstance = NLUAuth.getNLUInstance();
    handleEmotionNLURequest(NLUInstance, analyzeParams, res);

    // return res.send({ "happy": "90", "sad": "10" });
});

app.get("/url/sentiment", (req, res) => {
    //get the url query param
    const url = req.query.url;
    //return error if url is not present
    if (!url) {
        res.status(400).send({ err: 'Bad request. Query param "url" is not present' });
    }

    const analyzeParams = {
        url: url,
        features: {
            sentiment: {}
        }
    };

    const NLUInstance = NLUAuth.getNLUInstance();
    handleSentimentNLURequest(NLUInstance, analyzeParams, res);

    // return res.send("url sentiment for " + req.query.url);
});

app.get("/text/emotion", (req, res) => {
    //get the text query param
    const text = req.query.text;
    //return error if text is not present
    if (!text) {
        res.status(400).send({ err: 'Bad request. Query param "text" is not present' });
    }

    const analyzeParams = {
        text: text,
        features: {
            emotion: {}
        }
    };

    const NLUInstance = NLUAuth.getNLUInstance();
    handleEmotionNLURequest(NLUInstance, analyzeParams, res);

    // return res.send({ "happy": "10", "sad": "90" });
});

app.get("/text/sentiment", (req, res) => {
    //get the text query param
    const text = req.query.text;
    //return error if text is not present
    if (!text) {
        res.status(400).send({ err: 'Bad request. Query param "text" is not present' });
    }

    const analyzeParams = {
        text: text,
        features: {
            sentiment: {}
        }
    };

    const NLUInstance = NLUAuth.getNLUInstance();
    handleSentimentNLURequest(NLUInstance, analyzeParams, res);

    // return res.send("text sentiment for " + req.query.text);
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})


const handleEmotionNLURequest = (NLUInstance, analyzeParams, res) => {
    NLUInstance.analyze(analyzeParams)
        .then(analysisResults => {
            //check if the response is 200 OK
            if (analysisResults.status !== 200) {
                res.status(analysisResults.status).send({ err: 'Error getting the response' });
                return;
            }

            console.log(JSON.stringify(analysisResults, null, 2));
            if (!analysisResults.result
                || !analysisResults.result.emotion
                || !analysisResults.result.emotion.document
                || !analysisResults.result.emotion.document.emotion) {
                res.status(500).send({ err: 'Error getting the response' });
                return;
            }

            //return the emotions
            const emotions = analysisResults.result.emotion.document.emotion;
            res.status(200).send(emotions);
        })
        .catch(err => {
            console.log('Emotion error:', err);
            res.status(err.status).send({ err: 'Error getting the response' });
        });
}

const handleSentimentNLURequest = (NLUInstance, analyzeParams, res) => {
    NLUInstance.analyze(analyzeParams)
        .then(analysisResults => {
            //check if the response is 200 OK
            if (analysisResults.status !== 200) {
                res.status(analysisResults.status).send({ err: 'Error getting the response' });
                return;
            }

            console.log(JSON.stringify(analysisResults, null, 2));
            if (!analysisResults.result
                || !analysisResults.result.sentiment
                || !analysisResults.result.sentiment.document) {
                res.status(500).send({ err: 'Error getting the response' });
                return;
            }

            //return the sentiments
            const sentimentRes = analysisResults.result.sentiment.document;
            res.status(200).send(sentimentRes);
        })
        .catch(err => {
            console.log('Sentiment error:', err);
            res.status(err.status).send({ err: 'Error getting the response' });
        });
}
