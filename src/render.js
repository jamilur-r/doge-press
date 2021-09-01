const Vue = require("vue");
const path = require("path");
const { ipcRenderer } = require("electron");
const hsbj = require("handbrake-js");

ipcRenderer.on("reply", (e, args) => {
  const outPath = document.querySelector("#out-path");
  outPath.innerHTML = args.filePath;
});

const App = {
  data() {
    return {
      file: null,
      inFileExt: "",
      inFileName: "",

      outFileName: "",
      outFileExt: ".mp4",
      outDir: "",

      preset: "Very Fast 480p30",

      percent: 0,
      time: "",
    };
  },
  methods: {
    startCompress() {
      const outPath = document.querySelector("#out-path");
      
      if (
        (this.file !== null,
        this.outDir.length > 0,
        this.outFileName.length > 0)
      ) {
        let out = this.outFileName + this.outFileExt;
        let op = path.resolve(outPath.innerHTML);

        let outLoc = path.join(op, out);
        const options = {
          input: path.resolve(this.file.path),
          output: path.resolve(outLoc),
          preset: this.preset,
        };

        hsbj
          .spawn(options)
          .on("error", (err) => {
            console.log(err);
            ipcRenderer.send("error", {
              msg: "Failed to compress",
            });
          })
          .on("progress", (progress) => {
            (this.percent = progress.percentComplete),
              (this.time = progress.eta);
          })
          .on("complete", (stream) => {
            ipcRenderer.send("success");
          });
      } else {
        ipcRenderer.send("error");
      }
    },
    selectDirStart() {
      ipcRenderer.send("select-file");
    },

    fileInput(e) {
      this.file = e.target.files[0];
      vid = document.querySelector(".video");
      const loc = path.resolve(this.file.path);
      this.inFileExt = path.extname(this.file.name);
      this.inFileName = this.file.name;

      vid.src = loc;
    },
  },
};

Vue.createApp(App).mount("#app");
