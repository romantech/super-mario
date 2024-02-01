export const generateRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const loadImages = srcset => {
  // image.src 속성에 값을 할당하면 백그라운드에서 이미지 로드 시작
  const loadImage = src => {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image at ${src}`));
      img.src = src;
    });
  };

  return Promise.all(srcset.map(loadImage));
};
