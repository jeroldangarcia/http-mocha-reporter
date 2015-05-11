var request = require('supertest');

/**
 * Expose `List`.
 */
exports = module.exports = List;

/**
 * Initialize a new `List` test reporter.
 *
 * @param {Runner} runner
 * @api public
 */
function List(runner) {

  var self = this
    , stats = this.stats
    , total = runner.total;

  var mssg ;

  runner.on('start', function(){
    //
  });

  runner.on('test', function (test) {
    mssg = clean(test);
  });

  runner.on('pass', function(test){
    mssg = clean(test);
    mssg.successful = true;
    mssg.pending = false;
    mssg.failed = false;
  });

  runner.on('fail', function(test, err){
    mssg = clean(test);
    mssg.successful = false;
    mssg.pending = false;
    mssg.failed = true;
    mssg.err = err.message;
  });

  runner.on('test end', function(){
    POST('/console/test', mssg);
  });

  runner.on('suite', function (suite) {
    //POST('/console/suite', mssg);
  })
}

/**
 * Return a plain-object representation of `test`
 * free of cyclic properties etc.
 *
 * @param {Object} test
 * @return {Object}
 * @api private
 */

function clean(test) {
    return {
        name : test.title,
        description : test.fullTitle,
        duration : test.duration,
        pending : true
    }  
}

/**
 * Send an HTTP Post request to a remote defect API
 */
function POST (url, data) {
    request('http://127.0.0.1:3000')
        .post(url)
        .set('connection','keep-alive')
        .set('Content-Type', 'application/json')
        .send(data)
        .end(function (err, res) {
            //..
        });
}
