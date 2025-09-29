import api from './api';
import { type StudentResponse }from './models/response/StudentResponse';
import type { LoginResponse, LoginRequest } from './models/Login';
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
 * Login.
 * @param request 
 * @returns Login response
 */
export async function login(request: LoginRequest): Promise<LoginResponse> {
  try {
    const response = await api.post("/user/public/login", request);
    return response.data;
  } catch (error: any) {
    console.error("Login error:", error);
    throw error.response?.data || { message: "Login failed" };
  }
}


/**
 * Validates the temporary password for a university account.
 * @param universityId The ID of the university.
 * @param tempPassword The temporary password to validate.
 * @returns Promise<boolean> Returns true if valid, false otherwise.
 */
export async function validateTempPassword(
  universityId: number,
  tempPassword: string
): Promise<boolean> {
  try {
    const response = await api.post(
      `/user/public/validate-temp-password/${universityId}`,
      null,
      { params: { tempPassword } }
    );

    // Backend should return { valid: true/false }
    return response?.data?.valid === true;
  } catch (error: any) {
    console.error("Error validating temporary password:", error);
    return false;
  }
};

/**
 * Updates the password for a university account.
 * @param universityId The ID of the university whose password is being updated.
 * @param newPassword The new password.
 * @returns Promise<boolean> Returns true if update succeeded, false otherwise.
 */
export async function updatePassword(
  universityId: number,
  newPassword: string
): Promise<boolean> {
  try {
    const response = await api.put(
      `/user/public/update-password/${universityId}`,
      null,
      { params: { newPassword } }
    );

    // Expecting backend to return { success: true } or "success"
    if (typeof response?.data === "string") {
      return response.data === "success";
    }
    return response?.data?.success === true;
  } catch (error: any) {
    console.error("Error updating password:", error);
    return false;
  }
};


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
    const response = await api.get<CourseResponse[]>("/superadmin/api/course/all");
    return response.data;
  } catch (error: any) {
    console.error("Error fetching all courses:", error);
    throw error.response?.data || { message: "Failed to fetch all courses" };
  }
};

/**
 * Fetches all courses from the API.
 * @returns Promise<CourseResponse[]>
 */
export async function getAllCoursesForAdmin(): Promise<CourseResponse[]> {
  try {
    const response = await api.get<CourseResponse[]>("/admin/api/course/all/active");
    return response.data;
  } catch (error: any) {
    console.error("Error fetching all courses:", error);
    throw error.response?.data || { message: "Failed to fetch all courses" };
  }
};

/**
 * Assigns a course to a specific university.
 * @param universityId The ID of the university
 * @param courseId The ID of the course
 * @returns Promise<CourseResponse>
 */
