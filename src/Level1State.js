var GameEngine = (function(GameEngine) {
  const PI_180 = Math.PI/180;
  const PI_270 = Math.PI/270;
  let keys = {};
  let t_textos = 20;
  let t_textos_aux = 0;
  let hay_texto = false;
  let t_accion = 0.3;
  let t_accion_aux = 0;
  let accion = false;

  class Level1State {
    constructor(engine, game) {
      let self = this;
      this.ready = false;
      this.engine = engine;
      this.game = game;

      this.scene = new BABYLON.Scene(engine);

      this.meteSonidos();

      this.background_audio = new Audio("music/Lonelyhood.ogg");
      this.background_audio.volume = 0.2;
      this.background_audio.addEventListener("canplay", function() {
        this.play();
      });

      this.background_audio_rain = new Audio("music/Dark_Rainy_Night(ambience).ogg");
      this.background_audio_rain.loop = true;
      this.background_audio_rain.volume = 0.1;
      this.background_audio_rain.addEventListener("canplay", function() {
        this.play();
      });

      this.scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
      this.scene.collisionsEnabled = true;
      this.scene.clearColor = new BABYLON.Color3(0.46484375, 0.6171875, 0.79296875);

      this.assetsManager = new BABYLON.AssetsManager(this.scene);
      this.assetsManager.addMeshTask("mesh_task", "", "modelos/", "Lorian.babylon");
      this.assetsManager.addMeshTask("mesh_task", "", "modelos/", "key.babylon");
      this.assetsManager.addMeshTask("mesh_task", "", "modelos/", "level1.babylon");
      this.assetsManager.addMeshTask("mesh_task", "", "modelos/", "bed.babylon");
      this.assetsManager.addMeshTask("mesh_task", "", "modelos/", "key_poly.babylon");    
      this.assetsManager.addMeshTask("mesh_task", "", "modelos/", "Worn_Key.babylon");
      this.assetsManager.addMeshTask("mesh_task", "", "modelos/", "zombie_sin_textura.babylon");
      this.assetsManager.addMeshTask("mesh_task", "", "modelos/", "fantasma.babylon");

      this.assetsManager.onFinish = function () {
        self.init();
      }
      
      this.assetsManager.load();

    }

    init() {
      this.ready = true;
      BABYLON.Animation.AllowMatricesInterpolation = false;

      this.scene.ambientColor = new BABYLON.Color3(0.9, 0.3, 0.2);
      this.camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(0, 0, 0), this.scene);
      this.camera.radius = 130;
      this.camera.heightOffset = 90;
      this.camera.cameraAcceleration = 0.03;
      this.camera.maxCameraSpeed = 10;

      this.light = new BABYLON.DirectionalLight("directionalLight", 
                                                new BABYLON.Vector3(-1, -2, -1), 
                                                this.scene);
      this.light.position = new BABYLON.Vector3(0, 150, 20);
      this.light.diffuse = new BABYLON.Color3(0.2, 0, 1);
      this.light.specular = new BABYLON.Color3(1, 0.3, 1);

      //var light = new BABYLON.SpotLight("spotLight", new BABYLON.Vector3(0, 30, -10), new BABYLON.Vector3(0, -1, 0), Math.PI / 3, 2, scene);

      this.scene.activeCamera = this.camera;

      var GUITexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

      // GUI
      this.take_text = new BABYLON.GUI.TextBlock();
      this.take_text.top = "20%";
      this.take_text.text = "E para recoger";
      this.take_text.color = "black";
      this.take_text.resizeToFit = true;
      this.take_text.fontSize = "5%";

      this.take_text.isVisible = false;

      this.actual_text = this.creaTexto("Uh... mi cabeza... ¿Dónde estoy?\nQue raro parece este lugar, no tengo de otra mas que explorar...");
      hay_texto = true;

      this.num_yabes = 0;

      this.yabes = new BABYLON.GUI.TextBlock();
      this.yabes.top = "-45%";
      this.yabes.left = "-40%";
      this.yabes.text = "Llaves: " + this.num_yabes;
      this.yabes.color = "white";
      this.yabes.resizeToFit = true;
      this.yabes.fontSize = "5%";

      GUITexture.addControl(this.take_text);  
      GUITexture.addControl(this.actual_text); 
      GUITexture.addControl(this.yabes);
      
      this.character = new GameEngine.Character(this.scene);
      this.zombie = new GameEngine.Zombie(this.scene, this.character, -1637, 1.1, 1359);

      this.fantasme = new GameEngine.Fantasma(this.scene, this.character);
      this.fantasme.mesh.position.x = -1314;
      this.fantasme.mesh.position.y = 1;
      this.fantasme.mesh.position.z = -1152;

      this.fantasme2 = new GameEngine.Fantasma2(this.scene, this.fantasme, this.character);
      this.fantasme2.mesh.position.x = 906.84;
      this.fantasme2.mesh.position.y = 1;
      this.fantasme2.mesh.position.z = 775.67;

      this.near_object = null;
      
      this.camera.lockedTarget = this.character.cameraTarget;

      //Level 1
      this.character.mesh.position.x = 1004.82;   
      this.character.mesh.position.z = -1090.28;

      this.key = new GameEngine.Object(this.scene, "Cube");
      this.key.mesh.position.x = -1600.99;
      this.key.mesh.position.y = 1.7;      
      this.key.mesh.position.z = -1122.96;  

      this.key2 = new GameEngine.Object(this.scene, "Cube.001");
      this.key2.mesh.position.x = 1110.29;      
      this.key2.mesh.position.y = 1.7;
      this.key2.mesh.position.z = -685.55;  
      this.key2.id = 2;

      this.key3 = new GameEngine.Object(this.scene, "Key_01");
      this.key3.mesh.position.x = -514.53;      
      this.key3.mesh.position.y = 1.7;
      this.key3.mesh.position.z = 1490.62;

      this.key4 = new GameEngine.Object(this.scene, "AntiqueKey");
      this.key4.mesh.position.x = 974.18;
      this.key4.mesh.position.y = 1.7;
      this.key4.mesh.position.z = 988.83; 
      this.key4.id = 4;

      this.level = new GameEngine.Object(this.scene, "Plane");
      this.level.mesh.position.x = -300;
      this.level.mesh.position.z = 200;  

      this.ball = BABYLON.MeshBuilder.CreateSphere("Ball", {diameter: 200}, this.scene);
      this.ball.material = new BABYLON.StandardMaterial("BallMat", this.scene);
      this.ball.emissiveColor = new BABYLON.Color3(0, 0, 1);
      this.ball.position.x = 677.73;
      this.ball.position.y = 100;
      this.ball.position.z = -948.27; 
      this.ball.checkCollisions = true;

      this.ball_2 = BABYLON.MeshBuilder.CreateSphere("Ball_2", {diameter: 200}, this.scene);
      this.ball_2.material = new BABYLON.StandardMaterial("BallMat_2", this.scene);
      this.ball_2.emissiveColor = new BABYLON.Color3(0, 0, 1);
      this.ball_2.position.x = -1365.27;
      this.ball_2.position.y = 100;
      this.ball_2.position.z = 610.46;
      this.ball_2.checkCollisions = true;

      this.ball_3 = BABYLON.MeshBuilder.CreateSphere("Ball_3", {diameter: 200}, this.scene);
      this.ball_3.material = new BABYLON.StandardMaterial("BallMat_3", this.scene);
      this.ball_3.emissiveColor = new BABYLON.Color3(0, 0, 1);
      this.ball_3.position.x = -71.31;
      this.ball_3.position.y = 100;
      this.ball_3.position.z = 687.83;
      this.ball_3.checkCollisions = true;

      this.ball_4 = BABYLON.MeshBuilder.CreateSphere("Ball_4", {diameter: 200}, this.scene);
      this.ball_4.material = new BABYLON.StandardMaterial("BallMat_4", this.scene);
      this.ball_4.emissiveColor = new BABYLON.Color3(0, 0, 1);
      this.ball_4.position.x = 1097.54;
      this.ball_4.position.y = 100;
      this.ball_4.position.z = 1649.61;      
      this.ball_4.checkCollisions = true;
      
      this.actual_text.fontSize = "3%";

      this.cama1 = new GameEngine.Object(this.scene, "lettoO");
      this.cama1.mesh.position.x = -1295.49;
      this.cama1.mesh.position.y = 1.2;
      this.cama1.mesh.position.z = 1279;
      this.cama1.checkCollisions = false;

      this.cama2 = new GameEngine.Object(this.scene, "lettoO");
      this.cama2.mesh = this.cama1.mesh.clone("cama2");
      this.cama2.mesh.position.x = -1701.72;
      this.cama2.mesh.position.y = 1;
      this.cama2.mesh.position.z = -837;
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
          if(this.near_object.id == 2){
            this.actual_text.text = "¿Pero qué clase de criatura era esa? ¡Dios, quiero salir de aquí!";
            hay_texto = true;
            t_textos = 5;
          }else if(this.near_object.id == 4){
            this.actual_text.text = "¿Será esta la salida?";
            hay_texto = true;
            t_textos = 5;
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
      tex.fontSize = "4%";
      tex.isVisible = false;

      return tex;
    }

    update(elapsed) {
      if (this.ready) {
        
        if(!this.ball_4.isVisible && !this.ball_3.isVisible && !this.ball_2.isVisible && !this.ball.isVisible){
              this.game.changeState("lvl2");
              this.background_audio.pause();
        }

        if(accion){
          t_accion_aux += elapsed;
          if(t_accion_aux >= t_accion){
            t_accion_aux = 0;
            accion = false;
            this.zombie_a3.play();
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
            this.ambiente_a3.play();
          }
        }else{
          this.actual_text.text = "";
        }

        this.character.update(elapsed);
        this.zombie.update(elapsed);

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

        if(this.num_yabes > 0){
          if (this.ball.isVisible && this.character.mesh.intersectsMesh(this.ball, false)) {
            this.ball.material.emissiveColor = new BABYLON.Color3(0, 1, 0);
            this.ball.checkCollisions = false;
            this.ball.isVisible = false;
            this.num_yabes -= 1;
            this.yabes.text = "Llaves: " + this.num_yabes;
            this.actual_text.text = "Apenas puedo caminar.";
            t_textos = 5;     
            hay_texto = true;
            this.demon_a7.play();
            this.demon_a5.play();
          }

          if (this.ball_2.isVisible && this.character.mesh.intersectsMesh(this.ball_2, false)) {
            this.ball_2.material.emissiveColor = new BABYLON.Color3(0, 1, 0);
            this.ball_2.checkCollisions = false;
            this.ball_2.isVisible = false;
            this.num_yabes -= 1;
            this.yabes.text = "Llaves: " + this.num_yabes;
            this.actual_text.text = "¿Qué es eso? ¿Qué es este lugar?\nTiene pinta de ser algún tipo de hospital,\npero no tengo memoria ahora mismo…\nEsto no me da buena espina…";
            t_textos = 11;
            hay_texto = true;
            this.demon_a7.play();
            this.demon_a5.play();
          }
          if (this.ball_3.isVisible && this.character.mesh.intersectsMesh(this.ball_3, false)) {
            this.ball_3.material.emissiveColor = new BABYLON.Color3(1, 0, 0);
            this.ball_3.checkCollisions = false;
            this.ball_3.isVisible = false;
            this.num_yabes -= 1;
            this.yabes.text = "Llaves: " + this.num_yabes;
            this.actual_text.text = "-Lorian…\ncreo... creo que ese era mi nombre.";
            hay_texto = true;
            t_textos = 5;
            this.demon_a6.play();
            this.demon_a6.volume = 1;
            this.demon_a1.play();
            this.ambiente_a3.play();
          }
          if (this.ball_4.isVisible && this.character.mesh.intersectsMesh(this.ball_4, false)) {
            this.ball_4.material.emissiveColor = new BABYLON.Color3(1, 0, 0);
            this.ball_4.checkCollisions = false;
            this.ball_4.isVisible = false;
            this.num_yabes -= 1;
            this.yabes.text = "Llaves: " + this.num_yabes;
            this.demon_a7.play();
            this.demon_a5.play();
            this.ambiente_a1.play();
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

  GameEngine.Level1State = Level1State;
  return GameEngine;
})(GameEngine || {})