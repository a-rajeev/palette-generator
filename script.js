const imageUploader = document.getElementById("imageUploader");
const paletteDiv = document.getElementById("palette");
const exportBtn = document.getElementById("exportBtn");

const colorThief = new ColorThief();

function generatePalette(image) {
  const palette = colorThief.getPalette(image, 5);

  paletteDiv.innerHTML = "";

  palette.forEach((color) => {
    const colorDiv = document.createElement("div");
    colorDiv.classList.add("color");
    colorDiv.style.backgroundColor = `rgb(${color.join(",")})`;
    colorDiv.dataset.hex = rgbToHex(color);

    colorDiv.title = colorDiv.dataset.hex;
    paletteDiv.appendChild(colorDiv);
  });

  exportBtn.style.display = "inline-block";
}

function rgbToHex(rgb) {
  return "#" + rgb.map(val => {
    const hex = val.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("");
}

imageUploader.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();

    reader.onload = function(event) {
      const placeholderImage = document.getElementById("placeholderImage");
      placeholderImage.src = event.target.result;
      placeholderImage.style.display = "block";

      placeholderImage.onload = function() {
        generatePalette(placeholderImage);
      };
    };
    reader.readAsDataURL(file);
  }
});

const customImages = [
  "https://github.com/a-rajeev/palette-generator/blob/update_style/assets/images/Img%20(1).jpg?raw=true",
  "https://github.com/a-rajeev/palette-generator/blob/update_style/assets/images/Img%20(11).jpeg?raw=true",
  "https://github.com/a-rajeev/palette-generator/blob/update_style/assets/images/Img%20(14).jpeg?raw=true",
  "https://github.com/a-rajeev/palette-generator/blob/update_style/assets/images/Img%20(2).jpg?raw=true",
  "https://github.com/a-rajeev/palette-generator/blob/update_style/assets/images/Img%20(3).jpg?raw=true",
  "https://github.com/a-rajeev/palette-generator/blob/update_style/assets/images/Img%20(8).jpeg?raw=true"
];

const randomImage = customImages[Math.floor(Math.random() * customImages.length)];

document.getElementById("placeholderImage").src = randomImage;

exportBtn.addEventListener("click", () => {
  const colors = [];
  const colorDivs = document.querySelectorAll(".color");
  colorDivs.forEach((colorDiv) => {
    colors.push(colorDiv.dataset.hex);
  });

  const palette = JSON.stringify(colors, null, 2);
  const blob = new Blob([palette], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "palette.json";
  link.click();
});
