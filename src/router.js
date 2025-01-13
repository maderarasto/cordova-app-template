import {CordovaRouter, JSX} from "@/core";
import Home from "@/app/Home";
import About from "@/app/About";
import Contact from "@/app/Contact";

const router = new CordovaRouter({
  routes: [
    {
      path: '/',
      component: () => <Home />,
    },
    {
      path: '/about',
      component: () => <About />,
    },
    {
      path: '/contact',
      component: () => <Contact />,
    }
  ]
});

export default router;