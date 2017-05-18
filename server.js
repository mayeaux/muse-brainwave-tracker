var express = require('express');
var app = express();
var redis = require('redis')
var osc = require('osc')

var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser')

var lastPointTime = Date.now();
var now;

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

function logValues(){
	console.log('Total Charge ' + Math.round(totalWaves * 100) / 100);
  console.log('Delta (1-4Hz):    ' + museDelta + ' Relative: ' + deltaRelative + '%');
  console.log('Theta (4-8Hz):    ' + museTheta + ' Relative: ' + thetaRelative + '%');
  console.log('Alpha (8-13Hz):   ' + museAlpha + ' Relative: ' + alphaRelative + '%');
  console.log('Beta: (13-30Hz):  ' + museBeta + ' Relative: ' + betaRelative + '%');
  console.log('Gamma (30-44Hz): ' + museGamma + ' Relative: ' + gammaRelative + '%');
  console.log('\n')

}

// SEEMINGLY WORKING //

let oscAddress, museAlpha, museBeta, museDelta, museTheta, museGamma;

let alphaRelative, betaRelative, deltaRelative, thetaRelative, gammaRelative;

let totalWaves;

// Listen for incoming OSC bundles.
udpPort.on("message", function (oscData) {

	// console.log(oscData);

  // alpha_relative = alpha_absolute / (alpha_absolute + beta_absolute + delta_absolute + gamma_absolute + theta_absolute)



  oscAddress = oscData.address;
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
  if(oscAddress == '/muse/elements/beta_absolute'){
    museBeta = Number(oscData.args[0].toFixed(4));
  }
  if(oscAddress == '/muse/elements/delta_absolute'){
    museDelta = Number(oscData.args[0].toFixed(4));
  }
  if(oscAddress == '/muse/elements/theta_absolute'){
    museTheta = Number(oscData.args[0].toFixed(4));
  }
  if(oscAddress == '/muse/elements/gamma_absolute'){
    museGamma= Number(oscData.args[0].toFixed(4));
  }

	totalWaves = museAlpha + museBeta + museDelta + museTheta + museGamma;

  if(oscAddress == '/muse/elements/alpha_absolute'){
    alphaRelative = museAlpha / totalWaves;
    alphaRelative  = Math.round(alphaRelative * 100);

    // console.log('Alpha relative' + alphaRelative);
  }

  if(oscAddress == '/muse/elements/beta_absolute'){
    betaRelative = museBeta / totalWaves;
    betaRelative  = Math.round(betaRelative * 100);

  }

  if(oscAddress == '/muse/elements/delta_absolute'){
    deltaRelative = museDelta / totalWaves;
    deltaRelative  = Math.round(deltaRelative * 100);
  }

  if(oscAddress == '/muse/elements/theta_absolute'){
    thetaRelative = museTheta / totalWaves;
    thetaRelative  = Math.round(thetaRelative * 100);
  }

  if(oscAddress == '/muse/elements/gamma_absolute'){
		gammaRelative = museGamma / totalWaves;
    gammaRelative  = Math.round(gammaRelative * 100);
  }



  // console.log(totalWaves)






  //

});

setTimeout(function(){
  logValues();
}, 1000)


setInterval(function(){
  logValues();
}, 3000)


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
