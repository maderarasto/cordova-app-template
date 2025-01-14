import {Component} from "@/core";
import {PressableOpacity} from "@/core/components";

export default class HomeScreen extends Component {
  constructor(key, props, context) {
    super(key, props, context);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.context.router.navigate('/about');
  }

  render() {
    return (
      <div style="flex: 1; display: flex; justify-content: center; align-items: center; background-color: white">
        <p onClick={this.handleClick}>Welcome</p>
      </div>
    );
  }
}