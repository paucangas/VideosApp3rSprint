import Phaser from 'phaser';
import MenuScene from './scenes/MenuScene';
import World1Scene from './scenes/World1Scene';
import VictoryScene from './scenes/VictoryScene';
import World2Scene from './scenes/World2Scene';
import GameOverScene from './scenes/GameOverScene';


const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [MenuScene, World1Scene, VictoryScene, World2Scene, GameOverScene], // MenuScene is the first scene
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
};

const game = new Phaser.Game(config);