/** DDC primary navigation. Only "Ovens" is part of this prototype; the rest are placeholder links. */
export interface NavItem {
  key: string
  label: string
  /** Desktop sidebar icon (24px). */
  sidebarIcon: string
  /** Mobile bottom-bar icon (30px). */
  tabIcon?: string
  active?: boolean
}

export const SIDEBAR_MAIN: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', sidebarIcon: 'menu-dashboard', tabIcon: 'tab-dashboard' },
  { key: 'ovens', label: 'Ovens', sidebarIcon: 'menu-oven', tabIcon: 'tab-oven-fill', active: true },
  { key: 'analytics', label: 'Analytics', sidebarIcon: 'menu-analytics', tabIcon: 'tab-analytics' },
  { key: 'library', label: 'Library', sidebarIcon: 'menu-library', tabIcon: 'tab-library' },
  { key: 'community', label: 'Community', sidebarIcon: 'menu-community' },
]

export const SIDEBAR_SETTINGS: NavItem = { key: 'settings', label: 'Settings', sidebarIcon: 'menu-settings' }
export const SIDEBAR_GUIDE: NavItem = { key: 'guide', label: 'Guide', sidebarIcon: 'menu-guide' }

export const BOTTOM_NAV: NavItem[] = [
  ...SIDEBAR_MAIN.filter((i) => i.tabIcon),
  { key: 'menu', label: 'Menu', sidebarIcon: 'tab-menu', tabIcon: 'tab-menu' },
]
