// Name: Input Manager
// By: @mistium on discord
// Description: Store a list of previously pressed keys. Made primarily for use in originOS (https://github.com/Mistium/Origin-OS).

(function (Scratch) {
  "use strict";

  const MAX_KEY_HISTORY = 100; // Adjust the maximum number of keys to keep in history

  // Define keybinds
  const keybinds = ["Ctrl", "Shift", "Alt"];

  class InputManager {
    constructor() {
      const textEditingKeys = ['Backspace', 'Delete', 'Enter', 'Tab', 'Escape', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
      this.keyHistory = [];
      this.inputs = {};
      this.currentInput = "";
      this.currentInputChar = 0;
      this.currentInputLine = 1;
    }

    getInfo() {
      return {
        id: 'InputManager',
        name: 'Input Manager',
        blocks: [
          {
            opcode: 'allInputs',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Get all inputs'
          },
          {
            opcode: 'getInputData',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Get data of input [ID]',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "input1"
              }
            }
          },
          {
            opcode: 'deselectInput',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Deselect inputs',
          },
          {
            opcode: 'switchToInput',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Switch To Input [ID]',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "input1",
              },
            },
          },
          {
            opcode: 'getCurrentCursorPosition',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Get current cursor position',
          },
          {
            opcode: 'setCursorLocation',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Switch Cursor To Line [Line] And Character [Char]',
            arguments: {
              Line: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "1",
              },
              Char: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "0",
              },
            },
          }
        ],
      };
    }

    deselectInput() {
      this.currentInput = "";
      this.currentInputChar = 0;
      this.currentInputLine = 1;
    }
    
    setCursorLocation({ Line,Char }) {
      this.currentInputChar = Char;
      this.currentInputLine = Line;
    }
    
    allInputs() {
      return JSON.stringify(this.inputs);
    }
    
    switchToInput({ ID }) {
      if (!this.inputs[ID]) {
        this.inputs[ID] = '';
      }
      this.currentInput = ID;
      this.currentInputChar = 0;
      this.currentInputLine = 1;
    }

    getInputData({ ID }) {
      if (this.inputs[ID]) {
        return JSON.stringify(this.inputs[ID]);
      } else {
        return ""; // Return empty string if input ID doesn't exist
      }
    }
    
    onKeyDown(event) {
      const textEditingKeys = ['Backspace', 'Delete', 'Enter', 'Tab', 'Escape', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
  
      // Check if Command (Cmd) or Control (Ctrl) keys are pressed
      if (event.metaKey || event.ctrlKey) {
        return; // Skip adding keys when Cmd or Ctrl are pressed
      }

      // Check if the pressed key is part of a keybind
      if (this.isKeybind(event.key)) {
        return; // Skip adding keybind keys to history
      }

      // Handle text editing keys
      if (textEditingKeys.includes(event.key)) {
        // Perform actions based on the pressed text editing key
        switch (event.key) {
          case 'Backspace':
            // Remove character before the cursor in the current input
            if (this.currentInput && this.currentInputChar > 0) {
              const input = this.inputs[this.currentInput];
              this.inputs[this.currentInput] = input.slice(0, this.currentInputChar - 1) + input.slice(this.currentInputChar);
              this.currentInputChar--;
            }
            break;
          case 'Delete':
            // Remove character after the cursor in the current input
            if (this.currentInput && this.currentInputChar < this.inputs[this.currentInput].length) {
              const input = this.inputs[this.currentInput];
              this.inputs[this.currentInput] = input.slice(0, this.currentInputChar) + input.slice(this.currentInputChar + 1);
            }
            break;
          case 'Enter':
            if (this.currentInput) {
              this.inputs[this.currentInput] = this.inputs[this.currentInput].slice(0, this.currentInputChar) + '\n' + this.inputs[this.currentInput].slice(this.currentInputChar);
    
              // Move cursor to the beginning of the next line
              this.currentInputChar = 0;
              this.currentInputLine++;
            }
            break;
          case 'Tab':
            if (this.currentInput) {
              this.inputs[this.currentInput] = this.inputs[this.currentInput].slice(0, this.currentInputChar) + '\t' + this.inputs[this.currentInput].slice(this.currentInputChar);
              this.currentInputChar++;
            }
            break;
          case 'Escape':
            this.currentInput = "";
            break;
          case 'ArrowLeft':
            if (this.currentInputChar > 0) {
              this.currentInputChar--;
            }
            break;
          case 'ArrowRight':
            if (this.currentInputChar < this.inputs[this.currentInput].length) {
              this.currentInputChar++;
            }
            break;
          case 'ArrowUp':
            // Move cursor up to the previous line
            if (this.currentInputLine > 1) {
              this.currentInputLine--;
              // Adjust cursor position to the end of the previous line if it's longer than the current line
              const currentLineLength = this.inputs[this.currentInput].split('\n')[this.currentInputLine - 1].length;
              if (this.currentInputChar > currentLineLength) {
                this.currentInputChar = currentLineLength;
              }
            }
            break;
          case 'ArrowDown':
            // Move cursor down to the next line
            const inputLines = this.inputs[this.currentInput].split('\n');
            if (this.currentInputLine < inputLines.length) {
              this.currentInputLine++;
              // Adjust cursor position to the end of the next line if it's longer than the current line
              const nextLineLength = inputLines[this.currentInputLine - 1].length;
              if (this.currentInputChar > nextLineLength) {
                this.currentInputChar = nextLineLength;
              }
            }
            break;
          default:
            break;
        }
      } else {
        // Handle normal alphanumeric key presses
        if (event.key.length === 1) {
          // Append the pressed key to the current input at the cursor position
          this.inputs[this.currentInput] = this.inputs[this.currentInput].slice(0, this.currentInputChar) + event.key + this.inputs[this.currentInput].slice(this.currentInputChar);
          this.currentInputChar++;
        }
      }
    }
    
    getCurrentCursorPosition() {
      const data = {
        line: this.currentInputLine,
        character: this.currentInputChar
      };
      return JSON.stringify(data);
    }
    
    onPaste(event) {
      const pastedText = event.clipboardData.getData('text/plain');
      if (pastedText.trim() !== '') {
        if (this.currentInput) {
          // Append pasted text to the current input at the cursor position
          this.inputs[this.currentInput] = this.inputs[this.currentInput].slice(0, this.currentInputChar) + pastedText + this.inputs[this.currentInput].slice(this.currentInputChar);
          this.currentInputChar += pastedText.length;
        }
      }
    }

    isKeybind(key) {
      return keybinds.includes(key);
    }

    addKeyToHistory(key) {
      // Check if the maximum history size is reached
      if (this.keyHistory.length >= MAX_KEY_HISTORY) {
        this.keyHistory.pop(); // Remove the last element
      }
      
      // Add the key to the end of the array
      this.keyHistory.push(key);
    }
  }

  // Create an instance of the InputManager class
  const extension = new InputManager();

  // Register the extension with Scratch
  Scratch.extensions.register(extension);

  // Listen for keydown events and call the onKeyDown method
  document.addEventListener('keydown', (event) => extension.onKeyDown(event));

  // Listen for paste events and call the onPaste method
  document.addEventListener('paste', (event) => extension.onPaste(event));
})(Scratch);
