import {CordovaRouter, JSX} from "@/core";
import Home from "@/app/Home";

const router = new CordovaRouter({
  routes: [
    {
      path: '/',
      component: () => <Home />,
    },
  ]
});

export default router;