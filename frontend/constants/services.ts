export const SERVICES = [
  { 
    id: '1', 
    title: 'Greening', 
    subtitle: 'Chennai', 
    icon: 'leaf' as const, 
    iconColor: '#599839', 
    iconBgColor: '#EAF5E5' 
  },
  { 
    id: '2', 
    title: 'Pay', 
    subtitle: 'Tax/Dues', 
    icon: 'wallet' as const, 
    iconColor: '#826B31', 
    iconBgColor: '#FBF0D5' 
  },
  { 
    id: '3', 
    title: 'Get', 
    subtitle: 'Documents', 
    icon: 'document-text' as const, 
    iconColor: '#317582', 
    iconBgColor: '#DEF7FC' 
  },
  { 
    id: '4', 
    title: 'View', 
    subtitle: 'More Services', 
    icon: 'grid' as const, 
    iconColor: '#656565', 
    iconBgColor: '#F7F7F7' 
  },
];

export const QUICK_ACTIONS = [
  { id: 'pothole', title: 'Report Pothole', icon: 'construct' as const, iconColor: '#656565', bgColor: '#F7F7F7' },
  { id: 'garbage', title: 'Garbage Collection', icon: 'trash' as const, iconColor: '#599839', bgColor: '#EAF5E5' },
  { id: 'water', title: 'Water Leakage', icon: 'water' as const, iconColor: '#3B8FA3', bgColor: '#DEF7FC' },
  { id: 'light', title: 'Street Light', icon: 'bulb' as const, iconColor: '#826B31', bgColor: '#FBF0D5' },
  { id: 'drainage', title: 'Drainage Issue', icon: 'rainy' as const, iconColor: '#3B8FA3', bgColor: '#DEF7FC' },
];

export type Service = typeof SERVICES[number];
export type QuickAction = typeof QUICK_ACTIONS[number];
