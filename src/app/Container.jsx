import {JSX} from "@/core";

const Container = ({children}, context) => {
  console.log(context);
  return (
    <div className="container" style="background-color: green; height: 450px">{children}</div>
  )
}

export default Container;