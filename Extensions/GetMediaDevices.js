navigator.mediaDevices.enumerateDevices().then(devices => {
  if (devices.length === 0) {
    console.log("No media devices found.");
    return;
  }
  const uniqueDevices = {};
  devices.forEach(device => {
    const deviceId = device.deviceId;
    if (uniqueDevices[device.label]) {
      return;
    }
		const info = {
      id: deviceId || 'N/A',
    };
    if (device.kind === 'audioinput' && devices.some(d => d.deviceId === deviceId && d.kind === 'audiooutput')) {
      info.type = 'audioboth'
    } else if (device.kind === 'audioinput') {
      info.type = 'audioinput'
    } else if (device.kind === 'audiooutput') {
      info.type = 'audiooutput'
		} else if (device.kind === 'videoinput') {
      info.type = 'videoinput'
    }
    uniqueDevices[device.label] = info;
  });
  return JSON.stringify(uniqueDevices);
}).catch(err => {
  return 'Error enumerating devices:' + err;
});

// Use this code to return a json string that contains user media device names //
