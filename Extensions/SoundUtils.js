class SynthesisExtension {
    constructor(runtime) {
        this.runtime = runtime;
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.channels = [];
    }

    getInfo() {
        return {
            id: 'synthesis',
            name: 'Synthesis Extension',
            blocks: [
                {
                    opcode: 'createChannel',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'Create channel [CHANNEL]',
                    arguments: {
                        CHANNEL: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'Channel 1'
                        }
                    }
                },
                {
                    opcode: 'playTone',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'Play [FREQUENCY]Hz tone on [CHANNEL]',
                    arguments: {
                        FREQUENCY: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 440
                        },
                        CHANNEL: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'Channel 1'
                        }
                    }
                },
                {
                    opcode: 'stopAllSounds',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'Stop all sounds on [CHANNEL]',
                    arguments: {
                        CHANNEL: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'Channel 1'
                        }
                    }
                },
                {
                    opcode: 'isPlaying',
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: 'Sound playing on [CHANNEL]?',
                    arguments: {
                        CHANNEL: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'Channel 1'
                        }
                    }
                }
            ]
        };
    }

    createChannel(args) {
        const channel = {
            name: args.CHANNEL,
            oscillator: null,
            playing: false
        };
        this.channels.push(channel);
    }

    playTone(args) {
        const channelName = args.CHANNEL;
        const frequency = args.FREQUENCY;
        const channel = this.channels.find(ch => ch.name === channelName);
        if (!channel) {
            console.error(`Channel '${channelName}' not found.`);
            return;
        }

        if (!channel.oscillator) {
            channel.oscillator = this.audioContext.createOscillator();
            channel.oscillator.type = 'sine'; // Change waveform type here
            channel.oscillator.connect(this.audioContext.destination);
        }

        channel.oscillator.frequency.value = frequency;
        if (!channel.playing) {
            channel.oscillator.start();
            channel.playing = true;
        }
    }

    stopAllSounds(args) {
        const channelName = args.CHANNEL;
        const channel = this.channels.find(ch => ch.name === channelName);
        if (!channel) {
            console.error(`Channel '${channelName}' not found.`);
            return;
        }

        if (channel.oscillator && channel.playing) {
            channel.oscillator.stop();
            channel.oscillator = null;
            channel.playing = false;
        }
    }

    isPlaying(args) {
        const channelName = args.CHANNEL;
        const channel = this.channels.find(ch => ch.name === channelName);
        if (!channel) {
            console.error(`Channel '${channelName}' not found.`);
            return false;
        }

        return channel.playing;
    }
}

Scratch.extensions.register(new SynthesisExtension());
