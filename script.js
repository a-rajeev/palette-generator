const imageUploader = document.getElementById("imageUploader");
const placeholderImage = document.getElementById("placeholderImage");
const paletteDiv = document.getElementById("palette");
const exportBtn = document.getElementById("exportBtn");

const colorThief = new ColorThief();

function rgbToHex(rgb) {
  return "#" + rgb.map(val => {
    const hex = val.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("");
}

function generatePalette(image) {
  if (!image.complete) return;

  try {
    const palette = colorThief.getPalette(image, 5);
    if (!palette || palette.length === 0) {
      console.warn("No palette extracted.");
      return;
    }

    paletteDiv.innerHTML = "";

    palette.forEach((color) => {
      const colorWrapper = document.createElement("div");
      colorWrapper.classList.add("color-wrapper");

      const colorDiv = document.createElement("div");
      colorDiv.classList.add("color");
      const hexColor = rgbToHex(color); 
      colorDiv.style.backgroundColor = `rgb(${color.join(",")})`;
      colorDiv.dataset.hex = hexColor;

      const copyText = document.createElement("div");
      copyText.classList.add("copy-text");
      copyText.textContent = "Copy";

      const hexCode = document.createElement("div");
      hexCode.classList.add("hex-code");
      hexCode.textContent = hexColor;

      colorWrapper.appendChild(colorDiv);
      colorDiv.appendChild(copyText); 
      colorWrapper.appendChild(hexCode);
      paletteDiv.appendChild(colorWrapper);

      colorDiv.addEventListener("click", function() {
        const hexValue = this.dataset.hex;
        console.log("Hex to copy: ", hexValue);
        
        const textarea = document.createElement("textarea");
        textarea.value = hexValue;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "absolute";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
          const successful = document.execCommand("copy");
          if (successful) {
            copyText.textContent = "Copied 😊";
            setTimeout(() => {
              copyText.textContent = "Copy";
            }, 1000);
          } else {
            console.error("Copy command was unsuccessful");
          }
        } catch (err) {
          console.error("Failed to copy: ", err);
        }
        
        document.body.removeChild(textarea);
        
        if (navigator.clipboard) {
          navigator.clipboard.writeText(hexValue)
            .catch(err => console.error("Clipboard API failed: ", err));
        }
      });
    });

  } catch (e) {
    console.error("Error generating palette:", e);
  }
}

const customImages = [
  "https://res.cloudinary.com/dmtvv9nti/image/upload/v1746362377/Img_8_maggno.jpg",
  "https://res.cloudinary.com/dmtvv9nti/image/upload/v1746362378/Img_12_kmtfyp.jpg",
  "https://res.cloudinary.com/dmtvv9nti/image/upload/v1746362377/Img_2_sva2cf.jpg",
  "https://res.cloudinary.com/dmtvv9nti/image/upload/v1746362377/Img_14_iztn1c.jpg",
  "https://res.cloudinary.com/dmtvv9nti/image/upload/v1746362377/Img_3_xezvcv.jpg",
  "https://res.cloudinary.com/dmtvv9nti/image/upload/v1746362377/Img_1_auzpgs.jpg",
  "https://res.cloudinary.com/dmtvv9nti/image/upload/v1746362377/Img_2_r8nark.jpg",
  "https://res.cloudinary.com/dmtvv9nti/image/upload/v1746362377/Img_11_lobpjz.jpg",
  "https://res.cloudinary.com/dmtvv9nti/image/upload/v1746362271/cld-sample-2.jpg",
  "https://res.cloudinary.com/dmtvv9nti/image/upload/v1746362270/samples/coffee.jpg"
];

document.addEventListener("DOMContentLoaded", () => {
  const randomImage = customImages[Math.floor(Math.random() * customImages.length)];
  placeholderImage.crossOrigin = "anonymous";
  placeholderImage.src = randomImage;

  placeholderImage.onload = () => {
    setTimeout(() => generatePalette(placeholderImage), 100);
  };

  imageUploader.addEventListener("change", function(e) {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      placeholderImage.src = imageUrl;
      placeholderImage.onload = () => {
        generatePalette(placeholderImage);
      };
      customImages.push(imageUrl);
    }
  });
});

exportBtn.addEventListener("click", () => {
  const colors = Array.from(paletteDiv.querySelectorAll('.color'))
                      .map(colorDiv => colorDiv.dataset.hex);
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(colors));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href",     dataStr);
  downloadAnchorNode.setAttribute("download", "palette.json");
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
});