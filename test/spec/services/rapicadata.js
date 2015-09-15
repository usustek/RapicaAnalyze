'use strict';

describe('Service: RapicaData', function () {

  // load the service's module
  beforeEach(module('rapicaAnalyzeApp'));

  // instantiate service
  var RapicaData;
  beforeEach(inject(function (_RapicaData_) {
    RapicaData = _RapicaData_;
  }));

  it('should do something', function () {
    expect(!!RapicaData).toBe(true);
  });

});
