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




// SEEMINGLY WORKING //

// Listen for incoming OSC bundles.
udpPort.on("message", function (oscData) {


	oscAddress = oscData.address;

	if(oscAddress == '/muse/elements/alpha_absolute'){
    museAlpha = oscData.args[0];
    console.log(museAlpha + ' muse alpha')
	}
});

setTimeout(function(){
  console.log('Alpha Absolute: ' + museAlpha);
}, 2000);

setTimeout(function(){
  console.log('Alpha Absolute: ' + museAlpha);
}, 4000);


setTimeout(function(){
  console.log('Alpha Absolute: ' + museAlpha);
}, 6000);







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
