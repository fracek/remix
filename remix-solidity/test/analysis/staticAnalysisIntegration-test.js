var test = require('tape')

var StatRunner = require('../../src/analysis/staticAnalysisRunner')
// const util = require('util')

var solc = require('solc/wrapper')
var compiler = solc(require('../../soljson'))

var fs = require('fs')
var path = require('path')

var testFiles = [
  'KingOfTheEtherThrone.sol',
  'assembly.sol',
  'ballot.sol',
  'ballot_reentrant.sol',
  'ballot_withoutWarnings.sol',
  'cross_contract.sol',
  'inheritance.sol',
  'modifier1.sol',
  'modifier2.sol',
  'notReentrant.sol',
  'structReentrant.sol',
  'thisLocal.sol',
  'globals.sol',
  'library.sol',
  'transfer.sol',
  'ctor.sol',
  'forgottenReturn.sol',
  'selfdestruct.sol'
]

var testFileAsts = {}

testFiles.forEach((fileName) => {
  var content = fs.readFileSync(path.join(__dirname, 'test-contracts', fileName), 'utf8')
  testFileAsts[fileName] = JSON.parse(compiler.compileStandardWrapper(compilerInput(content)))
})

test('Integration test thisLocal.js', function (t) {
  t.plan(testFiles.length)

  var module = require('../../src/analysis/modules/thisLocal')

  var lengthCheck = {
    'KingOfTheEtherThrone.sol': 0,
    'assembly.sol': 0,
    'ballot.sol': 0,
    'ballot_reentrant.sol': 1,
    'ballot_withoutWarnings.sol': 0,
    'cross_contract.sol': 0,
    'inheritance.sol': 0,
    'modifier1.sol': 0,
    'modifier2.sol': 0,
    'notReentrant.sol': 0,
    'structReentrant.sol': 0,
    'thisLocal.sol': 1,
    'globals.sol': 0,
    'library.sol': 0,
    'transfer.sol': 0,
    'ctor.sol': 0,
    'forgottenReturn.sol': 0,
    'selfdestruct.sol': 0
  }

  runModuleOnFiles(module, t, (file, report) => {
    t.equal(report.length, lengthCheck[file], `${file} has right amount of this local warnings`)
  })
})

test('Integration test checksEffectsInteraction.js', function (t) {
  t.plan(testFiles.length)

  var module = require('../../src/analysis/modules/checksEffectsInteraction')

  var lengthCheck = {
    'KingOfTheEtherThrone.sol': 1,
    'assembly.sol': 1,
    'ballot.sol': 0,
    'ballot_reentrant.sol': 1,
    'ballot_withoutWarnings.sol': 0,
    'cross_contract.sol': 0,
    'inheritance.sol': 1,
    'modifier1.sol': 0,
    'modifier2.sol': 0,
    'notReentrant.sol': 0,
    'structReentrant.sol': 1,
    'thisLocal.sol': 0,
    'globals.sol': 1,
    'library.sol': 1,
    'transfer.sol': 1,
    'ctor.sol': 0,
    'forgottenReturn.sol': 0,
    'selfdestruct.sol': 0
  }

  runModuleOnFiles(module, t, (file, report) => {
    t.equal(report.length, lengthCheck[file], `${file} has right amount of checks-effects-interaction warnings`)
  })
})

test('Integration test constantFunctions.js', function (t) {
  t.plan(testFiles.length)

  var module = require('../../src/analysis/modules/constantFunctions')

  var lengthCheck = {
    'KingOfTheEtherThrone.sol': 0,
    'assembly.sol': 0,
    'ballot.sol': 0,
    'ballot_reentrant.sol': 0,
    'ballot_withoutWarnings.sol': 0,
    'cross_contract.sol': 1,
    'inheritance.sol': 0,
    'modifier1.sol': 1,
    'modifier2.sol': 0,
    'notReentrant.sol': 0,
    'structReentrant.sol': 0,
    'thisLocal.sol': 1,
    'globals.sol': 0,
    'library.sol': 1,
    'transfer.sol': 0,
    'ctor.sol': 0,
    'forgottenReturn.sol': 0,
    'selfdestruct.sol': 1
  }

  runModuleOnFiles(module, t, (file, report) => {
    t.equal(report.length, lengthCheck[file], `${file} has right amount of constant warnings`)
  })
})

