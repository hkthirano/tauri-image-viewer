const { invoke } = window.__TAURI__.tauri;

const { open, save } = window.__TAURI__.dialog;
let _canvas = document.querySelector('canvas');
let _context = _canvas.getContext('2d');
function newImage() {
  let img = _context.createImageData(_canvas.width, _canvas.height);
  _context.putImageData(img, 0, 0);
}

function openImage() {
  open({
    filters: [
      { name: 'PNG', extensions: ['png'] },
      { name: 'JPG', extensions: ['jpg'] },
      { name: 'Bitmap', extensions: ['bmp'] },
      { name: 'Targa', extensions: ['tga'] },
      { name: 'TIFF', extensions: ['tiff'] },
    ],
  }).then(async file => {
    let data = await invoke("open_img", { path: file });
    _canvas.width = data[0];
    _canvas.height = data[1];
    let img = _context.createImageData(_canvas.width, _canvas.height);
    for (i = 0; i < img.data.length; i++) {
      img.data[i] = data[2][i]
    }
    _context.putImageData(img, 0, 0);
  });
}

function saveImage() {
  let w = _canvas.width;
  let h = _canvas.height;
  let img = _context.getImageData(0, 0, w, h);
  let arr = [];
  img.data.forEach((data) => { arr.push(data); });
  save({
    filters: [
      { name: 'PNG', extensions: ['png'] },
      { name: 'JPG', extensions: ['jpg'] },
      { name: 'Bitmap', extensions: ['bmp'] },
      { name: 'Targa', extensions: ['tga'] },
      { name: 'TIFF', extensions: ['tiff'] },
    ],
  }).then(async file => {
    await invoke("save_img", {
      path: file,
      width: w,
      height: h,
      data: arr
    });
  });
}