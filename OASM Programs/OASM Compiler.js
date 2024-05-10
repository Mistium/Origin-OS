function compileOASM(CODE) {
    const code = CODE
    const all = ["totv","setv","chav","jump","equl","gthn","lthn","prnt","ngth","nlth","svto","mulv","divv","subv","pend","penu","penc","pens","pene","setx","sety","setp","labl","getd","sinv","cosv","tanv","modv","sqrt","copy","letr","leng"]
    let vars = []
    let commands = []
    let output = []
    let item = ""
    for (i in CODE) {
        console.log(i)
        item = CODE[i]
        cur = item.split(" ")
        cur = cur.concat(Array(4 - cur.length).fill(0))
        if (cur[0] === "labl") {
            CODE = CODE.map((x) => {
                if (x == cur[1]) {
                    return i
                } else {
                    return x
                }
            })
        } else if (cur[0] === "setv") {
            if (!Number.isInteger(Number(cur[1])) && vars.indexOf(cur[1]) !== -1) {
                vars.push(cur[1])
                let len = vars.length
                CODE = CODE.map((x) => {
                    if (x == cur[1]) {
                        return len
                    } else {
                        return x
                    }
                })
                console.log(CODE)
                
            }
        }
        cur[0] = all.indexOf(cur[0]) + 1
        commands = commands.concat(cur)
    }
    return JSON.stringify(commands);
}

console.log(compileOASM(["totv 13","setv 1 4095","setv 2 0","setv 3 0","setv 4 0","setv 5 4","setv 6 0","setv 10 10","setv 11 50","setv 12 10","setv 13 1","getd timer 6","divv 6 12","penc 1","pens 2","pend","setv 3 0","setv 4 10000","labl stolp","chav 3 13","svto 7 3","mulv 7 6","svto 8 7","svto 9 7","sinv 8","mulv 8 3","divv 8 10","cosv 9","mulv 9 3","divv 9 10","penc 3","setp 8 9","lthn 3 4 stolp","penu"]))
