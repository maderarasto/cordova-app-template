import {createElement} from "@/app";
import Subcontainer from "@/app/Subcontainer";

const Container = (props) => {
    console.log(props);
    return (
      <div style="height: 100px; background-color: #ff000080;">
        <Subcontainer name="some" />
      </div>
    );
}

export default Container;