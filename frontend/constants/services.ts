export const SERVICES = [
  { id: '1', title: 'Report Issue', icon: 'warning-outline' as const, iconColor: '#EF4444', iconBgColor: '#FEE2E2' },
  { id: '2', title: 'Track Complaint', icon: 'search-outline' as const, iconColor: '#3B82F6', iconBgColor: '#DBEAFE' },
  { id: '3', title: 'My Tickets', icon: 'receipt-outline' as const, iconColor: '#10B981', iconBgColor: '#D1FAE5' },
  { id: '4', title: 'Water Supply', icon: 'water-outline' as const, iconColor: '#06B6D4', iconBgColor: '#CFFAFE' },
  { id: '5', title: 'Electricity', icon: 'flash-outline' as const, iconColor: '#F59E0B', iconBgColor: '#FEF3C7' },
  { id: '6', title: 'Road & Traffic', icon: 'car-outline' as const, iconColor: '#8B5CF6', iconBgColor: '#EDE9FE' },
  { id: '7', title: 'Sanitation', icon: 'trash-outline' as const, iconColor: '#EC4899', iconBgColor: '#FCE7F3' },
  { id: '8', title: 'Parks & Gardens', icon: 'leaf-outline' as const, iconColor: '#22C55E', iconBgColor: '#DCFCE7' },
  { id: '9', title: 'Street Lights', icon: 'bulb-outline' as const, iconColor: '#F97316', iconBgColor: '#FFEDD5' },
];

export const QUICK_ACTIONS = [
  { id: 'pothole', title: 'Report Pothole', icon: 'construct-outline' as const, iconColor: '#EF4444', bgColor: '#FEE2E2' },
  { id: 'garbage', title: 'Garbage Collection', icon: 'trash-outline' as const, iconColor: '#22C55E', bgColor: '#DCFCE7' },
  { id: 'water', title: 'Water Leakage', icon: 'water-outline' as const, iconColor: '#3B82F6', bgColor: '#DBEAFE' },
  { id: 'light', title: 'Street Light', icon: 'bulb-outline' as const, iconColor: '#F59E0B', bgColor: '#FEF3C7' },
  { id: 'drainage', title: 'Drainage Issue', icon: 'rainy-outline' as const, iconColor: '#8B5CF6', bgColor: '#EDE9FE' },
];

export type Service = typeof SERVICES[number];
export type QuickAction = typeof QUICK_ACTIONS[number];
