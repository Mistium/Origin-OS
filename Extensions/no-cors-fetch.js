(function (Scratch) {
  "use strict";

  class NoCorsExtension {
    getInfo() {
      return {
        id: 'nocorsextension',
        name: 'No-CORS Extension',
        blocks: [
          {
            opcode: 'fetchData',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Fetch data from URL [URL]',
            arguments: {
              URL: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '',
              },
            },
          },
        ],
      };
    }

    fetchData({ URL }) {
      return new Promise(resolve => {
        fetch(URL, { mode: 'no-cors' })
          .then(response => response.text())
          .then(data => resolve(data))
          .catch(error => resolve(error.message));
      });
    }
  }

  Scratch.extensions.register(new NoCorsExtension());
})(Scratch);
