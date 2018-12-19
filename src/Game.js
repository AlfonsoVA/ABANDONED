var GameEngine = (function(GameEngine) {

  class Game {
    constructor(engine) {

      this.engine = engine;
      this.state = new GameEngine.StartState(this.engine, this);

    }

    changeState(state_name) {
      if (state_name === "lvl1") {
        this.state.scene.detachControl();
        this.state = new GameEngine.Level1State(this.engine, this);
      }else if(state_name === "lvl2"){
        this.state.scene.detachControl();
        this.state = new GameEngine.Level2State(this.engine, this);
      }else if(state_name === "lvl3"){
        this.state.scene.detachControl();
        this.state = new GameEngine.Level3State(this.engine, this);
      }else if(state_name === "ini"){
        this.state.scene.detachControl();
        this.state = new GameEngine.StartState(this.engine, this);
      }
    }

    processInput() {
      this.state.processInput();
    }

    update(elapsed) {
      this.state.update(elapsed);
    }

    render() {
      this.state.render();
    }
  }

  GameEngine.Game = Game;
  return GameEngine;
})(GameEngine || {})