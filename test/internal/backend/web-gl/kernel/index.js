const sinon = require('sinon');
const { assert, skip, test, module: describe, only } = require('qunit');
const { WebGLKernel } = require('../../../../../src');

describe('internal: WebGLKernel');

(typeof global !== 'undefined' ? test : skip)('.setupFeatureChecks() if context is available, but .getExtension() is falsey', () => {
  const mockContext = {
    getExtension: null // this is important
  };
  const mockElement = {
    getContext: () => mockContext,
  };
  const mockDocument = {
    createElement: () => {
      return mockElement;
    }
  };
  global.document = mockDocument;

  WebGLKernel.setupFeatureChecks();
  assert.ok(true);

  delete global.document;
});

test('.validateSettings() checks output texture size - too large', () => {
  const mockContext = {
    constructor: {
      features: {
        maxTextureSize: 1,
      },
    },
    checkOutput: () => {},
    output: [2],
    validate: true,
    checkTextureSize: WebGLKernel.prototype.checkTextureSize,
  };
  assert.throws(() => {
    WebGLKernel.prototype.validateSettings.apply(mockContext, []);
  }, new Error('Texture size [1,2] generated by kernel is larger than supported size [1,1]'));
});

test('.validateSettings() checks output texture size - ok', () => {
  const mockContext = {
    constructor: {
      features: {
        maxTextureSize: 1,
      },
    },
    checkOutput: () => {},
    output: [1],
    validate: true,
    checkTextureSize: WebGLKernel.prototype.checkTextureSize,
  };
  WebGLKernel.prototype.validateSettings.apply(mockContext, []);
  assert.ok(true);
});

test('.build() checks if already built, and returns early if true', () => {
  const mockContext = {
    built: true,
    initExtensions: sinon.spy(),
  };
  WebGLKernel.prototype.build.apply(mockContext);
  assert.equal(mockContext.initExtensions.callCount, 0);
});