test('Integration test inlineAssembly.js', function (t) {
  t.plan(testFiles.length)

  var module = require('../../src/analysis/modules/inlineAssembly')

  var lengthCheck = {
    'KingOfTheEtherThrone.sol': 0,
    'assembly.sol': 2,
    'ballot.sol': 0,
    'ballot_reentrant.sol': 0,
    'ballot_withoutWarnings.sol': 0,
    'cross_contract.sol': 0,
    'inheritance.sol': 0,
    'modifier1.sol': 0,
    'modifier2.sol': 0,
    'notReentrant.sol': 0,
    'structReentrant.sol': 0,
    'thisLocal.sol': 0,
    'globals.sol': 0,
    'library.sol': 0,
    'transfer.sol': 0,
    'ctor.sol': 0,
    'forgottenReturn.sol': 0,
    'selfdestruct.sol': 0
  }

  runModuleOnFiles(module, t, (file, report) => {
    t.equal(report.length, lengthCheck[file], `${file} has right amount of inline assembly warnings`)
  })
})

test('Integration test txOrigin.js', function (t) {
  t.plan(testFiles.length)

  var module = require('../../src/analysis/modules/txOrigin')

  var lengthCheck = {
    'KingOfTheEtherThrone.sol': 0,
    'assembly.sol': 1,
    'ballot.sol': 0,
    'ballot_reentrant.sol': 0,
    'ballot_withoutWarnings.sol': 0,
    'cross_contract.sol': 0,
    'inheritance.sol': 0,
    'modifier1.sol': 0,
    'modifier2.sol': 0,
    'notReentrant.sol': 0,
    'structReentrant.sol': 0,
    'thisLocal.sol': 0,
    'globals.sol': 1,
    'library.sol': 0,
    'transfer.sol': 0,
    'ctor.sol': 0,
    'forgottenReturn.sol': 0,
    'selfdestruct.sol': 0
  }

  runModuleOnFiles(module, t, (file, report) => {
    t.equal(report.length, lengthCheck[file], `${file} has right amount of tx.origin warnings`)
  })
})

test('Integration test gasCosts.js', function (t) {
  t.plan(testFiles.length)

  var module = require('../../src/analysis/modules/gasCosts')

  var lengthCheck = {
    'KingOfTheEtherThrone.sol': 2,
    'assembly.sol': 2,
    'ballot.sol': 3,
    'ballot_reentrant.sol': 2,
    'ballot_withoutWarnings.sol': 0,
    'cross_contract.sol': 1,
    'inheritance.sol': 1,
    'modifier1.sol': 0,
    'modifier2.sol': 1,
    'notReentrant.sol': 1,
    'structReentrant.sol': 1,
    'thisLocal.sol': 2,
    'globals.sol': 1,
    'library.sol': 1,
    'transfer.sol': 1,
    'ctor.sol': 0,
    'forgottenReturn.sol': 3,
    'selfdestruct.sol': 0
  }

  runModuleOnFiles(module, t, (file, report) => {
    t.equal(report.length, lengthCheck[file], `${file} has right amount of gasCost warnings`)
  })
})

