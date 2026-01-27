// Public Grievance and Redressal (PGR) API Service
// Using backend proxy to avoid CORS issues
import { API_BASE_URL } from '@/constants/api';

const PROXY_BASE_URL = API_BASE_URL;
const PGR_BASE_URL = 'https://gccservices.in/pgr/api'; // For reference only
const GIS_BASE_URL = 'https://gisgccservices.in/agserver/rest/services/EDP_MOBILE_API/EDPAPI/FeatureServer/0/query'; // For reference only

export interface ComplaintCategory {
  groupid: string;
  groupname: string;
  group: ComplaintSubType[];
}

export interface ComplaintSubType {
  id: string;
  complaintname: string;
  complaintlvl: string;
}

export interface ComplaintCategoriesResponse {
  ComplaintCategoryListResult: ComplaintCategory[];
  Message: string;
  ResultStatus: boolean;
}

export interface LocationFeature {
  type: string;
  geometry: null;
  properties: {
    region: string;
    new_zone: string;
    new_ward: string;
    road_id: string;
    road_name: string;
    gis_id: string;
    type: string;
  };
}

export interface LocationResponse {
  type: string;
  features: LocationFeature[];
}

export interface RegisterComplaintRequest {
  ComplainantName?: string;
  ComplainantAddr?: string;
  MobileNo?: string;
  Email?: string;
  ComplaintTitle: string;
  ComplaintType: string; // ID of Sub-category
  ComplaintDetails: string;
  StreetId: string; // Road ID from GIS API
  latitude: number;
  longtitude: number;
  Landmark?: string;
  gender?: string;
  Comp_Image?: string; // Base64 or file
}

export interface RegisterComplaintResponse {
  complaintNumber: string;
}

// Get all complaint categories
export async function getComplaintCategories(): Promise<ComplaintCategoriesResponse> {
  try {
    const response = await fetch(`${PROXY_BASE_URL}/api/pgr/getComplaintCategories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching complaint categories:', error);
    throw error;
  }
}

// Get complaint sub-types for a specific group
export async function getComplaintSubTypes(groupId: string): Promise<ComplaintCategoriesResponse> {
  try {
    const response = await fetch(`${PROXY_BASE_URL}/api/pgr/getComplaintSubTypes?groupId=${groupId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch sub-types: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching complaint sub-types:', error);
    throw error;
  }
}

// Get location details from GIS API
export async function getLocationDetails(latitude: number, longitude: number): Promise<LocationResponse> {
  try {
    const geometry = {
      y: latitude,
      x: longitude,
    };

    const params = new URLSearchParams({
      where: '',
      objectIds: '',
      time: '',
      geometry: JSON.stringify(geometry),
      geometryType: 'esriGeometryPoint',
      inSR: '4326',
      defaultSR: '4326',
      spatialRel: 'esriSpatialRelIntersects',
      distance: '25',
      units: 'esriSRUnit_Meter',
      relationParam: '',
      outFields: 'region,new_zone,new_ward,road_id,road_name,gis_id,type',
      returnGeometry: 'false',
      maxAllowableOffset: '',
      geometryPrecision: '',
      outSR: '',
      havingClause: '',
      gdbVersion: '',
      historicMoment: '',
      returnDistinctValues: 'false',
      returnIdsOnly: 'false',
      returnCountOnly: 'false',
      returnExtentOnly: 'false',
      orderByFields: '',
      groupByFieldsForStatistics: '',
      outStatistics: '',
      returnZ: 'false',
      returnM: 'false',
      multipatchOption: 'xyFootprint',
      resultOffset: '',
      resultRecordCount: '',
      returnTrueCurves: 'false',
      returnExceededLimitFeatures: 'false',
      quantizationParameters: '',
      returnCentroid: 'false',
      timeReferenceUnknownClient: 'false',
      maxRecordCountFactor: '',
      sqlFormat: 'none',
      resultType: '',
      featureEncoding: 'esriDefault',
      datumTransformation: '',
      f: 'geojson',
    });

    const response = await fetch(`${PROXY_BASE_URL}/api/pgr/getLocationDetails?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch location details: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching location details:', error);
    throw error;
  }
}

// Register a complaint
export async function registerComplaint(
  complaintData: RegisterComplaintRequest
): Promise<RegisterComplaintResponse> {
  try {
    // Convert image to base64 if it's a file URI
    let imageBase64: string | undefined = undefined;
    
    if (complaintData.Comp_Image) {
      if (complaintData.Comp_Image.startsWith('data:')) {
        // Already a data URI
        imageBase64 = complaintData.Comp_Image;
      } else if (complaintData.Comp_Image.startsWith('file://') || complaintData.Comp_Image.startsWith('http://') || complaintData.Comp_Image.startsWith('https://')) {
        // Convert file URI or URL to base64
        try {
          const response = await fetch(complaintData.Comp_Image);
          const blob = await response.blob();
          const reader = new FileReader();
          imageBase64 = await new Promise<string>((resolve, reject) => {
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        } catch (error) {
          console.error('Error converting image to base64:', error);
          // Continue without image if conversion fails
        }
      }
    }

    // Send JSON to backend, backend will convert to FormData
    const requestBody: any = {
      ComplainantName: complaintData.ComplainantName,
      ComplainantAddr: complaintData.ComplainantAddr,
      MobileNo: complaintData.MobileNo,
      Email: complaintData.Email,
      ComplaintTitle: complaintData.ComplaintTitle,
      ComplaintType: complaintData.ComplaintType,
      ComplaintDetails: complaintData.ComplaintDetails,
      StreetId: complaintData.StreetId,
      latitude: complaintData.latitude.toString(),
      longtitude: complaintData.longtitude.toString(),
      Landmark: complaintData.Landmark,
      gender: complaintData.gender,
      Comp_Image: imageBase64,
    };

    // Remove undefined values
    Object.keys(requestBody).forEach(key => {
      if (requestBody[key] === undefined || requestBody[key] === null || requestBody[key] === '') {
        delete requestBody[key];
      }
    });

    const response = await fetch(`${PROXY_BASE_URL}/api/pgr/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to register complaint: ${errorText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error registering complaint:', error);
    throw error;
  }
}
