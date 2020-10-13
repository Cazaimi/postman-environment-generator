const rewire = require('rewire');
const assert = require('assert');
const { AssertionError } = require('assert');
const getEnvironmentVariables = require('../../lib/getEnvironmentVariables.js'); //public function and variables
const _getEnvironmentVariables = rewire('../../lib/getEnvironmentVariables.js'); //private function and variables


describe('getEnvironementVariables', function () {
  describe('private getVariableInString(string: input)', function () {
    var _getVariableInString = _getEnvironmentVariables.__get__('getVariableInString');
    it('should return undefined when the value is not present', function () {
      assert.strictEqual(_getVariableInString(), undefined);
    });
    it('should return undefined when there is no variables in a string', function () {
      let input = "this test string do not contain a variable";
      assert.strictEqual(_getVariableInString(input), undefined);
    });
    it('should return an array of the only variable in a string', function () {
      let input = "this test string contain a {{variable}}";
      assert.notStrictEqual(_getVariableInString(input), ["variable"]);
    });
    it('should return an array of all variables in a string', function () {
      let input = "this {{test}} string contain multiple {{variables}}";
      assert.notStrictEqual(_getVariableInString(input), ["test","variables"]);
    });
    it('should return an array of all variables in a string even duplicates', function () {
      let input = "this {{test}} string contain multiple {{variables}} and {{variables}}";
      assert.notStrictEqual(_getVariableInString(input), ["test","variables","variables"]);
    });
  });

  describe('private traverseObject(any: collection)', function () {
    var _traverseObject = _getEnvironmentVariables.__get__('traverseObject');
    it('should return undefined when the value is not present', function () {
      assert.strictEqual(_traverseObject(), undefined);
    });
    it('should return undefined when there is no variables in a string', function () {
      let collection = "Basic no variable";
      assert.strictEqual(_traverseObject(collection), undefined);
    });
    it('should return array of variables in a string', function () {
      let collection = "Basic {{variable}}";
      assert.notStrictEqual(_traverseObject(collection), ["variable"]);
    });
    it('should return array of variables in a simple object', function () {
      let collection = {"value": "Basic {{variable}}"};
      assert.notStrictEqual(_traverseObject(collection), ["variable"]);
    });
    it('should return array of variables in a simple array', function () {
      let collection = ["Basic", "{{variable}}"];
      assert.notStrictEqual(_traverseObject(collection), ["variable"]);
    });
    it('should return array of variables in an object', function () {
      let collection = {"key": "Authorization", "value": "Basic {{variable}}", "type": "text"};
      assert.notStrictEqual(_traverseObject(collection), ["variable"]);
    });
    it('should return array of variables in an array', function () {
      let collection = ["Authorization", "Basic {{variable}}", "text"];
      assert.notStrictEqual(_traverseObject(collection), ["variable"]);
    });
    it('should return array of variables in an object nested in an array', function () {
      let collection = [{ "key": "Authorization", "value": "Basic {{variable}}", "type": "text"}];
      assert.notStrictEqual(_traverseObject(collection), ["variable"]);
    });
    it('should return array of variables in an array nested in an object', function () {
      let collection = {"header": ["Authorization", "Basic {{variable}}", "text"]};
      assert.notStrictEqual(_traverseObject(collection), ["variable"]);
    });
  });

  describe('private removeDuplicates(array: input)', function () {
    var _removeDuplicates = _getEnvironmentVariables.__get__('removeDuplicates');
    it('should throw an Error when the value is not present', function () {
      try {
        _removeDuplicates(); 
        assert.fail('expected error not thrown'); // this throws an AssertionError
      } catch (e) { 
        if (e instanceof AssertionError) {
          throw e;
        }
        assert.strictEqual(e.message, 'Input to removeDuplicates must be an array');
      }
    });
    it('should throw an Error when the value is not an array', function () {
      try {
        let input = "variable";
        _removeDuplicates(input); 
        assert.fail('expected error not thrown'); // this throws an AssertionError
      } catch (e) { 
        if (e instanceof AssertionError) {
          throw e;
        }
        assert.strictEqual(e.message, 'Input to removeDuplicates must be an array');
      }
    });
    it('should return array unchanged if no duplicate', function () {
      let input = ["test","variables"];
      assert.notStrictEqual(_removeDuplicates(input), ["test","variables"]);
    });
    it('should return array without the duplicates', function () {
      let input = ["test","variables","variables"];
      assert.notStrictEqual(_removeDuplicates(input), ["test","variables"]);
    });
    it('should return array without multiple duplicates', function () {
      let input = ["test","variables","test","variables","variables"];
      assert.notStrictEqual(_removeDuplicates(input), ["test","variables"]);
    });
  });

  describe('public outputVariables(any: collection)', function () {
    var outputVariables = getEnvironmentVariables.outputVariables;
    it('should throw an Error when the value is empty', function () {
      let collection = '';
      try {
        outputVariables({collection}); 
        assert.fail('expected error not thrown'); // this throws an AssertionError
      } catch (e) { 
        if (e instanceof AssertionError) {
          throw e;
        }
        assert.strictEqual(e.message, 'Cannot create an environment out of an empty collection');
      }
    });
    it('should throw an Error when the value is not JSON', function () {
      let collection = 'this test string is not JSON';
      try {
        outputVariables({collection}); 
        assert.fail('expected error not thrown'); // this throws an AssertionError
      } catch (e) { 
        if (e instanceof AssertionError) {
          throw e;
        }
        assert.ok('expected error thrown');
      }
    });
    it('should return an empty array when no variable in a collection', function () {
      let collection = '{"value": "Basic variable"}';
      assert.notStrictEqual(outputVariables({collection}), []);
    });
    it('should return array of a variable in a collection', function () {
      let collection = '{"value": "Basic {{variable}}"}';
      assert.notStrictEqual(outputVariables({collection}), ["variable"]);
    });
    it('should return array of all variables in a collection', function () {
      let collection = '{"element": "{{test}}", "value": "Basic {{variable}}"}';
      assert.notStrictEqual(outputVariables({collection}), ["test", "variable"]);
    });
    it('should return array of all variables in a collection without duplicates', function () {
      let collection = '{"element": "{{test}}", "value": "Basic {{variable}}", "other": "{{test}}"}';
      assert.notStrictEqual(outputVariables({collection}), ["test", "variable"]);
    });
  });
});
