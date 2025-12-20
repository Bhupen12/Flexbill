import { ROLES, type Role } from '$lib/types';
import {
  Building2Icon,
  Layers2Icon,
  LayoutGridIcon,
  ShieldIcon,
  type IconProps
} from '@lucide/svelte';
import type { Component } from 'svelte';


type SidebarItem = {
  title: string;
  url: string;
  icon: Component<IconProps, object, "">;
};

type GroupItems = {
  title: string,
  items: SidebarItem[]
}

export type MenuItem = {
  home: string,
  groups: GroupItems[]
}

export const SIDEBAR_BY_ROLE: Partial<Record<Role, MenuItem>> = {
  [ROLES.SUPER_ADMIN]: {
    home: "/super/dashboard",
    groups: [
      {
        title: "Organizations",
        items: [
          {
            title: 'DashBoard',
            url: '/super/dashboard',
            icon: LayoutGridIcon
          },
          {
            title: 'Organizations',
            url: '/super/organizations',
            icon: Building2Icon
          },
          {
            title: 'Platform Users',
            url: '/super/users',
            icon: ShieldIcon
          }
        ]
      }
    ]
  },

  [ROLES.ADMIN]: {
    home: "/admin/dashboard",
    groups: [
      {
        title: "Organization",
        items: [
          {
            title: "DashBoard",
            url: "/admin/dashboard",
            icon: ShieldIcon
          },
          {
            title: "Users",
            url: "/admin/users",
            icon: ShieldIcon
          },
          {
            title: "Products",
            url: "/admin/products",
            icon: Layers2Icon
          }
        ]
      }
    ]
  },

  // [ROLES.USER]: [
  //   {
  //     title: 'Billing',
  //     url: '/app/billing',
  //     icon: ReceiptIcon
  //   },
  //   {
  //     title: 'Customers',
  //     url: '/app/customers',
  //     icon: UserIcon
  //   }
  // ]
};
