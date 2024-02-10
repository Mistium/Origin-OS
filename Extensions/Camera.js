(function (Scratch) {
  "use strict";

  class CameraExtension {
    constructor() {
      this.video = null;
      this.stream = null;
    }

    getInfo() {
      return {
        id: 'cameraextension',
        name: 'Camera Extension',
        blocks: [
          {
            opcode: 'startCamera',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Start camera',
          },
          {
            opcode: 'stopCamera',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Stop camera',
          },
          {
            opcode: 'captureCamera',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Capture camera as Data URI',
          },
          {
            opcode: 'cameraWidth',
            blockType: Scratch.BlockType.REPORTER,
            text: 'camera width',
          },
          {
            opcode: 'cameraHeight',
            blockType: Scratch.BlockType.REPORTER,
            text: 'camera height',
          },
          {
            opcode: 'isCameraOn',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'camera on?',
          },
        ],
      };
    }

    async startCamera() {
      if (!this.stream) {
        await this.setupCamera();
      }
    }

    async stopCamera() {
      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop());
        this.stream = null;
        this.video = null;
      }
    }

    async captureCamera() {
      if (!this.stream) {
        await this.setupCamera();
      }

      if (this.stream) {
        const videoTrack = this.stream.getVideoTracks()[0];
        const imageCapture = new ImageCapture(videoTrack);
        const blob = await imageCapture.grabFrame();
        return URL.createObjectURL(blob);
      }

      return null;
    }


    cameraWidth() {
      return this.video ? this.video.videoWidth : 0;
    }

    cameraHeight() {
      return this.video ? this.video.videoHeight : 0;
    }

    isCameraOn() {
      return !!this.stream;
    }

    async setupCamera() {
      try {
        this.video = document.createElement('video');

        // Request access to the user's camera
        this.stream = await navigator.mediaDevices.getUserMedia({ video: true });

        // Set up video element to stream from the camera
        this.video.srcObject = this.stream;
        await this.video.play();
      } catch (error) {
        console.error('Failed to access camera:', error);
        this.stream = null;
      }
    }
  }

  const cameraExtension = new CameraExtension();
  Scratch.extensions.register(cameraExtension);

})(Scratch);
