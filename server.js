var _ = require('lodash');
var express = require('express');
var app = express();
var redis = require('redis')
var osc = require('osc')

var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded())
app.use(express.static(__dirname + '/public'));

var udpPort = new osc.UDPPort({
    localAddress: "192.168.0.155",
    localPort: 5000
});

udpPort.open();

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

function logBrainwaves(){
  let date = new Date().toLocaleTimeString();

  console.log(date);

  let totalWaves = 0;

  for(const brainwave of brainwaves){
    totalWaves += museData.absoluteValues[brainwave]
  }
  console.log(`Total Charge: ${totalWaves.toFixed(2)}`);
  // let keysSorted = Object.keys(museData.absoluteValues).sort(function(a,b){return museData.absoluteValues[a]-museData.absoluteValues[b]})

  //
  // for(const brainwave of brainwaves){
  //   console.log(`${brainwave} ${museData.frequencies[brainwave]}: ${((museData.absoluteValues[brainwave]/totalWaves) * 100).toFixed(2)} %`);
  // }

  for(const brainwave of brainwaves){
    const absoluteWave = museData.absoluteValues[brainwave];

    console.log(`${brainwave} ${museData.frequencies[brainwave]}: ${absoluteWave.toFixed(2)}`);
  }


  console.log('\n');

  // console.log(keysSorted)
  //
  // console.log('\n')
  //
  // console.log(museData.absoluteValues)
  //
  // console.log('\n')

}

let oscAddress;

const brainwaves = ['delta', 'theta', 'alpha', 'beta', 'gamma'];

// hold all data in memory
let museData = {
  absoluteValues : {},
  relativeBandPower : {},
  frequencies : {
    alpha: '(8-13Hz)',
    beta: '(13-30Hz)',
    delta: '(1-4Hz)',
    gamma: '(30-44Hz)',
    theta: '(4-8Hz)'
  }
};

// Listen for incoming OSC bundles.
udpPort.on("message", function (oscData) {
  // console.log(oscData);

  oscAddress = oscData.address;

  // start building up data
  for(const brainwave of brainwaves){
    let oscPath = `/muse/elements/${brainwave}_absolute`;
    if(oscPath == oscAddress){
      const absoluteBrainwaveValue = oscData.args[0];

      // getting the data, adding one to make all values positive
      museData.absoluteValues[brainwave] = absoluteBrainwaveValue + 1;
    }
  }

});


setInterval(function(){

  // logBrainwaves();

}, 1500);







// OLD CODE //

io.on('connection', function (socket) {
    console.log("socket.io connection");
  	socket.emit('news', { hello: 'world' });

	setInterval(function(){
		var testData = {
			address: "/muse/eeg",
			args: [100, 200, 300, 400]
		}
		socket.emit('news', testData);
	}, 1000);

  	// Listen for incoming OSC bundles.
	udpPort.on("message", function (oscData) {
		now = Date.now()
		if((now-lastPointTime <= 1000) || (lastPointTime-now <= 1000)) {
			lastPointTime = now
			socket.emit('news', oscData);
		}
	});

});

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
  console.log("Listening on " + port + '\n');
});
