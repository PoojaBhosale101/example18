let express = require('express'),
  bodyParser = require('body-parser'),
  port = process.env.PORT || 3000,
  app = express();
  let alexaVerifier = require('alexa-verifier');
  var isFisrtTime = true;
  const SKILL_NAME = 'Description';
  const GET_DESCRIPTION_MESSAGE = "Here's your Description: ";
  var request = require('request');
  var tokenValue="";
  const PAUSE = '<break time="0.3s" />'
const WHISPER = '<amazon:effect name="whispered"/>'
  
  app.use(bodyParser.json({
  verify: function getRawBody(req, res, buf) {
    req.rawBody = buf.toString();
    console.log(buf.toString())
  }
}));


function requestVerifier(req, res, next) {
  alexaVerifier(
    req.headers.signaturecertchainurl,
    req.headers.signature,
    req.rawBody,
    function verificationCallback(err) {
      if (err) {
        console.log(err)
        res.status(401).json({
          message: 'Verification Failure',
          error: err
        });
      } else {
        next();
      }
    }
  );
}

function log() {
  if (true) {
    console.log.apply(console, arguments);
  }
}

app.post('/itemdetails', requestVerifier, function(req, res) {
  console.log(req.body.request.type)
  if (req.body.request.type === 'LaunchRequest') {
    res.json(getDescription());
    isFisrtTime = false
  } else if (req.body.request.type === 'SessionEndedRequest') { /* ... */
    log("Session End")
  }
  });
    
function handleDataMissing() {
  return buildResponse(MISSING_DETAILS, true, null)
}
  
  function getDescription() {

  var welcomeSpeechOutput = 'Welcome to Item Description<break time="0.3s" />'
  if (!isFisrtTime) {
    welcomeSpeechOutput = '';
  }
  
  var options = {
  url: 'http://129.191.22.15:7080/jderest/tokenrequest',
  method: 'POST',
  json: {
    "username": "RUPESHK",
    "password": "password1",
    "deviceName": "SoapUI",
    "environment": "JDV920",
    "role": "*ALL"
  }
};
request(options, function(error, response, body) {
  console.log(response.statusCode)
  if (!error && response.statusCode == 200) {
    console.log(response.statusCode)
    console.log(body.username)
    //console.log(body.userInfo.token) 
    // Print the shortened url.
    tokenValue = body.username
    console.log("Token Value is:" + tokenValue)
	}});

  const tempOutput = WHISPER + GET_DESCRIPTION_MESSAGE + tokenValue + PAUSE;
  const speechOutput = welcomeSpeechOutput + tempOutput + MORE_MESSAGE
  return buildResponse(speechOutput, false, "");

}

function buildResponse(speechText, shouldEndSession, cardText) {
const speechOutput = "<speak>" + speechText + "</speak>"
  var jsonObj = {
    "version": "1.0",
    "response": {
      "shouldEndSession": shouldEndSession,
      "outputSpeech": {
        "type": "SSML",
        "ssml": speechOutput
      }
    },
    "card": {
      "type": "Simple",
      "title": SKILL_NAME,
      "content": cardText,
      "text": cardText
    },
  }
  return jsonObj
}


app.listen(port);
console.log('Alexa list RESTful API server started on: ' + port);