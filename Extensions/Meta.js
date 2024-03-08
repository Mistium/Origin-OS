(function (Scratch) {
  "use strict";

  // Define keybinds
  const keybinds = ["Cmd", "Ctrl"];
  let currentKeybind = ''
  
  class KeybindManager {
    constructor() {
      this.metaKey = false;
    }

    getInfo() {
      return {
        id: 'KeybindManager',
        name: 'Keybind Manager',
        blocks: [
          {
            opcode: 'isMetaKeyPressed',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'Meta key pressed?',
          },
          {
            opcode: 'isKeybindPressed',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'Meta + [KEY] pressed?',
            arguments: {
              KEY: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "S",
              }
            }
          }
        ]
      };
    }

    isMetaKeyPressed() {
      return this.metaKey;
    }

    isKeybindPressed({ KEY }) {
      return this.metaKey && currentKeybind == KEY;
    }

    onKeyDown(event) {
      if (event.metaKey) {
        event.preventDefault();
        currentKeybind = event.key;
        this.metaKey = true;
      }
    }

    onKeyUp(event) {
      // Reset metaKey flag when Meta (Cmd) key is released
      if (!event.metaKey) {
        this.metaKey = false;
      }
    }
  }

  // Create an instance of the KeybindManager class
  const extension = new KeybindManager();

  // Register the extension with Scratch
  Scratch.extensions.register(extension);

  // Listen for keydown events and call the onKeyDown method
  document.addEventListener('keydown', (event) => extension.onKeyDown(event));

  // Listen for keyup events and call the onKeyUp method
  document.addEventListener('keyup', (event) => extension.onKeyUp(event));
})(Scratch);
