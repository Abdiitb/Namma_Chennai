export type GccOnlineServiceModule = {
  title: string;
  slug: string;
  gccUrl?: string;
  description?: string;
};

export type GccOnlineService = {
  title: string;
  slug: string;
  gccUrl: string;
  description: string;
  icon: string;
  color: string;
  modules: GccOnlineServiceModule[];
};

/**
 * Source: GCC "Online Services" page.
 * Order here MUST match the GCC page order.
 */
export const GCC_ONLINE_SERVICES: GccOnlineService[] = [
  {
    title: 'Birth and Death',
    slug: 'birth-and-death',
    gccUrl: 'https://chennaicorporation.gov.in/gcc/online-services/birth-death',
    description: 'Birth/Death certificates and related services',
    icon: 'document-text-outline',
    color: '#06B6D4',
    modules: [
      {
        title: 'Birth Certificate',
        slug: 'birth-certificate',
        gccUrl: 'https://chennaicorporation.gov.in/gcc/online-services/birth-certificate',
      },
      {
        title: 'Death Certificate',
        slug: 'death-certificate',
        gccUrl: 'https://chennaicorporation.gov.in/gcc/online-services/death-certificate',
      },
      {
        title: 'Child Name Inclusion',
        slug: 'child-name-inclusion',
        gccUrl: 'https://chennaicorporation.gov.in/new_site/child-inclusion/Home.jsp',
      },
      {
        title: 'Hospital Registration for Birth & Death',
        slug: 'hospital-registration',
        gccUrl: 'https://crstn.org/',
      },
    ],
  },
  {
    title: 'Property Tax',
    slug: 'property-tax',
    // The link on the Online Services page currently 404s; this is the working GCC page.
    gccUrl: 'https://chennaicorporation.gov.in/gcc/online-payment/property-tax/property-tax-online-payment/',
    description: 'Pay property tax and access related utilities',
    icon: 'home-outline',
    color: '#F59E0B',
    modules: [
      {
        title: 'Pay Property Tax',
        slug: 'pay',
        gccUrl: 'https://chennaicorporation.gov.in/gcc/online-payment/property-tax/property-tax-online-payment/',
      },
      {
        title: 'Register Mobile / Email',
        slug: 'mobile-email-registration',
        gccUrl: 'https://chennaicorporation.gov.in/gcc/online-payment/property-tax/mobile-reg/',
      },
      {
        title: 'Help Video',
        slug: 'help-video',
        gccUrl: 'https://chennaicorporation.gov.in/gcc/videos/PTax.mp4',
      },
    ],
  },
  {
    title: 'Professional Tax',
    slug: 'professional-tax',
    gccUrl: 'https://chennaicorporation.gov.in/gcc/online-services/online-payment/profession-tax',
    description: 'Registration, payment status, calculator and rules',
    icon: 'briefcase-outline',
    color: '#8B5CF6',
    modules: [
      {
        title: 'New Professional Tax Registration',
        slug: 'new-registration',
        gccUrl: 'https://erp.chennaicorporation.gov.in/e-portal/login.do',
      },
      {
        title: 'Professional Tax Status / Paytax',
        slug: 'status-paytax',
        gccUrl:
          'https://erp.chennaicorporation.gov.in/egproftax/portal/registration/search!searchByAckNo.action',
      },
      {
        title: 'Professional Tax Calculator',
        slug: 'calculator',
        gccUrl:
          'https://chennaicorporation.gov.in/gcc/online-services/online-payment/profession-tax/profession-tax-calculator/',
      },
      {
        title: 'Professional Tax Rules / Procedure',
        slug: 'rules-procedure',
        gccUrl:
          'https://www.chennaicorporation.gov.in/rules-procedures/ProfessionTaxprocedureOnline.pdf',
      },
      {
        title: 'Know your Zone & Division',
        slug: 'know-your-zone-division',
        gccUrl:
          'https://chennaicorporation.gov.in/gcc/citizen-details/location-service/find_zone.jsp',
      },
    ],
  },
  {
    title: 'Company Tax',
    slug: 'company-tax',
    gccUrl: 'https://chennaicorporation.gov.in/gcc/online-services/company-tax',
    description: 'Company tax registration and payment status',
    icon: 'business-outline',
    color: '#10B981',
    modules: [
      {
        title: 'Company Tax Status / Paytax',
        slug: 'status-paytax',
        gccUrl:
          'https://chennaicorporation.gov.in/gcc/online-services/online-payment/online-tax-payment/company.jsp',
      },
      {
        title: 'Company Tax Registration',
        slug: 'registration',
        gccUrl: 'https://erp.chennaicorporation.gov.in/e-portal/login.do',
      },
      {
        title: 'Know your Zone & Division',
        slug: 'know-your-zone-division',
        gccUrl:
          'https://chennaicorporation.gov.in/gcc/citizen-details/location-service/find_zone.jsp',
      },
    ],
  },
  {
    title: 'Community Hall',
    slug: 'community-hall',
    gccUrl: 'https://gccservices.chennaicorporation.gov.in/communityhall',
    description: 'Browse halls, check availability and booking',
    icon: 'people-outline',
    color: '#EC4899',
    modules: [
      { title: 'Browse Community Halls', slug: 'browse', gccUrl: 'https://gccservices.chennaicorporation.gov.in/communityhall' },
      { title: 'Check Availability', slug: 'check-availability', gccUrl: 'https://gccservices.chennaicorporation.gov.in/communityhall' },
      { title: 'Login / Register', slug: 'login-register', gccUrl: 'https://gccservices.chennaicorporation.gov.in/communityhall' },
    ],
  },
  {
    title: 'Muthalvar Padaippagam',
    slug: 'muthalvar-padaippagam',
    gccUrl: 'https://gccservices.chennaicorporation.gov.in/muthalvarpadaippagam',
    description: 'Co-working space / learning centre bookings',
    icon: 'school-outline',
    color: '#3B82F6',
    modules: [
      { title: 'Book Now', slug: 'book-now', gccUrl: 'https://gccservices.chennaicorporation.gov.in/muthalvarpadaippagam' },
      { title: 'Available Locations', slug: 'available-locations', gccUrl: 'https://gccservices.chennaicorporation.gov.in/muthalvarpadaippagam' },
      { title: 'Give Feedback', slug: 'feedback', gccUrl: 'https://ee.kobotoolbox.org/x/a9bm75Uf' },
      {
        title: 'Google Reviews',
        slug: 'google-reviews',
        gccUrl:
          'https://www.google.com/maps/place/Muthalvar+Padaippagam/@13.1119311,80.2299216,17z/',
      },
    ],
  },
  {
    title: 'Swimming Pool',
    slug: 'swimming-pool',
    gccUrl: 'https://gccservices.chennaicorporation.gov.in/swimmingpool',
    description: 'Book swimming pool slots and view rules/tariff',
    icon: 'water-outline',
    color: '#06B6D4',
    modules: [
      { title: 'Book Slot', slug: 'book-slot', gccUrl: 'https://gccservices.chennaicorporation.gov.in/swimmingpool' },
      { title: 'Tariff', slug: 'tariff', gccUrl: 'https://gccservices.chennaicorporation.gov.in/swimmingpool' },
      { title: 'Rules & Regulations', slug: 'rules', gccUrl: 'https://gccservices.chennaicorporation.gov.in/swimmingpool' },
      { title: 'Facilities', slug: 'facilities', gccUrl: 'https://gccservices.chennaicorporation.gov.in/swimmingpool' },
    ],
  },
  {
    title: 'Town Planning',
    slug: 'town-planning',
    // The link on the Online Services page currently 404s; this is the working GCC department page.
    gccUrl: 'https://chennaicorporation.gov.in/gcc/department/town-planning/',
    description: 'Building permit and town planning information',
    icon: 'map-outline',
    color: '#8B5CF6',
    modules: [
      { title: 'Department Head', slug: 'department-head', gccUrl: 'https://chennaicorporation.gov.in/gcc/department/town-planning/#department-head' },
      { title: 'Building Permit', slug: 'building-permit', gccUrl: 'https://chennaicorporation.gov.in/gcc/department/town-planning/#Building' },
      { title: 'Details of OSR Lands of COC', slug: 'osr-lands', gccUrl: 'https://chennaicorporation.gov.in/gcc/department/town-planning/#coc' },
      { title: 'Building Approval Process in GCC', slug: 'building-approval-process', gccUrl: 'https://chennaicorporation.gov.in/gcc/department/town-planning/#building-approval' },
    ],
  },
  {
    title: 'Trade License',
    slug: 'trade-license',
    gccUrl: 'https://chennaicorporation.gov.in/gcc/online-services/trade-license',
    description: 'Apply for a new trade license or renew',
    icon: 'storefront-outline',
    color: '#10B981',
    modules: [
      {
        title: 'Trade License Status / Renewal',
        slug: 'status-renewal',
        gccUrl:
          'https://erp.chennaicorporation.gov.in/egtradelicense/citizen/tradeSearchNoLogin!newForm.action',
      },
      {
        title: 'New Trade License',
        slug: 'new-trade-license',
        gccUrl: 'https://erp.chennaicorporation.gov.in/e-portal/login.do',
      },
    ],
  },
  {
    title: 'Citizen Portal',
    slug: 'citizen-portal',
    gccUrl: 'https://erp.chennaicorporation.gov.in/e-portal/login.do',
    description: 'Citizen login and registration for e-portal',
    icon: 'log-in-outline',
    color: '#6B7280',
    modules: [
      { title: 'Login', slug: 'login', gccUrl: 'https://erp.chennaicorporation.gov.in/e-portal/login.do' },
      {
        title: 'Citizen Registration',
        slug: 'citizen-registration',
        gccUrl: 'https://erp.chennaicorporation.gov.in/e-portal/citizen/citizenRegistration.do',
      },
      {
        title: 'Forgot Password',
        slug: 'forgot-password',
        gccUrl: 'https://erp.chennaicorporation.gov.in/e-portal/login.do?forgotPwd=0',
      },
    ],
  },
  {
    title: 'Entertainment Tax',
    slug: 'entertainment-tax',
    gccUrl: 'https://erp.chennaicorporation.gov.in/portal/login.jsp',
    description: 'Login to entertainment tax portal',
    icon: 'film-outline',
    color: '#F59E0B',
    modules: [{ title: 'Login', slug: 'login', gccUrl: 'https://erp.chennaicorporation.gov.in/portal/login.jsp' }],
  },
  {
    title: 'Sanitary Certificate',
    slug: 'sanitary-certificate',
    gccUrl: 'https://erp.chennaicorporation.gov.in/e-portal/login.do',
    description: 'Access sanitary certificate services via e-portal',
    icon: 'medkit-outline',
    color: '#EF4444',
    modules: [
      { title: 'Login', slug: 'login', gccUrl: 'https://erp.chennaicorporation.gov.in/e-portal/login.do' },
      {
        title: 'Citizen Registration',
        slug: 'citizen-registration',
        gccUrl: 'https://erp.chennaicorporation.gov.in/e-portal/citizen/citizenRegistration.do',
      },
    ],
  },
  {
    title: 'Pet Animal Licence',
    slug: 'pet-animal-licence',
    gccUrl: 'https://petservice.gccservices.in',
    description: 'Pet licensing and registration (GCC portal)',
    icon: 'paw-outline',
    color: '#8B5CF6',
    modules: [
      { title: 'Apply / Register', slug: 'apply', gccUrl: 'https://petservice.gccservices.in' },
      { title: 'Renew', slug: 'renew', gccUrl: 'https://petservice.gccservices.in' },
      { title: 'Track / Status', slug: 'status', gccUrl: 'https://petservice.gccservices.in' },
    ],
  },
  {
    title: 'Online Public Grievance',
    slug: 'online-public-grievance',
    gccUrl: 'https://gccservices.chennaicorporation.gov.in/pgr',
    description: 'Register complaints and check complaint status',
    icon: 'help-circle-outline',
    color: '#EC4899',
    modules: [
      {
        title: 'Register Complaints',
        slug: 'register-complaints',
        gccUrl: 'https://gccservices.chennaicorporation.gov.in/pgr/registercomplaints',
      },
      { title: 'Check Complaint Status', slug: 'check-status', gccUrl: 'https://gccservices.chennaicorporation.gov.in/pgr' },
      { title: 'Register via Phone (1913)', slug: 'phone-1913', gccUrl: 'https://gccservices.chennaicorporation.gov.in/pgr' },
    ],
  },
  {
    title: 'C & D Dump Registration',
    slug: 'c-and-d-dump-registration',
    gccUrl: 'https://gccservices.in/dumpregistration',
    description: 'Register and track C&D waste dump requests',
    icon: 'trash-outline',
    color: '#6B7280',
    modules: [
      { title: 'Register', slug: 'register', gccUrl: 'https://gccservices.in/dumpregistration/register' },
      { title: 'Check Status', slug: 'status', gccUrl: 'https://gccservices.in/dumpregistration/status' },
    ],
  },
  {
    title: 'Dashboard',
    slug: 'dashboard',
    gccUrl: 'https://erp.chennaicorporation.gov.in/egtradelicense/citizen/eazeofCount!newForm.action',
    description: 'Service dashboard (external portal)',
    icon: 'speedometer-outline',
    color: '#3B82F6',
    modules: [
      {
        title: 'Open Dashboard',
        slug: 'open-dashboard',
        gccUrl: 'https://erp.chennaicorporation.gov.in/egtradelicense/citizen/eazeofCount!newForm.action',
      },
    ],
  },
  {
    title: 'Hoardings Approval',
    slug: 'hoardings-approval',
    gccUrl: 'https://erp.chennaicorporation.gov.in/portal/login.jsp',
    description: 'Login to hoardings approval portal',
    icon: 'image-outline',
    color: '#10B981',
    modules: [{ title: 'Login', slug: 'login', gccUrl: 'https://erp.chennaicorporation.gov.in/portal/login.jsp' }],
  },
  {
    title: 'Know your Zone & Division',
    slug: 'know-your-zone-division',
    gccUrl: 'https://chennaicorporation.gov.in/gcc/citizen-details/location-service/find_zone.jsp',
    description: 'Find your zone/division using location search',
    icon: 'location-outline',
    color: '#F59E0B',
    modules: [
      {
        title: 'Find Zone & Division',
        slug: 'find-zone-division',
        gccUrl: 'https://chennaicorporation.gov.in/gcc/citizen-details/location-service/find_zone.jsp',
      },
    ],
  },
  {
    title: 'Public Grievance & Redressal',
    slug: 'public-grievance-redressal',
    gccUrl: 'https://gccservices.in/pgr/registercomplaints',
    description: 'Register and track complaints with GCC',
    icon: 'document-text-outline',
    color: '#016ACD',
    modules: [
      {
        title: 'Register Complaint',
        slug: 'register-complaint',
        gccUrl: 'https://gccservices.in/pgr/registercomplaints',
      },
    ],
  },
];

export function getGccOnlineServiceBySlug(slug: string) {
  return GCC_ONLINE_SERVICES.find((s) => s.slug === slug);
}

export function getGccOnlineServiceModuleBySlug(serviceSlug: string, moduleSlug: string) {
  const service = getGccOnlineServiceBySlug(serviceSlug);
  const module = service?.modules.find((m) => m.slug === moduleSlug);
  return { service, module };
}

