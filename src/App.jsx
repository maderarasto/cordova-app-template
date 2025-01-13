import {Component, RouterView} from "@/core";

export default class App extends Component {
  constructor(key, props, context) {
    super(key, props, context);
  }

  render() {
    return (
      <>
        <RouterView />
      </>
    );
  }
}