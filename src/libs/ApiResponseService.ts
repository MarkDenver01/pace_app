import api from './api';
import { type StudentResponse }from './models/response/StudentResponse';
import { type LoginRequest } from './models/request/LoginRequest';
import type { StudentListResponse } from './models/response/StudentListResponse';

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


