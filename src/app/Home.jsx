import {Component} from "@/core";

export default class HomeScreen extends Component {
  constructor(key, props, context) {
    super(key, props, context);
  }

  render() {
    return (
      <div style="display: flex; justify-content: center; align-items: center; background-color: white">
        <p>Welcome</p>
      </div>
    );
  }
}