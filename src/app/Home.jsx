import {Component} from "@/core";
import AboutScreen from "@/app/About";

export default class HomeScreen extends Component {
  constructor(key, props, context) {
    super(key, props, context);

    this.handle = this.handle.bind(this);
  }

  handle() {
    console.log(this);
  }

  render() {
    this.handle();

    return (
      <div style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center;">
        <p onClick={this.handle}>Welcome</p>
        <AboutScreen />
      </div>
    );
  }
}