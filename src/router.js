import {CordovaRouter} from "@/core";

const router = new CordovaRouter({
  routes: [
    {
      path: '/',
      children: [
        {
          path: 'profile',
          children: [
            {
              path: 'edit'
            }
          ]
        },
        {
          path: 'connections',
          children: [
            {
              path: ':id',
            }
          ]
        }
      ]
    }
  ]
});

export default router;