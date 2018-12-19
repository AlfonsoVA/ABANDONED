var GameEngine = (function(GameEngine) {
  let keys = {};
  let tiempo_presentacion = 10;
  let t_present = 0;

  class StartState {
    constructor(engine, game) {

      this.engine = engine;
      this.game = game;

      this.scene = new BABYLON.Scene(engine);

      var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), this.scene);

      this.camera = new BABYLON.UniversalCamera("camera", new BABYLON.Vector3(0, 0, -10), this.scene);
      this.camera.setTarget(BABYLON.Vector3.Zero());

      this.background_audio = new Audio("music/forest.ogg");
      this.background_audio.loop = true;
      this.background_audio.volume = 0.5;
      this.background_audio.addEventListener("canplay", function() {
        this.play();
      });

      var materialPlane = new BABYLON.StandardMaterial("texturePlane", this.scene);
      materialPlane.diffuseTexture = new BABYLON.Texture("images/Pantalla_princi.jpeg", this.scene);
      materialPlane.specularColor = new BABYLON.Color3(0, 255, 0);
      materialPlane.backFaceCulling = false;

      var plane = BABYLON.Mesh.CreatePlane("plane", 10.1, this.scene, true, BABYLON.Mesh.DOUBLESIDE);
      plane.material = materialPlane;

      this.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("GUI");
      
      this.presentacion = false;

      let rectPanel = new BABYLON.GUI.Rectangle();
      rectPanel.width = 0.9;
      rectPanel.height = "100px";
      rectPanel.top = 300;
      rectPanel.left = 50;
      rectPanel.cornerRadius = 0;
      rectPanel.color = "black";
      rectPanel.thickness = 0;
      rectPanel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
      rectPanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
      this.advancedTexture.addControl(rectPanel);    

      this.text_present = new BABYLON.GUI.TextBlock();
      this.text_present.text = "Tu nombre es Lorian.\nDespiertas una noche en lo que parece un hospital.\nNo recuerdas muy bien el por qué estás ahí...";
      this.text_present.color = "red";
      this.text_present.fontSize = 33;
      this.text_present.isVisible = false;
      rectPanel.addControl(this.text_present);      
      

      var GUITexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
      GUITexture.addControl(this.init_text);

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

    processInput() {
      if (keys[" "]) {
        this.presentacion = true;
        this.text_present.isVisible = true;

      }
    }

    update(elapsed) {
      if(this.presentacion){
        t_present += elapsed;
      }

      if(t_present >= tiempo_presentacion){
          this.game.changeState("lvl1");
          this.background_audio.pause();
      }

    }

    render() {
      this.scene.render();
    }
  }

  GameEngine.StartState = StartState;
  return GameEngine;
})(GameEngine || {})