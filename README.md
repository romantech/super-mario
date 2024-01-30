
![20240121_211922](https://github.com/romantech/super-mario/assets/8604840/a429b9fb-51cc-47d8-af62-35ff9d07c125)


# Simple Super Mario Runner Game

This is a Mario Runner game implemented in vanilla JavaScript without using Canvas. When the game starts, Mario automatically runs forward, and obstacles are randomly generated ahead. These obstacles can be avoided by jumping, which is done by pressing space (on PC) or touching (on Mobile). Every time you avoid an obstacle, the Score increases by 1 point. 

Additionally, a gravity effect has been implemented to make Mario's jumps look more natural.

- [Game Link](https://romantech.github.io/super-mario)
- [Implementation Details Korean Ver](https://bit.ly/3ShQQiC)

## Implementation Details
### Gravity Jump
> [!NOTE]
> After creating a new image element and assigning an image URL to its `src` attribute, the image loads in the background. Then, if the `src` attribute of another image element is set to a URL that has already been loaded, the browser will use the image stored in the cache.
```jsx
class Mario {
  static jumpHeight = 18; // Jump height. The higher the value, the higher the jump.
  static gravity = 0.4; // Gravity. The lower the value, the longer the jump.

	// ...

  constructor({ defaultBottom, className = 'mario' }) {
    this.defaultBottom = defaultBottom;
    this.isJumping = false;
		// ...
  }

  run() { /* ... */ }

  stop() { /* ... */ }

  jump() {
    if (this.isJumping) return;

    this.isJumping = true;
    let jumpCount = 0;
    let velocity = Mario.jumpHeight;

    const up = () => {
      jumpCount++;
      velocity = Math.max(velocity - Mario.gravity, 0);

      let nextBottom = jumpCount * velocity + this.defaultBottom;
      this.element.style.bottom = nextBottom + 'px';

      if (nextBottom > this.defaultBottom) requestAnimationFrame(up);
      else this.isJumping = false;
    };

    up();
  }
}
}
```

When the user presses the spacebar, the `jump()` method is called. This method executes the `up()` function on every frame to simulate the jumping action. Within the `up()` function, `jumpCount` is incremented by 1, and `velocity` is decreased by the value of `Mario.gravity`.

Then, the product of the reduced `velocity` and `jumpCount` is calculated, and this result is added to Mario's default height, `defaultBottom`, to determine the jump height for the current frame, `nextBottom`. The jump ends when `nextBottom` is less than or equal to `defaultBottom`.

Since `velocity` decreases by `gravity` every frame, the jump quickly ascends, then gradually slows down, and after reaching the peak, it descends rapidly, simulating the effect of gravity.

Below is a chart/image showing how the height changes with each frame. For clarity, `velocity` is reduced by 1 in each frame, and `defaultBottom` is not included in the height calculation.

![image](https://github.com/romantech/super-mario/assets/8604840/8ba5952c-9a1f-4470-bc90-1d92555ae19c)

The jump starts with the highest ascent, and as it approaches the peak, the ascent gradually decreases due to gravity until it's almost zero. After the peak, the ascent increases until it returns to its original point.

| Count | Velocity | Height (Count×Velocity) | Difference from Previous Height | Phase |
| --- | --- | --- | --- | --- |
| 0 | 16 | 0 | 0 | Starting Point |
| 1 | 15 | 15 | 15 | Start of Ascent |
| 2 | 14 | 28 | 13 |  |
| 3 | 13 | 39 | 11 | Beginning to Slow Down |
| 4 | 12 | 48 | 9 |  |
| 5 | 11 | 55 | 7 |  |
| 6 | 10 | 60 | 5 |  |
| 7 | 9 | 63 | 3 |  |
| 8 | 8 | 64 | 1 | Peak |
| 9 | 7 | 63 | 1 | Start of Descent |
| 10 | 6 | 60 | 3 | Beginning to Speed Up |
| 11 | 5 | 55 | 5 |  |
| 12 | 4 | 48 | 7 |  |
| 13 | 3 | 39 | 9 |  |
| 14 | 2 | 28 | 11 |  |
| 15 | 1 | 15 | 13 |  |
| 16 | 0 | 0 | 15 | Returning to Starting Point |

### Obstacle Collision Detection
> [!NOTE]
> If changes have been made to the DOM but have not yet been reflected on the screen, calling the `getBoundingClientRect()` method triggers a reflow (recalculation of layout). This happens because the browser needs to calculate the layout to provide accurate position and size information of the element. If there are no changes in the DOM and the browser has already calculated the latest layout information, a reflow does not occur.

When the game starts, the `checkCollision()` method is called to check for collisions between Mario and all obstacle elements on every frame. If Mario collides with an obstacle, the game is halted.

The position of each element is obtained by calling the `element.getBoundingClientRect()` method, which returns the coordinate values relative to the viewport.

```jsx
class Game {
  collisionFrameId = null;
  // ...

  constructor({ speed, defaultBottom }) {
    this.mario = new Mario({ defaultBottom });
    this.obstacles = new ObstacleManager({ speed, defaultBottom });
    // ...
  }

  start() { 
    // ...
    this.checkCollision();
  }

  stop() { /* ... */ }
  failed() { /* ... */ }
  reset() { /* ... */ }
  restart() { /* ... */ }

  checkCollision() {
    for (let obstacle of this.obstacles.list) {
      const marioRect = this.mario.element.getBoundingClientRect();
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

  toggleButtonActive(shouldRestart) { /* ... */ }
  scheduleAddObstacle() { /* ... */ }
  isPassed(marioRect, obstacleRect) { /* ... */ }
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
