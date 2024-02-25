// Name: Better Eval
// ID: bettereval
// Description: Makes it where it does not spam the console with errors.
// By: Wolfieboy09 <https://scratch.mit.edu/users/Wolfieboy09/>

(function(Scratch) {
    if (!Scratch.extensions.unsandboxed) {
    throw new Error("Better Eval must be unsandboxed");
   }
    class BetterEval {
        getInfo() {
            return {
                id: 'bettereval',
                name: 'Better Eval',
                color1: '#b58707',
                blocks: [
                    {
                        opcode: 'cmdBlock',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'evaluate [CODE]',
                        arguments: {
                            CODE: { type: Scratch.ArgumentType.STRING, defaultValue: 'alert(\'Hello :D\')'}
                        }
                    },
                    {
                        opcode: 'boolBlock',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'evaluate [CODE]',
                        arguments: {
                            CODE: { type: Scratch.ArgumentType.STRING, defaultValue: ''}
                        }
                    },
                    {
                        opcode: 'reporterBlock',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'evaluate [CODE]',
                        arguments: {
                            CODE: { type: Scratch.ArgumentType.STRING, defaultValue: ''}
                        }
                    }
                ]
            }
        }

        cmdBlock({ CODE }) {
            // eslint-disable-next-line no-eval
            eval(CODE);
        }

        boolBlock({ CODE }) {
            // eslint-disable-next-line no-eval
            return eval(CODE);
        }

        reporterBlock({ CODE }) {
            // eslint-disable-next-line no-eval
            return eval(CODE);
        }
    }
    Scratch.extensions.register(new BetterEval())
})(Scratch);
