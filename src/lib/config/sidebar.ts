import { ROLES } from '$lib/types';
import {
  Building2Icon,
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

export const SIDEBAR_BY_ROLE: Record<string, ManuItems[]> = {
  [ROLES.SUPER_ADMIN]: [
    {
      title: "Organizations",
      items: [
        {
          title: 'Organizations',
          url: '/super-admin/organizations',
          icon: Building2Icon
        },
        {
          title: 'Platform Users',
          url: '/super-admin/users',
          icon: ShieldIcon
        }
      ]
    }
  ],

  // [ROLES.ADMIN]: [
  //   {
  //     title: 'Organization',
  //     url: '/admin/organization',
  //     icon: Building2Icon
  //   },
  //   {
  //     title: 'Users',
  //     url: '/admin/users',
  //     icon: UserIcon
  //   }
  // ],

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
