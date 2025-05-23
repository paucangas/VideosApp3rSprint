import Phaser from 'phaser';
import MenuScene from './scenes/MenuScene';
import World1Scene from './scenes/World1Scene';
import World2Scene from './scenes/World2Scene';
import GameOverScene from './scenes/GameOverScene';
import VictoryScene from './scenes/VictoryScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 500 },
      debug: false,
    },
  },
  scene: [MenuScene, World1Scene, World2Scene, GameOverScene, VictoryScene],
};

new Phaser.Game(config);
