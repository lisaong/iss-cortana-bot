var assert = require('assert');
var ssml = require('../src/ssml');

describe('SSML', function() {
  describe('#speak()', function() {
    it('should return expected SSML', function() {
      var expected = "<speak xmlns=\"http://www.w3.org/2001/10/synthesis\" version=\"1.0\" xml:lang=\"en-US\">help</speak>";
      var result = ssml.speak('help');
      assert.equal(result, expected)
    });
  });
});