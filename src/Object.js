var GameEngine = (function(GameEngine) {

  class Object {
    constructor(scene, name) {
      this.scene = scene;
      this.mesh = scene.getMeshByName(name);
      this.mesh.checkCollisions = true;
      this.active = true;
      this.id;
    }

    processInput() {
    }

    update(elapsed) {
    }

  }

  GameEngine.Object = Object;
  return GameEngine;
})(GameEngine || {})