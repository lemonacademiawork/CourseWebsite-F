'use client';

export default function TrainerStudentsPage() {
    const students = [
        { name: "Rahul Mehta", email: "rahul.mehta@gmail.com", course: "Lippan Art Fundamentals", progress: "85%", joinedDate: "Aug 10, 2026" },
        { name: "Sneha Nair", email: "sneha.nair@example.com", course: "Lippan Art Fundamentals", progress: "60%", joinedDate: "Aug 12, 2026" }
    ];

    return (
        <main className="flex-grow min-h-screen bg-surface px-margin-mobile md:px-margin-desktop py-8 text-xs max-w-[1280px] mx-auto w-full">
            <header className="mb-6">
                <h2 className="text-xl font-bold text-on-surface">Your Students</h2>
                <p className="text-on-surface-variant mt-1">Monitor course progress, submissions, and feedback for active learners.</p>
            </header>

            <div className="bg-surface-container-lowest border border-outline-variant/35 rounded-2xl p-6 shadow-sm">
                <div className="w-full overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-surface-container-low border-b border-outline-variant text-on-surface-variant font-semibold">
                                <th className="py-2.5 px-3">Student Name</th>
                                <th className="py-2.5 px-3">Email Address</th>
                                <th className="py-2.5 px-3">Assigned Course</th>
                                <th className="py-2.5 px-3 text-center">Progress</th>
                                <th className="py-2.5 px-3">Joined Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/20 text-on-surface">
                            {students.map((student, idx) => (
                                <tr key={idx}>
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
        </main>
    );
}
