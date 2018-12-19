var GameEngine = (function(GameEngine) {
  const PI_180 = Math.PI/180;
  const PI_2 =  Math.PI/2;
  let move_vector;

  class ZombieDos {
    constructor(scene, character, x=0, y=5, z=-5, zombie) {

      this.scene = scene;

      this.character = character;      

      this.mesh = zombie.mesh.clone("zombieDos");
      this.mesh2 = zombie.mesh2.clone("zombiesurfaceDos");

      //Sincronizando los meshes
      this.mesh2.parent = this.mesh;     

      //Revisar colisiones
      this.mesh.checkCollisions = true;

      //Checando elipsoides
      this.mesh.ellipsoid = new BABYLON.Vector3(35, 90, 50);
      this.mesh.ellipsoidOffset = new BABYLON.Vector3(0, 90, 0);


      this.skeleton = scene.getSkeletonByName("Zombie_armadura");      

      //Animacion de caminar
      this.walk_range = this.skeleton.getAnimationRange("zombie_walk");

      //Empieza animacion de caminar
      scene.beginAnimation(this.skeleton, this.walk_range.from+2, this.walk_range.to, true, 0.7);

      this.mesh.position.x = x;
      this.mesh.position.y = y;
      this.mesh.position.z = z;

      this.state = "Idle";

    }

    update(elapsed) {

      if(BABYLON.Vector3.Distance(this.mesh.position, this.character.mesh.position) < 350){
          
          move_vector = BABYLON.Vector3.Lerp(this.mesh.position-20, this.character.mesh.position, 0.007).subtract(this.mesh.position);
          move_vector = new BABYLON.Vector3(1, 0, 1);

          this.mesh.moveWithCollisions(move_vector);

          this.mesh.lookAt(this.character.mesh.position);
        }
    }
  }
  GameEngine.ZombieDos = ZombieDos;
  return GameEngine;
})(GameEngine || {})
