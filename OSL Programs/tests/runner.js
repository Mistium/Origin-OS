const fs = require('fs');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');

const TEST_ROOT = __dirname;

const tests = new Map();     // id -> test
const completed = new Set(); // ids

function loadTests() {
  tests.clear();
  completed.clear();

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        walk(fullPath);
        continue;
      }

      if (!entry.name.endsWith('.test.js')) continue;

      delete require.cache[require.resolve(fullPath)];
      const mod = require(fullPath);

      if (!Array.isArray(mod.tests)) continue;

      for (const test of mod.tests) {
        test._logs = [];
        tests.set(test.id, test);
      }
    }
  }

  walk(TEST_ROOT);

  if (tests.size === 0) {
    console.error('❌ No tests found');
    process.exit(1);
  }
}

loadTests();

http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/rotur') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('ok');
    return;
  }

  res.writeHead(404);
  res.end();
}).listen(5001, '127.0.0.1', () => {
  console.log('HTTP  http://127.0.0.1:5001/rotur');
});

const wsServer = new WebSocket.Server({
  host: '127.0.0.1',
  port: 5002
});

let start = 0;

wsServer.on('connection', socket => {
  console.log('WS client connected');
  start = performance.now();

  socket.send(JSON.stringify({cmd: 'handshake', mode: 'test'}))

  for (const test of tests.values()) {
    socket.send(JSON.stringify({
      cmd: 'test',
      id: test.id,
      code: test.code
    }));
  }

  socket.on('message', raw => {
    let msg;
    try {
      msg = JSON.parse(raw);
    } catch {
      return;
    }

    const test = tests.get(msg.id);
    if (!test) return;

    if ('log' in msg) {
      test._logs.push(msg.log);
    }

    if (msg.done === true) {
      if (!completed.has(msg.id)) {
        completed.add(msg.id);
        console.log(`(${completed.size}/${tests.size}) [${test.name}] done`);
      }

      if (completed.size === tests.size) {
        finish();
      }
    }
  });
});

wsServer.on('listening', () => {
  console.log('WS    ws://127.0.0.1:5002');
});

function finish() {
  let failed = 0;

  for (const test of tests.values()) {
    const pass =
      JSON.stringify(test._logs) === JSON.stringify(test.expect);

    if (!pass) {
      failed++;
      console.log(`❌ ${test.name}`);
      console.log('   expected:', test.expect);
      console.log('   received:', test._logs);
    }
  }

  let passed = tests.size - failed;

  console.log(`\n🌈 Test Results (${tests.size} tests)`);
  console.log(`   Passed: ${passed}`);
  console.log(`   Failed: ${failed}`);
  console.log(`   Total: ${tests.size}`);

  const duration = Math.round(performance.now() - start);
  console.log(`   Time:   ${duration}ms`);

  process.exit(failed ? 1 : 0);
}

process.on('SIGINT', () => {
  const unfinished = [];

  for (const [id, test] of tests.entries()) {
    if (!completed.has(id)) {
      unfinished.push(test.name);
    }
  }

  if (unfinished.length > 0) {
    console.log('\n❗ Unfinished tests:');
    for (const name of unfinished) {
      console.log('   -', name);
    }
  } else {
    console.log('\nAll tests completed.');
  }

  process.exit(0);
});
