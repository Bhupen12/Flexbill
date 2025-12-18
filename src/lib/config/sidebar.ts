import { ROLES, type Role } from '$lib/types';
import {
  Building2Icon,
  Layers2Icon,
  ShieldIcon,
  type IconProps
} from '@lucide/svelte';
import type { Component } from 'svelte';


type SidebarItem = {
  title: string;
  url: string;
  icon: Component<IconProps, object, "">;
};

export type ManuItems = {
  title: string,
  items: SidebarItem[]
}

export const SIDEBAR_BY_ROLE: Partial<Record<Role, ManuItems[]>> = {
  [ROLES.SUPER_ADMIN]: [
    {
      title: "Organizations",
      items: [
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
  ],

  [ROLES.ADMIN]: [
    {
      title: "Organization",
      items: [
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
  ],

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
