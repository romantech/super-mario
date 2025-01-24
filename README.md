![Image](https://github.com/user-attachments/assets/08cbdf5d-fce0-4c9c-a3c1-ea77a145821e)

# Simple Super Mario Runner Game

This game is a Mario Runner, developed using vanilla JavaScript without the Canvas API. As the game commences, Mario automatically advances, with obstacles appearing randomly in his path. Players can avoid these obstacles by jumping, which is achieved by pressing the space bar on a PC or tapping the screen on mobile devices. The game concludes if Mario collides with an obstacle. Points are earned each time Mario collects a coin.

Additionally, a gravity effect has been implemented to make Mario's jumps look more natural.

- [Game Link](https://romantech.github.io/super-mario)
- [Implementation Details Korean Ver](https://romantech.net/1265)

## Implementation Details

- [Singleton DOM Management](#singleton-dom-management)
- [Gravity Jump](#gravity-jump)
- [Obstacle Collision Detection](#obstacle-collision-detection)

### Singleton DOM Management

> [!NOTE]
> The constructor function essentially returns the newly created instance (this), but as shown below, it is also possible to explicitly specify a return value.

```jsx
class DomManager {
  static instance = null;

  constructor() {
    if (DomManager.instance) return DomManager.instance;

    this.gameArea = document.querySelector('.game');
    this.dialog = document.querySelector('.dialog-failed');
    // ...

    DomManager.instance = this;
  }

  static getInstance() {
    if (!DomManager.instance) DomManager.instance = new DomManager();
    return DomManager.instance;
  }
}

export default DomManager.getInstance();
```

Game elements frequently used in a game, such as the game area, score, start button, etc., are managed by a class called `DomManager`. Centralizing DOM-related tasks in one place like this can avoid repetitive queries and manipulations.

The practice of creating only one instance of a class and sharing it across the entire application is called the singleton pattern. Exporting the DOM manager as a singleton allows for consistent access to the same instance throughout the project, enhancing consistency.

When the `getInstance()` static method is called for the first time, there is no existing instance, so the `constructor` is executed to create a new instance, which is then assigned to the static property `DomManager.instance`. Subsequent calls to `getInstance()` return the existing instance that was previously assigned to the `DomManager.instance` property.

### Gravity Jump

> [!NOTE]
> After creating a new image element and assigning an image URL to its `src` attribute, the image loads in the background. Then, if the `src` attribute of another image element is set to a URL that has already been loaded, the browser will use the image stored in the cache.

```jsx
class Mario {
  static JUMP_HEIGHT = 18; // Jump height. The higher the value, the higher the jump.
  static GRAVITY = 0.4; // Gravity. The lower the value, the longer the jump.

  audio;
  defaultBottom;
  isJumping = false;
  // ...

  constructor({ audio, defaultBottom, className = 'mario' }) {
    this.audio = audio;
    this.defaultBottom = defaultBottom;
    // ...
  }

  jump() {
    if (this.isJumping) return;

    this.audio.playJumpSound();
    this.isJumping = true;
    let jumpCount = 0;
    let velocity = Mario.JUMP_HEIGHT;

    const up = () => {
      jumpCount++;
      velocity = Math.max(velocity - Mario.GRAVITY, 0);

      let nextBottom = jumpCount * velocity + this.defaultBottom;
      this.element.style.bottom = nextBottom + 'px';

      if (nextBottom > this.defaultBottom) requestAnimationFrame(up);
      else this.isJumping = false;
    };

    up();
  }

  // ...
}
```

When the user presses the spacebar, the `jump()` method is called. This method executes the `up()` function on every frame to simulate the jumping action. Within the `up()` function, `jumpCount` is incremented by 1, and `velocity` is decreased by the value of `Mario.GRAVITY`.

Then, the product of the reduced `velocity` and `jumpCount` is calculated, and this result is added to Mario's default height, `defaultBottom`, to determine the jump height for the current frame, `nextBottom`. The jump ends when `nextBottom` is less than or equal to `defaultBottom`.

Since `velocity` decreases by `Mario.GRAVITY` every frame, the jump quickly ascends, then gradually slows down. As the `jumpCount` increases, after reaching the peak, it descends rapidly, simulating the effect of gravity.

Below is a chart/image showing how the height changes with each frame. For clarity, `velocity` is reduced by 1 in each frame, and `defaultBottom` is not included in the height calculation.

![image](https://github.com/romantech/super-mario/assets/8604840/8ba5952c-9a1f-4470-bc90-1d92555ae19c)

The jump starts with the highest ascent, and as it approaches the peak, the ascent gradually decreases due to gravity until it's almost zero. After the peak, the ascent increases until it returns to its original point.

| Count | Velocity | Height (Count × Velocity) | Difference from Previous Height | Phase                       |
| ----- | -------- | ------------------------- | ------------------------------- | --------------------------- |
| 0     | 16       | 0                         | 0                               | Starting Point              |
| 1     | 15       | 15                        | 15                              | Start of Ascent             |
| 2     | 14       | 28                        | 13                              |                             |
| 3     | 13       | 39                        | 11                              | Beginning to Slow Down      |
| 4     | 12       | 48                        | 9                               |                             |
| 5     | 11       | 55                        | 7                               |                             |
| 6     | 10       | 60                        | 5                               |                             |
| 7     | 9        | 63                        | 3                               |                             |
| 8     | 8        | 64                        | 1                               | Peak                        |
| 9     | 7        | 63                        | 1                               | Start of Descent            |
| 10    | 6        | 60                        | 3                               | Beginning to Speed Up       |
| 11    | 5        | 55                        | 5                               |                             |
| 12    | 4        | 48                        | 7                               |                             |
| 13    | 3        | 39                        | 9                               |                             |
| 14    | 2        | 28                        | 11                              |                             |
| 15    | 1        | 15                        | 13                              |                             |
| 16    | 0        | 0                         | 15                              | Returning to Starting Point |

### Obstacle Collision Detection

> [!NOTE]
> If changes have been made to the DOM but have not yet been reflected on the screen, calling the `getBoundingClientRect()` method triggers a reflow (recalculation of layout). This happens because the browser needs to calculate the layout to provide accurate position and size information of the element. If there are no changes in the DOM and the browser has already calculated the latest layout information, a reflow does not occur.

When the game starts, the `checkCollision()` method is called to check for collisions between Mario and all obstacle elements on every frame. If Mario collides with an obstacle, the game is halted.

The position of each element is obtained by calling the `element.getBoundingClientRect()` method, which returns the coordinate values relative to the viewport.

```jsx
class Game {
  // ...
  collisionFrameId = null;

  constructor({ speed = Game.DEFAULT_SPEED, defaultBottom = Game.DEFAULT_BOTTOM } = {}) {
    this.obstacles = new ObstacleManager({ speed, defaultBottom });
    this.mario = new Mario({ defaultBottom, audio: this.audio });
    // ...
  }

  start() {
    // ...
    this.checkCollision();
  }

  checkCollision() {
    const marioRect = this.mario.element.getBoundingClientRect();

    for (let obstacle of this.entityManager.list) {
      const obstacleRect = obstacle.element.getBoundingClientRect();

      if (this.isColliding(marioRect, obstacleRect)) {
        this.toggleButtonActive(true);
        return this.failed();
      }

      // ...
    }

    this.collisionFrameId = requestAnimationFrame(this.checkCollision);
  }

  isColliding(marioRect, obstacleRect) {
    const isHorizontalOverlap =
      marioRect.left < obstacleRect.right && // Check if Mario overlaps from the right side of the obstacle
      marioRect.right > obstacleRect.left; // Check if Mario overlaps from the left side of the obstacle

    const isVerticalOverlap =
      marioRect.top < obstacleRect.bottom && // Check if Mario overlaps from below the obstacle
      marioRect.bottom > obstacleRect.top; // Check if Mario overlaps from above the obstacle

    return isHorizontalOverlap && isVerticalOverlap;
  }

  // ...
}
```

The `checkCollision()` method iterates through each obstacle, obtaining the current coordinates of Mario and the obstacle. Mario's coordinates are checked repeatedly because his position changes continuously with each frame while jumping. These coordinates are passed to the `isColliding()` method to check for horizontal and vertical collisions (refer to the image below).

![image](https://github.com/romantech/super-mario/assets/8604840/4b7e08f1-9b51-4bff-9ec8-9d0e263700e8)

- Horizontal Overlap
  - When Mario's **left edge** is to the left of the obstacle's **right edge**, and
  - Mario's **right edge** is to the right of the obstacle's **left edge**.
- Vertical Overlap
  - When Mario's **top edge** is above the obstacle's **bottom edge**, and
  - Mario's **bottom edge** is below the obstacle's **top edge**.
