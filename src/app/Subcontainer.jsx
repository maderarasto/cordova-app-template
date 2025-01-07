import {createElement} from "@/app";

const Subcontainer = () => {
    return <div className="subcontainer" onClick={() => console.log('click')}>
        <form aria-checked={true} aria-colindex={5} data-id={24}></form>
        <input type="text" aria-valuemin={25} aria-checked={false} />
    </div>;
}

export default Subcontainer;