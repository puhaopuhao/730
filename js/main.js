import Player from './player/index'
import Enemy from './npc/enemy'
import Scanner from './npc/scanner'
import Flotage from './npc/flotage'
import BackGround from './runtime/background'
import GameInfo from './runtime/gameinfo'
import PrizeInfo from './runtime/prizeinfo'
import Music from './runtime/music'
import DataBus from './databus'
let ctx = canvas.getContext('2d')
let databus = new DataBus()

/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    // 维护当前requestAnimationFrame的id
    this.aniId = 0

    this.restart()
  }

  restart() {
    databus.reset()

    canvas.removeEventListener(
      'touchstart',
      this.touchHandler
    )
    canvas.removeEventListener(
      'touchstart', 
      this.continueHandler
    )

    this.bg = new BackGround(ctx)
    this.player = new Player(ctx)
    this.gameinfo = new GameInfo()
    this.music = new Music()
    this.prizeinfo = new PrizeInfo()
    this.bindLoop = this.loop.bind(this)
    this.hasEventBind = false
    this.continue = true

    // 清除上一局的动画
    window.cancelAnimationFrame(this.aniId);

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )


  }

  /**
   * 随着帧数变化的敌机生成逻辑
   * 帧数取模定义成生成的频率
   */
  enemyGenerate() {
    if (databus.frame % 30 === 0) {
      let enemy = databus.pool.getItemByClass('enemy', Enemy)
      enemy.init(5)
      databus.enemys.push(enemy)
    }
    else if (databus.frame % 50 === 0) {
      if (databus.scanners.length == 0) {
        let scanner = databus.pool.getItemByClass('scanner', Scanner)
        scanner.init(2)
        databus.scanners.push(scanner)
      }
    }
  }


  // 全局碰撞检测
  collisionDetection() {
    let that = this

    databus.bullets.forEach((bullet) => {
      for (let i = 0, il = databus.enemys.length; i < il; i++) {
        let enemy = databus.enemys[i]

        if (!enemy.isPlaying && enemy.isCollideWith(bullet)) {
          enemy.visible = false
          enemy.playAnimation()
          that.music.playExplosion()

          bullet.useStaticImg = false  //IMPROVE
          bullet.visible = false
          databus.score += 1
          //enemy.useStaticImg=false
          // enemy.visible = false

          //databus.removeEnemey_n(enemy)
          //  databus.removeEnemey(enemy)
          // enemy.playAnimation=false
          // enemy.useStaticImg=false
          break
        }
      }

    })

    for (let i = 0, il = databus.enemys.length; i < il; i++) {
      let enemy = databus.enemys[i]

      if (this.player.isCollideWith(enemy)) {
        databus.gameOver = true

        break
      }
    }

    for (let i = 0, il = databus.scanners.length; i < il; i++) {
      let scanner = databus.scanners[i]

      if (this.player.isCollideWith(scanner)) {
        databus.prizeGot = true
        break
      }
    }
  }

  // 游戏结束后的触摸事件处理逻辑
  touchEventHandler(e) {
    e.preventDefault()

    let x = e.touches[0].clientX
    let y = e.touches[0].clientY

    let area = this.gameinfo.btnArea
    if (x >= area.startX
      && x <= area.endX
      && y >= area.startY
      && y <= area.endY)
      this.restart()
  }

  //游戏暂停时触摸关闭按钮和京东折扣券的处理逻辑

  continueTouchEventHandler(e) {
    e.preventDefault()

    let x = e.touches[0].clientX
    let y = e.touches[0].clientY

    let area = this.prizeinfo.btnArea
    if (x >= area.startX
      && x <= area.endX
      && y >= area.startY
      && y <= area.endY)
      // this.restart()
      // this.aniId = window.requestAnimationFrame(
      //   this.bindLoop,
      //   canvas
      // )
      this.restart()
      //this.continue = true
  }


  // 游戏逻辑更新主函数
  update() {
    if (databus.gameOver)
      return;

    if (databus.prizeGot)
      return;

    this.bg.update()

    databus.bullets
      .concat(databus.enemys)
      .concat(databus.scanners)
      //      .concat(databus.flotages)
      .forEach((item) => {
        item.update()
      })

    this.enemyGenerate()

    this.collisionDetection()

    if (databus.frame % 20 === 0) {
      this.player.shoot()
      this.music.playShoot()
    }
  }


  /**
   * canvas重绘函数
   * 每一帧重新绘制所有的需要展示的元素
   */
  render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    this.bg.render(ctx)

    databus.bullets
      .concat(databus.enemys)
      .concat(databus.scanners)
      //      .concat(databus.flotages)
      .forEach((item) => {
        item.drawToCanvas(ctx)
      })

    this.player.drawToCanvas(ctx)

    databus.animations.forEach((ani) => {
      if (ani.isPlaying) {
        ani.aniRender(ctx)
      }
    })

    this.gameinfo.renderGameScore(ctx, databus.score)

    // 游戏结束停止帧循环
    if (databus.gameOver) {
      this.gameinfo.renderGameOver(ctx, databus.score)

      if (!this.hasEventBind) {
        this.hasEventBind = true
        this.touchHandler = this.touchEventHandler.bind(this)
        canvas.addEventListener('touchstart', this.touchHandler)
      }
    }

    // 游戏暂停
    if (databus.prizeGot) {

      this.prizeinfo.renderPrizeInfo(ctx)

      if (!this.hasEventBind) {
        this.hasEventBind = true
        this.continueHandler = this.continueTouchEventHandler.bind(this)
        canvas.addEventListener('touchstart', this.continueHandler)

      }
    }
  }

  // 实现游戏帧循环
  loop() {
    databus.frame++

    this.update()
    this.render()

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
  }
}
