'use strict';

describe('Service: RapicaParse', function () {

  // load the service's module
  beforeEach(module('rapicaAnalyzeApp'));

  // instantiate service
  var RapicaParse;
  beforeEach(inject(function (_RapicaParse_) {
    RapicaParse = _RapicaParse_;
  }));

  it('should do something', function () {
    expect(!!RapicaParse).toBe(true);
  });

});
