export const SERVICES = [
  { id: '1', title: 'Report Issue', icon: 'warning-outline' as const, iconColor: '#FFD600', iconBgColor: '#1A1A1A' },
  { id: '2', title: 'Track Complaint', icon: 'search-outline' as const, iconColor: '#FFD600', iconBgColor: '#1A1A1A' },
  { id: '3', title: 'My Tickets', icon: 'receipt-outline' as const, iconColor: '#FFD600', iconBgColor: '#1A1A1A' },
  { id: '4', title: 'Water Supply', icon: 'water-outline' as const, iconColor: '#FFD600', iconBgColor: '#1A1A1A' },
  { id: '5', title: 'Electricity', icon: 'flash-outline' as const, iconColor: '#FFD600', iconBgColor: '#1A1A1A' },
  { id: '6', title: 'Road & Traffic', icon: 'car-outline' as const, iconColor: '#FFD600', iconBgColor: '#1A1A1A' },
  { id: '7', title: 'Sanitation', icon: 'trash-outline' as const, iconColor: '#FFD600', iconBgColor: '#1A1A1A' },
  { id: '8', title: 'Parks & Gardens', icon: 'leaf-outline' as const, iconColor: '#FFD600', iconBgColor: '#1A1A1A' },
  { id: '9', title: 'Street Lights', icon: 'bulb-outline' as const, iconColor: '#FFD600', iconBgColor: '#1A1A1A' },
];

export const QUICK_ACTIONS = [
  { id: 'pothole', title: 'Report Pothole', icon: 'construct-outline' as const, iconColor: '#FFD600', bgColor: '#1A1A1A' },
  { id: 'garbage', title: 'Garbage Collection', icon: 'trash-outline' as const, iconColor: '#FFD600', bgColor: '#1A1A1A' },
  { id: 'water', title: 'Water Leakage', icon: 'water-outline' as const, iconColor: '#FFD600', bgColor: '#1A1A1A' },
  { id: 'light', title: 'Street Light', icon: 'bulb-outline' as const, iconColor: '#FFD600', bgColor: '#1A1A1A' },
  { id: 'drainage', title: 'Drainage Issue', icon: 'rainy-outline' as const, iconColor: '#FFD600', bgColor: '#1A1A1A' },
];

export type Service = typeof SERVICES[number];
export type QuickAction = typeof QUICK_ACTIONS[number];
