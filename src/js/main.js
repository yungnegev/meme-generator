const imageInput = document.querySelector('#image-input');
const topTextInput = document.querySelector('#top-text');
const bottomTextInput = document.querySelector('#bottom-text');
const canvas = document.querySelector('#meme');

let image; // переменная для хранения объекта Image (обьявляется вне функции, чтобы была доступна в других функциях)

imageInput.addEventListener('change', (event) => {
    canvas.style.display = 'block';                            // показать canvas
    const imageFile = event.target.files[0];                   // файл изображения
    const imageDataURL = URL.createObjectURL(imageFile);       // создание ссылки на изображение 

    image = new Image();                                       // создание объекта Image
    image.src = imageDataURL;                                  // src объекта Image теперь ссылка на изображение

    image.onload = () => {                                     // после загрузки изображения, отобразить его на canvas
        updateMemeCanvas(canvas, image, topTextInput.value, bottomTextInput.value);
    }
});

topTextInput.addEventListener('input', (event) => {
    if (!image) return; // если изображение не загружено, то ничего не делать
    updateMemeCanvas(canvas, image, event.target.value, bottomTextInput.value);
});

bottomTextInput.addEventListener('input', (event) => {
    if (!image) return; 
    updateMemeCanvas(canvas, image, topTextInput.value, event.target.value);
});

function updateMemeCanvas(canvas, image, topText, bottomText) {
    // работа с canvas
    const ctx = canvas.getContext('2d');
    const imageWidth = image.width;
    const imageHeight = image.height;
    const fontSize = imageWidth / 10; // размер шрифта зависит от ширины изображения
    const marginY = imageHeight / 25; // отступ сверху и снизу зависит от высоты изображения

    canvas.width = imageWidth;        // установка размеров canvas (я ограничил ее в css чтобы не было слишком большой)
    canvas.height = imageHeight;      // если оставить без размеров, то canvas будет маленьким и изображение будет растянуто
                                      // а если ограничить размеры сдесь, то изображение будет обрезано

    ctx.drawImage(image, 0, 0);       // отображение изображения на canvas

    // работа с текстом
    ctx.fillStyle = '#fff';          // цвет текста
    ctx.strokeStyle = '#000';        // цвет обводки текста
    ctx.lineWidth = fontSize / 10;   // толщина обводки текста
    ctx.textAlign = 'center';        // выравнивание текста по центру
    ctx.lineJoin = 'round';          // скругление углов текста
    ctx.font = `${fontSize}px Impact, Arial`; // шрифт

    // отображение текста
    ctx.textBaseline = 'top'; // выравнивание текста по верхней линии
    ctx.fillText(topText, imageWidth / 2, marginY, imageWidth); // отображение текста сверху

    ctx.textBaseline = 'bottom'; // выравнивание текста по нижней линии
    ctx.fillText(bottomText, imageWidth / 2, imageHeight - marginY, imageWidth); // отображение текста снизу
}

function addOutline(ctx, text, x, y) {
    ctx.strokeText(text, x, y);
}

const downloadBtn = document.querySelector('#download');

downloadBtn.onclick= () => {
    if (!image) return;                             // если изображение не загружено, то ничего не делать

    const dataURL = canvas.toDataURL('image/png');  // берем данные изображения в формате png из canvas

    const a = document.createElement('a');          // пустой элемент ссылки (через него будем скачивать изображение)
    a.href = dataURL;                               // хреф ссылки - это данные изображения
    a.download = 'meme.png';                        // имя файла для скачивания (можно было рандом числа или генерировать из текста)

    a.style.display = 'none';                       // скрыть ссылку
    document.body.appendChild(a);                   // добавить ссылку в документ

    a.click();                                      // клик по ссылке (скачивание файла)

    document.body.removeChild(a);                   // удалить ссылку из документа
    // можно было сразу сделать ссылку видимой и не добавлять ее в документ, но я хочу с button
};


