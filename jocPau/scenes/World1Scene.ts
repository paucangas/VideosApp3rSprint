import Phaser from "phaser"

export default class World1Scene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private coins!: Phaser.Physics.Arcade.Group
  private enemies!: Phaser.Physics.Arcade.Group
  private specialEnemies!: Phaser.Physics.Arcade.Group
  private traps!: Phaser.Physics.Arcade.Group
  private deadlyGround!: Phaser.Physics.Arcade.StaticGroup
  private lavaParticles!: Phaser.GameObjects.Group
  private bullets!: Phaser.Physics.Arcade.Group
  private enemyBullets!: Phaser.Physics.Arcade.Group
  private boomerangs!: Phaser.Physics.Arcade.Group
  private lives = 10
  private livesText!: Phaser.GameObjects.Text
  private coinCount = 0
  private coinText!: Phaser.GameObjects.Text
  private portal!: Phaser.Physics.Arcade.Sprite
  private lastFired = 0
  private playerFacing: "left" | "right" = "right"
  private powerUps!: Phaser.Physics.Arcade.Group
  private fireMode: "normal" | "shotgun" | "machinegun" = "normal"
  private powerUpTimer = 0
  private canDoubleJump = false
  private isJumping = false
  private hasDoubleJumped = false
  private canDash = true
  private dashSpeed = 500
  private dashDuration = 300
  private isDashing = false
  private dashCooldown = 1000
  private dashCooldownTimer = 0
  private shiftKey!: Phaser.Input.Keyboard.Key
  private gameOver = false
  private invulnerable = false
  private invulnerabilityTimer = 0
  private invulnerabilityDuration = 1500
  private worldWidth = 25600
  private worldHeight = 600
  private objectiveText!: Phaser.GameObjects.Text
  private groundTiles!: Phaser.Physics.Arcade.StaticGroup
  private platforms!: Phaser.Physics.Arcade.StaticGroup

  constructor() {
    super("World1Scene")
  }

  preload() {
    // Cohesive sprite set - Ancient Egypt/Dungeon theme

    // Player - Mummy sprite (already liked by user)
    this.load.spritesheet("player", "https://labs.phaser.io/assets/sprites/metalslug_mummy37x45.png", {
      frameWidth: 37,
      frameHeight: 45,
    })

    // Ground and platform textures - Stone/sand theme
    this.load.image("ground", "https://labs.phaser.io/assets/tilemaps/tiles/tmw_desert_spacing.png")
    this.load.image("platform", "https://labs.phaser.io/assets/sprites/block.png")

    // Desert/tomb background
    this.load.image("background", "https://labs.phaser.io/assets/skies/bigsky.png")

    // Enemy sprites - Ancient Egypt theme
    this.load.spritesheet("enemy", "https://labs.phaser.io/assets/sprites/red_ball.png", {
      frameWidth: 39,
      frameHeight: 40,
    })
    this.load.image("flyingEnemy", "https://labs.phaser.io/assets/sprites/beball1.png")
    this.load.image("boomerangEnemy", "https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/sprites/ghost.png")
    this.load.image("tripleEnemy", "https://labs.phaser.io/assets/sprites/red_ball.png")

    // Collectibles and items - Treasure theme
    this.load.image("coin", "https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/sprites/diamond.png")
    this.load.image("trap", "https://labs.phaser.io/assets/sprites/saw.png")
    this.load.image("lava", "https://labs.phaser.io/assets/particles/fire1.png")
    // Portal más visible
    this.load.image("portal", "https://labs.phaser.io/assets/sprites/blue_ball.png")

    // Bullets and projectiles - Matching theme
    this.load.image("bullet", "https://labs.phaser.io/assets/sprites/purple_ball.png")
    this.load.image("enemyBullet", "https://labs.phaser.io/assets/sprites/purple_ball.png")
    this.load.image("boomerang", "https://labs.phaser.io/assets/sprites/orb-green.png")

    // Power-ups - Matching theme
    this.load.image("shotgunPowerUp", "https://labs.phaser.io/assets/sprites/orb-blue.png")
    this.load.image("machinegunPowerUp", "https://labs.phaser.io/assets/sprites/orb-red.png")
  }

  create() {

    this.lives = 10
  this.coinCount = 0
  this.fireMode = "normal"
  this.gameOver = false
  this.invulnerable = false
  this.canDash = true
  this.isDashing = false
  this.dashCooldownTimer = 0
  this.powerUpTimer = 0

  
    // World bounds
    this.physics.world.setBounds(0, 0, this.worldWidth, this.worldHeight)

    // Beautiful background with parallax
    const bg = this.add.image(0, 0, "background").setOrigin(0, 0)
    bg.setScale(this.worldWidth / bg.width, this.worldHeight / bg.height)
    bg.setScrollFactor(0.1)

    // Add keyboard input
    this.shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT)
    this.cursors = this.input.keyboard.createCursorKeys()

    // Better looking ground with tiles
    this.groundTiles = this.physics.add.staticGroup()
    for (let x = 0; x < this.worldWidth; x += 64) {
      const groundTile = this.groundTiles.create(x + 32, 568, "ground")
      groundTile.setScale(1, 1)
      groundTile.setTint(0xd2b48c) // Sandy color for ground
      groundTile.refreshBody()
    }

    // Invisible wall at the end of the world
    const endWall = this.add.rectangle(this.worldWidth - 10, this.worldHeight / 2, 20, this.worldHeight, 0x000000)
    this.physics.add.existing(endWall, true)
    endWall.setAlpha(0)

    // Player setup with better sprite - FIXED: Starting position MUCH higher above ground
    this.player = this.physics.add.sprite(100, 350, "player") // Changed Y from 450 to 350 to start well above ground
    this.player.setScale(1.5)
    this.player.setBounce(0.1)
    this.player.setCollideWorldBounds(true)

    // Player animations
    if (!this.anims.exists("left")) {
      this.anims.create({
        key: "left",
        frames: this.anims.generateFrameNumbers("player", { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1,
      });
    }

    if (!this.anims.exists("turn")) {
    this.anims.create({
      key: "turn",
      frames: [{ key: "player", frame: 0 }],
      frameRate: 20,
    })
  }

  if (!this.anims.exists("right")) {
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("player", { start: 0, end: 16 }),
      frameRate: 10,
      repeat: -1,
    })
  }

    this.physics.add.collider(this.player, this.groundTiles)
    this.physics.add.collider(this.player, endWall)

    // Better looking platforms - FIXED: Now solid from all sides
    this.platforms = this.physics.add.staticGroup()
    const platformPositions = [
      // Early section - easier jumps
      { x: 400, y: 450, width: 2 },
      { x: 800, y: 350, width: 2 },
      { x: 1200, y: 250, width: 2 },
      { x: 1600, y: 450, width: 1.5 },

      // Mid section - moderate difficulty
      { x: 2200, y: 300, width: 2 },
      { x: 2800, y: 200, width: 1.5 },
      { x: 3400, y: 350, width: 2 },
      { x: 4000, y: 150, width: 1 },
      { x: 4600, y: 450, width: 2 },
      { x: 5200, y: 250, width: 1.5 },
      { x: 5800, y: 180, width: 1 },
      { x: 6400, y: 250, width: 2 },

      // Challenge section - harder jumps
      { x: 7200, y: 200, width: 1 },
      { x: 7800, y: 350, width: 1.5 },
      { x: 8500, y: 150, width: 1 },
      { x: 9200, y: 300, width: 2 },
      { x: 9900, y: 180, width: 1 },
      { x: 10600, y: 450, width: 1.5 },
      { x: 11300, y: 220, width: 1 },
      { x: 12000, y: 350, width: 2 },

      // Advanced section
      { x: 12800, y: 180, width: 1 },
      { x: 13500, y: 320, width: 1.5 },
      { x: 14200, y: 150, width: 1 },
      { x: 14900, y: 380, width: 2 },
      { x: 15700, y: 200, width: 1 },
      { x: 16400, y: 350, width: 1.5 },
      { x: 17200, y: 180, width: 1 },
      { x: 18000, y: 450, width: 2 },

      // Final section - leading to portal
      { x: 18800, y: 250, width: 1.5 },
      { x: 19600, y: 350, width: 2 },
      { x: 20400, y: 200, width: 1 },
      { x: 21200, y: 450, width: 2 },
      { x: 22000, y: 180, width: 1 },
      { x: 22800, y: 320, width: 1.5 },
      { x: 23600, y: 200, width: 2 },
      { x: 24400, y: 350, width: 2 },
      { x: 25000, y: 250, width: 2 }, // Platform near portal
    ]

    platformPositions.forEach((pos) => {
      const platform = this.platforms.create(pos.x, pos.y, "platform")
      platform.setScale(pos.width, 0.5)
      platform.setTint(0xd2b48c) // Sandy color for platforms
      platform.refreshBody()
      // FIXED: Removed the lines that disabled collisions from sides and bottom
      // Now platforms are solid from all directions
    })

    this.physics.add.collider(this.player, this.platforms)

    // Deadly ground for lava areas
    this.deadlyGround = this.physics.add.staticGroup()
    this.lavaParticles = this.add.group()

    const lavaPositions = [
      { x: 1400, width: 150 },
      { x: 2600, width: 120 },
      { x: 4200, width: 180 },
      { x: 6000, width: 100 },
      { x: 7600, width: 160 },
      { x: 9400, width: 140 },
      { x: 11100, width: 120 },
      { x: 13200, width: 200 },
      { x: 15400, width: 130 },
      { x: 17600, width: 150 },
      { x: 19800, width: 110 },
      { x: 21600, width: 170 },
      { x: 23400, width: 120 },
    ]

    lavaPositions.forEach((lavaPos) => {
      // Create deadly ground collision zone
      const deadlyGround = this.deadlyGround.create(lavaPos.x + lavaPos.width / 2, 568, "ground")
      deadlyGround.setVisible(false) // Invisible collider
      deadlyGround.setScale(lavaPos.width / 200, 1.1) // Match width of lava area
      deadlyGround.refreshBody()

      // Create visual lava effects (these don't collide)
      for (let i = 0; i < lavaPos.width; i += 20) {
        const lavaParticle = this.add.image(lavaPos.x + i, 552, "lava")
        lavaParticle.setScale(1.2)
        lavaParticle.setTint(0xff4500)
        this.lavaParticles.add(lavaParticle)

        // Add fire animation
        this.tweens.add({
          targets: lavaParticle,
          alpha: { from: 0.8, to: 1 },
          scaleY: { from: 1.2, to: 1.5 },
          duration: 800,
          ease: "Sine.easeInOut",
          yoyo: true,
          repeat: -1,
        })
      }
    })

    // Deadly ground kills player instantly
    this.physics.add.overlap(this.player, this.deadlyGround, this.hitLava, undefined, this)

    // Better looking coins
    this.coins = this.physics.add.group()
    const coinPositions = [
      // Easy section coins
      { x: 400, y: 400 },
      { x: 800, y: 300 },
      { x: 1200, y: 200 },
      { x: 1600, y: 350 },
      // Mid section coins
      { x: 2200, y: 250 },
      { x: 2800, y: 150 },
      { x: 3400, y: 300 },
      { x: 4000, y: 100 },
      { x: 4600, y: 350 },
      { x: 5200, y: 200 },
      { x: 5800, y: 130 },
      { x: 6400, y: 330 },
      // Challenge section coins
      { x: 7200, y: 150 },
      { x: 7800, y: 300 },
      { x: 8500, y: 100 },
      { x: 9200, y: 250 },
      { x: 9900, y: 130 },
      { x: 10600, y: 350 },
      { x: 11300, y: 170 },
      { x: 12000, y: 300 },
      // Advanced section coins
      { x: 12800, y: 130 },
      { x: 13500, y: 270 },
      { x: 14200, y: 100 },
      { x: 14900, y: 330 },
      { x: 15700, y: 150 },
      { x: 16400, y: 300 },
      { x: 17200, y: 130 },
      { x: 18000, y: 350 },
      // Final section coins
      { x: 18800, y: 200 },
      { x: 19600, y: 300 },
      { x: 20400, y: 150 },
      { x: 21200, y: 330 },
      { x: 22000, y: 130 },
      { x: 22800, y: 270 },
      { x: 23600, y: 150 },
      { x: 24400, y: 300 },
      // Bonus coins in risky areas
      { x: 1450, y: 450 },
      { x: 2650, y: 450 },
      { x: 4250, y: 450 },
      { x: 6050, y: 450 },
      { x: 7650, y: 450 },
      { x: 9450, y: 450 },
      { x: 11150, y: 450 },
      { x: 13250, y: 450 },
      { x: 15450, y: 450 },
      { x: 17650, y: 450 },
      { x: 19850, y: 450 },
      { x: 21650, y: 450 },
      { x: 23450, y: 450 },
      { x: 25100, y: 200 },
      { x: 25200, y: 300 },
      { x: 25300, y: 400 },
    ]

    coinPositions.forEach((pos) => {
      const coin = this.coins.create(pos.x, pos.y, "coin")
      coin.setScale(0.8)
      coin.setBounceY(Phaser.Math.FloatBetween(0.3, 0.6))
      coin.setTint(0xffd700) // Gold tint

      // Add sparkle animation
      this.tweens.add({
        targets: coin,
        angle: 360,
        duration: 3000,
        repeat: -1,
        ease: "Linear",
      })
    })

    this.physics.add.collider(this.coins, this.platforms)
    this.physics.add.collider(this.coins, this.groundTiles)
    this.physics.add.overlap(this.player, this.coins, this.collectCoin, undefined, this)

    // Better looking enemies with animations
    this.enemies = this.physics.add.group()

    // Flying enemies with better sprites
    const flyingEnemyPositions = [
      { x: 600, y: 200, vx: 80 },
      { x: 1800, y: 150, vx: -80 },
      { x: 3200, y: 180, vx: 90 },
      { x: 4800, y: 160, vx: -90 },
      { x: 6600, y: 140, vx: 85 },
      { x: 8200, y: 170, vx: -85 },
      { x: 10200, y: 150, vx: 80 },
      { x: 12400, y: 180, vx: -80 },
      { x: 14600, y: 160, vx: 90 },
      { x: 16800, y: 140, vx: -90 },
      { x: 19000, y: 170, vx: 85 },
      { x: 21400, y: 150, vx: -85 },
      { x: 23600, y: 180, vx: 80 },

      { x: 400, y: 425, vx: 80 },
      { x: 1700, y: 425, vx: -80 },
      { x: 3100, y: 425, vx: 90 },
      { x: 4700, y: 425, vx: -90 },
      { x: 6500, y: 425, vx: 85 },
      { x: 8100, y: 425, vx: -85 },
      { x: 10100, y: 425, vx: 80 },
    ]

    flyingEnemyPositions.forEach((pos) => {
      const enemy = this.enemies.create(pos.x, pos.y, "flyingEnemy")
      enemy.setScale(1.0)
      enemy.setBounce(1)
      enemy.setCollideWorldBounds(true)
      enemy.setVelocityX(pos.vx)
      enemy.setData("isShooting", false)
      enemy.body.allowGravity = false
      enemy.setTint(0xffcc00) // Golden tint for flying enemies
    })

    // Shooting enemies
    const shootingEnemyPositions = [
      { x: 1000, y: 100, vx: 60 },
      { x: 2400, y: 120, vx: -60 },
      { x: 3800, y: 110, vx: 65 },
      { x: 5400, y: 130, vx: -65 },
      { x: 7000, y: 100, vx: 60 },
      { x: 8800, y: 120, vx: -60 },
      { x: 10800, y: 110, vx: 65 },
      { x: 13000, y: 130, vx: -65 },
      { x: 15200, y: 100, vx: 60 },
      { x: 17400, y: 120, vx: -60 },
      { x: 19600, y: 110, vx: 65 },
      { x: 22000, y: 130, vx: -65 },
      { x: 24200, y: 100, vx: 60 },
    ]

    shootingEnemyPositions.forEach((pos) => {
      const enemy = this.enemies.create(pos.x, pos.y, "enemy")
      enemy.setScale(1.2)
      enemy.setBounce(1)
      enemy.setCollideWorldBounds(true)
      enemy.setVelocityX(pos.vx)
      enemy.setData("isShooting", true)
      enemy.setTint(0xff0000) // Red tint for shooting enemies
      enemy.body.allowGravity = false
      enemy.anims.play("enemyWalk", true)
    })

    // Special enemies with better sprites
    this.specialEnemies = this.physics.add.group()

    const specialEnemyPositions = [
      // Boomerang enemies
      { x: 1400, y: 300, vx: 50, type: "boomerang" },
      { x: 3600, y: 250, vx: -50, type: "boomerang" },
      { x: 6200, y: 280, vx: 50, type: "boomerang" },
      { x: 8600, y: 220, vx: -50, type: "boomerang" },
      { x: 11600, y: 260, vx: 50, type: "boomerang" },
      { x: 14200, y: 240, vx: -50, type: "boomerang" },
      { x: 17000, y: 280, vx: 50, type: "boomerang" },
      { x: 20200, y: 220, vx: -50, type: "boomerang" },
      { x: 23000, y: 260, vx: 50, type: "boomerang" },

      // Triple shot enemies
      { x: 2000, y: 350, vx: 40, type: "triple" },
      { x: 4400, y: 320, vx: -40, type: "triple" },
      { x: 7400, y: 340, vx: 40, type: "triple" },
      { x: 9800, y: 310, vx: -40, type: "triple" },
      { x: 12800, y: 330, vx: 40, type: "triple" },
      { x: 15800, y: 320, vx: -40, type: "triple" },
      { x: 18600, y: 340, vx: 40, type: "triple" },
      { x: 21800, y: 310, vx: -40, type: "triple" },
    ]

    specialEnemyPositions.forEach((pos) => {
      const enemyType = pos.type === "boomerang" ? "boomerangEnemy" : "tripleEnemy"
      const enemy = this.specialEnemies.create(pos.x, pos.y, enemyType)

      if (pos.type === "boomerang") {
        enemy.setTint(0x00ff00) // Green for boomerang
        enemy.setScale(1.0)
      } else {
        enemy.setTint(0x0000ff) // Blue for triple shot
        enemy.setScale(1.0)
      }

      enemy.setBounce(1)
      enemy.setCollideWorldBounds(true)
      enemy.setVelocityX(pos.vx)
      enemy.setData("attackType", pos.type)
      enemy.setData("lastAttack", 0)
      enemy.body.allowGravity = false
    })

    this.physics.add.collider(this.enemies, this.platforms)
    this.physics.add.collider(this.enemies, this.groundTiles)
    this.physics.add.collider(this.specialEnemies, this.platforms)
    this.physics.add.collider(this.specialEnemies, this.groundTiles)
    this.physics.add.collider(this.player, this.enemies, this.hitEnemy, undefined, this)
    this.physics.add.collider(this.player, this.specialEnemies, this.hitEnemy, undefined, this)

    // FIXED: Better positioned traps (saws) - now on ground and platforms
    this.traps = this.physics.add.group()

    // Ground traps
    const groundTrapPositions = [800, 1800, 3000, 4400, 5600, 7200, 8400, 10000, 11400, 12600]

    groundTrapPositions.forEach((x) => {
      const trap = this.traps.create(x, 450, "trap") // On ground level
      trap.setScale(0.8)
      trap.setImmovable(true)
      trap.body.allowGravity = false
      trap.setTint(0x8b0000) // Dark red tint

      // Add spinning animation
      this.tweens.add({
        targets: trap,
        angle: 360,
        duration: 2000,
        repeat: -1,
        ease: "Linear",
      })
    })

    // Platform traps - positioned on some platforms
    const platformTrapPositions = [
      { x: 400, y: 430 }, // On first platform
      { x: 1200, y: 230 }, // On third platform
      { x: 2200, y: 280 }, // On a mid-section platform
      { x: 3400, y: 330 }, // On another platform
      { x: 5200, y: 230 }, // On platform
      { x: 7800, y: 330 }, // On platform
      { x: 9900, y: 160 }, // On platform
      { x: 12000, y: 330 }, // On platform
      { x: 14900, y: 360 }, // On platform
      { x: 17200, y: 160 }, // On platform
      { x: 19600, y: 330 }, // On platform
      { x: 22000, y: 160 }, // On platform
      { x: 24400, y: 330 }, // On platform
    ]

    platformTrapPositions.forEach((pos) => {
      const trap = this.traps.create(pos.x, pos.y, "trap") // On platform
      trap.setScale(0.8)
      trap.setImmovable(true)
      trap.body.allowGravity = false
      trap.setTint(0x8b0000) // Dark red tint

      // Add spinning animation
      this.tweens.add({
        targets: trap,
        angle: 360,
        duration: 2000,
        repeat: -1,
        ease: "Linear",
      })
    })

    this.physics.add.collider(this.traps, this.groundTiles)
    this.physics.add.collider(this.traps, this.platforms)
    this.physics.add.overlap(this.player, this.traps, this.hitEnemy, undefined, this)

    // Better looking power-ups
    this.powerUps = this.physics.add.group()
    const powerUpPositions = [
      { x: 3000, y: 350, type: "shotgun" },
      { x: 7000, y: 200, type: "machinegun" },
      { x: 12000, y: 300, type: "shotgun" },
      { x: 17000, y: 250, type: "machinegun" },
      { x: 22000, y: 350, type: "shotgun" },
    ]

    powerUpPositions.forEach((pos) => {
      const powerUp = this.powerUps.create(
        pos.x,
        pos.y,
        pos.type === "shotgun" ? "shotgunPowerUp" : "machinegunPowerUp",
      )
      powerUp.setScale(1.2)
      powerUp.setData("type", pos.type)
      powerUp.setBounceY(Phaser.Math.FloatBetween(0.3, 0.6))

      // Add pulsing effect
      this.tweens.add({
        targets: powerUp,
        scale: { from: 1.2, to: 1.5 },
        duration: 1500,
        ease: "Sine.easeInOut",
        yoyo: true,
        repeat: -1,
      })
    })

    this.physics.add.collider(this.powerUps, this.platforms)
    this.physics.add.collider(this.powerUps, this.groundTiles)
    this.physics.add.overlap(this.player, this.powerUps, this.collectPowerUp, undefined, this)

    // Player bullets
    this.bullets = this.physics.add.group({
      maxSize: 1250,
      allowGravity: false,
    })

    // Boomerangs
    this.boomerangs = this.physics.add.group({
      allowGravity: false,
    })

    // Player bullets collisions - destroy on impact, don't hurt player
    this.physics.add.collider(this.bullets, this.groundTiles, this.destroyBullet, undefined, this)
    this.physics.add.collider(this.bullets, this.platforms, this.destroyBullet, undefined, this)
    this.physics.add.overlap(this.bullets, this.enemies, this.bulletHitEnemy, undefined, this)
    this.physics.add.overlap(this.bullets, this.specialEnemies, this.bulletHitEnemy, undefined, this)

    // Boomerangs collisions
    this.physics.add.overlap(this.boomerangs, this.player, this.bulletHitPlayer, undefined, this)

    // Enemy bullets - FIXED: proper collision handling
    this.enemyBullets = this.physics.add.group({
      maxSize: 40,
      allowGravity: false,
    })

    // CRITICAL FIX: Enemy bullets destroy on collision but don't affect ground/platforms
    this.physics.add.overlap(this.enemyBullets, this.groundTiles, this.destroyEnemyBullet, undefined, this)
    this.physics.add.overlap(this.enemyBullets, this.platforms, this.destroyEnemyBullet, undefined, this)
    this.physics.add.overlap(this.enemyBullets, this.player, this.bulletHitPlayer, undefined, this)

    // UI elements with better styling
    this.livesText = this.add
      .text(16, 16, "❤️ Vides: 10", {
        fontSize: "28px",
        color: "#fff",
        stroke: "#000",
        strokeThickness: 2,
      })
      .setScrollFactor(0)

    this.coinText = this.add
      .text(16, 50, "💎 Monedes: 0", {
        fontSize: "28px",
        color: "#fff",
        stroke: "#000",
        strokeThickness: 2,
      })
      .setScrollFactor(0)

    this.add
      .text(16, 84, "🔫 Mode:", {
        fontSize: "28px",
        color: "#fff",
        stroke: "#000",
        strokeThickness: 2,
      })
      .setScrollFactor(0)

    // Objective text
    this.objectiveText = this.add
      .text(16, 118, "🎯 Objectiu: Arriba al portal al final del nivell!", {
        fontSize: "24px",
        color: "#ffff00",
        stroke: "#000",
        strokeThickness: 2,
        wordWrap: { width: 500 },
      })
      .setScrollFactor(0)

    // Portal grande y brillante al final del nivel
    this.portal = this.physics.add.staticSprite(this.worldWidth - 300, 400, "portal")
    this.portal.setVisible(true)
    this.portal.setScale(4) // Mucho más grande
    this.portal.setTint(0x00ffff)
    this.portal.setDepth(100) // Asegura que esté por encima de otros elementos

    // Añadir efectos más llamativos al portal
    this.tweens.add({
      targets: this.portal,
      alpha: { from: 0.7, to: 1 },
      scale: { from: 4, to: 4.5 },
      duration: 1000,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1,
    })

    this.tweens.add({
      targets: this.portal,
      angle: 360,
      duration: 3000,
      repeat: -1,
      ease: "Linear",
    })

    // Añadir un texto flotante sobre el portal
    const portalText = this.add.text(this.worldWidth - 300, 320, "¡PORTAL AL NIVEL 2!", {
      fontSize: "24px",
      color: "#ffff00",
      stroke: "#000",
      strokeThickness: 4,
      align: "center",
    })
    portalText.setOrigin(0.5)
    portalText.setDepth(100)

    // Añadir animación al texto
    this.tweens.add({
      targets: portalText,
      y: { from: 320, to: 300 },
      duration: 1500,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1,
    })

    // Mejorar la detección de colisión con el portal
    this.physics.add.overlap(
      this.player,
      this.portal,
      () => {
        if (!this.gameOver) {
          console.log("¡Portal tocado! Cambiando a nivel 2")
          this.gameOver = true

          // Efecto visual al tocar el portal
          this.cameras.main.flash(500, 0, 255, 255)
          this.player.setTint(0x00ffff)

          // Pequeña pausa antes de cambiar de escena
          this.time.delayedCall(600, () => {
            this.scene.start("World2Scene")
          })
        }
      },
      undefined,
      this,
    )

    // Flecha indicadora que apunta hacia el portal
    const arrow = this.add.text(this.worldWidth - 500, 400, "➡️", {
      fontSize: "48px",
    })
    arrow.setOrigin(0.5)
    arrow.setDepth(100)

    // Animar la flecha
    this.tweens.add({
      targets: arrow,
      x: { from: this.worldWidth - 500, to: this.worldWidth - 350 },
      duration: 1000,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1,
    })

    // Camera setup
    this.cameras.main.startFollow(this.player)
    this.cameras.main.setBounds(0, 0, this.worldWidth, this.worldHeight)

    // Enemy shooting timer
    this.time.addEvent({
      delay: 2500,
      callback: this.enemyShoot,
      callbackScope: this,
      loop: true,
    })

    // Special enemy attack timer
    this.time.addEvent({
      delay: 3500,
      callback: this.specialEnemyAttack,
      callbackScope: this,
      loop: true,
    })
  }

  update(time: number, delta: number) {
    if (!this.player || !this.player.active || this.gameOver) return

    // Check if player fell out of bounds
    if (this.player.y > 590) {
      this.lives = 0
      this.livesText.setText("❤️ Vides: 0")
      this.gameOver = true
      this.scene.start("GameOverScene")
      return
    }

    // Update invulnerability state
    if (this.invulnerable && time > this.invulnerabilityTimer) {
      this.invulnerable = false
      this.player.setAlpha(1)
    }

    // Flash player during invulnerability
    if (this.invulnerable) {
      this.player.setAlpha(Math.floor(time / 100) % 2 === 0 ? 0.2 : 0.8)
    }

    // Update dash cooldown
    if (!this.canDash && !this.isDashing && time > this.dashCooldownTimer) {
      this.canDash = true
    }

    // Player movement
    if (!this.isDashing) {
      if (this.cursors.left?.isDown) {
        this.player.setVelocityX(-160)
        this.player.anims.play("left", true)
        this.player.setFlipX(true) // Flip sprite for left movement
        this.playerFacing = "left"
      } else if (this.cursors.right?.isDown) {
        this.player.setVelocityX(160)
        this.player.anims.play("right", true)
        this.player.setFlipX(false) // Normal sprite for right movement
        this.playerFacing = "right"
      } else {
        this.player.setVelocityX(0)
        this.player.anims.play("turn")
      }
    }

    // Check if player is on ground
    const isOnGround = this.player.body.blocked.down

    // Reset jump state when landing
    if (isOnGround) {
      if (this.isJumping) {
        this.isJumping = false
        this.hasDoubleJumped = false
      }
    }

    // Jump logic
    if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
      if (isOnGround) {
        this.player.setVelocityY(-330)
        this.isJumping = true
      } else if (this.isJumping && !this.hasDoubleJumped) {
        this.player.setVelocityY(-330)
        this.hasDoubleJumped = true
      }
    }

    // Dash
    if (Phaser.Input.Keyboard.JustDown(this.shiftKey) && this.canDash && !this.isDashing) {
      this.performDash()
    }

    // Fast fall
    if (this.cursors.down?.isDown && !isOnGround) {
      this.player.setVelocityY(500)
    }

    // Player shooting
    if (this.cursors.space?.isDown && time > this.lastFired) {
      this.fireWeapon(time)
    }

    // Revert power-up after 10 seconds
    if (this.fireMode !== "normal" && time > this.powerUpTimer) {
      this.fireMode = "normal"
    }

    // Update UI
    const modeText = this.children.getByName("modeText") as Phaser.GameObjects.Text
    if (modeText) {
      let modeDisplay = "  Gun"
      if (this.fireMode === "shotgun") modeDisplay = "  ShotGun 🔫"
      if (this.fireMode === "machinegun") modeDisplay = "  MachineGun 🔥"
      modeText.setText(modeDisplay)
    } else {
      this.add
        .text(120, 84, "Normal", {
          fontSize: "28px",
          color: "#fff",
          stroke: "#000",
          strokeThickness: 2,
        })
        .setScrollFactor(0)
        .setName("modeText")
    }

    // Update boomerangs
    this.boomerangs.getChildren().forEach((boomerang: Phaser.GameObjects.GameObject) => {
      const boomerangSprite = boomerang as Phaser.Physics.Arcade.Image
      if (boomerangSprite && boomerangSprite.active) {
        boomerangSprite.angle += 10

        if (boomerangSprite.getData("returning")) {
          const enemy = boomerangSprite.getData("enemy") as Phaser.Physics.Arcade.Sprite

          if (enemy && enemy.active) {
            const angle = Phaser.Math.Angle.Between(boomerangSprite.x, boomerangSprite.y, enemy.x, enemy.y)
            boomerangSprite.setVelocity(Math.cos(angle) * 200, Math.sin(angle) * 200)

            const distance = Phaser.Math.Distance.Between(boomerangSprite.x, boomerangSprite.y, enemy.x, enemy.y)
            if (distance < 20) {
              boomerangSprite.destroy()
            }
          } else {
            boomerangSprite.destroy()
          }
        } else {
          const distanceTraveled = Phaser.Math.Distance.Between(
            boomerangSprite.x,
            boomerangSprite.y,
            boomerangSprite.getData("startX"),
            boomerangSprite.getData("startY"),
          )

          if (distanceTraveled > 300) {
            boomerangSprite.setData("returning", true)
          }
        }
      }
    })
  }

  private fireWeapon(time: number) {
    if (!this.player || !this.player.active) return

    if (this.fireMode === "shotgun") {
      const angles = [-20, -10, 0, 10, 20]
      angles.forEach((angle) => {
        const bullet = this.bullets.create(this.player.x, this.player.y, "bullet")
        if (bullet) {
          bullet.setScale(1.5)
          const rad = Phaser.Math.DegToRad(this.playerFacing === "right" ? angle : 180 - angle)
          bullet.setVelocity(Math.cos(rad) * 400, Math.sin(rad) * 400)
          bullet.setTint(0x00ffff) // Cyan tint for shotgun

          this.time.delayedCall(2000, () => {
            if (bullet.active) {
              bullet.destroy()
            }
          })
        }
      })
      this.lastFired = time + 800
    } else if (this.fireMode === "machinegun") {
      const bullet = this.bullets.create(this.player.x, this.player.y, "bullet")
      if (bullet) {
        bullet.setScale(1.5)
        bullet.setVelocityX(this.playerFacing === "right" ? 400 : -400)
        bullet.setTint(0xff00ff) // Magenta tint for machinegun

        this.time.delayedCall(2000, () => {
          if (bullet.active) {
            bullet.destroy()
          }
        })
      }
      this.lastFired = time + 150
    } else {
      const bullet = this.bullets.create(this.player.x, this.player.y, "bullet")
      if (bullet) {
        bullet.setScale(1.5)
        bullet.setVelocityX(this.playerFacing === "right" ? 400 : -400)
        bullet.setTint(0x00ff00) // Green tint for normal

        this.time.delayedCall(2000, () => {
          if (bullet.active) {
            bullet.destroy()
          }
        })
      }
      this.lastFired = time + 500
    }
  }

  private collectCoin(player: Phaser.GameObjects.GameObject, coin: Phaser.GameObjects.GameObject) {
    ;(coin as Phaser.Physics.Arcade.Image).disableBody(true, true)
    this.coinCount += 1
    this.coinText.setText(`💎 Monedes: ${this.coinCount}`)
  }

  private collectPowerUp(player: Phaser.GameObjects.GameObject, powerUp: Phaser.GameObjects.GameObject) {
    const powerUpSprite = powerUp as Phaser.Physics.Arcade.Image
    const type = powerUpSprite.getData("type") as string
    powerUpSprite.disableBody(true, true)
    this.fireMode = type as "shotgun" | "machinegun"
    this.powerUpTimer = this.time.now + 10000
  }

  private performDash() {
    this.isDashing = true
    this.canDash = false

    const dashVelocity = this.playerFacing === "right" ? this.dashSpeed : -this.dashSpeed
    this.player.setVelocityX(dashVelocity)

    this.time.delayedCall(this.dashDuration, () => {
      this.isDashing = false
      this.dashCooldownTimer = this.time.now + this.dashCooldown
    })
  }

  private hitEnemy(player: Phaser.GameObjects.GameObject, enemy: Phaser.GameObjects.GameObject) {
    if (this.invulnerable || this.gameOver) return
    if (!player || !player.active || !enemy || !enemy.active) return

    this.lives -= 1
    this.livesText.setText("❤️ Vides: " + this.lives)

    this.invulnerable = true
    this.invulnerabilityTimer = this.time.now + this.invulnerabilityDuration

    if (this.lives <= 0) {
      this.gameOver = true
      this.scene.start("GameOverScene")
    } else {
      const enemySprite = enemy as Phaser.Physics.Arcade.Sprite
      let knockbackDirection = -1

      if (enemySprite && typeof enemySprite.x === "number") {
        knockbackDirection = this.player.x < enemySprite.x ? -1 : 1
      }

      this.player.setVelocity(knockbackDirection * 200, -200)
    }
  }

  private hitLava(player: Phaser.GameObjects.GameObject) {
    if (this.invulnerable || this.gameOver) return

    this.lives = 0
    this.livesText.setText("❤️ Vides: 0")
    this.gameOver = true

    this.player.setTint(0xff0000)

    this.time.delayedCall(500, () => {
      this.scene.start("GameOverScene")
    })
  }

  private destroyBullet(bullet: Phaser.GameObjects.GameObject) {
    if (bullet && bullet.active) {
      ;(bullet as Phaser.Physics.Arcade.Image).destroy()
    }
  }

  // CRITICAL FIX: Separate function for enemy bullets to prevent ground destruction
  private destroyEnemyBullet(bullet: Phaser.GameObjects.GameObject, ground: Phaser.GameObjects.GameObject) {
    if (bullet && bullet.active) {
      ;(bullet as Phaser.Physics.Arcade.Image).destroy()
    }
    // Ground/platform remains untouched
  }

  private bulletHitEnemy(bullet: Phaser.GameObjects.GameObject, enemy: Phaser.GameObjects.GameObject) {
    if (bullet && bullet.active) {
      ;(bullet as Phaser.Physics.Arcade.Image).destroy()
    }

    if (enemy && enemy.active) {
      ;(enemy as Phaser.Physics.Arcade.Sprite).destroy()
    }
  }

  private bulletHitPlayer(player: Phaser.GameObjects.GameObject, bullet: Phaser.GameObjects.GameObject) {
    if (this.invulnerable) {
      if (bullet && bullet.active) {
        ;(bullet as Phaser.Physics.Arcade.Image).destroy()
      }
      return
    }

    const bulletSprite = bullet as Phaser.Physics.Arcade.Image
    let knockbackDirection = -1

    if (bulletSprite && bulletSprite.body && bulletSprite.body.velocity) {
      knockbackDirection = bulletSprite.body.velocity.x > 0 ? -1 : 1
    }

    if (bulletSprite && bulletSprite.active) {
      bulletSprite.destroy()
    }

    this.lives -= 1
    this.livesText.setText("❤️ Vides: " + this.lives)

    this.invulnerable = true
    this.invulnerabilityTimer = this.time.now + this.invulnerabilityDuration

    if (this.lives <= 0) {
      this.gameOver = true
      this.scene.start("GameOverScene")
    } else {
      this.player.setVelocity(knockbackDirection * 200, -200)
    }
  }

  private enemyShoot() {
    if (this.gameOver) return

    this.enemies.getChildren().forEach((enemy: Phaser.GameObjects.GameObject) => {
      if (!enemy || !enemy.active) return

      const enemySprite = enemy as Phaser.Physics.Arcade.Sprite

      if (enemySprite.getData("isShooting")) {
        if (!this.player || !this.player.active) return

        const distance = Phaser.Math.Distance.Between(enemySprite.x, enemySprite.y, this.player.x, this.player.y)

        if (
          distance < 800 &&
          this.enemyBullets.countActive(true) < 20 &&
          this.cameras.main.worldView.contains(enemySprite.x, enemySprite.y)
        ) {
          const bullet = this.enemyBullets.create(enemySprite.x, enemySprite.y, "enemyBullet")
          if (bullet) {
            bullet.setScale(1.2)
            bullet.setTint(0xff0000) // Red tint for enemy bullets

            const angle = Phaser.Math.Angle.Between(enemySprite.x, enemySprite.y, this.player.x, this.player.y)
            bullet.setVelocity(Math.cos(angle) * 300, Math.sin(angle) * 300)

            this.time.delayedCall(3000, () => {
              if (bullet.active) {
                bullet.destroy()
              }
            })
          }
        }
      }
    })
  }

  private specialEnemyAttack() {
    if (this.gameOver) return

    this.specialEnemies.getChildren().forEach((enemy: Phaser.GameObjects.GameObject) => {
      if (!enemy || !enemy.active) return

      const enemySprite = enemy as Phaser.Physics.Arcade.Sprite
      const attackType = enemySprite.getData("attackType") as string
      const lastAttack = enemySprite.getData("lastAttack") as number

      if (this.time.now - lastAttack < 3000) return

      if (!this.player || !this.player.active) return

      const distance = Phaser.Math.Distance.Between(enemySprite.x, enemySprite.y, this.player.x, this.player.y)

      if (distance < 600 && this.cameras.main.worldView.contains(enemySprite.x, enemySprite.y)) {
        if (attackType === "boomerang") {
          this.fireBoomerang(enemySprite)
        } else if (attackType === "triple") {
          this.fireTripleShot(enemySprite)
        }

        enemySprite.setData("lastAttack", this.time.now)
      }
    })
  }

  private fireBoomerang(enemy: Phaser.Physics.Arcade.Sprite) {
    if (!this.player || !this.player.active) return

    const boomerang = this.boomerangs.create(enemy.x, enemy.y - 20, "boomerang")
    if (boomerang) {
      boomerang.setScale(1.2)
      boomerang.setTint(0x00ff00)

      const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.player.x, this.player.y)
      boomerang.setVelocity(Math.cos(angle) * 200, Math.sin(angle) * 200)

      boomerang.setData("startX", enemy.x)
      boomerang.setData("startY", enemy.y)
      boomerang.setData("enemy", enemy)
      boomerang.setData("returning", false)

      this.time.delayedCall(10000, () => {
        if (boomerang.active) {
          boomerang.destroy()
        }
      })
    }
  }

  private fireTripleShot(enemy: Phaser.Physics.Arcade.Sprite) {
    if (!this.player || !this.player.active) return

    const baseAngle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.player.x, this.player.y)
    const angles = [-15, 0, 15]

    angles.forEach((angleOffset) => {
      const bullet = this.enemyBullets.create(enemy.x, enemy.y - 20, "enemyBullet")
      if (bullet) {
        bullet.setScale(1.2)
        bullet.setTint(0x0000ff)

        const angle = baseAngle + Phaser.Math.DegToRad(angleOffset)
        bullet.setVelocity(Math.cos(angle) * 250, Math.sin(angle) * 250)

        this.time.delayedCall(3000, () => {
          if (bullet.active) {
            bullet.destroy()
          }
        })
      }
    })
  }
}