test('Integration test similarVariableNames.js', function (t) {
  t.plan(testFiles.length)

  var module = require('../../src/analysis/modules/similarVariableNames')

  var lengthCheck = {
    'KingOfTheEtherThrone.sol': 0,
    'assembly.sol': 0,
    'ballot.sol': 2,
    'ballot_reentrant.sol': 3,
    'ballot_withoutWarnings.sol': 0,
    'cross_contract.sol': 0,
    'inheritance.sol': 0,
    'modifier1.sol': 0,
    'modifier2.sol': 0,
    'notReentrant.sol': 1,
    'structReentrant.sol': 0,
    'thisLocal.sol': 0,
    'globals.sol': 0,
    'library.sol': 0,
    'transfer.sol': 0,
    'ctor.sol': 1,
    'forgottenReturn.sol': 0,
    'selfdestruct.sol': 0
  }

  runModuleOnFiles(module, t, (file, report) => {
    t.equal(report.length, lengthCheck[file], `${file} has right amount of similarVariableNames warnings`)
  })
})

test('Integration test inlineAssembly.js', function (t) {
  t.plan(testFiles.length)

  var module = require('../../src/analysis/modules/inlineAssembly')

  var lengthCheck = {
    'KingOfTheEtherThrone.sol': 0,
    'assembly.sol': 2,
    'ballot.sol': 0,
    'ballot_reentrant.sol': 0,
    'ballot_withoutWarnings.sol': 0,
    'cross_contract.sol': 0,
    'inheritance.sol': 0,
    'modifier1.sol': 0,
    'modifier2.sol': 0,
    'notReentrant.sol': 0,
    'structReentrant.sol': 0,
    'thisLocal.sol': 0,
    'globals.sol': 0,
    'library.sol': 0,
    'transfer.sol': 0,
    'ctor.sol': 0,
    'forgottenReturn.sol': 0,
    'selfdestruct.sol': 0
  }

  runModuleOnFiles(module, t, (file, report) => {
    t.equal(report.length, lengthCheck[file], `${file} has right amount of inlineAssembly warnings`)
  })
})

test('Integration test blockTimestamp.js', function (t) {
  t.plan(testFiles.length)

  var module = require('../../src/analysis/modules/blockTimestamp')

  var lengthCheck = {
    'KingOfTheEtherThrone.sol': 1,
    'assembly.sol': 0,
    'ballot.sol': 0,
    'ballot_reentrant.sol': 3,
    'ballot_withoutWarnings.sol': 0,
    'cross_contract.sol': 0,
    'inheritance.sol': 0,
    'modifier1.sol': 0,
    'modifier2.sol': 0,
    'notReentrant.sol': 0,
    'structReentrant.sol': 0,
    'thisLocal.sol': 0,
    'globals.sol': 2,
    'library.sol': 0,
    'transfer.sol': 0,
    'ctor.sol': 0,
    'forgottenReturn.sol': 0,
    'selfdestruct.sol': 0
  }

  runModuleOnFiles(module, t, (file, report) => {
    t.equal(report.length, lengthCheck[file], `${file} has right amount of blockTimestamp warnings`)
  })
})

test('Integration test lowLevelCalls.js', function (t) {
  t.plan(testFiles.length)

  var module = require('../../src/analysis/modules/lowLevelCalls')

  var lengthCheck = {
    'KingOfTheEtherThrone.sol': 1,
    'assembly.sol': 1,
    'ballot.sol': 0,
    'ballot_reentrant.sol': 7,
    'ballot_withoutWarnings.sol': 0,
    'cross_contract.sol': 1,
    'inheritance.sol': 1,
    'modifier1.sol': 0,
    'modifier2.sol': 0,
    'notReentrant.sol': 1,
    'structReentrant.sol': 1,
    'thisLocal.sol': 2,
    'globals.sol': 1,
    'library.sol': 1,
    'transfer.sol': 0,
    'ctor.sol': 0,
    'forgottenReturn.sol': 0,
    'selfdestruct.sol': 0
  }

  runModuleOnFiles(module, t, (file, report) => {
    t.equal(report.length, lengthCheck[file], `${file} has right amount of lowLevelCalls warnings`)
  })
})

