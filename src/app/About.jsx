import {Component} from "@/core";

export default class AboutScreen extends Component {
  constructor(key, props, context) {
    super(key, props, context);
  }

  render() {
    return (
      <div style="flex: 1; display: flex; justify-content: center; align-items: center; background-color: white">
        <p>About</p>
        <p style="color: #737373">here</p>
      </div>
    );
  }
}