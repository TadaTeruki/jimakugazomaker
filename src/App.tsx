import { useEffect, useState } from "react";
import "./App.css";

function createCaptionedImage(
  caption: string,
  koreanCatpion: string,
  englishCaption: string,
  caption01Y: number,
  koreanCaption01XY: [number, number],
  imageSrc: string,
  imagePostionProp: number,
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
        offsetX = (canvas.width - drawWidth) * imagePostionProp;
        offsetY = (canvas.height - drawHeight) / 2;
      } else {
        drawWidth = canvas.width;
        drawHeight = canvas.width / imageAspect;
        offsetX = (canvas.width - drawWidth) / 2;
        offsetY = (canvas.height - drawHeight) * imagePostionProp;
      }

      ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);

      const fontSize = 25;
      const engFontSize = 15;
      const rectMargin = 10;
      const textBaseY = canvas.height * caption01Y;
      const koreanTextBaseX = canvas.width * koreanCaption01XY[0];
      const koreanTextBaseY = canvas.height * koreanCaption01XY[1];

      const baseFont = fontSize.toString() + "px sans-serif";
      const engFont = engFontSize.toString() + "px sans-serif";
      ctx.textAlign = "center";

      const cap = caption.split("\n");

      const kcap = koreanCatpion.split("\n");
      kcap.forEach((line, i) => {
        ctx.font = "bold " + baseFont;
        ctx.fillStyle = "white";
        ctx.strokeStyle = "#555";
        ctx.lineWidth = 3;
        const x = koreanTextBaseX;
        const y = koreanTextBaseY + fontSize * (i - cap.length / 2);
        ctx.strokeText(line, x, y);
        ctx.fillText(line, x, y);
      });

      const ecap = englishCaption.split("\n");
      ecap.forEach((line, i) => {
        ctx.font = "bold " + engFont;
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 5;
        const x = koreanTextBaseX;
        const y = koreanTextBaseY + engFontSize * (i - cap.length / 2);
        ctx.strokeText(line, x, y);
        ctx.fillText(line, x, y);
      });

      cap.forEach((line, i) => {
        ctx.font = baseFont;
        ctx.fillStyle = "#000c";
        ctx.fillRect(
          canvas.width / 2 - ctx.measureText(line).width / 2 - rectMargin,
          textBaseY +
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
          textBaseY +
            (fontSize + rectMargin * 2) * (i - cap.length / 2) -
            rectMargin / 2,
        );
      });

      ctx.font = "bold 15px monoscape";
      ctx.fillStyle = "#fffa";
      ctx.textAlign = "right";
      ctx.fillText("https://jimakugazomaker.peruki.dev", canvas.width - 5, 15);

      const img = new Image();
      img.src = canvas.toDataURL("image/jpeg");
      resolve(img);
    };
  });
}

function App() {
  const [caption, setCaption] = useState("私は眠いです~");
  const [koreanCatpion, setKoreanCaption] = useState("나는 졸려요...");
  const [englishCaption, setEnglishCaption] = useState("I'm sleepy...");
  const [imageSrc, setImageSrc] = useState("./犬.jpg");
  const [image, setImage] = useState(new Image());
  const [caption01Y, setCaption01Y] = useState(0.95);
  const [caption01YText, setCaption01YText] = useState(caption01Y.toString());
  const [koreanCaption01XY, setKoreanCaption01XY] = useState<[number, number]>([
    0.25, 0.85,
  ]);
  const [imagePostionProp, setImagePostionProp] = useState(0.5);
  const [imagePostionPropText, setImagePostionPropText] = useState(
    imagePostionProp.toString(),
  );
  const [koreanCaption01XYText, setKoreanCaption01XYText] = useState<
    [string, string]
  >([koreanCaption01XY[0].toString(), koreanCaption01XY[1].toString()]);

  const fetchImage = () => {
    createCaptionedImage(
      caption,
      koreanCatpion,
      englishCaption,
      caption01Y,
      koreanCaption01XY,
      imageSrc,
      imagePostionProp,
    ).then((img) => {
      setImage(img);
    });
  };

  useEffect(() => {
    fetchImage();
  }, [
    caption,
    koreanCatpion,
    englishCaption,
    caption01Y,
    koreanCaption01XY,
    imageSrc,
    imagePostionProp,
  ]);

  return (
    <div id="mainContainer">
      <h1>😺 どうぶつ字幕画像メーカー</h1>
      <p>元ネタが何とはいいませんが、ああいう感じの面白字幕画像を作れます</p>
      <br />
      <div className="imgContainer">
        <img src={image.src} alt="uploaded" />
      </div>
      <div className="forms">
        <div className="form">
          画像を選択
          <br />
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
          <br />
          画像の位置調整(0.0-1.0)
          <input
            type="text"
            value={imagePostionPropText}
            onChange={(e) => {
              setImagePostionPropText(e.target.value);
              if (e.target.value === "") return;
              setImagePostionProp(parseFloat(e.target.value));
            }}
          />
        </div>
        <div className="form">
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
          縦の位置(0.0-1.0)
          <input
            type="text"
            value={caption01YText}
            onChange={(e) => {
              setCaption01YText(e.target.value);
              setCaption01Y(parseFloat(e.target.value));
            }}
          />
        </div>
        <div className="form">
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
          <br />
          英語の字幕
          <br />
          <textarea
            rows={3}
            cols={50}
            value={englishCaption}
            onChange={(e) => {
              setEnglishCaption(e.target.value);
            }}
          />
          <br />
          縦の位置(0.0-1.0)
          <input
            type="text"
            value={koreanCaption01XYText[1]}
            onChange={(e) => {
              setKoreanCaption01XYText([
                koreanCaption01XYText[0],
                e.target.value,
              ]);
              if (e.target.value === "") return;
              setKoreanCaption01XY([
                koreanCaption01XY[0],
                parseFloat(e.target.value),
              ]);
            }}
          />
          <br />
          横の位置(0.0-1.0)
          <input
            type="text"
            value={koreanCaption01XYText[0]}
            onChange={(e) => {
              setKoreanCaption01XYText([
                e.target.value,
                koreanCaption01XYText[1],
              ]);
              if (e.target.value === "") return;
              setKoreanCaption01XY([
                parseFloat(e.target.value),
                koreanCaption01XY[1],
              ]);
            }}
          />
        </div>
      </div>
      <button
        onClick={() => {
          const a = document.createElement("a");
          a.href = image.src;
          a.download = "captioned.jpg";
          a.click();
        }}
      >
        ダウンロード
      </button>
      <div className="source">View Source: <a href="https://github.com/TadaTeruki/jimakugazomaker">github.com/TadaTeruki/jimakugazomaker</a></div>
    </div>
  );
}

export default App;
