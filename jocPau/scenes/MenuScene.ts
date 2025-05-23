import Phaser from 'phaser';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    // Afegir el títol del joc
    this.add.text(400, 100, 'Mummy Revenge', {
      fontSize: '64px',
      color: '#ffcc00',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 6,
    }).setOrigin(0.5);
  
    // Afegir les instruccions
    this.add.text(400, 200, 'Controls:', {
      fontSize: '32px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);
  
    this.add.text(400, 250, '- Mou-te amb les fletxes direcccionals', {
      fontSize: '24px',
      color: '#ffffff',
    }).setOrigin(0.5);
  
    this.add.text(400, 280, '- Dispara amb la barra espaiadora', {
      fontSize: '24px',
      color: '#ffffff',
    }).setOrigin(0.5);
  
    this.add.text(400, 310, '- Fes un dash amb la tecla SHIFT', {
      fontSize: '24px',
      color: '#ffffff',
    }).setOrigin(0.5);
  
    this.add.text(400, 360, 'En la segona fase, el rei Hephti et roba el poder del dash per teletransportar-se!', {
      fontSize: '20px',
      color: '#ff6666',
      align: 'center',
      wordWrap: { width: 700 },
    }).setOrigin(0.5);
  
    // Crear el botó de "Start Game"
    const startButton = this.add.text(400, 450, 'Start Game', {
      fontSize: '40px',
      color: '#ffffff',
      backgroundColor: '#0000ff',
      padding: { x: 20, y: 10 },
      fontStyle: 'bold',
    }).setOrigin(0.5).setInteractive();
  
    // Afegir un efecte de pulsació al botó
    this.tweens.add({
      targets: startButton,
      scale: { from: 1, to: 1.1 },
      duration: 800,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1,
    });
  
    // Configurar l'esdeveniment de clic al botó
    startButton.on('pointerdown', () => {
      this.scene.start('World1Scene'); // Canvia a la primera escena del joc
    });
  
    // Canviar el color del botó quan el ratolí passi per sobre
    startButton.on('pointerover', () => {
      startButton.setStyle({ backgroundColor: '#ff0000' });
    });
  
    startButton.on('pointerout', () => {
      startButton.setStyle({ backgroundColor: '#0000ff' });
    });
  }}