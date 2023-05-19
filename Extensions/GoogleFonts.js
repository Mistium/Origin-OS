(function (extensionId) {
  const Scratch3GoogleFonts = class {
    constructor(runtime) {
      this.runtime = runtime;
      this._onTargetWillExit = this._onTargetWillExit.bind(this);
      this._onTargetCreated = this._onTargetCreated.bind(this);

      this.fontLinkElement = null;
      this.textElement = null;
    }

    getInfo() {
      return {
        id: extensionId,
        name: 'Google Fonts',
        blocks: [
          {
            opcode: 'drawText',
            blockType: 'command',
            text: 'draw text [TEXT] with font [FONT]',
            arguments: {
              TEXT: {
                type: 'string',
                defaultValue: 'Hello!'
              },
              FONT: {
                type: 'string',
                menu: 'googleFonts',
                defaultValue: 'Roboto'
              }
            }
          }
        ],
        menus: {
          googleFonts: this.getGoogleFontsMenu()
        }
      };
    }

    getGoogleFontsMenu() {
      const fonts = [
        // Add your desired Google Fonts here
        'Roboto',
        'Open Sans',
        'Lato',
        'Montserrat',
        'Raleway'
      ];

      return fonts.map((font) => ({
        text: font,
        value: font.toLowerCase().replace(/\s/g, '-')
      }));
    }

    drawText(args) {
      const text = args.TEXT;
      const font = args.FONT;

      if (!this.fontLinkElement) {
        this.fontLinkElement = document.createElement('link');
        this.fontLinkElement.rel = 'stylesheet';
        document.head.appendChild(this.fontLinkElement);
      }

      const fontUrl = `https://fonts.googleapis.com/css2?family=${font}`;
      this.fontLinkElement.href = fontUrl;

      if (!this.textElement) {
        this.textElement = document.createElement('div');
        this.textElement.style.position = 'absolute';
        this.textElement.style.pointerEvents = 'none';
        document.body.appendChild(this.textElement);
      }

      this.textElement.textContent = text;
      this.textElement.style.fontFamily = font;
      this.textElement.style.fontSize = '48px';
      this.textElement.style.left = '50%';
      this.textElement.style.top = '50%';
      this.textElement.style.transform = 'translate(-50%, -50%)';
    }

    _onTargetWillExit() {
      this.stopAll();
    }

    _onTargetCreated() {
      this.stopAll();
    }

    stopAll() {
      if (this.fontLinkElement) {
        this.fontLinkElement.remove();
        this.fontLinkElement = null;
      }

      if (this.textElement) {
        this.textElement.remove();
        this.textElement = null;
      }
    }
  };

  const extensionInstance = new Scratch3GoogleFonts();
  window.Scratch.extensions.register(extensionId, extensionInstance);
})('googleFonts');
  const Scratch3GoogleFonts = class {
    constructor(runtime) {
      this.runtime = runtime;
      this._onTargetWillExit = this._onTargetWillExit.bind(this);
      this.runtime.on('targetWasRemoved', this._onTargetWillExit);
      this._onTargetCreated = this._onTargetCreated.bind(this);
      this.runtime.on('targetWasCreated', this._onTargetCreated);
      this.runtime.on('PROJECT_STOP_ALL', this.stopAll.bind(this));

      this.fontLinkElement = null;
      this.textElement = null;
    }

    getInfo() {
      return {
        id: extensionId,
        name: 'Google Fonts',
        blocks: [
          {
            opcode: 'drawText',
            blockType: 'command',
            text: 'draw text [TEXT] with font [FONT]',
            arguments: {
              TEXT: {
                type: 'string',
                defaultValue: 'Hello!'
              },
              FONT: {
                type: 'string',
                menu: 'googleFonts',
                defaultValue: 'Roboto'
              }
            }
          }
        ],
        menus: {
          googleFonts: this.getGoogleFontsMenu()
        }
      };
    }

    getGoogleFontsMenu() {
      const fonts = [
        // Add your desired Google Fonts here
        'Roboto',
        'Open Sans',
        'Lato',
        'Montserrat',
        'Raleway'
      ];

      return fonts.map((font) => ({
        text: font,
        value: font.toLowerCase().replace(/\s/g, '-')
      }));
    }

    drawText(args) {
      const text = args.TEXT;
      const font = args.FONT;

      if (!this.fontLinkElement) {
        this.fontLinkElement = document.createElement('link');
        this.fontLinkElement.rel = 'stylesheet';
        document.head.appendChild(this.fontLinkElement);
      }

      const fontUrl = `https://fonts.googleapis.com/css2?family=${font}`;
      this.fontLinkElement.href = fontUrl;

      if (!this.textElement) {
        this.textElement = document.createElement('div');
        this.textElement.style.position = 'absolute';
        this.textElement.style.pointerEvents = 'none';
        document.body.appendChild(this.textElement);
      }

      this.textElement.textContent = text;
      this.textElement.style.fontFamily = font;
      this.textElement.style.fontSize = '48px';
      this.textElement.style.left = '50%';
      this.textElement.style.top = '50%';
      this.textElement.style.transform = 'translate(-50%, -50%)';
(function (extensionId) {
  const Scratch3GoogleFonts = class {
    constructor(runtime) {
      this.runtime = runtime;
      this._onTargetWillExit = this._onTargetWillExit.bind(this);
      this._onTargetCreated = this._onTargetCreated.bind(this);

      this.fontLinkElement = null;
      this.textElement = null;
    }

    getInfo() {
      return {
        id: extensionId,
        name: 'Google Fonts',
        blocks: [
          {
            opcode: 'drawText',
            blockType: 'command',
            text: 'draw text [TEXT] with font [FONT]',
            arguments: {
              TEXT: {
                type: 'string',
                defaultValue: 'Hello!'
              },
              FONT: {
                type: 'string',
                menu: 'googleFonts',
                defaultValue: 'Roboto'
              }
            }
          }
        ],
        menus: {
          googleFonts: this.getGoogleFontsMenu()
        }
      };
    }

    getGoogleFontsMenu() {
      const fonts = [
        // Add your desired Google Fonts here
        'Roboto',
        'Open Sans',
        'Lato',
        'Montserrat',
        'Raleway'
      ];

      return fonts.map((font) => ({
        text: font,
        value: font.toLowerCase().replace(/\s/g, '-')
      }));
    }

    drawText(args) {
      const text = args.TEXT;
      const font = args.FONT;

      if (!this.fontLinkElement) {
        this.fontLinkElement = document.createElement('link');
        this.fontLinkElement.rel = 'stylesheet';
        document.head.appendChild(this.fontLinkElement);
      }

      const fontUrl = `https://fonts.googleapis.com/css2?family=${font}`;
      this.fontLinkElement.href = fontUrl;

      if (!this.textElement) {
        this.textElement = document.createElement('div');
        this.textElement.style.position = 'absolute';
        this.textElement.style.pointerEvents = 'none';
        document.body.appendChild(this.textElement);
      }

      this.textElement.textContent = text;
      this.textElement.style.fontFamily = font;
      this.textElement.style.fontSize = '48px';
      this.textElement.style.left = '50%';
      this.textElement.style.top = '50%';
      this.textElement.style.transform = 'translate(-50%, -50%)';
    }

    _onTargetWillExit() {
      this.stopAll();
    }

    _onTargetCreated() {
      this.stopAll();
    }

    stopAll() {
      if (this.fontLinkElement) {
        this.fontLinkElement.remove();
        this.fontLinkElement = null;
      }

      if (this.textElement) {
        this.textElement.remove();
        this.textElement = null;
      }
    }
  };

  const extensionInstance = new Scratch3GoogleFonts();
  window.Scratch.extensions.register(extensionId, extensionInstance);
})('googleFonts');

    stopAll() {
      if (this.fontLinkElement) {
        this.fontLinkElement.remove();
        this.fontLinkElement = null;
      }

      if (this.textElement) {
        this.textElement.remove();
        this.textElement = null;
      }
    }

    _onTargetWillExit() {
      this.stopAll();
    }

    _onTargetCreated() {
      this.stopAll();
    }
  };

  const extensionInstance = new Scratch3GoogleFonts();
  Scratch.extensions.register(extensionId, extensionInstance);
})('googleFonts');
