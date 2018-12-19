var GameEngine = (function(GameEngine) {
  const PI_180 = Math.PI/180;
  const PI_270 = Math.PI/270;
  let keys = {};
  let t_textos = 20;
  let t_textos_aux = 0;
  let hay_texto = false;
  let t_accion = 1;
  let t_accion_aux = 0;
  let accion = false;

  class Level3State {
    constructor(engine, game) {
      let self = this;
      this.ready = false;
      this.engine = engine;
      this.game = game;
      this.scene = new BABYLON.Scene(engine);

      this.meteSonidos();

      this.llave_audio = new Audio("https://opengameart.org/sites/default/files/133008__cosmicd__annulet-of-absorption.wav");
      this.llave_audio.volume = 0.2;

      this.background_audio = new Audio("music/Sad_piano.mp3");
      this.background_audio.loop = true;
      this.background_audio.volume = 0.4;
      this.background_audio.addEventListener("canplay", function() {
        this.play();
      });

      this.scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
      this.scene.collisionsEnabled = true;

      this.assetsManager = new BABYLON.AssetsManager(this.scene);
      this.assetsManager.addMeshTask("mesh_task", "", "modelos/", "Lorian.babylon");
      this.assetsManager.addMeshTask("mesh_task", "", "modelos/", "key.babylon");
      this.assetsManager.addMeshTask("mesh_task", "", "modelos/", "level3.babylon");
      this.assetsManager.addMeshTask("mesh_task", "", "modelos/", "zombie_sin_textura.babylon");
      this.assetsManager.addMeshTask("mesh_task", "", "modelos/", "fantasma.babylon");
      this.assetsManager.addMeshTask("mesh_task", "", "modelos/", "key_poly.babylon");      
      this.assetsManager.addMeshTask("mesh_task", "", "modelos/", "Worn_Key.babylon");
      this.assetsManager.addMeshTask("mesh_task", "", "modelos/", "bed.babylon");

      this.assetsManager.onFinish = function () {
        self.init();
      }
      
      this.assetsManager.load();

    }

    init() {
      this.ready = true;
      BABYLON.Animation.AllowMatricesInterpolation = false;

      this.camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(0, 0, 0), this.scene);
      this.camera.radius = 130;
      this.camera.heightOffset = 90;
      this.camera.cameraAcceleration = 0.03
      this.camera.maxCameraSpeed = 10;

      this.light = new BABYLON.DirectionalLight("directionalLight", 
                                                new BABYLON.Vector3(-1, -2, -1), 
                                                this.scene);
      this.light.position = new BABYLON.Vector3(0, 150, 20);
      this.light.diffuse = new BABYLON.Color3(1, 0, 0);
      this.light.specular = new BABYLON.Color3(0, 1, 0);

      this.scene.activeCamera = this.camera;

      // GUI
      this.take_text = new BABYLON.GUI.TextBlock();
      this.take_text.top = "20%";
      this.take_text.text = "E para recoger";
      this.take_text.color = "black";
      this.take_text.resizeToFit = true;
      this.take_text.fontSize = "5%";

      this.take_text.isVisible = false;

      this.actual_text = this.creaTexto("...");
      hay_texto = true;
      t_textos = 4;

      this.num_yabes = 0;

      this.yabes = new BABYLON.GUI.TextBlock();
      this.yabes.top = "-45%";
      this.yabes.left = "-40%";
      this.yabes.text = "Llaves: " + this.num_yabes;
      this.yabes.color = "white";
      this.yabes.resizeToFit = true;
      this.yabes.fontSize = "5%";

      var GUITexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
      GUITexture.addControl(this.take_text);  
      GUITexture.addControl(this.actual_text); 
      GUITexture.addControl(this.yabes);

      this.character = new GameEngine.Character(this.scene);
      this.near_object = null;

      this.zombie = new GameEngine.Zombie(this.scene, this.character, 65, 1, -822);

      this.zombie_2 = new GameEngine.ZombieDos(this.scene, this.character, 453.98, 1, 12.91, this.zombie);

      this.fantasme = new GameEngine.Fantasma(this.scene, this.character);
      this.fantasme.mesh.position.x = -872.35;
      this.fantasme.mesh.position.y = 1;
      this.fantasme.mesh.position.z = -712.51;
      
      this.fantasme2 = new GameEngine.Fantasma2(this.scene, this.fantasme, this.character);
      this.fantasme2.mesh.position.x = -444.59;
      this.fantasme2.mesh.position.y = 1;
      this.fantasme2.mesh.position.z = -220.62;

      this.camera.lockedTarget = this.character.cameraTarget;

      //Level 3
      this.character.mesh.position.x = -217.71;
      this.character.mesh.position.z = 1439.30;

      this.key = new GameEngine.Object(this.scene, "Cube.001");
      this.key.mesh.position.x = -217.71;
      this.key.mesh.position.z = 733.18;

      this.key2 = new GameEngine.Object(this.scene, "AntiqueKey");
      this.key2.mesh.position.x = -224.79;
      this.key2.mesh.position.z = -207.63;
      this.key2.id = 2;

      this.key3 = new GameEngine.Object(this.scene, "Cube");
      this.key3.mesh.position.x = 724.24;
      this.key3.mesh.position.z = 403.99;

      this.key4 = new GameEngine.Object(this.scene, "Key_01");
      this.key4.mesh.position.x = -1010.24;
      this.key4.mesh.position.z = 763.46;

      this.level = new GameEngine.Object(this.scene, "Plane");
      this.level.mesh.position.x = -300;
      this.level.mesh.position.z = 200;  

      this.ball = BABYLON.MeshBuilder.CreateSphere("Ball", {diameter: 200}, this.scene);
      this.ball.material = new BABYLON.StandardMaterial("BallMat_8", this.scene);
      this.ball.emissiveColor = new BABYLON.Color3(0, 0, 1);
      this.ball.position.x = -212.18;
      this.ball.position.y = 100;
      this.ball.position.z = 496.15;  
      this.ball.checkCollisions = true;     

      this.ball_2 = BABYLON.MeshBuilder.CreateSphere("Ball_2", {diameter: 300}, this.scene);
      this.ball_2.material = new BABYLON.StandardMaterial("BallMat_9", this.scene);
      this.ball_2.emissiveColor = new BABYLON.Color3(0, 0, 1);
      this.ball_2.position.x = 734.46;
      this.ball_2.position.y = 100;
      this.ball_2.position.z = 1128.44;
      this.ball_2.checkCollisions = true; 
    
      this.ball_3 = BABYLON.MeshBuilder.CreateSphere("Ball_3", {diameter: 200}, this.scene);
      this.ball_3.material = new BABYLON.StandardMaterial("BallMat_10", this.scene);
      this.ball_3.emissiveColor = new BABYLON.Color3(1, 0, 0);
      this.ball_3.position.x = -829.73;
      this.ball_3.position.y = 100;
      this.ball_3.position.z = 1473.02;
      this.ball_3.checkCollisions = true;

      this.ball_4 = BABYLON.MeshBuilder.CreateSphere("Ball_4", {diameter: 200}, this.scene);
      this.ball_4.material = new BABYLON.StandardMaterial("BallMat_10", this.scene);
      this.ball_4.emissiveColor = new BABYLON.Color3(1, 0, 0);
      this.ball_4.position.x = -786.73;
      this.ball_4.position.y = 100;
      this.ball_4.position.z = 534.84;
      this.ball_4.checkCollisions = true;

      this.cama1 = new GameEngine.Object(this.scene, "lettoO");
      this.cama1.mesh.position.x = -311;
      this.cama1.mesh.position.y = 1;
      this.cama1.mesh.position.z = 24;
      this.cama1.checkCollisions = false;

      this.cama2 = new GameEngine.Object(this.scene, "lettoO");
      this.cama2.mesh = this.cama1.mesh.clone("cama2");
      this.cama2.mesh.position.x = -301;
      this.cama2.mesh.position.y = 1;
      this.cama2.mesh.position.z = -631;
      this.cama2.checkCollisions = false;

      // register keyboard input
      this.scene.actionManager = new BABYLON.ActionManager(this.scene);
      this.scene.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, 
          function(evt) {
            keys[evt.sourceEvent.key] = true;
          }
        )
      );
      this.scene.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, 
          function(evt) {
            delete keys[evt.sourceEvent.key];
          }
        )
      );

    }

    meteSonidos(){

      this.llave_audio = new Audio("https://opengameart.org/sites/default/files/133008__cosmicd__annulet-of-absorption.wav");
      this.llave_audio.volume = 0.2;

      this.ambiente_a1 = new Audio("music/dark_ambiences/ambience-1.wav");
      this.ambiente_a2 = new Audio("music/dark_ambiences/ambience-2.wav");
      this.ambiente_a3 = new Audio("music/dark_ambiences/ambience-5.wav");

      this.demon_a1 = new Audio("music/demons/Demon_00.mp3");
      this.demon_a2 = new Audio("music/demons/Demon_08.mp3");
      this.demon_a3 = new Audio("music/demons/Demon_14.mp3");
      this.demon_a4 = new Audio("music/demons/Demon_20.mp3");
      this.demon_a5 = new Audio("music/demons/Human_DyingBreath_03.mp3");
      this.demon_a6 = new Audio("music/demons/qubodup-GhostMoan03.mp3");
      this.demon_a7 = new Audio("music/demons/qubodup-GhostMoan04.mp3");
      this.ahhhrg = new Audio("music/demons/aargh6.ogg");

      this.zombie_a1 = new Audio("music/zombies/zombie-18.wav");
      this.zombie_a2 = new Audio("music/zombies/zombie-4.wav");
      this.zombie_a3 = new Audio("music/zombies/zombie-8.wav");

    }

    processInput() {
      if (this.ready) {
        this.character.processInput(keys);

        if (!accion && (keys["E"] || keys["e"]) && this.near_object && this.near_object.active){
          this.num_yabes += 1;
          this.yabes.text = "Llaves: " + this.num_yabes;
          accion = true;
          this.near_object.mesh.isVisible = false;
          this.near_object.mesh.checkCollisions = false;
          this.near_object.active = false;
          this.llave_audio.play();
          this.demon_a1.play();
          this.demon_a5.play();
          this.demon_a6.play();
          this.demon_a7.play();
          this.demon_a4.play();
          this.demon_a3.play();
          this.ambiente_a3.play();
          if(this.near_object.id == 2){
            this.actual_text.text = "Este lugar no está lejos de ser un infierno, desearía salir y advertir a\ntodo el mundo, pero no creo poder hacerlo...";
            hay_texto = true;
            t_textos = 9;
          }
        }

        // Para saber donde poner las cosas.
        if(keys["d"]){
          console.log("X:");
          console.log(this.character.mesh.position.x);
          console.log("Y:");
          console.log(this.character.mesh.position.y);
          console.log("Z:");
          console.log(this.character.mesh.position.z);
        }

      }
    }

    creaTexto(txt){
      var tex = new BABYLON.GUI.TextBlock();
      tex.top = "10%";
      tex.text = txt;
      tex.color = "white";
      tex.resizeToFit = true;
      tex.fontSize = "3%";
      tex.isVisible = false;

      return tex;
    }

    update(elapsed) {
      if (this.ready) {
        
        if(accion){
          t_accion_aux += elapsed;
          if(t_accion_aux >= t_accion){
            t_accion_aux = 0;
            accion = false;
          }
        }

        this.take_text.isVisible = false; 
        this.actual_text.isVisible = false;

        if(hay_texto){
          this.actual_text.isVisible = true;
          t_textos_aux += elapsed;
          if(t_textos_aux >= t_textos){
            this.actual_text.isVisible = false;
            hay_texto = false;
            t_textos_aux = 0;
            this.demon_a1.play();
            this.demon_a5.play();
            this.demon_a6.play();
            this.demon_a7.play();
            this.demon_a4.play();
            this.demon_a3.play();
            if(!this.ball_3.isVisible){
              this.actual_text.text = "GAME OVER."
              hay_texto = true;
              t_textos = 50;
            }
          }
        }else{
          this.actual_text.text = "";
        }

        this.character.update(elapsed);
        this.zombie.update(elapsed);
        this.zombie_2.update(elapsed);

        if(this.fantasme.active){
          this.fantasme.update(elapsed);

          if(this.fantasme.grita){
            this.ahhhrg.play();
            this.fantasme.grita = false;
          }
        }

        if(this.fantasme2.active){
          this.fantasme2.update(elapsed);

          if(this.fantasme2.grita){
            this.ahhhrg.play();
            this.fantasme2.grita = false;
          }
        }

        if(this.num_yabes > 0){
         if (this.ball.isVisible && this.character.mesh.intersectsMesh(this.ball, false)) {            
            this.ball.checkCollisions = false;
            this.ball.isVisible = false;
            this.num_yabes -= 1;
            this.yabes.text = "Llaves: " + this.num_yabes;
            this.actual_text.text = "Entonces era como sospechaba,\nsólo me usaron para ganarse algo de sucio dinero a cambio de mi vida,\ntal vez no sabían que esto pasaría pero… ya no hay mucho que hacer.";
            hay_texto = true;
            t_textos = 9;
            this.demon_a7.play();
            this.demon_a5.play();
            this.demon_a6.play();
          }
         if (this.ball_2.isVisible && this.character.mesh.intersectsMesh(this.ball_2, false)) {
            this.ball_2.material.emissiveColor = new BABYLON.Color3(0, 1, 0);
            this.ball_2.checkCollisions = false;
            this.ball_2.isVisible = false;
            this.num_yabes -= 1;
            this.yabes.text = "Llaves: " + this.num_yabes;
            this.actual_text.text = "Ah... muchas veces se toman decisiones y no se mira atrás aunque algo esté en juego.\nEra imposible que ellos supieran que al entregarme a este\nlugar me pasaría esto, o al menos eso quiero creer...";
            hay_texto = true;
            this.demon_a6.play();
            this.demon_a1.play();
            this.ambiente_a3.play();
          }
         if (this.ball_3.isVisible && this.character.mesh.intersectsMesh(this.ball_3, false)) {
            this.ball_3.material.emissiveColor = new BABYLON.Color3(0, 1, 0);
            this.ball_3.checkCollisions = false;
            this.ball_3.isVisible = false;   
            this.actual_text.text = "Bueno... mucho ya no hay que hacer... éste es mi fin.";
            this.num_yabes -= 1;
            this.yabes.text = "Llaves: " + this.num_yabes;
            hay_texto = true;
            this.demon_a7.play();
            this.demon_a5.play();
            this.demon_a1.play();
            this.demon_a6.play();
            this.demon_a4.play();
            this.ambiente_a1.play();
            this.ambiente_a3.play();
            this.demon_a1.play();
            this.demon_a5.play();
            this.character.state = "Dead";
            this.demon_a1.play();
            this.demon_a5.play();
            this.demon_a6.play();
            this.demon_a7.play();
            this.demon_a4.play();
            this.demon_a3.play();
            this.demon_a5.loop = true;
            this.demon_a3.loop = true;
            this.demon_a7.loop = true;
            this.demon_a6.loop = true;
            this.demon_a1.loop = true;
            this.demon_a4.loop = true;
            this.background_audio.pause();
          }

          if (this.ball_4.isVisible && this.character.mesh.intersectsMesh(this.ball_4, false)) {
            this.ball_4.material.emissiveColor = new BABYLON.Color3(0, 1, 0);
            this.ball_4.checkCollisions = false;
            this.ball_4.isVisible = false;
            this.num_yabes -= 1;
            this.yabes.text = "Llaves: " + this.num_yabes;
          } 
        }
        
        if(this.key.active){
          if (this.key.mesh.intersectsMesh(this.character.mesh, false)) {
            this.near_object = this.key;
            this.take_text.isVisible = true;
          }
        }

        if(this.key2.active){
          if (this.key2.mesh.intersectsMesh(this.character.mesh, false)) {
            this.near_object = this.key2;
            this.take_text.isVisible = true;
          }
        } 

        if(this.key3.active){
          if (this.key3.mesh.intersectsMesh(this.character.mesh, false)) {
            this.near_object = this.key3;
            this.take_text.isVisible = true;
          }
        } 

        if(this.key4.active){
          if (this.key4.mesh.intersectsMesh(this.character.mesh, false)) {    
            this.near_object = this.key4;
            this.take_text.isVisible = true;
          }          
        } 

      }
    }

    render() {
      if (this.ready) {
        this.scene.render();
      }
    }

  }

  GameEngine.Level3State = Level3State;
  return GameEngine;
})(GameEngine || {})