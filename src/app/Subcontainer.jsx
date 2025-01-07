import {createElement} from "@/app";

const Subcontainer = (props) => {

    return <div className="subcontainer" onClick={() => console.log('click')}>
        {props.children}
    </div>;
}

export default Subcontainer;