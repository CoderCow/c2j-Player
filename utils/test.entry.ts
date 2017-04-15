'use strict';

// Exclude the main entry points of the application because if the web app
// would actually start up, it would mess up the code coverage report.
const FILES_TO_EXCLUDE = ['./index.ts', './main.ts'];

import chai = require('chai');
import chaiAsPromised = require('chai-as-promised');
import sinonChai = require('sinon-chai');

chai.use(chaiAsPromised as any);
chai.use(sinonChai as any);

// require all production and test code files
let testContext = require.context(
  '../public',
  true,
  /\.(jsx?|tsx?)$/
);

let moduleNames = testContext.keys().filter((path) => {
  return FILES_TO_EXCLUDE.indexOf(path) === -1;
});
console.log(moduleNames);
moduleNames.forEach(testContext);
