var restify = require('restify');

var config = require('../../../lib/lib-config').load('/config/config.json');

exports.get = function(req, res, next){

    var key = req.params.key;
    var tsS = req.params.start;
    var tsE = req.params.end;

    console.log(key + " " + tsS + " " + tsE)

    console.log(config.couchHost + ':' + config.couchPort + '/');

    var client = restify.createJsonClient({
        url: 'http://' + config.couchHost + ':' + config.couchPort + '/',
        version: '*'
    });

    client.get('/axihome/_design/getDeviceHistory/_view/getDeviceHistory?startkey="' + key + '-' + tsS + '"&endkey="' + key + '-' + tsE + '"' , function(cerr, creq, cres, cobj) {

	console.log(cerr);
	

        var val = [];

        for(var k in cobj.rows){

            // Get the item

            var item = cobj.rows[k];

            // Get the value

            var v = item.value.object.values[0].value;

            if(v === true) 
                v = 1;
            else if(v === false) 
                v = 0;

            // Add to array

	        var val = [item.value.timestamp * 1000, v];
	        val.push(val);
        }

        res.json(val);
    })
};


