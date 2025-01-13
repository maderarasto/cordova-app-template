import {Component} from "@/core";
import HomeScreen from "@/app/Home";

export default class App extends Component {
  constructor(key, props, context) {
    super(key, props, context);
  }

  render() {
    return (
      <>
        <HomeScreen />
      </>
    );
  }
}