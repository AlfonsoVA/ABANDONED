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

  class Level2State {
    constructor(engine, game) {
      let self = this;

      this.ready = false;
      this.engine = engine;
      this.game = game;
      this.scene = new BABYLON.Scene(engine);

      this.llave_audio = new Audio("https://opengameart.org/sites/default/files/133008__cosmicd__annulet-of-absorption.wav");
      this.llave_audio.volume = 0.5;

      this.meteSonidos();

      this.background_audio = new Audio("https://opengameart.org/sites/default/files/Socapex%20-%20Dark%20ambiance_3.mp3");
      this.background_audio.loop = false;
      this.background_audio.volume = 0.2;
      this.background_audio.addEventListener("canplay", function() {
        this.play();
      });

      this.scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
      this.scene.collisionsEnabled = true;
      this.scene.clearColor = new BABYLON.Color3(0.46484375, 0.6171875, 0.79296875);

      this.assetsManager = new BABYLON.AssetsManager(this.scene);
      this.assetsManager.addMeshTask("mesh_task", "", "modelos/", "Lorian.babylon");
      this.assetsManager.addMeshTask("mesh_task", "", "modelos/", "key.babylon");
      this.assetsManager.addMeshTask("mesh_task", "", "modelos/", "level2.babylon");
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

      this.scene.ambientColor = new BABYLON.Color3(0.75, 0.75, 0.75);
      this.camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(0, 0, 0), this.scene);
      this.camera.radius = 130;
      this.camera.heightOffset = 90;
      this.camera.cameraAcceleration = 0.03;
      this.camera.maxCameraSpeed = 10;

      this.light = new BABYLON.DirectionalLight("directionalLight", 
                                                new BABYLON.Vector3(-1, -2, -1), 
                                                this.scene);
      this.light.position = new BABYLON.Vector3(0, 150, 20);
      this.light.diffuse = new BABYLON.Color3(0.2, 0.7, 0.6);
      this.light.specular = new BABYLON.Color3(0.65, 0.3, 0.3);

      this.scene.activeCamera = this.camera;

      // GUI
      this.take_text = new BABYLON.GUI.TextBlock();
      this.take_text.top = "20%";
      this.take_text.text = "E para recoger";
      this.take_text.color = "black";
      this.take_text.resizeToFit = true;
      this.take_text.fontSize = "5%";

      this.take_text.isVisible = false;

      this.actual_text = this.creaTexto("Esa puerta me clarificó un poco la mente, ahora empiezo a recordar…\neste lugar es el hospital Merrieland,\nrecuerdo haber escuchado a mi madre hablar que este era un hospital psiquiátrico,\npero parece más bien un lugar de experimentación,\nla gente que está aquí no es normal, los ruidos… y parece no haber nadie humano…");
      hay_texto = true;

      this.num_yabes = 0;

      this.yabes = new BABYLON.GUI.TextBlock();
      this.yabes.top = "-45%";
      this.yabes.left = "-40%";
      this.yabes.text = "Llaves: " + this.num_yabes.toString();
      this.yabes.color = "white";
      this.yabes.resizeToFit = true;
      this.yabes.fontSize = "5%";

      var GUITexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
      GUITexture.addControl(this.take_text);  
      GUITexture.addControl(this.actual_text); 
      GUITexture.addControl(this.yabes);
      
      this.character = new GameEngine.Character(this.scene);
      this.near_object = null;
      
      this.camera.lockedTarget = this.character.cameraTarget;

      //Level 2
      this.character.mesh.position.x = -1132.89;
      this.character.mesh.position.z = 828.22;

      this.zombie = new GameEngine.Zombie(this.scene, this.character, -718.15, 1, 685.74);

      this.zombie_2 = new GameEngine.ZombieDos(this.scene, this.character, 751.23, 1, -546.71, this.zombie);

      this.fantasme = new GameEngine.Fantasma(this.scene, this.character);
      this.fantasme.mesh.position.x = -608.83;
      this.fantasme.mesh.position.y = 1;
      this.fantasme.mesh.position.z = -489.89;               

      this.fantasme2 = new GameEngine.Fantasma2(this.scene, this.fantasme, this.character);
      this.fantasme2.mesh.position.x = 428.35;
      this.fantasme2.mesh.position.y = 1;
      this.fantasme2.mesh.position.z = 954.14;

      this.key = new GameEngine.Object(this.scene, "AntiqueKey");
      this.key.mesh.position.x = -408.83;
      this.key.mesh.position.z = 801.74;
      this.key.id = 1;

      this.key2 = new GameEngine.Object(this.scene, "Cube");
      this.key2.mesh.position.x = 588.16;
      this.key2.mesh.position.z = -338.87;      
      this.key2.id = 2;

      this.key3 = new GameEngine.Object(this.scene, "Key_01");
      this.key3.mesh.position.x = -454.92
      this.key3.mesh.position.z = -275.97; 
      this.key3.id = 3;

      this.level = new GameEngine.Object(this.scene, "Plane");
      this.level.mesh.position.x = -300;
      this.level.mesh.position.z = 200;  

      this.ball_5 = BABYLON.MeshBuilder.CreateSphere("Ball_5", {diameter: 200}, this.scene);
      this.ball_5.material = new BABYLON.StandardMaterial("BallMat_5", this.scene);
      this.ball_5.emissiveColor = new BABYLON.Color3(0, 0, 1);
      this.ball_5.position.x = 425.99;
      this.ball_5.position.y = 100;
      this.ball_5.position.z = 446.39;	
      this.ball_5.checkCollisions = true;

      this.ball_6 = BABYLON.MeshBuilder.CreateSphere("Ball_6", {diameter: 200}, this.scene);
      this.ball_6.material = new BABYLON.StandardMaterial("BallMat_6", this.scene);
      this.ball_6.emissiveColor = new BABYLON.Color3(0, 0, 1);
      this.ball_6.position.x = 66.33;
      this.ball_6.position.y = 100;
      this.ball_6.position.z = 66.33;
      this.ball_6.checkCollisions = true;   

      this.ball_7 = BABYLON.MeshBuilder.CreateSphere("Ball_7", {diameter: 200}, this.scene);
      this.ball_7.material = new BABYLON.StandardMaterial("BallMat_7", this.scene);
      this.ball_7.emissiveColor = new BABYLON.Color3(0, 0, 1);
      this.ball_7.position.x = 822.99;
      this.ball_7.position.y = 100;
      this.ball_7.position.z = -817.35;
      this.ball_7.checkCollisions = true;

      this.cama1 = new GameEngine.Object(this.scene, "lettoO");
      this.cama1.mesh.position.x = -682.66;
      this.cama1.mesh.position.y = 0.73;
      this.cama1.mesh.position.z = 873;
      this.cama1.checkCollisions = false;

      this.cama2 = new GameEngine.Object(this.scene, "lettoO");
      this.cama2.mesh = this.cama1.mesh.clone("cama2");
      this.cama2.mesh.position.x = -242.76;
      this.cama2.mesh.position.y = 0.8;
      this.cama2.mesh.position.z = -215;
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
          this.ambiente_a3.play();
          if(this.near_object.id == 1){
            this.actual_text.text = "Todo empezó el día del conflicto, una decisión complicada...\nmis padres siempre han pensado que debía acudir a un especialista por\nmis tendencias... ¿Habrán tenido razón? ¿Merezco esto?";
            hay_texto = true;
            t_textos = 9;
            this.ambiente_a1.play();
          }else if(this.near_object.id == 3){
            this.actual_text.text = "No... esa decisión me concernía a mi también, además, esto no es un hospital psiquiátrico.\nLes habrán ofrecido una gran cantidad...";
            hay_texto = true;
            t_textos = 9;
          }else if(this.near_object.id == 2){
            this.actual_text.text = "¿Qué le ha pasado a estas personas? ¿Por qué un hospital psiquiátrico haría\nesto con sus pacientes?";
            hay_texto = true;
            t_textos = 6;
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

        if(!this.ball_7.isVisible && !this.ball_6.isVisible && !this.ball_5.isVisible){
                this.game.changeState("lvl3");
                this.background_audio.pause();
        }

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
          if (this.ball_5.isVisible && this.character.mesh.intersectsMesh(this.ball_5, false)) {
            this.ball_5.material.emissiveColor = new BABYLON.Color3(0, 1, 0);
            this.ball_5.checkCollisions = false;
            this.ball_5.isVisible = false;
            this.num_yabes -= 1;
            this.yabes.text = "Llaves: " + this.num_yabes;
            this.actual_text.text = "Maldita sea mi suerte, estoy harto de este lugar.\nAún así, parece que no pueden herirme, lo cual me alegra, pero me hace sospechar\nsi han hecho cosas conmigo";
            hay_texto = true;
            t_textos = 7;
            this.demon_a7.play();
            this.demon_a5.play();
            this.demon_a6.play();
            this.ambiente_a3.play();
          }
          if (this.ball_6.isVisible && this.character.mesh.intersectsMesh(this.ball_6, false)) {
            this.ball_6.material.emissiveColor = new BABYLON.Color3(1, 0, 0);
            this.ball_6.checkCollisions = false;
            this.ball_6.isVisible = false;
            this.num_yabes -= 1;
            this.yabes.text = "Llaves: " + this.num_yabes;
            this.actual_text.text = "Antes de llegar a este lugar tuve un conflicto en mi hogar,\nsiempre he tenido problemas, por eso me habían mencionado sobre MerrieLand…\nque incluso ofrecían pagos a las familias por “cuidar” a sus familiares…";
            hay_texto = true;
            t_textos = 13;
            this.demon_a6.play();
            this.demon_a1.play();
            this.ambiente_a3.play();
          }
          if (this.ball_7.isVisible && this.character.mesh.intersectsMesh(this.ball_7, false)) {
            this.ball_7.material.emissiveColor = new BABYLON.Color3(1, 0, 0);
            this.ball_7.checkCollisions = false;
            this.ball_7.isVisible = false;
            this.num_yabes -= 1;
            this.yabes.text = "Llaves: " + this.num_yabes;
            this.actual_text.text = "¿He sido vendido por mi familia?";
            hay_texto = true;
            t_textos = 5;
            this.demon_a7.play();
            this.demon_a5.play();
            this.demon_a1.play();
            this.demon_a6.play();
            this.demon_a4.play();
            this.ambiente_a1.play();
            this.ambiente_a3.play();
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
      }
    }

    render() {
      if (this.ready) {
        this.scene.render();
      }
    }

  }

  GameEngine.Level2State = Level2State;
  return GameEngine;
})(GameEngine || {})