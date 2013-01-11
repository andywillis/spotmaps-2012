var redis = require('redis');
redis.debug_mode = true;

var client = redis.createClient(6379, 'nodejitsudb2518232178.redis.irstack.com');

client.auth('f327cfe980c971946e80b8e975fbebb4', function (err) {
  if (err) {
    throw err;
  }
});

client.on('ready', function () {

  // Set!
  client.set('foo', 'bar', function (err, res) {
    if (err) {
      throw err;
    }

    // Get!
    client.get('foo', function (err, foo) {
      if (err) {
        throw err;
      }

      console.log('foo = %s;', foo);

      client.quit();
    });
  });
});