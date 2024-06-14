import { createRouter, createWebHashHistory } from "vue-router";
import AppLayout from "@/layout/AppLayout.vue";
import { useStore } from "vuex";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      component: () => import("@/layout/LandingPageMainLayout.vue"),
      children: [
        {
          path: "/",
          name: "landing",
          component: () => import("@/views/pages/ecommerce/Landing.vue"),
        },
      ],
    },
    {
      path: "/",
      component: () => import("@/layout/LandingPageLayout.vue"),
      children: [
        {
          path: "/orderTracker",
          name: "orderTracker",
          component: () => import("@/views/pages/ecommerce/OrderTracker.vue"),
        },
        {
          path: "/editProfile",
          name: "Edit Profile",
          component: () => import("@/views/pages/ecommerce/EditProfile.vue"),
        },
        {
          path: "/viewProfile",
          name: "View Profile",
          component: () => import("@/views/pages/ecommerce/ViewProfile.vue"),
        },
      ],
    },
    {
      path: "/admin",
      component: AppLayout,
      children: [
        {
          path: "dashboard",
          name: "dashboard",
          component: () => import("@/views/Dashboard.vue"),
        },
        {
          path: "inventory",
          name: "Manage Inventory",
          component: () => import("@/views/pages/admin/ManageInventory.vue"),
        },
        {
          path: "pos/:sessionId", // Add the parameter placeholder
          name: "POS",
          component: () => import("@/views/pages/admin/POS.vue"),
        },

        {
          path: "payment",
          name: "Payment",
          component: () => import("@/views/pages/admin/Payment.vue"),
        },
        {
          path: "session",
          name: "Session",
          component: () => import("@/views/pages/admin/Session.vue"),
        },
        {
          path: "addAccount",
          name: "Add Account",
          component: () => import("@/views/pages/admin/AddAccount.vue"),
        },
        {
          path: "addAccountVerify",
          name: "Add Account Verify",
          component: () => import("@/views/pages/admin/AddAccountVerify.vue"),
        },
        {
          path: "addAccountInfo",
          name: "Add Account Info",
          component: () => import("@/views/pages/admin/AddAccountInfo.vue"),
        },
        {
          path: "onlineCustomer",
          name: "Online Customer",
          component: () => import("@/views/pages/admin/OnlineCustomer.vue"),
        },
        {
          path: "reports",
          name: "Reports",
          component: () => import("@/views/pages/admin/Reports.vue"),
        },
        {
          path: "test",
          name: "Test",
          component: () => import("@/views/pages/admin/Test.vue"),
        }
      ],
    },
    {
      path: "/auth/login",
      name: "login",
      component: () => import("@/views/pages/auth/Login.vue"),
    },
    {
      path: "/auth/register",
      name: "register",
      component: () => import("@/views/pages/auth/Register.vue"),
    },
    {
      path: "/auth/verifyEmail",
      name: "verifyEmail",
      component: () => import("@/views/pages/auth/VerifyEmail.vue"),
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const store = useStore();
  await store.dispatch('auth/initializeAuth');
  const userRole = store.state.auth.accountType; // Assuming 'accountType' holds the role
  const isAuthenticated = store.state.auth.isAuthenticated;

  if (isAuthenticated && (userRole === 'Owner' || userRole === 'Employee')) {
    // If the user is either an owner or an employee, redirect to the admin dashboard
    if (to.path !== '/admin/dashboard') {
      next({ path: '/admin/dashboard' });
    } else {
      next();
    }
  } else if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({ name: 'login', query: { redirect: to.fullPath } });
    } else if (to.matched.some(record => record.meta.allowedRoles && !record.meta.allowedRoles.includes(userRole))) {
      next({ name: 'login' }); // Redirect to login if role not allowed
    } else {
      next();
    }
  } else {
    next(); // Continue as normal if no role-related redirects are necessary
  }
});



export default router;
