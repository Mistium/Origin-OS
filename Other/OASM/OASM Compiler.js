function compileOASM(CODE) {
    const all = ["totv","setv","chav","jump","equl","gthn","lthn","prnt","ngth","nlth","svto","mulv","divv","subv","pend","penu","penc","pens","pene","setx","sety","setp","labl","getd","sinv","cosv","tanv","modv","sqrt","copy","letr","leng"]
    const jumps = ["jump","equl","gthn","lthn","ngth","nlth"]
    let vars = []
    let commands = []
    let output = []
    let item = ""
    for (i in CODE) {
        item = CODE[i]
        cur = item.split(" ")
        cur = cur.concat(Array(4 - cur.length).fill(0))
        if (cur[0] === "labl") {
            let mapcur = []
            CODE = CODE.map((x) => {
                mapcur = x.split(" ")
                if (jumps.indexOf(mapcur[0]) !== -1) {
                    if (mapcur[3] === cur[1]) {
                        mapcur[3] = i;
                    } else if (mapcur[1] === cur[1]) {
                        mapcur[1] = i
                    }
                    return mapcur.join(" ")
                }
                return x
            })
        } else if (cur[0] === "setv") {
            if (!Number.isInteger(Number(cur[1])) && vars.indexOf(cur[1]) === -1) {
                vars.push(cur[1])
                let len = vars.length
                let mapcur = []
                CODE = CODE.map((x) => {
                    mapcur = x.split(" ")
                    if (mapcur[1] === cur[1]) {
                        mapcur[1] = len
                    } else if (mapcur[2] === cur[1]) {
                        mapcur[2] = len
                    } else if (mapcur[3] === cur[1]) {
                        mapcur[3] = len
                    }
                    return mapcur.join(" ")
                })
                cur[1] = len
            }
        }
        cur[0] = all.indexOf(cur[0]) + 1
        commands = commands.concat(cur)
    }
    return JSON.stringify(commands);
}

console.log(compileOASM(["totv 13","setv 1 4095","setv 2 0","setv 3 0","setv 4 0","setv 5 4","setv 6 0","setv 10 10","setv 11 50","setv 12 10","setv 13 1","getd timer 6","divv 6 12","penc 1","pens 2","pend","setv 3 0","setv 4 10000","labl stolp","chav 3 13","svto 7 3","mulv 7 6","svto 8 7","svto 9 7","sinv 8","mulv 8 3","divv 8 10","cosv 9","mulv 9 3","divv 9 10","penc 3","setp 8 9","lthn 3 4 stolp","penu","jump stolp"]))

console.log(compileOASM(["setv time 0","setv div 31536000000","setv offset 1970","getd timestamp time","divv time div","chav time offset","prnt time"]))
