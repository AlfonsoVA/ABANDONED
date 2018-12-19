var GameEngine = (function(GameEngine) {
  const PI_180 = Math.PI/180;
  const PI_2 =  Math.PI/2;
  let invi_time = 5;
  let invi_time_aux = 0;
  let bye = true;

  class Character {
    constructor(scene) {

      let self = this;

      this.scene = scene;
      this.mesh = scene.getMeshByName("Lorian_body");
      this.mesh2 = scene.getMeshByName("Lorian_unions");
      this.mesh2.parent = this.mesh;
      this.mesh.checkCollisions = true;
      this.mesh.ellipsoid = new BABYLON.Vector3(35, 90, 30);
      this.mesh.ellipsoidOffset = new BABYLON.Vector3(0, 90, 0);
      this.mesh.material.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);

      this.debug_ellipsoid = BABYLON.MeshBuilder.CreateSphere("tmp_sphere", {diameterX: 70, diameterY: 180, diameterZ: 60}, scene);
      this.debug_ellipsoid.position.y = 90;
      this.debug_ellipsoid.parent = this.mesh;
      this.debug_ellipsoid.visibility = 0.50;
      this.debug_ellipsoid.isVisible = false;

      this.cameraTarget = BABYLON.MeshBuilder.CreateBox("CameraTarget", {width: 10, height: 10, depth: 10}, scene);
      this.cameraTarget.visibility = 0;
      this.cameraTarget.parent = this.mesh;
      this.cameraTarget.position.y = 120;

      this.skeleton = scene.getSkeletonByName("Lorian_armature");
      this.skeleton.needInitialSkinMatrix = false;

      this.walk_range = this.skeleton.getAnimationRange("Walk_injured");

      this.idle_range = this.skeleton.getAnimationRange("Idle");
      this.invisible_range = this.skeleton.getAnimationRange("Invisible");

      this.ataque_range = this.skeleton.getAnimationRange("Ataque");

      this.muerte_range = this.skeleton.getAnimationRange("Muerte");

      this.state = "Idle";
      this.invisible = false;
      this.animation_stopped = false;

      this.invi_trans = false;

      this.itHasStopped = function () {
        self.animation_stopped = true;
      }

      scene.beginAnimation(this.skeleton, this.idle_range.from + 1, this.idle_range.to, true, 0.8);

      this.velocity = new BABYLON.Vector3();
      this.vr = 0;
      this.rotation = -Math.PI/2;
      this.speed = 0;
    }

    // Faltan corregir las animaciones para que algunas al terminar de hacerse se desbloqueen las otras y no se repitan.
    processInput(keys) {
      if(this.state !== "Dead"){
        this.vr = 0;
        if(this.state !== "Attack" && !this.invi_trans){
          if (keys["ArrowUp"]) {
            if (this.state === "Idle") {
              this.scene.stopAnimation(this.skeleton);
              this.scene.beginAnimation(this.skeleton, this.walk_range.from + 2, this.walk_range.to, true);
              this.state = "Walk";
            }

            this.speed = 200;
          }
          else {
            if (this.state === "Walk") {
              this.scene.stopAnimation(this.skeleton);
              this.scene.beginAnimation(this.skeleton, this.idle_range.from + 1, this.idle_range.to, true, 0.8);
              this.state = "Idle";
            }
            this.speed = 0;
            this.velocity.x = 0;
            this.velocity.y = 0;
            this.velocity.z = 0;
          }

          if (keys["ArrowLeft"]) {
            this.vr = -3;
            this.velocity.x = 0;
            this.velocity.y = 0;
            this.velocity.z = 0;
          }
          if (keys["ArrowRight"]) {
            this.vr = 3;
            this.velocity.x = 0;
            this.velocity.y = 0;
            this.velocity.z = 0;
          }

          if (keys["z"] || keys["Z"]) {
            this.scene.stopAnimation(this.skeleton);
            this.scene.beginAnimation(this.skeleton, this.invisible_range.from, this.invisible_range.to, false, 1, this.itHasStopped);
            this.invi_trans = true;
            this.speed = 0; 
          }

          if (keys["p"] || keys["P"]) {
            this.scene.stopAnimation(this.skeleton);
            this.scene.beginAnimation(this.skeleton, this.ataque_range.from, this.ataque_range.to, false, 1.5, this.itHasStopped);
            this.state = "Attack";
            this.speed = 0; 
          }
        }
      }else{
          this.speed = 0;
          this.scene.stopAnimation(this.skeleton);
          this.scene.beginAnimation(this.skeleton, this.muerte_range.from+1, this.muerte_range.to, false, 0.3);
        }
    }

    update(elapsed) {

      if(this.invisible){
        this.debug_ellipsoid.isVisible = true;
        invi_time_aux += elapsed;
        if(invi_time_aux >= invi_time){
          this.invisible = false;
          invi_time_aux = 0;
        }
      }else{
        this.debug_ellipsoid.isVisible = false;
      }

      this.rotation += this.vr * PI_180;
      this.velocity.x = -Math.cos(this.rotation) * this.speed * elapsed;
      this.velocity.y += this.scene.gravity.y * elapsed;
      this.velocity.z =  Math.sin(this.rotation) * this.speed * elapsed;

      this.mesh.rotation.y = this.rotation + PI_2;
      this.cameraTarget.rotation.y = this.mesh.rotation.y;

      if(this.animation_stopped && this.invi_trans){
        this.invisible = true;
        this.invi_trans = false;
        this.animation_stopped = false;
      }

      if(this.animation_stopped && this.state === "Attack"){
        this.state = "Idle";
        this.animation_stopped = false;
      } 

      this.mesh.moveWithCollisions(this.velocity);
    }

  }

  GameEngine.Character = Character;
  return GameEngine;
})(GameEngine || {})
