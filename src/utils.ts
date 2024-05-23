interface Collidable<T> {
  collision: (data: T) => void;
}

export const checkCollision = <T extends Collidable<T>>(data: T[]) => {
  for (let i = 0; i < data.length; i++) {
    for (let j = i + 1; j < data.length; j++) {
      data[i].collision(data[j]);
    }
  }
};

export const randomColor = (colors: string[]) => {
  return colors[Math.floor(Math.random() * colors.length)];
};
