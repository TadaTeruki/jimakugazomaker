import { useEffect, useState } from "react";
import "./App.css";

function createCaptionedImage(
  caption: string,
  koreanCatpion: string,
  imageSrc: string,
): Promise<HTMLImageElement> {
  const image = new Image();
  image.src = imageSrc;
  return new Promise((resolve) => {
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 800;
      canvas.height = 450;
      const ctx = canvas.getContext("2d")!;

      const imageAspect = image.width / image.height;
      const canvasAspect = canvas.width / canvas.height;
      let drawWidth, drawHeight, offsetX, offsetY;

      if (imageAspect > canvasAspect) {
        drawWidth = canvas.height * imageAspect;
        drawHeight = canvas.height;
        offsetX = 0;
        offsetY = (canvas.height - drawHeight) / 2;
      } else {
        drawWidth = canvas.width;
        drawHeight = canvas.width / imageAspect;
        offsetX = (canvas.width - drawWidth) / 2;
        offsetY = 0;
      }

      ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);

      const fontSize = 25;
      const rectMargin = 10;
      const textBaswHeight = canvas.height * 0.95;

      ctx.font = fontSize.toString() + "px sans-serif";
      ctx.textAlign = "center";

      const cap = caption.split("\n");

      const kcap = koreanCatpion.split("\n");
      kcap.forEach((line, i) => {
        ctx.fillStyle = "white";
        ctx.fillText(
          line,
          canvas.width / 2,
          textBaswHeight +
            (fontSize + rectMargin * 2) * (i - cap.length / 2) -
            rectMargin / 2 -20,
        );
      });

      cap.forEach((line, i) => {
        ctx.fillStyle = "#000c";
        ctx.fillRect(
          canvas.width / 2 - ctx.measureText(line).width / 2 - rectMargin,
          textBaswHeight +
            (fontSize + rectMargin * 2) * (i - cap.length / 2) -
            fontSize -
            rectMargin,
          ctx.measureText(line).width + rectMargin * 2,
          fontSize + rectMargin * 2,
        );
        ctx.fillStyle = "white";
        ctx.fillText(
          line,
          canvas.width / 2,
          textBaswHeight +
            (fontSize + rectMargin * 2) * (i - cap.length / 2) -
            rectMargin / 2,
        );
      });

      const img = new Image();
      img.src = canvas.toDataURL("image/jpeg");
      resolve(img);
    };
  });
}

function App() {
  const [caption, setCaption] = useState("私は眠いです");
  const [koreanCatpion, setKoreanCaption] = useState("나는 졸려요...");
  const [imageSrc, setImageSrc] = useState("./default.jpg");
  const [image, setImage] = useState(new Image());

  const fetchImage = () => {
    createCaptionedImage(caption, koreanCatpion, imageSrc).then((img) => {
      setImage(img);
    });
  };

  useEffect(() => {
    fetchImage();
  }, [caption, koreanCatpion, imageSrc]);

  return (
    <>
      <h1>😺 どうぶつ字幕画像メーカー</h1>
      <p>
        画像をアップロード:&nbsp;
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files![0];
            const reader = new FileReader();
            reader.onload = () => {
              setImageSrc(reader.result as string);
            };
            reader.readAsDataURL(file);
          }}
        />
      </p>
      <div className="imgContainer">
        <img src={image.src} alt="uploaded" />
      </div>
      <p>
        日本語の字幕
        <br />
        <textarea
          rows={3}
          cols={50}
          value={caption}
          onChange={(e) => {
            setCaption(e.target.value);
          }}
        />
        <br />
        <br />
        韓国語の字幕
        <br />
        <textarea
          rows={3}
          cols={50}
          value={koreanCatpion}
          onChange={(e) => {
            setKoreanCaption(e.target.value);
          }}
        />
      </p>
      <button onClick={() => {}}>ダウンロード</button>
    </>
  );
}

export default App;
