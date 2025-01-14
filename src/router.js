import {CordovaRouter, JSX} from "@/core";
import Home from "@/app/Home";
import AboutScreen from "@/app/About";

const router = new CordovaRouter({
  routes: [
    {
      path: '/',
      component: () => <Home />,
    },
    {
      path: '/about',
      component: () => <AboutScreen />
    }
  ]
});

export default router;