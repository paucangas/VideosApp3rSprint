import Phaser from 'phaser';

export default class VictoryScene extends Phaser.Scene {
  constructor() {
    super('VictoryScene');
  }

  create() {
    // Text de victòria
    this.add.text(400, 200, 'Has guanyat!', {
      fontSize: '64px',
      color: '#00ff00',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 6,
    }).setOrigin(0.5);

    // Botó per tornar al menú principal
    const menuButton = this.add.text(400, 300, 'Torna al menú', {
      fontSize: '32px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 },
    }).setOrigin(0.5).setInteractive();

    menuButton.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });

    // Botó per reiniciar el joc
    const restartButton = this.add.text(400, 400, 'Reinicia el joc', {
      fontSize: '32px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 },
    }).setOrigin(0.5).setInteractive();

    restartButton.on('pointerdown', () => {
      this.scene.start('World1Scene'); // Reinicia el joc des de la primera escena
    });

    // Efecte de pulsació per als botons
    this.tweens.add({
      targets: [menuButton, restartButton],
      scale: { from: 1, to: 1.1 },
      duration: 800,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1,
    });

    // Canvi de color quan el ratolí passa per sobre
    menuButton.on('pointerover', () => {
      menuButton.setStyle({ backgroundColor: '#ff0000' });
    });
    menuButton.on('pointerout', () => {
      menuButton.setStyle({ backgroundColor: '#000000' });
    });

    restartButton.on('pointerover', () => {
      restartButton.setStyle({ backgroundColor: '#ff0000' });
    });
    restartButton.on('pointerout', () => {
      restartButton.setStyle({ backgroundColor: '#000000' });
    });
  }
}