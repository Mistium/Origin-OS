// Use the code below to return a json string that contains user media device names
//
// Example Output below
//
//{
//  "inputDevices": [
//    "Default - AirPods",
//    "AirPods",
//    "Mist's iphoneXS Microphone",
//    "MacBook Pro Microphone (Built-in)",
//    "Immersed (Virtual)",
//    "Meta Quest Remote Desktop Audio (Virtual)",
//    "Virtual Desktop Mic (Virtual)",
//    "Virtual Desktop Speakers (Virtual)"
//  ],
//  "outputDevices": [
//    "Default - AirPods",
//    "AirPods",
//    "MacBook Pro Speakers (Built-in)",
//    "Immersed (Virtual)",
//    "Meta Quest Remote Desktop Audio (Virtual)",
//    "Virtual Desktop Mic (Virtual)",
//    "Virtual Desktop Speakers (Virtual)"
//  ]
//}

navigator.mediaDevices.enumerateDevices().then(devices => {if (devices.length === 0) {console.log("No media devices found.");return;}const inputDevices = [];const outputDevices = [];devices.forEach(device => {if (device.kind === 'audioinput') {inputDevices.push(device.label);} else if (device.kind === 'audiooutput') {outputDevices.push(device.label);}});return JSON.stringify({ inputDevices, outputDevices });}).catch(err => {return 'Error enumerating devices:', err;});
