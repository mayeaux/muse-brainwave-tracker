var express = require('express');
var app = express();
var redis = require('redis')
var osc = require('osc')

var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser')

var lastPointTime = Date.now();
var now;
var _ = require('lodash');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded())
app.use(express.static(__dirname + '/public'));

var udpPort = new osc.UDPPort({
    localAddress: "192.168.0.155",
    localPort: 5000
});

udpPort.open();


// function logValues(){
//   console.log('Alpha: ' + museAlpha);
//   console.log('Beta: ' + museBeta);
//   console.log('Delta: ' + museDelta);
//   console.log('Theta: ' + museTheta);
//   console.log('Gamma: ' + museGamma);
//   console.log('\n')
//
// }

function logRelativeValues(){
	console.log('Total Charge ' + Math.round(totalWaves * 100) / 100);
  console.log('Delta (1-4Hz):   ' + deltaRelative + '%');
  console.log('Theta (4-8Hz):   ' + thetaRelative + '%');
  console.log('Alpha (8-13Hz):  ' + alphaRelative + '%');
  console.log('Beta: (13-30Hz): ' + betaRelative + '%');
  console.log('Gamma (30-44Hz): ' + gammaRelative + '%');
  console.log('\n')

}

function logAbsoluteValues(){
  console.log('Total Charge ' + Math.round(totalWaves * 100) / 100);
  console.log('Delta (1-4Hz):   ' + museDelta);
  console.log('Theta (4-8Hz):   ' + museTheta);
  console.log('Alpha (8-13Hz):  ' + museAlpha);
  console.log('Beta: (13-30Hz): ' + museBeta);
  console.log('Gamma (30-44Hz): ' + museGamma);
  console.log('\n')

}

function logAbsoluteValuesExponentiated(){
  console.log('Total Charge ' + Math.round(totalWaves * 100) / 100);
  console.log('Delta (1-4Hz):   ' + Math.pow(10, museDelta));
  console.log('Theta (4-8Hz):   ' + Math.pow(10, museTheta));
  console.log('Alpha (8-13Hz):  ' + Math.pow(10, museAlpha));
  console.log('Beta: (13-30Hz): ' + Math.pow(10, museBeta));
  console.log('Gamma (30-44Hz): ' + Math.pow(10, museGamma));
  console.log('\n')

}

// SEEMINGLY WORKING //

let oscAddress, museAlpha, museBeta, museDelta, museTheta, museGamma;

let alphaRelative, betaRelative, deltaRelative, thetaRelative, gammaRelative;

const brainwaves = ['alpha', 'beta', 'theta', 'delta', 'gamma'];

let museData = {
  absoluteValues : {},
  relativeBandPower : {}
};

// Listen for incoming OSC bundles.
udpPort.on("message", function (oscData) {

  let totalWaves = 0;

  oscAddress = oscData.address;

  for(const brainwave of brainwaves){
    let oscPath = `/muse/elements/${brainwave}_absolute`;
    if(oscPath == oscAddress){
      const absoluteBrainwaveValue = oscData.args[0];

      // getting the data
      museData.absoluteValues[brainwave] = absoluteBrainwaveValue;
      museData.relativeBandPower[brainwave] = Math.pow(10,absoluteBrainwaveValue);
    }
  }

  // console.log('hello')
  //
  // console.log(museData.absoluteValues);

  console.log(_.isEmpty(museData.absoluteValues))

  if(!_.isEmpty(museData.absoluteValues)){

    for (let [brainwave, absoluteValue] of Object.entries(museData.absoluteValues)){
      totalWaves = totalWaves += absoluteValue
    }
    console.log(totalWaves);
  }



	const oscValue =  oscData.args[0].toFixed(4);
  //
  //
  // if(oscAddress == '/muse/elements/jaw_clench'){
   //  console.log('Jaw Clench: '  + oscData.args + '\n');
  // }
  //
	// if(oscAddress == '/muse/batt'){
	// 	console.log('Battery: '  + oscData.args + '\n');
	// }

  // if(oscAddress == '/muse/elements/blink'){
  //   console.log('Blink: '  + oscData.args);
  // }



	// add up all 5 of the values
	// divide it
  if(oscAddress == '/muse/elements/alpha_absolute'){
    museAlpha = Number(oscData.args[0].toFixed(4));
  }


  if(oscAddress == '/muse/elements/alpha_absolute') {
    alphaRelative = museAlpha / totalWaves;
    alphaRelative = Math.round(alphaRelative * 100);
  }

});

// setTimeout(function(){
//   for(const brainwave of brainwaves){
//     console.log(global[brainwave] + ' ' + brainwave)
//   }
//   console.log(museData);
// }, 950)

// setTimeout(function(){
//   logValues();
// }, 1000)


setInterval(function(){
  // logRelativeValues();
}, 950)


// setTimeout(function(){
//   console.log('Alpha Absolute: ' + museAlpha);
// }, 4000);
//
//
// setTimeout(function(){
//   console.log('Alpha Absolute: ' + museAlpha);
// }, 6000);

// SEEMINGLY WORKING //







// OLD CODE //

// io.on('connection', function (socket) {
//     console.log("socket.io connection");
//   	socket.emit('news', { hello: 'world' });
// /*
// 	setInterval(function(){
// 		var testData = {
// 			address: "/muse/eeg",
// 			args: [100, 200, 300, 400]
// 		}
// 		socket.emit('news', testData);
// 	}, 1000);
// */
//   	// Listen for incoming OSC bundles.
// 	udpPort.on("message", function (oscData) {
// 		now = Date.now()
// 		if((now-lastPointTime <= 1000) || (lastPointTime-now <= 1000)) {
// 			lastPointTime = now
// 			socket.emit('news', oscData);
// 		}
// 	});
//
// });

// OLD CODE //



// // LOG RAW DATA //
//
// let oscAddress, museAlpha;
//
// // Listen for incoming OSC bundles.
// udpPort.on("message", function (oscData) {
//
//   console.log(oscData);
// });
//
// // LOG RAW DATA //


var port = Number(process.env.PORT || 3000);
server.listen(port, function() {
  console.log("Listening on " + port);
});
