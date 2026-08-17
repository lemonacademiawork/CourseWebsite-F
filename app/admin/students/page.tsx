'use client';
import { useState } from 'react';

interface StudentItem {
    id: number;
    name: string;
    studentId: string;
    email: string;
    phone: string;
    coursesCount: number;
    joinDate: string;
    status: 'Paid' | 'Pending';
}

export default function AdminStudentManagement() {
    const [students, setStudents] = useState<StudentItem[]>([]);
    const [isAdding, setIsAdding] = useState(false);

    // Form states
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [status, setStatus] = useState<'Paid' | 'Pending'>('Paid');

    const handleAddStudent = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        const newStudent: StudentItem = {
            id: Date.now(),
            name: name.trim(),
            studentId: `#LA-${Math.floor(1000 + Math.random() * 9000)}`,
            email: email.trim() || 'student@example.com',
            phone: phone.trim() || 'N/A',
            coursesCount: 0,
            joinDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
            status
        };

        setStudents([...students, newStudent]);
        setName('');
        setEmail('');
        setPhone('');
        setIsAdding(false);
    };

    return (
        <main className="flex-grow w-full px-margin-mobile md:px-margin-desktop py-6 max-w-[1440px] mx-auto min-h-screen text-xs">

            <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-on-surface">Students</h2>
                    <p className="text-xs text-on-surface-variant mt-1">Manage student enrollments, progress, and account details.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <button 
                        onClick={() => setIsAdding(!isAdding)}
                        className="px-3 py-1.5 rounded-lg bg-primary text-on-primary font-semibold text-xs hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-sm"
                    >
                        <span className="material-symbols-outlined text-[16px]">add</span>
                        {isAdding ? 'Cancel' : 'Add Student'}
                    </button>
                </div>
            </header>

            {isAdding && (
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4 shadow-sm mb-6 max-w-xl">
                    <h3 className="text-sm font-bold text-on-surface mb-3">Add New Student</h3>
                    <form onSubmit={handleAddStudent} className="space-y-3">
                        <div>
                            <label className="block font-semibold text-on-surface-variant mb-1">Full Name</label>
                            <input 
                                type="text" 
                                className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2 focus:ring-1 focus:ring-primary focus:outline-none" 
                                placeholder="e.g. Priya Sharma"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block font-semibold text-on-surface-variant mb-1">Email</label>
                                <input 
                                    type="email" 
                                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2 focus:ring-1 focus:ring-primary focus:outline-none" 
                                    placeholder="e.g. priya@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block font-semibold text-on-surface-variant mb-1">Phone Number</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2 focus:ring-1 focus:ring-primary focus:outline-none" 
                                    placeholder="e.g. +91 98765 43210"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block font-semibold text-on-surface-variant mb-1">Payment Status</label>
                            <select 
                                className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2 focus:ring-1 focus:ring-primary focus:outline-none"
                                value={status}
                                onChange={(e) => setStatus(e.target.value as any)}
                            >
                                <option value="Paid">Paid</option>
                                <option value="Pending">Pending</option>
                            </select>
                        </div>
                        <button 
                            type="submit" 
                            className="bg-primary text-on-primary font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
                        >
                            Save Student
                        </button>
                    </form>
                </div>
            )}

            <section className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
                <div className="w-full overflow-x-auto table-container">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-surface-container-low border-b border-surface-variant text-on-surface-variant text-xs uppercase tracking-wider">
                                <th className="py-3 px-4 font-semibold">Student</th>
                                <th className="py-3 px-4 font-semibold">Contact</th>
                                <th className="py-3 px-4 font-semibold">Courses</th>
                                <th className="py-3 px-4 font-semibold">Join Date</th>
                                <th className="py-3 px-4 font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs text-on-surface divide-y divide-surface-variant">
                            {students.map((student) => (
                                <tr key={student.id} className="hover:bg-primary-container/5 transition-colors">
                                    <td className="py-3 px-4">
                                        <div>
                                            <p className="font-bold text-on-surface">{student.name}</p>
                                            <p className="text-[10px] text-on-surface-variant">ID: {student.studentId}</p>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <p className="text-on-surface">{student.email}</p>
                                        <p className="text-[10px] text-on-surface-variant">{student.phone}</p>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="text-on-surface-variant">{student.coursesCount} Enrolled</span>
                                    </td>
                                    <td className="py-3 px-4 text-on-surface-variant">{student.joinDate}</td>
                                    <td className="py-3 px-4">
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                            student.status === 'Paid' 
                                                ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant' 
                                                : 'bg-secondary-fixed text-on-secondary-fixed-variant'
                                        }`}>
                                            {student.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {students.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-on-surface-variant">
                                        No student profiles available. Click "Add Student" to enroll one.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    );
}
