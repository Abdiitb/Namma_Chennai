// Heritage Walk API Service
// Using backend proxy to avoid CORS issues
import { API_BASE_URL } from '@/constants/api';
const PROXY_BASE_URL = API_BASE_URL;
const HERITAGE_WALK_BASE_URL = 'https://gccservices.in/heritagewalk'; // For PDF URL only

export interface BookingDetails {
  Id: number;
  reg_username: string;
  reg_address: string;
  mobile_no: number;
  visitor_category: 'individual' | 'family' | 'school' | 'college';
  aadhar_no: number;
  age: number;
  guide_lang: string;
  sign_lang: boolean;
  family_mem_count: number | null;
  below5_year_count: number | null;
  children_bw_6and17: number | null;
  adults_count: number | null;
  visting_day_time: string;
  institution_name: string | null;
  grade_year: string | null;
  no_of_students: number | null;
  students_age: number | null;
  department: string | null;
  cdate: string;
  ref_id: string;
}

export interface BookingCounts {
  counts: Record<string, number>;
  limit: number;
}

export interface BookingResponse {
  Message: string;
  Data: {
    visitor_category: string;
    Id: number;
    refId: string;
  };
  status: string;
}

// Get booking details by reference ID
export async function getBookingDetails(refId: string): Promise<BookingDetails> {
  const response = await fetch(
    `${PROXY_BASE_URL}/api/heritage-walk/booking-details?refId=${refId}`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch booking details');
  }
  return response.json();
}

// Get booking list by mobile number
export async function getBookingList(mobileNo: string): Promise<{ Status: string; Data: BookingDetails[] }> {
  const response = await fetch(
    `${PROXY_BASE_URL}/api/heritage-walk/booking-list?mobileno=${mobileNo}`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch booking list');
  }
  return response.json();
}

// Get all booking counts
export async function getAllBookingCounts(): Promise<BookingCounts> {
  const response = await fetch(
    `${PROXY_BASE_URL}/api/heritage-walk/booking-counts`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch booking counts');
  }
  return response.json();
}

// Save individual booking
export async function saveIndividualRegistration(data: {
  name: string;
  address: string;
  mobile: string;
  visitorType: 'individual';
  aadhar: string;
  age: number;
  visitDayTime: string;
  language: string;
  signLanguage: number;
}): Promise<BookingResponse> {
  const response = await fetch(
    `${PROXY_BASE_URL}/api/heritage-walk/save-individual`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.name,
        address: data.address,
        mobile: data.mobile,
        visitorType: data.visitorType,
        aadhar: data.aadhar,
        age: data.age.toString(),
        visitDayTime: data.visitDayTime,
        language: data.language,
        signLanguage: data.signLanguage.toString(),
      }),
    }
  );
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to save individual registration');
  }
  return response.json();
}

// Save family booking
export async function saveFamilyRegistration(data: {
  name: string;
  address: string;
  mobile: string;
  visitorType: 'family';
  aadhar: string;
  age: number;
  visitDayTime: string;
  language: string;
  signLanguage: number;
  familyMembers: number;
  childrenBelow5: number;
  children6to17: number;
  adults: number;
}): Promise<BookingResponse> {
  const response = await fetch(
    `${PROXY_BASE_URL}/api/heritage-walk/save-family`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.name,
        address: data.address,
        mobile: data.mobile,
        visitorType: data.visitorType,
        aadhar: data.aadhar,
        age: data.age.toString(),
        visitDayTime: data.visitDayTime,
        language: data.language,
        signLanguage: data.signLanguage.toString(),
        familyMembers: data.familyMembers.toString(),
        childrenBelow5: data.childrenBelow5.toString(),
        children6to17: data.children6to17.toString(),
        adults: data.adults.toString(),
      }),
    }
  );
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to save family registration');
  }
  return response.json();
}

// Save school booking
export async function saveSchoolRegistration(data: {
  name: string;
  address: string;
  mobile: string;
  visitorType: 'school';
  schoolname: string;
  grade: string;
  noofstudents: number;
  approxage: number;
  language: string;
  signLanguage: number;
  visitDayTime: string;
}): Promise<BookingResponse> {
  const response = await fetch(
    `${PROXY_BASE_URL}/api/heritage-walk/save-school`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.name,
        address: data.address,
        mobile: data.mobile,
        visitorType: data.visitorType,
        schoolname: data.schoolname,
        grade: data.grade,
        noofstudents: data.noofstudents.toString(),
        approxage: data.approxage.toString(),
        language: data.language,
        signLanguage: data.signLanguage.toString(),
        visitDayTime: data.visitDayTime,
      }),
    }
  );
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to save school registration');
  }
  return response.json();
}

// Save college booking
export async function saveCollegeRegistration(data: {
  name: string;
  address: string;
  mobile: string;
  visitorType: 'college';
  Collegename: string;
  department: string;
  years: number;
  noofStudents: number;
  Aproxage: number;
  language: string;
  signLanguage: number;
  visitDayTime: string;
}): Promise<BookingResponse> {
  const response = await fetch(
    `${PROXY_BASE_URL}/api/heritage-walk/save-college`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.name,
        address: data.address,
        mobile: data.mobile,
        visitorType: data.visitorType,
        Collegename: data.Collegename,
        department: data.department,
        years: data.years.toString(),
        noofStudents: data.noofStudents.toString(),
        Aproxage: data.Aproxage.toString(),
        language: data.language,
        signLanguage: data.signLanguage.toString(),
        visitDayTime: data.visitDayTime,
      }),
    }
  );
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to save college registration');
  }
  return response.json();
}

// Download acknowledgement PDF
export function getAcknowledgementPDFUrl(bookingId: number): string {
  return `${HERITAGE_WALK_BASE_URL}/api/pdf/download?ID=${bookingId}`;
}
