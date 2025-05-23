import Phaser from 'phaser';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  create() {
    // Text de Game Over
    this.add.text(400, 200, 'Has perdut!', {
      fontSize: '64px',
      color: '#ff0000',
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

    // Botó per iniciar el joc directament
    const playButton = this.add.text(400, 400, 'Inicia el joc', {
      fontSize: '32px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 },
    }).setOrigin(0.5).setInteractive();

    playButton.on('pointerdown', () => {
      this.scene.start('World1Scene'); // Canvia a la primera escena del joc
    });
  }
}