export async function assignCourseToUniversity(
  universityId: number,
  courseId: number
): Promise<CourseResponse> {
  try {
    const response = await api.post<CourseResponse>(
      `/admin/api/universities/${universityId}/courses/${courseId}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error assigning course to university:", error);
    throw error.response?.data || { message: "Failed to assign course to university" };
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

/**
 * Toggles an admin account's status between ACTIVE and DEACTIVE.
 * @param adminId The ID of the admin account to toggle.
 * @returns Promise<UserAccountResponse> The updated admin account details.
 */
export async function toggleAdminStatus(adminId: number): Promise<UserAccountResponse> {
  try {
    const response = await api.put<UserAccountResponse>(
      `/superadmin/api/admin_account/${adminId}/status`
    );
    return response.data;
  } catch (error: any) {
    console.error('Error toggling admin status:', error);
    throw error.response?.data || { message: 'Failed to toggle admin status' };
  }
}

/**
 * Updates an existing course.
 * @param id The ID of the course to update.
 * @param data CourseRequest object with updated course data.
 * @returns Promise<CourseResponse>
 */
export async function updateCourse(id: number, data: CourseRequest): Promise<CourseResponse> {
  try {
    const response = await api.put<CourseResponse>(`/superadmin/api/course/update/${id}`, data);
    return response.data;
  } catch (error: any) {
    console.error("Error updating course:", error);
    throw error.response?.data || { message: "Failed to update course" };
  }
}

// Save question API
// Save question API
export async function saveQuestion(data: {
  courseId: number;
  category: string; // e.g., "GENERAL_INTEREST"
  question: string;
}) {
  try {
    const response = await api.post("/superadmin/api/questions/save", data);
    return response.data;
  } catch (error: any) {
    console.error("Error saving question:", error);
    throw error.response?.data || { message: "Failed to save question" };
  }
}

// Fetch all questions API (with university info)
export async function getAllQuestions() {
  try {
    const response = await api.get('/superadmin/api/questions/all');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching questions:', error);
    throw error.response?.data || { message: 'Failed to fetch questions' };
  }
}

/**
 * Fetches active courses by university ID.
 * @param universityId number
 * @returns Promise<CourseResponse[]>
 */
export async function getActiveCoursesByUniversity(universityId: number): Promise<CourseResponse[]> {
  try {
    const response = await api.get<CourseResponse[]>(
      `/superadmin/api/course/active?universityId=${universityId}`
    );
    return response.data;
  } catch (error: any) {
    console.error('Error fetching active courses:', error);
    throw error.response?.data || { message: 'Failed to fetch active courses' };
  }
}

/**
 * Deletes a question by ID.
 * @param questionId 
 * @returns Promise<void>
 */
export async function deleteQuestion(questionId: number): Promise<void> {
  try {
    await api.delete(`/superadmin/api/questions/delete/${questionId}`);
  } catch (error: any) {
    console.error('Error deleting question:', error);
    throw error.response?.data || { message: 'Failed to delete question' };
  }
}

/**
 * Updates a question by ID.
 * @param questionId The ID of the question to update.
 * @param data The updated question data.
 * @returns Promise<void>
 */
export async function updateQuestion(questionId: number, data: {
  courseId: number;
  category: string;
  question: string;
}): Promise<void> {
  try {
    await api.put(`/superadmin/api/questions/update/${questionId}`, data);
  } catch (error: any) {
    console.error('Error updating question:', error);
    throw error.response?.data || { message: 'Failed to update question' };
  }
}

/**
 * @param universityId number
 * @returns Promise<number>
 * Fetches the number of active courses for a given university.
 */
export async function totalActiveCourseByUniversity(universityId: number): Promise<number> {
  try {
    const response = await api.get<{ count: number }>(
      `/admin/api/university/courses/count/${universityId}`
    );
    return response.data.count;
  } catch (error: any) {
    console.error('Error fetching course count:', error);
    throw error.response?.data || { message: 'Failed to fetch course count' };
  }
}

/**
 * Fetches active courses by university ID.
 * @param universityId number
 * @returns Promise<CourseResponse[]>
 */
export async function getAllActiveCoursesByUniversity(universityId: number): Promise<CourseResponse[]> {
  try {
    const response = await api.get<CourseResponse[]>(
      `/admin/api/course/all/active?universityId=${universityId}`
    );
    return response.data;
  } catch (error: any) {
    console.error('Error fetching active courses:', error);
    throw error.response?.data || { message: 'Failed to fetch active courses' };
  }
};

/**
 * Fetches active courses by university ID.
 * @param universityId number
 * @returns Promise<CourseResponse[]>
 */
export async function getAllCoursesByUniversity(universityId: number): Promise<CourseResponse[]> {
  try {
    const response = await api.get<CourseResponse[]>(
      `/admin/api/course/all/${universityId}`
    );
    return response.data;
  } catch (error: any) {
    console.error('Error fetching active courses:', error);
    throw error.response?.data || { message: 'Failed to fetch active courses' };
  }
};

/**
 * Update course status (activate/deactivate) for a specific university.
 * @param courseId - The course ID
 * @param universityId - The university ID
 * @param action - Either "activate" or "deactivate"
 */
async function updateCourseStatus(
  courseId: number,
  universityId: number,
  action: "activate" | "deactivate"
) {
  return api.put(`/admin/api/course/${courseId}/${action}`, null, {
    params: { universityId },
  });
};

/**
 * Activate a course for a specific university.
 */
export async function activateCourse(courseId: number, universityId: number) {
  const response = await api.put(`/admin/api/courses/${universityId}/activate/${courseId}`);
  return response.data;
}

/**
 * Deactivate a course for a specific university.
 */
export async function deactivateCourse(courseId: number, universityId: number) {
  const response = await api.put(`/admin/api/courses/${universityId}/deactivate/${courseId}`);
  return response.data;
}


/**
 * Fetch all active courses for a specific university.
 */
export async function getUniversityCourses(universityId: number) {
  const response = await api.get(`/admin/api/course/university/${universityId}`);
  return response.data;
};

export async function saveOrUpdateTheme(
  request: CustomizationRequest
): Promise<CustomizationResponse> {
  try {
    const formData = new FormData();

    formData.append("themeName", request.themeName);
    formData.append("aboutText", request.aboutText);

    if (request.logoFile) {
      formData.append("logoFile", request.logoFile);
    }

    // Convert number → string for FormData
    formData.append("universityId", request.universityId.toString());

    const response = await api.post(
      "/admin/api/customization/save",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error saving theme:", error);
    throw error.response?.data || { message: "Failed to save theme" };
  }
}


/**
 * Fetches a theme by its ID.
 * @param id The ID of the theme to fetch.
 * @returns Promise<CustomizationResponse>
 */
export async function getTheme(universityId: number, ): Promise<CustomizationResponse> {
    try {
        const response = await api.get(`/admin/api/customization/${universityId}`); // <-- Corrected spelling
        return response.data;
    } catch (error: any) {
        console.error('Error fetching theme:', error);
        throw error.response?.data || { message: 'Failed to fetch theme' };
    }
};

export async function getActiveCourses(): Promise<CourseResponse[]> {
  try {
    const response = await api.get<CourseResponse[]>("/admin/api/course/active/all");
    return response.data;
  } catch (error: any) {
    console.error("Error fetching active courses:", error);
    throw error.response?.data || { message: "Failed to fetch active courses" };
  }
};

/**
 * Fetches the number of active courses for a given university.
 * @param universityId number
 * @returns Promise<number>
 */
export async function getActiveCourseCountByUniversity(universityId: number): Promise<number> {
  try {
    const response = await api.get<{ count: number }>(
      `/superadmin/api/university/courses/count/${universityId}`,
      { params: { status: "Active" } }
    );
    return response.data.count; // return number directly
  } catch (error: any) {
    console.error("Error fetching active course count:", error);
    throw error.response?.data || { message: "Failed to fetch active course count" };
  }
};

/**
 * Generates (or retrieves) a dynamic activation link for a university account.
 * @param universityId The ID of the university.
 * @returns Promise<{ universityId: string; link: string }>
 */
export async function generateActivationLink(
  universityId: number
): Promise<{ universityId: string; link: string }> {
  try {
    const response = await api.post<{ universityId: string; link: string }>(
      `/user/public/user/account/${universityId}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error generating activation link:", error);
    throw error.response?.data || { message: "Failed to generate activation link" };
  }
};

/**
 * Fetches the generated university activation link by universityId.
 * @param universityId number
 * @returns Promise<{ universityId: number; link: string }>
 */
export async function getUniversityActivationLink(
  universityId: number
): Promise<{ universityId: number; link: string }> {
  try {
    const response = await api.get<string>(`/user/public/generated_dynamic_link/${universityId}`);
    const link = response.data; // response.data ay string galing backend

    // Return object para match sa frontend typing
    return { universityId, link };
  } catch (error: any) {
    console.error("Error fetching university activation link:", error);
    throw error.response?.data || { message: "Failed to fetch university activation link" };
  }
}











