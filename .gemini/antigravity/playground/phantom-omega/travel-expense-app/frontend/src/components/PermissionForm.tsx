import React, { useState } from 'react';
import { api } from '../services/api';
import type { PermissionData } from '../types';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { Textarea } from './ui/Textarea';
import { Upload, Send, FileText, MapPin, Truck, User } from 'lucide-react';

const PermissionForm: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<PermissionData>({
        ref_no: '',
        doc_date: new Date().toISOString().split('T')[0],
        subject: 'ขออนุญาตใช้รถยนต์ส่วนตัวเพื่อร่วมเป็นคณะกรรมการกลั่นกรองผลงานสื่อสร้างสรรค์ ปลูกจิตสำนึกรักบ้านเกิด',
        to_person: 'ผู้อำนวยการสำนักงานส่งเสริมการเรียนรู้ประจำจังหวัดมหาสารคาม',
        office: 'ศูนย์ส่งเสริมการเรียนรู้ระดับอำเภอโกสัมพีนคร',
        person_name: '',
        position: '',
        department: '',
        objective: '',
        destination: '',
        start_date: '',
        end_date: '',
        vehicle_type: 'Personal Car',
        license_plate: '',
        province: '',
        distance: 0,
        budget_source: 'เงินงบประมาณรายจ่ายประจำปี พ.ศ. 2569 แผนงาน : ยุทธศาสตร์สร้างความเสมอภาคทางการศึกษา',
        status: 'Draft',
        map_url_origin: '',
        map_url_destination: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, field: 'map_url_origin' | 'map_url_destination') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, [field]: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await api.savePermission(formData);
            if (result.status === 'success') {
                alert('บันทึกข้อมูลสำเร็จ! ID: ' + result.id);
            } else {
                alert('เกิดข้อผิดพลาด: ' + result.message);
            }
        } catch (error) {
            alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-8 bg-gray-50 min-h-screen font-sans">

            {/* Header / Title */}
            <div className="mb-8 text-center relative">
                <div className="mx-auto w-24 h-24 mb-4 flex items-center justify-center">
                    {/* Placeholder for Garuda (Kruth) - using a styled text or simple svg for now */}
                    <svg viewBox="0 0 100 100" className="w-20 h-20 text-[#5d4037] fill-current">
                        <path d="M50 20 C60 10, 80 10, 90 30 C80 40, 60 40, 50 20 C40 40, 20 40, 10 30 C20 10, 40 10, 50 20 Z" />
                        <text x="50" y="70" fontSize="10" textAnchor="middle" fill="#5d4037">(ตราครุฑ)</text>
                    </svg>
                </div>
                <h1 className="text-3xl font-bold text-[#1e3a8a]">บันทึกข้อความ</h1>
                <p className="text-gray-600 mt-2">ส่วนราชการ {formData.office}</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-xl border border-gray-200 p-8 space-y-8 relative overflow-hidden">
                {/* Decorative top border */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#1e3a8a] via-[#d4af37] to-[#1e3a8a]"></div>

                {/* Section 1: Document Header */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-6 border-b border-gray-100">
                    <div className="md:col-span-5">
                        <Label htmlFor="ref_no" className="text-[#1e3a8a] font-semibold">ที่</Label>
                        <Input id="ref_no" name="ref_no" value={formData.ref_no} onChange={handleChange} placeholder="ศธ 07072.05/..." required className="mt-1" />
                    </div>
                    <div className="md:col-span-7">
                        <Label htmlFor="doc_date" className="text-[#1e3a8a] font-semibold">วันที่</Label>
                        <Input type="date" id="doc_date" name="doc_date" value={formData.doc_date} onChange={handleChange} required className="mt-1" />
                    </div>
                    <div className="md:col-span-12">
                        <Label htmlFor="subject" className="text-[#1e3a8a] font-semibold">เรื่อง</Label>
                        <Input id="subject" name="subject" value={formData.subject} onChange={handleChange} required className="mt-1 w-full" />
                    </div>
                    <div className="md:col-span-12">
                        <Label htmlFor="to_person" className="text-[#1e3a8a] font-semibold">เรียน</Label>
                        <Input id="to_person" name="to_person" value={formData.to_person} onChange={handleChange} required className="mt-1 w-full" />
                    </div>
                </div>

                {/* Section 2: Requester Info */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <User className="w-5 h-5 text-[#d4af37]" />
                        <h3 className="text-lg font-bold text-[#5d4037]">ข้อมูลผู้ขออนุญาต</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="person_name">ชื่อ-สกุล</Label>
                            <Input id="person_name" name="person_name" value={formData.person_name} onChange={handleChange} placeholder="นาย/นาง/นางสาว..." required />
                        </div>
                        <div>
                            <Label htmlFor="position">ตำแหน่ง</Label>
                            <Input id="position" name="position" value={formData.position} onChange={handleChange} required />
                        </div>
                        <div className="md:col-span-2">
                            <Label htmlFor="department">สังกัด</Label>
                            <Input id="department" name="department" value={formData.department} onChange={handleChange} required />
                        </div>
                    </div>
                </div>

                {/* Section 3: Trip Details */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-5 h-5 text-[#d4af37]" />
                        <h3 className="text-lg font-bold text-[#5d4037]">รายละเอียดการเดินทาง</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <Label htmlFor="objective">วัตถุประสงค์ (เพื่อ...)</Label>
                            <Textarea id="objective" name="objective" rows={3} value={formData.objective} onChange={handleChange} required />
                        </div>
                        <div>
                            <Label htmlFor="destination">สถานที่ไปราชการ (ณ...)</Label>
                            <Input id="destination" name="destination" value={formData.destination} onChange={handleChange} required />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="start_date">เดินทางไป (วัน-เวลา)</Label>
                                <Input type="datetime-local" id="start_date" name="start_date" value={formData.start_date} onChange={handleChange} required />
                            </div>
                            <div>
                                <Label htmlFor="end_date">เดินทางกลับ (วัน-เวลา)</Label>
                                <Input type="datetime-local" id="end_date" name="end_date" value={formData.end_date} onChange={handleChange} required />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 4: Budget & Vehicle */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Budget */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <FileText className="w-5 h-5 text-[#d4af37]" />
                            <h3 className="text-lg font-bold text-[#5d4037]">งบประมาณ</h3>
                        </div>
                        <div>
                            <Label htmlFor="budget_source">แหล่งงบประมาณ</Label>
                            <Textarea id="budget_source" name="budget_source" rows={3} value={formData.budget_source} onChange={handleChange} className="text-sm" />
                        </div>
                    </div>

                    {/* Vehicle */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Truck className="w-5 h-5 text-[#d4af37]" />
                            <h3 className="text-lg font-bold text-[#5d4037]">พาหนะเดินทาง</h3>
                        </div>
                        <div>
                            <Label htmlFor="vehicle_type">ประเภทพาหนะ</Label>
                            <select
                                id="vehicle_type"
                                name="vehicle_type"
                                value={formData.vehicle_type}
                                onChange={handleChange}
                                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                            >
                                <option value="Personal Car">รถยนต์ส่วนบุคคล</option>
                                <option value="Public Transport">รถโดยสารประจำทาง</option>
                                <option value="Official Vehicle">รถราชการ</option>
                                <option value="Other">อื่นๆ</option>
                            </select>
                        </div>
                        {formData.vehicle_type === 'Personal Car' && (
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <Label htmlFor="license_plate">ทะเบียน</Label>
                                    <Input id="license_plate" name="license_plate" value={formData.license_plate} onChange={handleChange} placeholder="กข 1234" />
                                </div>
                                <div>
                                    <Label htmlFor="province">จังหวัด</Label>
                                    <Input id="province" name="province" value={formData.province} onChange={handleChange} placeholder="กทม." />
                                </div>
                                <div className="col-span-2">
                                    <Label htmlFor="distance">ระยะทาง (กม.) ไป-กลับ</Label>
                                    <Input type="number" id="distance" name="distance" value={formData.distance} onChange={handleChange} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Section 5: Map Attachments */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-5 h-5 text-[#d4af37]" />
                        <h3 className="text-lg font-bold text-[#5d4037]">เอกสารแนบ (DOH GIS)</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Map 1: Origin */}
                        <div>
                            <Label className="mb-2 block text-sm">1. แผนที่ต้นทาง (Origin)</Label>
                            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 bg-white relative overflow-hidden transition-all">
                                {formData.map_url_origin ? (
                                    <img src={formData.map_url_origin} alt="Origin Map" className="absolute inset-0 w-full h-full object-cover" />
                                ) : (
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-8 h-8 mb-2 text-gray-400" />
                                        <p className="text-xs text-gray-500">คลิกอัปโหลดภาพต้นทาง</p>
                                    </div>
                                )}
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'map_url_origin')} />
                            </label>
                        </div>

                        {/* Map 2: Destination */}
                        <div>
                            <Label className="mb-2 block text-sm">2. แผนที่ปลายทาง (Destination)</Label>
                            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 bg-white relative overflow-hidden transition-all">
                                {formData.map_url_destination ? (
                                    <img src={formData.map_url_destination} alt="Destination Map" className="absolute inset-0 w-full h-full object-cover" />
                                ) : (
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-8 h-8 mb-2 text-gray-400" />
                                        <p className="text-xs text-gray-500">คลิกอัปโหลดภาพปลายทาง</p>
                                    </div>
                                )}
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'map_url_destination')} />
                            </label>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500">
                        *รูปภาพแคปเจอร์จาก <a href="https://dohgis.doh.go.th/dohtotravel/" target="_blank" rel="noreferrer" className="text-[#1e3a8a] underline">DOH GIS</a>
                    </p>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-4 pt-6 mt-6 border-t border-gray-100">
                    <Button type="button" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                        บันทึกร่าง
                    </Button>
                    <Button type="submit" disabled={loading} className="bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white min-w-[150px]">
                        {loading ? 'กำลังบันทึก...' : (
                            <>
                                <Send className="w-4 h-4 mr-2" /> ยืนยันข้อมูล
                            </>
                        )}
                    </Button>
                </div>

            </form>
        </div>
    );
};

export default PermissionForm;
