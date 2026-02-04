class uams {
  onStartActions = [];
  onStopActions = [];
  onStart() {
    for (let action of this.onStartActions) {
      if (!action()) {
        return false;
      }
    }
    return true;
  }
  onStop() {
    this.onStopActions.forEach((action) => action());
  }
  addOnStart(action) {
    this.onStartActions.push(action);
  }
  addOnStop(action) {
    this.onStopActions.push(action);
  }
  createAction(action) {
    async function actionFun() {
      if (this.onStart()) {
        await action();
      }
      this.onStop();
    }
    const actionToRetutn = actionFun.bind(this);
    return actionToRetutn;
  }
}

export default uams;
