$( function() {

        var socket = io.connect( "http://localhost:3000" );
        socket.on( "news", function(value) {
            if (!(value.args && value.address == "/muse/eeg"))
                return;

            var xVal = (new Date()).getTime(), // current time
                yVal = value.args[0];

            data[0].push( value.args[0] );
            data[1].push( value.args[1] );
            data[2].push( value.args[2] );
            data[3].push( value.args[3] );

            path
                .attr( "d", line )
                .attr( "transform", null )
                .transition()
                .duration( 750 )
                .ease( "linear" )
                .attr( "transform", "translate(" + x( 0 ) + ")" );

            // pop the old data point off the front
            data[0].shift();
            data[1].shift();
            data[2].shift();
            data[3].shift();
        } );

} );
