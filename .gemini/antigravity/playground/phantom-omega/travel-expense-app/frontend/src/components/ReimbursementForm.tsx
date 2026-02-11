import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { PermissionData } from '../types';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { FileText, Calculator, DollarSign } from 'lucide-react';

const ReimbursementForm: React.FC = () => {
    const [permissions, setPermissions] = useState<PermissionData[]>([]);
    const [selectedId, setSelectedId] = useState<string>('');
    const [formData, setFormData] = useState({
        permission_id: '',
        allowance_days: 0,
        allowance_rate: 240, // Default rate
        allowance_total: 0,
        transport_cost: 0,
        accommodation_cost: 0,
        total_amount: 0,
        total_text: '' // BahtText
    });

    // Load permissions on mount
    useEffect(() => {
        const fetchPermissions = async () => {
            const res = await api.getPermissions();
            if (res.status === 'success' && res.data) {
                setPermissions(res.data);
            }
        };
        fetchPermissions();
    }, []);

    // Handle selection
    const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = e.target.value;
        setSelectedId(id);
        setFormData(prev => ({ ...prev, permission_id: id }));

        // Auto-calculate days based on dates if possible
        const selected = permissions.find(p => p.id === id);
        if (selected) {
            const start = new Date(selected.start_date);
            const end = new Date(selected.end_date);
            const diffTime = Math.abs(end.getTime() - start.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            // Simple day diff, might need adjustment for partial days
            setFormData(prev => ({
                ...prev,
                permission_id: id,
                allowance_days: diffDays || 1,
                allowance_total: (diffDays || 1) * prev.allowance_rate
            }));
        }
    };

    const [loadingPdf, setLoadingPdf] = useState(false);

    // Handle calculations
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // const val = parseFloat(value) || 0; // Unused

        setFormData(prev => {
            const next = { ...prev, [name]: value }; // keep as string or number

            // Recalculate totals
            if (name === 'allowance_days' || name === 'allowance_rate') {
                next.allowance_total = (parseFloat(next.allowance_days as any) || 0) * (parseFloat(next.allowance_rate as any) || 0);
            }

            const total = (next.allowance_total || 0) + (parseFloat(next.transport_cost as any) || 0) + (parseFloat(next.accommodation_cost as any) || 0);
            next.total_amount = total;

            return next;
        });
    };

    const handleCreatePdf = async () => {
        if (!selectedId) {
            alert('กรุณาเลือกรายการบันทึกข้อความก่อน');
            return;
        }
        setLoadingPdf(true);
        try {
            // Include formatted total
            const payload = {
                ...formData,
                ...selectedPermission, // merge permission data
                total_amount_num: formData.total_amount,
                total_amount_text: formData.total_text
            };

            const res = await api.createReimbursementPdf(payload);
            if (res.status === 'success' && res.url) {
                window.open(res.url, '_blank');
            } else {
                alert('เกิดข้อผิดพลาด: ' + (res.message || 'Unknown error'));
            }
        } catch (error) {
            alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
        } finally {
            setLoadingPdf(false);
        }
    };

    const selectedPermission = permissions.find(p => p.id === selectedId);

    return (
        <div className="max-w-4xl mx-auto p-8 bg-gray-50 min-h-screen font-sans">
            <div className="mb-8 border-b pb-4">
                <h1 className="text-3xl font-bold text-[#1e3a8a]">ขอเบิกค่าใช้จ่ายในการเดินทาง</h1>
                <p className="text-gray-600 mt-2">เลือกรายการที่ได้รับอนุมัติแล้วเพื่อทำเรื่องเบิกจ่าย</p>
            </div>

            <div className="bg-white shadow-lg rounded-xl border border-gray-200 p-8 space-y-6">

                {/* Step 1: Select Permission */}
                <div>
                    <Label htmlFor="permission_select" className="text-lg font-bold text-[#5d4037]">1. เลือกบันทึกข้อความขออนุมัติเดินทาง</Label>
                    <select
                        id="permission_select"
                        className="mt-2 w-full p-3 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-[#1e3a8a] focus:outline-none"
                        value={selectedId}
                        onChange={handleSelect}
                    >
                        <option value="">-- กรุณาเลือกรายการ --</option>
                        {permissions.map(p => (
                            <option key={p.id} value={p.id}>
                                {p.doc_date} - {p.destination} ({p.person_name})
                            </option>
                        ))}
                    </select>
                </div>

                {selectedPermission && (
                    <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                        {/* Summary of Selected Trip */}
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
                            <h3 className="font-semibold text-[#1e3a8a] mb-2 flex items-center gap-2">
                                <FileText className="w-4 h-4" /> รายละเอียดการเดินทาง
                            </h3>
                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                                <p><span className="font-semibold">เรื่อง:</span> {selectedPermission.subject}</p>
                                <p><span className="font-semibold">สถานที่:</span> {selectedPermission.destination}</p>
                                <p><span className="font-semibold">วันที่:</span> {selectedPermission.start_date} ถึง {selectedPermission.end_date}</p>
                                <p><span className="font-semibold">พาหนะ:</span> {selectedPermission.vehicle_type} {selectedPermission.license_plate}</p>
                            </div>
                        </div>

                        {/* Step 2: Expenses */}
                        <div className="space-y-6">
                            <Label className="text-lg font-bold text-[#5d4037] flex items-center gap-2">
                                <Calculator className="w-5 h-5" /> 2. รายละเอียดค่าใช้จ่าย
                            </Label>

                            {/* Allowance */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <Label>จำนวนวันเบี้ยเลี้ยง</Label>
                                    <Input type="number" name="allowance_days" value={formData.allowance_days} onChange={handleChange} />
                                </div>
                                <div>
                                    <Label>อัตรา (บาท/วัน)</Label>
                                    <Input type="number" name="allowance_rate" value={formData.allowance_rate} onChange={handleChange} />
                                </div>
                                <div>
                                    <Label>รวมเบี้ยเลี้ยง</Label>
                                    <Input value={formData.allowance_total} readOnly className="bg-gray-100 font-semibold text-[#1e3a8a]" />
                                </div>
                            </div>

                            {/* Other Costs */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>ค่าพาหนะ (บาท)</Label>
                                    <Input type="number" name="transport_cost" value={formData.transport_cost} onChange={handleChange} placeholder="0.00" />
                                </div>
                                <div>
                                    <Label>ค่าที่พัก (บาท)</Label>
                                    <Input type="number" name="accommodation_cost" value={formData.accommodation_cost} onChange={handleChange} placeholder="0.00" />
                                </div>
                            </div>

                            {/* Grand Total */}
                            <div className="bg-[#1e3a8a] text-white p-6 rounded-xl flex flex-col md:flex-row justify-between items-center shadow-md">
                                <div className="text-lg font-medium">รวมเป็นเงินทั้งสิ้น</div>
                                <div className="text-3xl font-bold flex items-center gap-2">
                                    <DollarSign className="w-6 h-6 text-[#d4af37]" />
                                    {formData.total_amount.toLocaleString()} บาท
                                </div>
                            </div>

                            <div>
                                <Label>จำนวนเงินตัวอักษร</Label>
                                <Input
                                    name="total_text"
                                    value={formData.total_text}
                                    onChange={(e) => setFormData({ ...formData, total_text: e.target.value })}
                                    placeholder="(ตัวอย่าง: หนึ่งพันสองร้อยบาทถ้วน)"
                                />
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button
                                    onClick={handleCreatePdf}
                                    disabled={loadingPdf}
                                    className="bg-[#d4af37] hover:bg-[#b58f22] text-[#5d4037] font-bold min-w-[200px]"
                                >
                                    {loadingPdf ? 'กำลังสร้างเอกสาร...' : 'สร้างเอกสารขอเบิก (PDF)'}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReimbursementForm;
