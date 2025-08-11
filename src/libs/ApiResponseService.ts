import api from './api';
import { type StudentResponse }from './models/response/StudentResponse';
import { type LoginRequest } from './models/request/LoginRequest';
import type { StudentListResponse } from './models/response/StudentListResponse';
import type { CustomizationResponse, CustomizationRequest } from './models/Customization';
import type { UniversityResponse, UniversityRequest } from './models/University';
import type { CourseResponse, CourseRequest } from './models/Course';
import type { UserAccountResponse, UserAccountRequest } from './models/UserAccount';

/**
* Fetches a list of students from the API.
 * @returns Promise<StudentResponse[]>
 */
export async function fetchStudents(): Promise<StudentResponse[]> {
    try {
        const response = await api.get('/admin/api/get_all_students');
        return response.data;
    } catch (error: any) {
        console.error('Error fetching students:', error);
        throw error.response?.data || { message: 'Failed to fetch students' };
    }
}

/**
 * Fetches pending students from the API.
 * @returns Promise<StudentResponse[]>
 */
export async function fetchPendingStudents(): Promise<StudentListResponse> {
    try {
        const response = await api.get('/admin/api/students/pending');
        return response.data;
    } catch (error: any) {
        console.error('Error fetching pending students:', error);
        throw error.response?.data || { message: 'Failed to fetch pending students' };
    }
}

/**
 * Fetcher for approved students from the API.
 * @returns Promise<StudentResponse[]>
 */
export async function fetchApprovedStudents(): Promise<StudentListResponse> {
    try {
        const response = await api.get('/admin/api/students/approved');
        return response.data;
    } catch (error: any) {
        console.error('Error fetching pending students:', error);
        throw error.response?.data || { message: 'Failed to fetch pending students' };
    }
}

/**
 * Approves a student account.
 * @param email The email of the student to approve.
 * @param accountStatus The new account status for the student.
 * @returns Promise<void>
 */
export async function approveStudent(email: string, accountStatus: string): Promise<void> {
  try {
    await api.post('/admin/api/student_approve', null, {
      params: {
        email,
        user_account_status: accountStatus,
      },
    });
  } catch (error: any) {
    console.error('Error approving student:', error);
    throw error.response?.data || { message: 'Failed to approve student' };
  }
}


/**
 *  * Logs in a user with the provided credentials. 
 * @param request LoginRequest
 */
export async function login(request: LoginRequest) {
  try {
    const response = await api.post('/user/public/login', request);
    
    // Save token to localStorage or cookie
    const username = response.data.username;
    const role = response.data.role;
    const token = response.data.jwtToken;
    if (token) {
      localStorage.setItem('jwtToken', token);
    }
    if (role) {
      localStorage.setItem('authorized_role', role);
    }
    if (username) {
      localStorage.setItem('authorized_username', username);
    }

    return response.data;
  } catch (error: any) {
    console.error('Login error:', error);
    throw error.response?.data || { message: 'Login failed' };
  }
}

/**
 * Fetches the current theme customization settings.
 */
export async function getTheme(): Promise<CustomizationResponse> {
  try {
    const response = await api.get('/user/public/get_themes');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching theme:', error);
    throw error.response?.data || { message: 'Failed to fetch theme' };
  }
}

/**
 * Updates the current theme customization.
 */
