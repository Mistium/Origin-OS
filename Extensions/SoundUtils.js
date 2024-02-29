class SoundUtils {
    constructor(runtime) {
        this.runtime = runtime;
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.channels = [];
    }

    getInfo() {
        return {
            id: "SoundUtils",
            name: 'SoundUtils',
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
                },
                {
                    opcode: 'generateWhiteNoise',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'Generate white noise on [CHANNEL] with frequency [FREQUENCY]Hz',
                    arguments: {
                        CHANNEL: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'Channel 1'
                        },
                        FREQUENCY: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 440
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
    
    generateWhiteNoise(args) {
        const channelName = args.CHANNEL;
        const frequency = args.FREQUENCY;
        const channel = this.channels.find(ch => ch.name === channelName);
        if (!channel) {
            console.error(`Channel '${channelName}' not found.`);
            return;
        }

        // Stop any existing source on the channel
        if (channel.source) {
            channel.source.stop();
            channel.source = null;
        }
        channel.oscillator = this.audioContext.createOscillator();

        const bufferSize = 4096;
        const noiseBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = noiseBuffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = this.audioContext.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;
        whiteNoise.connect(this.audioContext.destination);
        whiteNoise.start();

        // Update frequency
        const playbackRate = frequency / this.audioContext.sampleRate;
        whiteNoise.playbackRate.setValueAtTime(playbackRate, this.audioContext.currentTime);

        channel.source = whiteNoise;
    }
}

Scratch.extensions.register(new SoundUtils());
