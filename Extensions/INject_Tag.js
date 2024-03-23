class InjectScriptExtension {
    getInfo() {
        return {
            id: 'injectScript',
            name: 'Inject Script',
            blocks: [
                {
                    opcode: 'injectScript',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'inject script [URL]',
                    arguments: {
                        URL: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'path/to/script.js'
                        }
                    }
                }
            ]
        };
    }

    injectScript({ URL }) {
        const scriptElement = document.createElement('script');
        scriptElement.src = URL;
        document.head.appendChild(scriptElement);
    }
}

Scratch.extensions.register(new InjectScriptExtension());
