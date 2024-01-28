// Name: IframePlus
// ID: IframePlus
// By: @mistium on discord
// Description: Display webpages or HTML over the stage with unique IDs. Made primarily for use in originOS (https://github.com/Mistium/Origin-OS).

(function (Scratch) {
  "use strict";

  /** @type {Map<string, { iframe: HTMLIFrameElement, overlay: Overlay, width: number, height: number, x: number, y: number, interactive: boolean }>} */
  const iframesMap = new Map();

  const SANDBOX = [
    "allow-same-origin",
    "allow-scripts",
    "allow-forms",
    "allow-modals",
    "allow-popups",
    "allow-presentation", // Allow interaction
    "allow-pointer-lock", // Allow pointer lock
  ];

  const featurePolicy = {};

  class MyIframeExtension {
    async stamp({ ID }) {
      const iframeInfo = iframesMap.get(ID);
      if (iframeInfo) {
        const { iframe } = iframeInfo;
        Scratch.renderer.overlayDiv.appendChild(iframe);
      }
    }

    getInfo() {
      return {
        name: Scratch.translate("MyIframe"),
        id: "myiframe",
        blocks: [
          {
            opcode: "display",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("show website [URL] with ID [ID]"),
            arguments: {
              URL: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "https://example.com",
              },
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "iframe1",
              },
            },
          },
          {
            opcode: "remove",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("remove iframe with ID [ID]"),
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "iframe1",
              },
            },
          },
          {
            opcode: "show",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("show iframe with ID [ID]"),
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "iframe1",
              },
            },
          },
          {
            opcode: "hide",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("hide iframe with ID [ID]"),
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "iframe1",
              },
            },
          },
          {
            opcode: "resize",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("resize iframe with ID [ID] to width [WIDTH] and height [HEIGHT]"),
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "iframe1",
              },
              WIDTH: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 480,
              },
              HEIGHT: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 360,
              },
            },
          },
          {
            opcode: "move",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("move iframe with ID [ID] to x [X] and y [Y]"),
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "iframe1",
              },
              X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
              },
              Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
              },
            },
          },
          {
            opcode: "setCorners",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("set iframe with ID [ID] top-left corner at x [X1] and y [Y1] bottom-right corner at x [X2] and y [Y2]"),
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "iframe1",
              },
              X1: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
              },
              Y1: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
              },
              X2: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 100,
              },
              Y2: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 100,
              },
            },
          },
          {
            opcode: "stamp",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("stamp iframe with ID [ID] to stage"),
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "iframe1",
              },
            },
          },
        ],
      };
    }

    async display({ URL, ID }) {
      this.remove({ ID }); // Remove existing iframe with the same ID, if any

      if (await Scratch.canEmbed(URL)) {
        const src = Scratch.Cast.toString(URL);
        this.createFrame(src, ID);
      }
    }

    remove({ ID }) {
      const iframeInfo = iframesMap.get(ID);
      if (iframeInfo) {
        const { iframe, overlay } = iframeInfo;
        Scratch.renderer.removeOverlay(iframe);
        iframesMap.delete(ID);
      }
    }

    show({ ID }) {
      const iframeInfo = iframesMap.get(ID);
      if (iframeInfo) {
        const { iframe } = iframeInfo;
        iframe.style.display = "";
      }
    }

    hide({ ID }) {
      const iframeInfo = iframesMap.get(ID);
      if (iframeInfo) {
        const { iframe } = iframeInfo;
        iframe.style.display = "none";
      }
    }

    resize({ ID, WIDTH, HEIGHT }) {
      const iframeInfo = iframesMap.get(ID);
      if (iframeInfo) {
        const { iframe } = iframeInfo;
        iframeInfo.x -= (WIDTH - iframeInfo.width) / 2;
        iframeInfo.y -= (HEIGHT - iframeInfo.height) / 2;
        iframeInfo.width = WIDTH;
        iframeInfo.height = HEIGHT;
        this.updateFrameAttributes(iframeInfo);
      }
    }

    move({ ID, X, Y }) {
      const iframeInfo = iframesMap.get(ID);
      if (iframeInfo) {
        iframeInfo.x = X - iframeInfo.width / 2;
        iframeInfo.y = Y + iframeInfo.height / 2;
        this.updateFrameAttributes(iframeInfo);
      }
    }

    setCorners({ ID, X1, Y1, X2, Y2 }) {
      const iframeInfo = iframesMap.get(ID);
      if (iframeInfo) {
        iframeInfo.x = X1;
        iframeInfo.y = Y1;
        iframeInfo.width = X2 - X1;
        iframeInfo.height = Y2 - Y1;
        this.updateFrameAttributes(iframeInfo);
      }
    }

    stamp({ ID }) {
      const iframeInfo = iframesMap.get(ID);
      if (iframeInfo) {
        const { iframe } = iframeInfo;

        // Clone the iframe and remove overlay
        const clonedIframe = iframe.cloneNode(true);
        clonedIframe.style.position = "static";
        clonedIframe.removeAttribute("sandbox");
        const clonedOverlay = Scratch.renderer.addOverlay(clonedIframe, "manual");

        // Add the cloned iframe to the stage
        Scratch.stage.appendChild(clonedOverlay);

        // Additional actions as needed...

        // Note: If you want to keep the original iframe on the stage,
        // you may need to update the clone process accordingly.
      }
    }

    createFrame(src, ID) {
      const iframe = document.createElement("iframe");
      iframe.style.width = "100%";
      iframe.style.height = "100%";
      iframe.style.border = "none";
      iframe.style.position = "absolute";
      iframe.setAttribute("sandbox", SANDBOX.join(" "));
      iframe.setAttribute(
        "allow",
        Object.entries(featurePolicy)
          .map(([name, permission]) => `${name} ${permission}`)
          .join("; ")
      );
      iframe.setAttribute("allowtransparency", "true");
      iframe.setAttribute("allowtransparency", "true");
      iframe.setAttribute("src", src);

      const overlay = Scratch.renderer.addOverlay(iframe, "manual");

      // Store iframe information in the map
      iframesMap.set(ID, { iframe, overlay, width: 480, height: 360, x: 0, y: 0, interactive: true });

      // Update iframe attributes
      this.updateFrameAttributes(iframesMap.get(ID));
    }

    updateFrameAttributes(iframeInfo) {
      if (!iframeInfo) {
        return;
      }

      const { iframe, overlay, width, height, x, y, interactive } = iframeInfo;

      // Get the center of the canvas
      const centerX = Scratch.vm.runtime.stageWidth / 2;
      const centerY = Scratch.vm.runtime.stageHeight / 2;

      // Update the position of the iframe relative to the center of the canvas
      iframe.style.transform = `translate(${centerX + x}px, ${centerY - y}px)`;
      iframe.style.width = `${width}px`;
      iframe.style.height = `${height}px`;

      overlay.mode = "manual";
      Scratch.renderer._updateOverlays();

      iframe.style.pointerEvents = interactive ? "auto" : "none";
    }
  }

  Scratch.extensions.register(new MyIframeExtension());
})(Scratch);
