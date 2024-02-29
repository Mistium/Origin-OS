class SoundUtils {
    constructor(runtime) {
        this.runtime = runtime;
        this.channels = {};
    }

    getInfo() {
        return {
            id: 'synthesis',
            name: 'Synthesis Extension',
            blocks: [
                {
                    opcode: 'playSound',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'Play [SOUND_TYPE] on channel [CHANNEL]',
                    arguments: {
                        SOUND_TYPE: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'soundTypes',
                            defaultValue: 'Square'
                        },
                        CHANNEL: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    }
                },
                {
                    opcode: 'isSoundPlaying',
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: 'Sound playing on channel [CHANNEL]?',
                    arguments: {
                        CHANNEL: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    }
                },
                {
                    opcode: 'stopSound',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'Stop sound on channel [CHANNEL]',
                    arguments: {
                        CHANNEL: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    }
                }
            ],
            menus: {
                soundTypes: ['Square', 'Sawtooth', 'Sine', 'Triangle', 'White Noise', 'Pink Noise']
            }
        };
    }

    playSound(args) {
        const { SOUND_TYPE, CHANNEL } = args;
        // Code to play the specified sound type on the specified channel
        this.channels[CHANNEL] = { soundType: SOUND_TYPE }; // Store the sound type being played on the channel
    }

    isSoundPlaying(args) {
        const { CHANNEL } = args;
        return !!this.channels[CHANNEL]; // Check if there is a sound being played on the channel
    }

    stopSound(args) {
        const { CHANNEL } = args;
        delete this.channels[CHANNEL]; // Stop the sound on the specified channel
    }
}

Scratch.extensions.register(new SoundUtils());
