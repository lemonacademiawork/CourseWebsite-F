'use client';

export default function TrainerStudentsPage() {
    const students = [
        { name: "Rahul Mehta", email: "rahul.mehta@gmail.com", course: "Lippan Art Fundamentals", progress: "85%", joinedDate: "Aug 10, 2026" },
        { name: "Sneha Nair", email: "sneha.nair@example.com", course: "Lippan Art Fundamentals", progress: "60%", joinedDate: "Aug 12, 2026" }
    ];

    return (
        <div className="relative min-h-screen pb-4">
            {/* Abstract Background Pattern */}
            <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: "radial-gradient(circle at 100% 0%, #ffe17a 0%, transparent 40%), radial-gradient(circle at 0% 100%, #fe9d7a 0%, transparent 40%)" }}></div>
            
            <div className="max-w-container-max mx-auto px-margin-mobile md:px-6 py-4 relative z-10 text-xs">
                <header className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-surface-variant/30 pb-3">
                    <div>
                        <h2 className="text-xl font-bold text-on-surface">Your Students</h2>
                        <p className="text-[11px] text-on-surface-variant mt-0.5">Monitor course progress, submissions, and feedback for active learners.</p>
                    </div>
                </header>

                <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden shadow-sm mt-6">
                    <div className="w-full overflow-x-auto">
                        <table className="w-full text-left border-collapse text-[11px]">
                            <thead>
                                <tr className="bg-surface-container-low border-b border-outline-variant/40 text-on-surface-variant font-semibold">
                                    <th className="py-2.5 px-3">Student Name</th>
                                    <th className="py-2.5 px-3">Email Address</th>
                                    <th className="py-2.5 px-3">Assigned Course</th>
                                    <th className="py-2.5 px-3 text-center">Progress</th>
                                    <th className="py-2.5 px-3">Joined Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/20 text-on-surface">
                                {students.map((student, idx) => (
                                    <tr key={idx} className="hover:bg-surface-container-low/30 transition-colors">
                                        <td className="py-3 px-3 font-semibold">{student.name}</td>
                                        <td className="py-3 px-3 text-on-surface-variant">{student.email}</td>
                                        <td className="py-3 px-3">{student.course}</td>
                                        <td className="py-3 px-3 text-center font-bold text-primary">{student.progress}</td>
                                        <td className="py-3 px-3 text-on-surface-variant">{student.joinedDate}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
