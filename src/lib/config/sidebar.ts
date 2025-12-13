import { ROLES } from '$lib/types/auth';
import { 
  Building2Icon, 
  ReceiptIcon, 
  ShieldIcon, 
  UserIcon, 
  type IconProps 
} from '@lucide/svelte';
import type { Component } from 'svelte';

export type SidebarItem = {
  title: string;
  url: string;
  icon: Component<IconProps, object, "">;
};

export const SIDEBAR_BY_ROLE: Record<string, SidebarItem[]> = {
  [ROLES.SUPER_ADMIN]: [
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
  ],

  [ROLES.ADMIN]: [
    {
      title: 'Organization',
      url: '/admin/organization',
      icon: Building2Icon
    },
    {
      title: 'Users',
      url: '/admin/users',
      icon: UserIcon
    }
  ],

  [ROLES.USER]: [
    {
      title: 'Billing',
      url: '/app/billing',
      icon: ReceiptIcon
    },
    {
      title: 'Customers',
      url: '/app/customers',
      icon: UserIcon
    }
  ]
};
