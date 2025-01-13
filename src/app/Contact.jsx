import {Component} from "@/core";

export default class ContactScreen extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <div style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center;">
        <p>Contact</p>
      </div>
    );
  }
}