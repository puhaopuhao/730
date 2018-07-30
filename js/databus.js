import Pool from './base/pool'

let instance

/**
 * 全局状态管理器
 */
export default class DataBus {
  constructor() {
    if ( instance )
      return instance

    instance = this

    this.pool = new Pool()

    this.reset()
  }

  reset() {
    this.frame      = 0
    this.score      = 0
    this.bullets    = []
    this.enemys     = []
    this.scanners   = []
    this.flotages   = []
    this.animations = []
    this.gameOver   = false
    this.prizeGot  = false
  }

  /**
   * 回收敌人，进入对象池
   * 此后不进入帧循环
   */
  removeEnemey(enemy) {
    let temp = this.enemys.shift()

    temp.useStaticImg = false  //IMPROVE
    temp.visible = false

    this.pool.recover('enemy', enemy)
  }
  removeEnemey_n(enemy)
  {
    this.pool.recover('enemy', enemy)
    this.enemy.visible=false;
    this.enemy.useStaticImg=false
  }



  
  removeScanner(scanner) {
    let temp = this.scanners.shift()

    temp.useStaticImg = false  //IMPROVE
    temp.visible = false

    this.pool.recover('scanner', scanner)
  }

  removeFlotage(flotage) {
    let temp = this.flotages.shift()

    temp.useStaticImg = false  //IMPROVE
    temp.visible = false

    this.pool.recover('flotage', flotage)
  }
  /**
   * 回收子弹，进入对象池
   * 此后不进入帧循环
   */
  removeBullets(bullet) {
    let temp = this.bullets.shift()

    temp.useStaticImg = false  //IMPROVE
    temp.visible = false

    this.pool.recover('bullet', bullet)
  }
  
  
}
