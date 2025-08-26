let ast = {
  "type": "opr",
  "data": "*",
  "left": {
    "type": "var",
    "data": "val",
  },
  "right": {
    "type": "opr",
    "data": "/",
    "left": {
      "type": "num",
      "data": 6,
    },
    "right": {
      "type": "var",
      "data": "val2",
    }
  }
}

// main use for bysl will be for operations and math stuff that doesnt need to be recursive so we can make it bytecode

/*
v= val2
n= 6
/ 1 2
v= val
* 4 3
*/
// first item is the memory address to write to
// 0 is special, it acts as a return value

// because this isnt recursive, we can skip a lot of js's function overhead and get a
// lot more out of V8 by using a basic iterative approach where its literally one
// instruction per line, and its finite and easy for the engine to optimise

// map the operations to numbers so they can be evaluated faster in the interpreter
const types = {
  tot: 0,
  var: 1,
  num: 2,
  "+": 3,
  "-": 4,
  "*": 5,
  "/": 6,
}

// generate the bytecode
function generateBysl(ast) {
  const memMap = new Map()
  const queue = [];

  function stepAst(node) {
    queue.push(node)
    switch (node.type) {
      case "opr":
        stepAst(node.left)
        stepAst(node.right)
        break
    }
  }

  stepAst(ast)

  // reverse so we can process the nodes in reverse
  queue.reverse()
  let out = []
  try {
    // only ever push to "out"
    // this means V8 can keep all the memory sequential and fast
    for (let i = 0, l = queue.length; i < l; i ++) {
      const cur = queue[i]
      const size = memMap.size
      // we always set memory so having this outside the switch is more efficient
      memMap.set(cur, size)
      // store the size of the map for each node, allowing the memory location to be specific to the node itself
      // references allow this to work because the queue is full of references, *not values*
      switch (cur.type) {
        case "var":
          out.push(types.var,cur.data,0)
          break
        case "num":
          out.push(types.num,cur.data,0)
          break
        case "opr":
          if (types[cur.data] === undefined) throw new Error()
          out.push(types[cur.data], memMap.get(cur.left), memMap.get(cur.right))
          break
        default:
          throw new Error() // stop it from compiling if theres unsupported nodes
      }
    }

    // let the interpreter know how much memory is nessecary for this bysl
    // bad for memory but might be the best way here
    out.unshift(types.tot, memMap.size, 0)
    return {success: true, code: out }
  } catch {
    return {success: false, code: out } // catch when it fails to generate
  }
}

const code = generateBysl(ast).code

const osl_vars = {val: 10, val2: 3}
// val * (6 / val2)
// 10 * (6 / 3) = 20

// simple standin
function getOSLvar(name) {
  return osl_vars[name] ?? null
}

// interpreter
function runBysl(code, getVar) {
  if (code[0] !== 0) throw new Error("Invalid Bysl")
  // check if the first command is the total data
  const mem = new Array(code[1])
  for (let i = 3; i < code.length; i += 3) {
    const memPos = i / 3 - 1
    switch (code[i]) {
      case types.var:
        mem[memPos] = getVar(code[i + 1])
        break
      case types.num:
        mem[memPos] = code[i + 1]
        break
      case types["+"]:
        mem[memPos] = mem[code[i + 1]] + mem[code[i + 2]]
        break
      case types["-"]:
        mem[memPos] = mem[code[i + 1]] - mem[code[i + 2]]
        break
      case types["*"]:
        mem[memPos] = mem[code[i + 1]] * mem[code[i + 2]]
        break
      case types["/"]:
        mem[memPos] = mem[code[i + 1]] / mem[code[i + 2]]
        break
    }
  }
  return mem[mem.length - 1]
}


const start = performance.now()
for (let i = 0; i < 100000; i ++) {
  runBysl(code, getOSLvar)
}
console.log(performance.now() - start)