export async function updateTheme(
  request: CustomizationRequest
): Promise<CustomizationResponse> {
  try {
    const formData = new FormData();
    formData.append('theme', request.themeName);
    formData.append('aboutText', request.aboutText);

    if (request.logoFile) {
      formData.append('logo', request.logoFile);
    }

    const response = await api.post('/admin/api/save_themes', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data;
  } catch (error: any) {
    console.error('Error updating theme:', error);
    throw error.response?.data || { message: 'Failed to update theme' };
  }
}

/**
 * 
 * @returns Promise<UniversityResponse[]>
 * Fetches all universities from the API.
 */
export async function getUniversities(): Promise<UniversityResponse[]> {
  try {
    const response = await api.get<UniversityResponse[]>('/superadmin/api/university/all');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching universities:', error);
    throw error.response?.data || { message: 'Failed to fetch universities' };
  }
};

/**
 * @param universityId number
 * @returns Promise<number>
 * Fetches the number of active courses for a given university.
 */
export async function getCourseCountByUniversity(universityId: number): Promise<number> {
  try {
    const response = await api.get<{ count: number }>(
      `/superadmin/api/course/count?universityId=${universityId}`
    );
    return response.data.count;
  } catch (error: any) {
    console.error('Error fetching course count:', error);
    throw error.response?.data || { message: 'Failed to fetch course count' };
  }
}


/**
 * Add a new university to the API.
 * @param data UniversityRequest.
 * @returns Promise<UniversityResponse> The created university response.  
 */
export async function addUniversity(data: UniversityRequest): Promise<UniversityResponse>  {
 try {
   const response = await api.post<UniversityResponse>('/superadmin/api/university/save', data);
    return response.data;
 } catch (error: any) {
   console.error('Error adding university:', error);
   throw error.response?.data || { message: 'Failed to add university' };
 }
};

/**
 * Updates an existing university.
 * @param id The ID of the university to update.
 * @param data UniversityRequest.
 * @returns Promise<UniversityResponse>
 */
export async function updateUniversity(id: number, data: UniversityRequest): Promise<UniversityResponse> {
  try {
    const response = await api.put<UniversityResponse>(`/superadmin/api/university/update/${id}`, data); // removed superadmin/
    return response.data;
  } catch (error: any) {
    console.error("Error updating university:", error);
    throw error.response?.data || { message: "Failed to update university" };
  }
};

/**
 * Deletes a university by ID.
 * @param id The ID of the university to delete.
 */
export async function deleteUniversity(id: number): Promise<void> {
  try {
    await api.delete(`/superadmin/api/university/delete/${id}`);
  } catch (error: any) {
    console.error("Error deleting university:", error);
    throw error.response?.data || { message: "Failed to delete university" };
  }
};

/**
 * Saves a course to the API.
 * @param course CourseRequest
 * @returns Promise<CourseResponse>
 */
export async function saveCourse(course: CourseRequest): Promise<CourseResponse> {
  try {
    const response = await api.post('/superadmin/api/course/save', course);
    return response.data;
  } catch (error: any) {
    console.error('Error saving course:', error);
    throw error.response?.data || { message: 'Failed to save course' };
  }
};

/**
 * Fetches all courses from the API.
 * @returns Promise<CourseResponse[]>
 */
export async function getAllCourses(): Promise<CourseResponse[]> {
  try {
    const response = await api.get<CourseResponse[]>('/superadmin/api/course/all');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching courses:', error);
    throw error.response?.data || { message: 'Failed to fetch courses' };
  }
};

/**
 * Saves an account (ADMIN-only endpoint).
 * @param data AccountRequest
 * @returns Promise<AccountResponse>
 */
export async function saveAccount(data: UserAccountRequest): Promise<UserAccountResponse> {
  try {
    const response = await api.post<UserAccountResponse>('/superadmin/api/admin_account/register', data);
    return response.data;
  } catch (error: any) {
    console.error('Error saving account:', error);
    throw error.response?.data || { message: 'Failed to save account' };
  }
};

/**
 * Fetches all accounts (ADMIN-only).
 * Can optionally be filtered by query params.
 * @param params Optional filter params
 * @returns Promise<AccountResponse[]>
 */
export async function getAccounts(params?: Record<string, any>): Promise<UserAccountResponse[]> {
  try {
    const response = await api.get<UserAccountResponse[]>('/superadmin/api/admin_account/list', { params });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching accounts:', error);
    throw error.response?.data || { message: 'Failed to fetch accounts' };
  }
};












