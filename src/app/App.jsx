import {Component} from "@/cordflare";
import Home from "@/app/Home";

export default class App extends Component {
  constructor(key, props) {
    super(key, props);
  }

  render() {
    return (
      <div>
        <h1>Welcome to App!</h1>
        <Home />
      </div>
    )
  }
}