test('Integration test blockBlockhash.js', function (t) {
  t.plan(testFiles.length)

  var module = require('../../src/analysis/modules/blockBlockhash')

  var lengthCheck = {
    'KingOfTheEtherThrone.sol': 0,
    'assembly.sol': 0,
    'ballot.sol': 0,
    'ballot_reentrant.sol': 0,
    'ballot_withoutWarnings.sol': 0,
    'cross_contract.sol': 0,
    'inheritance.sol': 0,
    'modifier1.sol': 0,
    'modifier2.sol': 0,
    'notReentrant.sol': 0,
    'structReentrant.sol': 0,
    'thisLocal.sol': 0,
    'globals.sol': 0, // was 1 !! @TODO
    'library.sol': 0,
    'transfer.sol': 0,
    'ctor.sol': 0,
    'forgottenReturn.sol': 0,
    'selfdestruct.sol': 0
  }

  runModuleOnFiles(module, t, (file, report) => {
    t.equal(report.length, lengthCheck[file], `${file} has right amount of blockBlockhash warnings`)
  })
})

test('Integration test noReturn.js', function (t) {
  t.plan(testFiles.length)

  var module = require('../../src/analysis/modules/noReturn')

  var lengthCheck = {
    'KingOfTheEtherThrone.sol': 0,
    'assembly.sol': 1,
    'ballot.sol': 0,
    'ballot_reentrant.sol': 0,
    'ballot_withoutWarnings.sol': 0,
    'cross_contract.sol': 0,
    'inheritance.sol': 0,
    'modifier1.sol': 1,
    'modifier2.sol': 0,
    'notReentrant.sol': 0,
    'structReentrant.sol': 0,
    'thisLocal.sol': 1,
    'globals.sol': 0,
    'library.sol': 0,
    'transfer.sol': 0,
    'ctor.sol': 0,
    'forgottenReturn.sol': 1,
    'selfdestruct.sol': 0
  }

  runModuleOnFiles(module, t, (file, report) => {
    t.equal(report.length, lengthCheck[file], `${file} has right amount of noReturn warnings`)
  })
})

test('Integration test selfdestruct.js', function (t) {
  t.plan(testFiles.length)

  var module = require('../../src/analysis/modules/selfdestruct')

  var lengthCheck = {
    'KingOfTheEtherThrone.sol': 0,
    'assembly.sol': 0,
    'ballot.sol': 0,
    'ballot_reentrant.sol': 0,
    'ballot_withoutWarnings.sol': 0,
    'cross_contract.sol': 0,
    'inheritance.sol': 0,
    'modifier1.sol': 0,
    'modifier2.sol': 0,
    'notReentrant.sol': 0,
    'structReentrant.sol': 0,
    'thisLocal.sol': 0,
    'globals.sol': 1,
    'library.sol': 0,
    'transfer.sol': 0,
    'ctor.sol': 0,
    'forgottenReturn.sol': 0,
    'selfdestruct.sol': 2
  }

  runModuleOnFiles(module, t, (file, report) => {
    t.equal(report.length, lengthCheck[file], `${file} has right amount of selfdestruct warnings`)
  })
})

// #################### Helpers
function runModuleOnFiles (module, t, cb) {
  var statRunner = new StatRunner()

  testFiles.forEach((fileName) => {
    statRunner.runWithModuleList(testFileAsts[fileName], [{ name: module.name, mod: new module.Module() }], (reports) => {
      cb(fileName, reports[0].report)
    })
  })
}

function compilerInput (contracts) {
  return JSON.stringify({
    language: 'Solidity',
    sources: {
      'test.sol': {
        content: contracts
      }
    },
    settings: {
      optimizer: {
        enabled: false,
        runs: 500
      }
    },
    outputSelection: {
      '*': {
        '*': [ 'metadata', 'evm.bytecode', 'abi', 'legacyAST', 'metadata', 'evm.assembly', 'evm.methodIdentifiers', 'evm.gasEstimates' ]
      }
    }
  })
}
