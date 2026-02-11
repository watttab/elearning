import type { PermissionData, ApiResponse } from '../types';

// Replace with your actual GAS Web App URL after deployment
const API_URL = 'https://script.google.com/macros/s/AKfycbyLLrZvzEdPTvZvBqWrOuVhEFjm5tv8XsO9_HVQftWZI6MuMgtZ-7_1ojhAHnOXpgCS7A/exec';

// Mock data for development
const MOCK_PERMISSIONS: PermissionData[] = [
    {
        id: '1',
        timestamp: new Date().toISOString(),
        ref_no: 'ศธ 07072.05/123',
        doc_date: '2024-02-10',
        subject: 'ขออนุญาตไปราชการ',
        to_person: 'ผู้อำนวยการ',
        office: 'ศูนย์ส่งเสริมการเรียนรู้ระดับอำเภอโกสัมพีนคร',
        person_name: 'นายวรธนพงศ์ ทับยานี',
        position: 'ครู',
        department: 'ศ.สกร.ระดับอำเภอโกสัมพีนคร',
        objective: 'เข้าร่วมประชุมโครงการ...',
        destination: 'กทม.',
        start_date: '2024-02-15T08:00',
        end_date: '2024-02-16T17:00',
        vehicle_type: 'Personal Car',
        license_plate: 'กท 1234',
        province: 'กรุงเทพมหานคร',
        distance: 150,
        budget_source: 'เงินงบประมาณรายจ่ายประจำปี พ.ศ. 2569',
        status: 'Pending',
    },
];

export const isDev = import.meta.env.DEV;

export const api = {
    getPermissions: async (): Promise<ApiResponse<PermissionData[]>> => {
        if (isDev) {
            console.log('Mock API: getPermissions');
            return { status: 'success', data: MOCK_PERMISSIONS };
        }

        try {
            const response = await fetch(`${API_URL}?action=getPermissions`);
            return await response.json();
        } catch (error) {
            return { status: 'error', message: String(error) };
        }
    },

    savePermission: async (data: PermissionData): Promise<ApiResponse<PermissionData>> => {
        if (isDev) {
            console.log('Mock API: savePermission', data);
            return { status: 'success', id: 'mock-id-' + Date.now() };
        }

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                body: JSON.stringify({ ...data, action: 'savePermission' }),
            });
            return await response.json();
        } catch (error) {
            return { status: 'error', message: String(error) };
        }
    },

    createReimbursementPdf: async (data: any): Promise<ApiResponse<{ url: string }>> => {
        if (isDev) {
            console.log('Mock API: createReimbursementPdf', data);
            return { status: 'success', data: { url: 'https://example.com/mock-pdf.pdf' } };
        }

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                body: JSON.stringify({ ...data, action: 'createReimbursementPdf' }),
            });
            return await response.json();
        } catch (error) {
            return { status: 'error', message: String(error) };
        }
    },
};
