import Animation from '../base/animation'
import DataBus from '../databus'

const ENEMY_IMG_SRC = 'images/scanner15.png'
const ENEMY_WIDTH = 60
const ENEMY_HEIGHT = 60

const __ = {
  speed: Symbol('speed')
}

let databus = new DataBus()

function rnd(start, end) {
  return Math.floor(Math.random() * (end - start) + start)
}

export default class Scanner extends Animation {
  constructor() {
    super(ENEMY_IMG_SRC, ENEMY_WIDTH, ENEMY_HEIGHT)

    this.initScannerAnimation()
  }

  init(speed) {
    this.x = rnd(0, window.innerWidth - ENEMY_WIDTH)
    this.y = -this.height
    this.min = this.x - 100
    this.max = this.x + 100
    this.flag = 1

    this[__.speed] = speed

    this.useStaticImg = true  //IMPROVE
    this.visible = true

    this.playAnimation(0, true)
  }


  //预定义scanner动画
  initScannerAnimation() {
    let frames = []

    const EXPLO_IMG_PREFIX = 'images/scanner'
    const EXPLO_FRAME_COUNT = 29

    for (let i = 0; i < EXPLO_FRAME_COUNT; i++) {
      frames.push(EXPLO_IMG_PREFIX + (i + 1) + '.png')
    }

    this.initFrames(frames)
  }
  // 预定义爆炸的帧动画
  // initExplosionAnimation() {
  //   let frames = []

  //   const EXPLO_IMG_PREFIX = 'images/explosion'
  //   const EXPLO_FRAME_COUNT = 19

  //   for (let i = 0; i < EXPLO_FRAME_COUNT; i++) {
  //     frames.push(EXPLO_IMG_PREFIX + (i + 1) + '.png')
  //   }

  //   this.initFrames(frames)
  // }

  // 每一帧更新自身位置
  update() {
    this.y += this[__.speed]

    if (this.x > this.max) {
      this.flag = -1
    }
    if (this.x < this.min) {
      this.flag = 1
    }

    if(this.x<=this.max && this.flag ==1){
      this.x += 3
    }
    else if (this.x >= this.min && this.flag == -1) {
      this.x -= 3
 
    }

    // 对象回收
    if (this.y > window.innerHeight + this.height)
      databus.removeScanner(this)
  }
}
