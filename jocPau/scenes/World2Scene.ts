import Phaser from "phaser"

export default class World2Scene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite
  private boss!: Phaser.Physics.Arcade.Sprite
  private bossHealth = 500
  private bossHealthText!: Phaser.GameObjects.Text
  private bossHealthBar!: Phaser.GameObjects.Graphics
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private platforms!: Phaser.Physics.Arcade.StaticGroup
  private bullets!: Phaser.Physics.Arcade.Group
  private bossBullets!: Phaser.Physics.Arcade.Group
  private powerUps!: Phaser.Physics.Arcade.Group
  private lives = 5
  private livesText!: Phaser.GameObjects.Text
  private lastFired = 0
  private playerFacing: "left" | "right" = "right"
  private fireMode: "normal" | "shotgun" | "machinegun" = "normal"
  private powerUpTimer = 0
  private canDoubleJump = false
  private isJumping = false
  private hasDoubleJumped = false
  private shiftKey!: Phaser.Input.Keyboard.Key
  private gameOver = false
  private invulnerable = false
  private invulnerabilityTimer = 0
  private invulnerabilityDuration = 1500
  private bossAttackTimer = 0
  private bossJumpTimer = 0
  private bossAttackType: "normal" | "shotgun" | "machinegun" = "normal"
  private powerUpSpawnTimer = 0
  private bossSpecialAttackTimer = 0

  constructor() {
    super("World2Scene")
  }

  preload() {
    // Reutilizamos los assets del primer nivel
    this.load.spritesheet("player", "https://labs.phaser.io/assets/sprites/metalslug_mummy37x45.png", {
      frameWidth: 37,
      frameHeight: 45,
    })
    this.load.image("ground", "https://labs.phaser.io/assets/tilemaps/tiles/tmw_desert_spacing.png")
    this.load.image("platform", "https://labs.phaser.io/assets/sprites/block.png")
    this.load.image("background", "https://labs.phaser.io/assets/skies/space3.png") // Fondo diferente para nivel 2
    this.load.image("bullet", "https://labs.phaser.io/assets/sprites/purple_ball.png")
    this.load.image("bossBullet", "https://labs.phaser.io/assets/sprites/bullet.png")
    this.load.image("shotgunPowerUp", "https://labs.phaser.io/assets/sprites/orb-blue.png")
    this.load.image("machinegunPowerUp", "https://labs.phaser.io/assets/sprites/orb-red.png")
    this.load.image("healthPowerUp", "https://labs.phaser.io/assets/sprites/orb-green.png")
    this.load.image("shockwave", "https://labs.phaser.io/assets/sprites/blue_ball.png")
  }

  create() {
    // Fondo del segundo nivel con efecto de estrellas
    const bg = this.add.image(0, 0, "background").setOrigin(0, 0)
    bg.setScale(800 / bg.width, 600 / bg.height)

    // Título de la batalla
    const bossTitle = this.add.text(400, 70, "BATALLA FINAL", {
      fontSize: "40px",
      color: "#ff0000",
      fontStyle: "bold",
      stroke: "#000000",
      strokeThickness: 6,
      align: "center",
    })
    bossTitle.setOrigin(0.5)

    // Efecto de pulsación para el título
    this.tweens.add({
      targets: bossTitle,
      scale: { from: 1, to: 1.1 },
      duration: 1000,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1,
    })

    // Añadir teclado
    this.shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT)
    this.cursors = this.input.keyboard.createCursorKeys()

    // Plataformas para la batalla
    this.platforms = this.physics.add.staticGroup()

    // Plataforma principal (suelo) - MUCHO MÁS BAJO y ANCHO COMPLETO
    for (let x = 0; x < 1000; x += 64) {
      const groundTile = this.platforms.create(x + 32, 785, "ground")
      groundTile.setScale(1, 2) // Hacer más grueso el suelo
      groundTile.refreshBody()
      groundTile.setTint(0x333333)
    }

    // Plataformas adicionales - MUCHO MÁS BAJAS y configuradas como one-way
    const platformPositions = [
      { x: 150, y: 650, width: 3 },
      { x: 650, y: 650, width: 3 },
      { x: 400, y: 550, width: 4 },
      { x: 200, y: 450, width: 2 },
      { x: 600, y: 450, width: 2 },
      { x: 400, y: 250, width: 3 },
    ]

    platformPositions.forEach((pos) => {
      const platform = this.platforms.create(pos.x, pos.y, "platform")
      platform.setScale(pos.width, 0.5)
      platform.refreshBody()
      platform.setTint(0x444444)

      // Configurar como plataforma de una sola dirección (solo sólida desde arriba)
      platform.body.checkCollision.down = false
      platform.body.checkCollision.left = true
      platform.body.checkCollision.right = true
    })

    // Jugador - posición inicial más baja
    this.player = this.physics.add.sprite(100, 400, "player")
    this.player.setScale(1.5)
    this.player.setBounce(0.1)
    this.player.setCollideWorldBounds(true)

    // Animaciones del jugador
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("player", { start: 0, end: 16 }),
      frameRate: 10,
      repeat: -1,
    })

    this.anims.create({
      key: "turn",
      frames: [{ key: "player", frame: 0 }],
      frameRate: 20,
    })

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("player", { start: 0, end: 16 }),
      frameRate: 10,
      repeat: -1,
    })

    // Jefe - posición inicial más baja
    this.boss = this.physics.add.sprite(700, 100, "player")
    this.boss.setScale(2.0)
    this.boss.setBounce(0.1)
    this.boss.setCollideWorldBounds(true)
    this.boss.setTint(0xff0000)
    this.boss.setFlipX(true)

    // Animaciones del jefe
    this.anims.create({
      key: "boss-left",
      frames: this.anims.generateFrameNumbers("player", { start: 0, end: 16 }),
      frameRate: 10,
      repeat: -1,
    })

    this.anims.create({
      key: "boss-turn",
      frames: [{ key: "player", frame: 0 }],
      frameRate: 20,
    })

    this.anims.create({
      key: "boss-right",
      frames: this.anims.generateFrameNumbers("player", { start: 0, end: 16 }),
      frameRate: 10,
      repeat: -1,
    })

    // Barra de vida del jefe
    this.bossHealthBar = this.add.graphics()

    this.bossHealthText = this.add.text(400, 20, "Jefe: 100/100", {
      fontSize: "24px",
      color: "#ff0000",
      stroke: "#000000",
      strokeThickness: 3,
    })
    this.bossHealthText.setOrigin(0.5)

    this.updateBossHealthBar()

    // Colisiones
    this.physics.add.collider(this.player, this.platforms)
    this.physics.add.collider(this.boss, this.platforms)

    // Balas del jugador
    this.bullets = this.physics.add.group({
      maxSize: 50,
      allowGravity: false,
    })

    // Balas del jefe
    this.bossBullets = this.physics.add.group({
      maxSize: 50,
      allowGravity: false,
    })

    // Power-ups
    this.powerUps = this.physics.add.group()
    this.physics.add.collider(this.powerUps, this.platforms)
    this.physics.add.overlap(this.player, this.powerUps, this.collectPowerUp, undefined, this)

    this.spawnPowerUp()

    // Colisiones de balas
    this.physics.add.overlap(this.bullets, this.boss, this.bulletHitBoss, undefined, this)
    this.physics.add.overlap(this.bossBullets, this.player, this.bulletHitPlayer, undefined, this)
    this.physics.add.collider(this.bullets, this.platforms, this.destroyBullet, undefined, this)
    this.physics.add.collider(this.bossBullets, this.platforms, this.destroyBullet, undefined, this)

    // UI
    this.livesText = this.add
      .text(16, 16, "❤️ Vides: 5", {
        fontSize: "24px",
        color: "#fff",
        stroke: "#000",
        strokeThickness: 2,
      })
      .setScrollFactor(0)

    // Inicializar temporizadores
    this.bossAttackTimer = this.time.now + 2000
    this.bossJumpTimer = this.time.now + 5000
    this.powerUpSpawnTimer = this.time.now + Phaser.Math.Between(7000, 15000)
    this.bossSpecialAttackTimer = this.time.now + 15000

    // Efecto de entrada del jefe
    this.boss.setAlpha(0)
    this.tweens.add({
      targets: this.boss,
      alpha: 1,
      y: 600, // Cambiar de 450 a 600
      duration: 2000,
      ease: "Power2",
      onComplete: () => {
        // Efecto de onda expansiva al aparecer
        this.createShockwave(this.boss.x, this.boss.y)
      },
    })

    // Mensaje de inicio de batalla
    const startBattleText = this.add.text(400, 300, "¡PREPARATE PARA LA BATALLA!", {
      fontSize: "36px",
      color: "#ffff00",
      stroke: "#000000",
      strokeThickness: 4,
    })
    startBattleText.setOrigin(0.5)

    this.tweens.add({
      targets: startBattleText,
      alpha: { from: 1, to: 0 },
      scale: { from: 1, to: 2 },
      duration: 2000,
      ease: "Power2",
      onComplete: () => {
        startBattleText.destroy()
      },
    })
  }

  update(time: number, delta: number) {
    if (!this.player || !this.player.active || this.gameOver) return

    // Update invulnerability state
    if (this.invulnerable && time > this.invulnerabilityTimer) {
      this.invulnerable = false
      this.player.setAlpha(1)
    }

    // Flash player during invulnerability
    if (this.invulnerable) {
      this.player.setAlpha(Math.floor(time / 100) % 2 === 0 ? 0.2 : 0.8)
    }

    // Player movement
    if (this.cursors.left?.isDown) {
      this.player.setVelocityX(-160)
      this.player.anims.play("left", true)
      this.player.setFlipX(true)
      this.playerFacing = "left"
    } else if (this.cursors.right?.isDown) {
      this.player.setVelocityX(160)
      this.player.anims.play("right", true)
      this.player.setFlipX(false)
      this.playerFacing = "right"
    } else {
      this.player.setVelocityX(0)
      this.player.anims.play("turn")
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

    // Player shooting
    if (this.cursors.space?.isDown && time > this.lastFired) {
      this.fireWeapon(time)
    }

    // Revert power-up after 10 seconds
    if (this.fireMode !== "normal" && time > this.powerUpTimer) {
      this.fireMode = "normal"
    }

    // Boss AI
    this.updateBossAI(time)

    // Spawn power-ups periodically
    if (time > this.powerUpSpawnTimer) {
      this.spawnRandomPowerUp()
      this.powerUpSpawnTimer = time + Phaser.Math.Between(30000, 60000) // 30-60 segundos
    }
  }

  private updateBossAI(time: number) {
    if (!this.boss || !this.boss.active || !this.player || !this.player.active) return

    // Boss movement - seguir al jugador
    if (this.boss.x < this.player.x - 100) {
      this.boss.setVelocityX(80)
      this.boss.anims.play("boss-right", true)
      this.boss.setFlipX(false)
    } else if (this.boss.x > this.player.x + 100) {
      this.boss.setVelocityX(-80)
      this.boss.anims.play("boss-left", true)
      this.boss.setFlipX(true)
    } else {
      this.boss.setVelocityX(0)
      this.boss.anims.play("boss-turn")
    }

    // Boss attack - disparar periódicamente
    if (time > this.bossAttackTimer) {
      this.bossFire()
      this.bossAttackTimer = time + Phaser.Math.Between(1000, 3000) // 1-3 segundos entre ataques
    }

    // Boss jump - saltar hacia el jugador periódicamente
    if (time > this.bossJumpTimer && this.boss.body.blocked.down) {
      this.bossJump()
      this.bossJumpTimer = time + Phaser.Math.Between(4000, 8000) // 4-8 segundos entre saltos
    }

    // Boss special attack - ataque especial periódicamente
    if (time > this.bossSpecialAttackTimer) {
      this.bossSpecialAttack()
      this.bossSpecialAttackTimer = time + Phaser.Math.Between(10000, 20000) // 10-20 segundos entre ataques especiales
    }

    // Cambiar tipo de ataque aleatoriamente
    if (Phaser.Math.Between(0, 1000) < 5) {
      const attackTypes = ["normal", "shotgun", "machinegun"]
      this.bossAttackType = attackTypes[Phaser.Math.Between(0, 2)] as "normal" | "shotgun" | "machinegun"
    }
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

  private bossFire() {
    if (!this.boss || !this.boss.active || !this.player || !this.player.active) return

    if (this.bossAttackType === "shotgun") {
      const angles = [-20, -10, 0, 10, 20]
      angles.forEach((angle) => {
        const bullet = this.bossBullets.create(this.boss.x, this.boss.y, "bossBullet")
        if (bullet) {
          bullet.setScale(1.5)
          const baseAngle = Phaser.Math.Angle.Between(this.boss.x, this.boss.y, this.player.x, this.player.y)
          const rad = baseAngle + Phaser.Math.DegToRad(angle)
          bullet.setVelocity(Math.cos(rad) * 300, Math.sin(rad) * 300)
          bullet.setTint(0xff0000) // Red tint for boss bullets

          this.time.delayedCall(3000, () => {
            if (bullet.active) {
              bullet.destroy()
            }
          })
        }
      })
    } else if (this.bossAttackType === "machinegun") {
      for (let i = 0; i < 3; i++) {
        this.time.delayedCall(i * 200, () => {
          if (!this.boss || !this.boss.active || !this.player || !this.player.active) return

          const bullet = this.bossBullets.create(this.boss.x, this.boss.y, "bossBullet")
          if (bullet) {
            bullet.setScale(1.5)
            const angle = Phaser.Math.Angle.Between(this.boss.x, this.boss.y, this.player.x, this.player.y)
            bullet.setVelocity(Math.cos(angle) * 300, Math.sin(angle) * 300)
            bullet.setTint(0xff0000)

            this.time.delayedCall(3000, () => {
              if (bullet.active) {
                bullet.destroy()
              }
            })
          }
        })
      }
    } else {
      const bullet = this.bossBullets.create(this.boss.x, this.boss.y, "bossBullet")
      if (bullet) {
        bullet.setScale(1.5)
        const angle = Phaser.Math.Angle.Between(this.boss.x, this.boss.y, this.player.x, this.player.y)
        bullet.setVelocity(Math.cos(angle) * 300, Math.sin(angle) * 300)
        bullet.setTint(0xff0000)

        this.time.delayedCall(3000, () => {
          if (bullet.active) {
            bullet.destroy()
          }
        })
      }
    }
  }

  private bossJump() {
    if (!this.boss || !this.boss.active || !this.player || !this.player.active) return

    // Saltar hacia el jugador
    const jumpVelocityY = -350
    let jumpVelocityX = 0

    if (this.boss.x < this.player.x) {
      jumpVelocityX = 200
    } else {
      jumpVelocityX = -200
    }

    this.boss.setVelocity(jumpVelocityX, jumpVelocityY)

    // Efecto visual - COMPLETAMENTE ARREGLADO
    this.boss.setTint(0xff3333)
    this.time.delayedCall(500, () => {
      if (this.boss && this.boss.active) {
        this.boss.setTint(0xff0000) // Directamente aplicar el color rojo
      }
    })
  }

  private bossSpecialAttack() {
    if (!this.boss || !this.boss.active) return

    // Elegir un ataque especial aleatorio
    const specialAttackType = Phaser.Math.Between(0, 2)

    switch (specialAttackType) {
      case 0:
        // Ataque 1: Onda expansiva
        this.createShockwave(this.boss.x, this.boss.y)
        break
      case 1:
        // Ataque 2: Lluvia de balas
        this.bulletRain()
        break
      case 2:
        // Ataque 3: Teletransporte y ataque
        this.bossTeleportAttack()
        break
    }
  }

  private createShockwave(x: number, y: number) {
    // Efecto visual de onda expansiva
    const shockwave = this.add.circle(x, y, 10, 0xff0000, 0.7)

    // Crear balas en círculo
    const numBullets = 16
    for (let i = 0; i < numBullets; i++) {
      const angle = (i / numBullets) * Math.PI * 2
      const bullet = this.bossBullets.create(x, y, "bossBullet")
      if (bullet) {
        bullet.setScale(1.5)
        bullet.setVelocity(Math.cos(angle) * 200, Math.sin(angle) * 200)
        bullet.setTint(0xff0000)

        this.time.delayedCall(3000, () => {
          if (bullet.active) {
            bullet.destroy()
          }
        })
      }
    }

    // Animación de la onda expansiva
    this.tweens.add({
      targets: shockwave,
      radius: 200,
      alpha: 0,
      duration: 1000,
      ease: "Power2",
      onComplete: () => {
        shockwave.destroy()
      },
    })

    // Efecto de cámara
    this.cameras.main.shake(500, 0.01)
  }

  private bulletRain() {
    // Lluvia de balas desde arriba
    for (let i = 0; i < 20; i++) {
      this.time.delayedCall(i * 100, () => {
        const x = Phaser.Math.Between(50, 750)
        const bullet = this.bossBullets.create(x, 0, "bossBullet")
        if (bullet) {
          bullet.setScale(1.5)
          bullet.setVelocity(0, 300)
          bullet.setTint(0xff0000)

          this.time.delayedCall(3000, () => {
            if (bullet.active) {
              bullet.destroy()
            }
          })
        }
      })
    }

    // Advertencia visual
    const warningText = this.add.text(400, 100, "¡CUIDADO!", {
      fontSize: "36px",
      color: "#ff0000",
      stroke: "#000000",
      strokeThickness: 4,
    })
    warningText.setOrigin(0.5)

    this.tweens.add({
      targets: warningText,
      alpha: { from: 1, to: 0 },
      y: 50,
      duration: 1000,
      ease: "Power2",
      onComplete: () => {
        warningText.destroy()
      },
    })
  }

  private bossTeleportAttack() {
    if (!this.boss || !this.boss.active || !this.player || !this.player.active) return

    // Efecto de desaparición
    this.boss.setAlpha(0.5)
    this.boss.setTint(0xff00ff)

    // Teletransporte
    this.time.delayedCall(500, () => {
      if (!this.boss || !this.boss.active || !this.player || !this.player.active) return

      // Teletransportarse cerca del jugador - ARREGLADO: no ir debajo del suelo
      const side = Phaser.Math.Between(0, 1) === 0 ? -1 : 1
      const newX = Phaser.Math.Clamp(this.player.x + side * 150, 50, 750)
      const newY = Math.min(this.player.y - 50, 700) // No ir más bajo que Y=700

      this.boss.x = newX
      this.boss.y = newY
      this.boss.setAlpha(0)

      // Reaparecer con ataque
      this.time.delayedCall(300, () => {
        if (!this.boss || !this.boss.active) return

        this.boss.setAlpha(1)
        this.boss.setTint(0xff0000) // Directamente aplicar el color rojo

        // Ataque inmediato
        this.bossFire()

        // Efecto visual
        this.createShockwave(this.boss.x, this.boss.y)
      })
    })
  }

  private spawnRandomPowerUp() {
    const x = Phaser.Math.Between(100, 700)
    const y = 100

    const powerUpType = Phaser.Math.Between(0, 2)
    let powerUp: Phaser.Physics.Arcade.Image

    switch (powerUpType) {
      case 0:
        powerUp = this.powerUps.create(x, y, "shotgunPowerUp")
        powerUp.setData("type", "shotgun")
        powerUp.setTint(0x00ffff)
        break
      case 1:
        powerUp = this.powerUps.create(x, y, "machinegunPowerUp")
        powerUp.setData("type", "machinegun")
        powerUp.setTint(0xff00ff)
        break
      case 2:
        powerUp = this.powerUps.create(x, y, "healthPowerUp")
        powerUp.setData("type", "health")
        powerUp.setTint(0x00ff00)
        break
    }

    powerUp.setScale(1.2)
    powerUp.setBounceY(0.5)

    // Añadir efecto de brillo
    this.tweens.add({
      targets: powerUp,
      scale: { from: 1.2, to: 1.5 },
      alpha: { from: 0.8, to: 1 },
      duration: 1000,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1,
    })

    // Mensaje de power-up
    const powerUpText = this.add.text(400, 100, "¡POWER-UP DISPONIBLE!", {
      fontSize: "24px",
      color: "#ffff00",
      stroke: "#000000",
      strokeThickness: 3,
    })
    powerUpText.setOrigin(0.5)

    this.tweens.add({
      targets: powerUpText,
      alpha: { from: 1, to: 0 },
      y: 80,
      duration: 2000,
      ease: "Power2",
      onComplete: () => {
        powerUpText.destroy()
      },
    })
  }

  private collectPowerUp(player: Phaser.GameObjects.GameObject, powerUp: Phaser.GameObjects.GameObject) {
    const powerUpSprite = powerUp as Phaser.Physics.Arcade.Image
    const type = powerUpSprite.getData("type") as string
    powerUpSprite.disableBody(true, true)

    if (type === "health") {
      this.lives = Math.min(this.lives + 1, 10)
      this.livesText.setText(`❤️ Vides: ${this.lives}`)

      // Efecto visual de curación
      this.player.setTint(0x00ff00)
      this.time.delayedCall(500, () => {
        if (this.player && this.player.active) {
          this.player.clearTint()
        }
      })
    } else {
      this.fireMode = type as "shotgun" | "machinegun"
      this.powerUpTimer = this.time.now + 10000

      // Mensaje de power-up
      const powerUpMessage = type === "shotgun" ? "¡SHOTGUN ACTIVADO!" : "¡MACHINE GUN ACTIVADO!"
      const messageText = this.add.text(400, 150, powerUpMessage, {
        fontSize: "24px",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 3,
      })
      messageText.setOrigin(0.5)

      this.tweens.add({
        targets: messageText,
        alpha: { from: 1, to: 0 },
        y: 130,
        duration: 2000,
        ease: "Power2",
        onComplete: () => {
          messageText.destroy()
        },
      })
    }
  }

  private bulletHitBoss(bullet: Phaser.GameObjects.GameObject, boss: Phaser.GameObjects.GameObject) {
    console.log("Bullet hit boss");
  console.log("Bullet active:", bullet.active);
  console.log("Boss active:", boss.active);
    

    // Reducir vida del jefe
    this.bossHealth -= 1
    this.updateBossHealthBar()

    // Efecto visual de daño - COMPLETAMENTE ARREGLADO
    this.boss.setTint(0xffffff)
    this.time.delayedCall(100, () => {
      if (this.boss && this.boss.active) {
        this.boss.setTint(0xff0000) // Directamente aplicar el color rojo sin clearTint
      }
    })

    // Comprobar si el jefe ha sido derrotado
    if (this.bossHealth <= 0) {
      console.log("Boss health:", this.bossHealth);
console.log("Boss active:", this.boss.active);
      this.bossDeath()
    }
  }

  private bulletHitPlayer(player: Phaser.GameObjects.GameObject, bullet: Phaser.GameObjects.GameObject) {
    if (this.invulnerable) {
      if (bullet && bullet.active) {
        ;(bullet as Phaser.Physics.Arcade.Image).destroy()
      }
      return
    }

    if (bullet && bullet.active) {
      ;(bullet as Phaser.Physics.Arcade.Image).destroy()
    }

    // Reducir vidas del jugador
    this.lives -= 1
    this.livesText.setText(`❤️ Vides: ${this.lives}`)

    // Invulnerabilidad temporal
    this.invulnerable = true
    this.invulnerabilityTimer = this.time.now + this.invulnerabilityDuration

    // Efecto visual de daño
    this.cameras.main.flash(300, 255, 0, 0)

    // Comprobar si el jugador ha perdido
    if (this.lives <= 0) {
      this.gameOver = true
      this.scene.start("GameOverScene")
    }
  }

  private destroyBullet(bullet: Phaser.GameObjects.GameObject) {
    if (bullet && bullet.active) {
      ;(bullet as Phaser.Physics.Arcade.Image).destroy()
    }
  }

  private spawnPowerUp() {
    // Generar una posición aleatoria dentro del nivel
    const x = Phaser.Math.Between(100, this.scale.width - 100)
    const y = Phaser.Math.Between(100, this.scale.height - 200)
  
    // Seleccionar un tipo de power-up aleatorio
    const powerUpType = Phaser.Math.Between(0, 2) // Cambia el rango según la cantidad de tipos de power-ups que tengas
    let powerUp: Phaser.Physics.Arcade.Image
  
    switch (powerUpType) {
      case 0:
        powerUp = this.powerUps.create(x, y, "shotgunPowerUp") as Phaser.Physics.Arcade.Image
        powerUp.setData("type", "shotgun")
        powerUp.setTint(0x00ffff) // Color opcional para diferenciar
        break
      case 1:
        powerUp = this.powerUps.create(x, y, "machinegunPowerUp") as Phaser.Physics.Arcade.Image
        powerUp.setData("type", "machinegun")
        powerUp.setTint(0xff00ff) // Color opcional para diferenciar
        break
      case 2:
        powerUp = this.powerUps.create(x, y, "healthPowerUp") as Phaser.Physics.Arcade.Image
        powerUp.setData("type", "health")
        powerUp.setTint(0x00ff00) // Color opcional para diferenciar
        break
    }
  
    // Configurar el comportamiento del power-up
    powerUp.setScale(1.2)
    powerUp.setBounce(0.5)
    powerUp.setCollideWorldBounds(true)
    powerUp.setVelocity(Phaser.Math.Between(-100, 100), Phaser.Math.Between(-50, 50))
  
    // Añadir efecto visual (opcional)
    this.tweens.add({
      targets: powerUp,
      scale: { from: 1.2, to: 1.5 },
      alpha: { from: 0.8, to: 1 },
      duration: 1000,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1,
    })
  
    // Programar el siguiente spawn entre 7 y 15 segundos
    this.time.delayedCall(Phaser.Math.Between(7000, 15000), this.spawnPowerUp, [], this)
  }

  private updateBossHealthBar() {
    this.bossHealthBar.clear()

    // Fondo de la barra
    this.bossHealthBar.fillStyle(0x000000, 0.8)
    this.bossHealthBar.fillRect(200, 20, 400, 20)

    // Barra de vida
    const healthPercentage = this.bossHealth / 500
    const barColor = this.getHealthBarColor(healthPercentage)
    this.bossHealthBar.fillStyle(barColor, 1)
    this.bossHealthBar.fillRect(200, 20, 400 * healthPercentage, 20)

    // Borde de la barra
    this.bossHealthBar.lineStyle(2, 0xffffff, 1)
    this.bossHealthBar.strokeRect(200, 20, 400, 20)

    // Actualizar texto
    this.bossHealthText.setText(`Jefe: ${this.bossHealth}/500`)
  }

  private getHealthBarColor(percentage: number): number {
    if (percentage > 0.6) return 0x00ff00 // Verde
    if (percentage > 0.3) return 0xffff00 // Amarillo
    return 0xff0000 // Rojo
  }

  private bossDeath() {
    console.log("Boss health:", this.bossHealth);
console.log("Boss active:", this.boss.active);
    this.gameOver = true

    // Detener al jefe
    this.boss.setVelocity(0, 0)
    this.boss.body.allowGravity = false

    // Efecto visual de muerte
    this.boss.setTint(0xffffff)

    // Explosiones múltiples
    for (let i = 0; i < 10; i++) {
      this.time.delayedCall(i * 200, () => {
        if (!this.boss || !this.boss.active) return

        const offsetX = Phaser.Math.Between(-50, 50)
        const offsetY = Phaser.Math.Between(-50, 50)
        this.createShockwave(this.boss.x + offsetX, this.boss.y + offsetY)
      })
    }

    // Mensaje de victoria
    const victoryText = this.add.text(400, 300, "¡JEFE DERROTADO!", {
      fontSize: "48px",
      color: "#ffff00",
      stroke: "#000000",
      strokeThickness: 6,
    })
    victoryText.setOrigin(0.5)

    // Efecto de cámara
    this.cameras.main.shake(1000, 0.02)
    this.cameras.main.flash(1000, 255, 255, 255)

    // Transición a la escena de victoria
    this.time.delayedCall(3000, () => {
      this.scene.start("VictoryScene")
    })
  }
}
