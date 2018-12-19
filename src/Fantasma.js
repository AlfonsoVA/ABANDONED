var GameEngine = (function(GameEngine) {
  const PI_180 = Math.PI/180;
  const PI_2 =  Math.PI/2;

  let move_vector;

  class Fantasma {
    constructor(scene, character) {
      let self = this;

      this.active = true;
      this.scene = scene;

      this.character = character;

      //this.mesh = scene.getMeshByName("joins_fantasma");
      //this.mesh2 = scene.getMeshByName("surface_fantasma");

      this.mesh = scene.getMeshByName("cabeza");
      this.mesh2 = scene.getMeshByName("cuerpo");
      this.mesh3 = scene.getMeshByName("cabello");
      this.mesh4 = scene.getMeshByName("ojos");
      this.mesh5 = scene.getMeshByName("dientes");
      this.mesh6 = scene.getMeshByName("forma_ojos");
      this.mesh7 = scene.getMeshByName("oyo_ojos");
      this.mesh8 = scene.getMeshByName("ropa");

      //Sincronizando los meshes
      this.mesh2.parent = this.mesh;
      this.mesh3.parent = this.mesh;
      this.mesh4.parent = this.mesh;
      this.mesh5.parent = this.mesh;
      this.mesh6.parent = this.mesh;
      this.mesh7.parent = this.mesh;
      this.mesh8.parent = this.mesh;

      //Checando elipsoides
      this.mesh.ellipsoid = new BABYLON.Vector3(50, 90, 50);
      this.mesh.ellipsoidOffset = new BABYLON.Vector3(0, 90, 0);

      //Revisar colisiones
      this.mesh.checkCollisions = true;

      //Cargando los huesitos.
      this.skeleton = scene.getSkeletonByName("armadura_fantasma");

      this.itHasStopped = function () {
        self.animation_stopped = true;
      }

      //Animacion de grito
      this.yell_range = this.skeleton.getAnimationRange("grito");
      this.scene.beginAnimation(this.skeleton, this.yell_range.from+2, this.yell_range.to, true, 1, this.itHasStopped);

      this.vr = 0;
      this.rotation = -Math.PI/2;

      this.state = "Idle";

      this.grita = false;
    }

    update(elapsed) {

      this.distancia = BABYLON.Vector3.Distance(this.mesh.position, this.character.mesh.position);

      if (this.distancia < 200) {
          this.state = "bye";
          this.grita = true;
      } else if(this.distancia < 300){
          this.mesh.lookAt(this.character.mesh.position);
      }

      if(this.state === "bye"){
        this.mesh.isVisible = false;
        this.mesh2.isVisible = false;
        this.mesh3.isVisible = false;
        this.mesh4.isVisible = false;
        this.mesh5.isVisible = false;
        this.mesh6.isVisible = false;
        this.mesh7.isVisible = false;
        this.mesh8.isVisible = false;
        this.mesh.checkCollisions = false;
        this.active = false;
      }

      this.animation_stopped = false;
    }
  }
  GameEngine.Fantasma = Fantasma;
  return GameEngine;
})(GameEngine || {})
