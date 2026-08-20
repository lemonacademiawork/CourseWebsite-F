'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface TrainerApplication {
    id: string;
    name: string;
    age: string;
    gender: string;
    email: string;
    phone: string;
    city: string;
    state: string;
    profilePhoto: string;
    category: string;
    experienceYears: string;
    profession: string;
    teachingExperience: string;
    previousWorkshops: string;
    studentsTaught: string;
    expertiseAreas: string;
    whatTheyCanTeach: string;
    whyTrainer: string;
    portfolioPhotos: string[];
    instagram: string;
    youtube: string;
    facebook: string;
    website: string;
    education: string;
    certifications: string;
    awards: string;
    languages: string;
    teachingLanguage: string;
    availability: string;
    classFormat: string;
    status: 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Changes Requested';
    adminFeedback?: string;
}

export default function BecomeTrainerApplicationPage() {
    const router = useRouter();
    const [existingApp, setExistingApp] = useState<TrainerApplication | null>(null);

    // Personal Info
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('Female');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [profilePhoto, setProfilePhoto] = useState('');

    // Professional Info
    const [category, setCategory] = useState('');
    const [experienceYears, setExperienceYears] = useState('');
    const [profession, setProfession] = useState('');
    const [teachingExperience, setTeachingExperience] = useState('');
    const [previousWorkshops, setPreviousWorkshops] = useState('');
    const [studentsTaught, setStudentsTaught] = useState('');

    // Creative Expertise
    const [expertiseAreas, setExpertiseAreas] = useState('');
    const [whatTheyCanTeach, setWhatTheyCanTeach] = useState('');
    const [whyTrainer, setWhyTrainer] = useState('');

    // Portfolio
    const [portfolioPhotos, setPortfolioPhotos] = useState<string[]>([]);

    // Social Links
    const [instagram, setInstagram] = useState('');
    const [youtube, setYoutube] = useState('');
    const [facebook, setFacebook] = useState('');
    const [website, setWebsite] = useState('');

    // Additional Info
    const [education, setEducation] = useState('');
    const [certifications, setCertifications] = useState('');
    const [awards, setAwards] = useState('');
    const [languages, setLanguages] = useState('');
    const [teachingLanguage, setTeachingLanguage] = useState('');
    const [availability, setAvailability] = useState('');
    const [classFormat, setClassFormat] = useState('Online Live');

    const [loading, setLoading] = useState(false);

    // Load auth and existing application
    useEffect(() => {
        const loggedIn = localStorage.getItem('is_logged_in') === 'true';
        if (!loggedIn) {
            router.push('/login');
            return;
        }

        const userEmail = localStorage.getItem('user_email') || '';
        setEmail(userEmail);
        setName(localStorage.getItem('user_name') || '');

        const apps = JSON.parse(localStorage.getItem('trainer_applications') || '[]');
        const userApp = apps.find((app: TrainerApplication) => app.email === userEmail);
        if (userApp) {
            setExistingApp(userApp);
            // Populate fields if editing is requested
            if (userApp.status === 'Changes Requested') {
                setAge(userApp.age || '');
                setGender(userApp.gender || 'Female');
                setPhone(userApp.phone || '');
                setCity(userApp.city || '');
                setState(userApp.state || '');
                setProfilePhoto(userApp.profilePhoto || '');
                setCategory(userApp.category || '');
                setExperienceYears(userApp.experienceYears || '');
                setProfession(userApp.profession || '');
                setTeachingExperience(userApp.teachingExperience || '');
                setPreviousWorkshops(userApp.previousWorkshops || '');
                setStudentsTaught(userApp.studentsTaught || '');
                setExpertiseAreas(userApp.expertiseAreas || '');
                setWhatTheyCanTeach(userApp.whatTheyCanTeach || '');
                setWhyTrainer(userApp.whyTrainer || '');
                setPortfolioPhotos(userApp.portfolioPhotos || []);
                setInstagram(userApp.instagram || '');
                setYoutube(userApp.youtube || '');
                setFacebook(userApp.facebook || '');
                setWebsite(userApp.website || '');
                setEducation(userApp.education || '');
                setCertifications(userApp.certifications || '');
                setAwards(userApp.awards || '');
                setLanguages(userApp.languages || '');
                setTeachingLanguage(userApp.teachingLanguage || '');
                setAvailability(userApp.availability || '');
                setClassFormat(userApp.classFormat || 'Online Live');
            }
        }
    }, []);

    const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setProfilePhoto(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handlePortfolioAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            Array.from(files).forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPortfolioPhotos(prev => [...prev, reader.result as string].slice(0, 3));
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removePortfolioImage = (idx: number) => {
        setPortfolioPhotos(prev => prev.filter((_, i) => i !== idx));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const newApp: TrainerApplication = {
            id: existingApp?.id || Date.now().toString(),
            name,
            age,
            gender,
            email,
            phone,
            city,
            state,
            profilePhoto,
            category,
            experienceYears,
            profession,
            teachingExperience,
            previousWorkshops,
            studentsTaught,
            expertiseAreas,
            whatTheyCanTeach,
            whyTrainer,
            portfolioPhotos,
            instagram,
            youtube,
            facebook,
            website,
            education,
            certifications,
            awards,
            languages,
            teachingLanguage,
            availability,
            classFormat,
            status: 'Submitted'
        };

        try {
            // Send to Render backend if deployed
            await fetch('/api/v1/trainers/apply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newApp)
            }).catch(() => {});

            // Update localStorage db
            const apps = JSON.parse(localStorage.getItem('trainer_applications') || '[]');
            const idx = apps.findIndex((a: TrainerApplication) => a.email === email);
            if (idx !== -1) {
                apps[idx] = newApp;
            } else {
                apps.push(newApp);
            }
            localStorage.setItem('trainer_applications', JSON.stringify(apps));
            setExistingApp(newApp);
            
            // If approved user gets role update
            window.dispatchEvent(new Event('trainer_applications_updated'));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (existingApp && existingApp.status !== 'Changes Requested') {
        return (
            <main className="min-h-screen bg-[#FBF8F1] py-16 px-margin-mobile md:px-margin-desktop max-w-xl mx-auto text-xs text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-surface-container flex items-center justify-center rounded-full text-primary mb-6">
                    <span className="material-symbols-outlined text-3xl">
                        {existingApp.status === 'Approved' ? 'task_alt' : existingApp.status === 'Rejected' ? 'cancel' : 'hourglass_empty'}
                    </span>
                </div>
                <h1 className="playfair text-2xl font-bold text-on-surface mb-2">
                    Application {existingApp.status}
                </h1>
                <p className="text-on-surface-variant max-w-md mb-8 leading-relaxed">
                    {existingApp.status === 'Submitted' && "Your application has been received and is in queue. Our review team will verify your portfolio shortly."}
                    {existingApp.status === 'Under Review' && "Our curriculum team is currently reviewing your expertise areas, teaching formats, and creative works."}
                    {existingApp.status === 'Approved' && "Congratulations! Your trainer application has been approved. You now have full access to create courses and manage live classes."}
                    {existingApp.status === 'Rejected' && "Unfortunately, your application does not match our current curriculum needs. We appreciate your interest."}
                </p>

                {existingApp.status === 'Approved' && (
                    <button 
                        onClick={() => {
                            localStorage.setItem('user_role', 'trainer');
                            window.dispatchEvent(new Event('auth_state_changed'));
                            router.push('/trainer/dashboard');
                        }}
                        className="bg-primary text-on-primary font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity shadow-sm"
                    >
                        Go to Trainer Dashboard
                    </button>
                )}
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#FBF8F1] py-12 px-margin-mobile md:px-margin-desktop text-xs max-w-[800px] mx-auto w-full">
            <header className="mb-8 text-center">
                <h1 className="playfair text-3xl font-bold text-primary mb-2">Become a Trainer</h1>
                <p className="text-on-surface-variant">Join Lemon Academy to instruct, inspire, and grow your creative business.</p>
            </header>

            {existingApp?.status === 'Changes Requested' && (
                <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-4 mb-8">
                    <h3 className="font-bold text-sm mb-1">Changes Requested by Admin:</h3>
                    <p className="italic">"{existingApp.adminFeedback || 'Please update your portfolio details.'}"</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-surface-container-lowest border border-outline-variant/35 rounded-2xl p-6 md:p-10 shadow-sm space-y-8">
                
                {/* 1. Personal Information */}
                <div>
                    <h3 className="text-sm font-bold text-primary border-b border-outline-variant/30 pb-2 mb-4">1. Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block font-semibold text-on-surface-variant mb-1">Full Name</label>
                            <input type="text" className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-primary" value={name} onChange={e => setName(e.target.value)} required />
                        </div>
                        <div>
                            <label className="block font-semibold text-on-surface-variant mb-1">Email Address</label>
                            <input type="email" className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 opacity-60" value={email} readOnly />
                        </div>
                        <div>
                            <label className="block font-semibold text-on-surface-variant mb-1">Age</label>
                            <input type="number" className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-primary" value={age} onChange={e => setAge(e.target.value)} required />
                        </div>
                        <div>
                            <label className="block font-semibold text-on-surface-variant mb-1">Gender</label>
                            <select className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 focus:outline-none" value={gender} onChange={e => setGender(e.target.value)}>
                                <option>Female</option>
                                <option>Male</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block font-semibold text-on-surface-variant mb-1">Phone Number</label>
                            <input type="text" className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-primary" value={phone} onChange={e => setPhone(e.target.value)} required />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block font-semibold text-on-surface-variant mb-1">City</label>
                                <input type="text" className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 focus:outline-none" value={city} onChange={e => setCity(e.target.value)} required />
                            </div>
                            <div>
                                <label className="block font-semibold text-on-surface-variant mb-1">State</label>
                                <input type="text" className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 focus:outline-none" value={state} onChange={e => setState(e.target.value)} required />
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block font-semibold text-on-surface-variant mb-1">Profile Photo</label>
                            <div className="flex items-center gap-4">
                                {profilePhoto && <img src={profilePhoto} className="w-12 h-12 rounded-full object-cover border" alt="Profile Preview" />}
                                <input type="file" accept="image/*" onChange={handleProfilePhotoChange} className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2 focus:outline-none" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Professional Information */}
                <div>
                    <h3 className="text-sm font-bold text-primary border-b border-outline-variant/30 pb-2 mb-4">2. Professional Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block font-semibold text-on-surface-variant mb-1">Trainer Category (Craft type)</label>
                            <input type="text" className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 focus:outline-none" placeholder="e.g. Lippan Art / Pottery" value={category} onChange={e => setCategory(e.target.value)} required />
                        </div>
                        <div>
                            <label className="block font-semibold text-on-surface-variant mb-1">Years of Creative Experience</label>
                            <input type="text" className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 focus:outline-none" placeholder="e.g. 5 years" value={experienceYears} onChange={e => setExperienceYears(e.target.value)} required />
                        </div>
                        <div>
                            <label className="block font-semibold text-on-surface-variant mb-1">Current Profession</label>
                            <input type="text" className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 focus:outline-none" placeholder="e.g. Studio Artist" value={profession} onChange={e => setProfession(e.target.value)} required />
                        </div>
                        <div>
                            <label className="block font-semibold text-on-surface-variant mb-1">Teaching Experience (Years/Brief)</label>
                            <input type="text" className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 focus:outline-none" placeholder="e.g. 2 years at community center" value={teachingExperience} onChange={e => setTeachingExperience(e.target.value)} required />
                        </div>
                        <div>
                            <label className="block font-semibold text-on-surface-variant mb-1">Previous Workshops Conducted</label>
                            <input type="text" className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 focus:outline-none" placeholder="e.g. 4 weekend camps" value={previousWorkshops} onChange={e => setPreviousWorkshops(e.target.value)} />
                        </div>
                        <div>
                            <label className="block font-semibold text-on-surface-variant mb-1">Number of Students Taught</label>
                            <input type="number" className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 focus:outline-none" placeholder="e.g. 150" value={studentsTaught} onChange={e => setStudentsTaught(e.target.value)} />
                        </div>
                    </div>
                </div>

                {/* 3. Creative Expertise */}
                <div>
                    <h3 className="text-sm font-bold text-primary border-b border-outline-variant/30 pb-2 mb-4">3. Creative Expertise</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block font-semibold text-on-surface-variant mb-1">Specific Areas of Expertise</label>
                            <textarea className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 focus:outline-none" rows={2} placeholder="Explain details of your technique" value={expertiseAreas} onChange={e => setExpertiseAreas(e.target.value)} required />
                        </div>
                        <div>
                            <label className="block font-semibold text-on-surface-variant mb-1">What workshops/courses do you propose to teach?</label>
                            <textarea className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 focus:outline-none" rows={2} placeholder="Outline class curriculum ideas" value={whatTheyCanTeach} onChange={e => setWhatTheyCanTeach(e.target.value)} required />
                        </div>
                        <div>
                            <label className="block font-semibold text-on-surface-variant mb-1">Why do you want to become a trainer at Lemon Academy?</label>
                            <textarea className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 focus:outline-none" rows={2} placeholder="Your motivation" value={whyTrainer} onChange={e => setWhyTrainer(e.target.value)} required />
                        </div>
                    </div>
                </div>

                {/* 4. Portfolio Upload */}
                <div>
                    <h3 className="text-sm font-bold text-primary border-b border-outline-variant/30 pb-2 mb-4">4. Portfolio (Upload 2-3 Creative Work Photos)</h3>
                    <div className="space-y-4">
                        <label className="cursor-pointer block border border-dashed border-outline-variant/60 rounded-xl p-6 text-center hover:bg-surface-container-low transition-colors">
                            <span className="material-symbols-outlined text-primary text-xl block mb-2">upload_file</span>
                            <span className="font-semibold text-on-surface">Click to Upload Artwork Images</span>
                            <input type="file" multiple accept="image/*" className="sr-only" onChange={handlePortfolioAdd} />
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {portfolioPhotos.map((photo, idx) => (
                                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border">
                                    <img src={photo} className="w-full h-full object-cover" alt="Portfolio Artwork" />
                                    <button 
                                        type="button" 
                                        onClick={() => removePortfolioImage(idx)}
                                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1"
                                    >
                                        <span className="material-symbols-outlined text-xs">delete</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 5. Social Links */}
                <div>
                    <h3 className="text-sm font-bold text-primary border-b border-outline-variant/30 pb-2 mb-4">5. Social Links (Optional)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block font-semibold text-on-surface-variant mb-1">Instagram Profile Link</label>
                            <input type="url" className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 focus:outline-none" placeholder="https://instagram.com/profile" value={instagram} onChange={e => setInstagram(e.target.value)} />
                        </div>
                        <div>
                            <label className="block font-semibold text-on-surface-variant mb-1">YouTube Channel Link</label>
                            <input type="url" className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 focus:outline-none" placeholder="https://youtube.com/channel" value={youtube} onChange={e => setYoutube(e.target.value)} />
                        </div>
                        <div>
                            <label className="block font-semibold text-on-surface-variant mb-1">Facebook Page Link</label>
                            <input type="url" className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 focus:outline-none" placeholder="https://facebook.com/page" value={facebook} onChange={e => setFacebook(e.target.value)} />
                        </div>
                        <div>
                            <label className="block font-semibold text-on-surface-variant mb-1">Website / Portfolio Link</label>
                            <input type="url" className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 focus:outline-none" placeholder="https://mywebsite.com" value={website} onChange={e => setWebsite(e.target.value)} />
                        </div>
                    </div>
                </div>

                {/* 6. Additional Information */}
                <div>
                    <h3 className="text-sm font-bold text-primary border-b border-outline-variant/30 pb-2 mb-4">6. Additional Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block font-semibold text-on-surface-variant mb-1">Highest Education Level</label>
                            <input type="text" className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 focus:outline-none" placeholder="e.g. Master of Fine Arts" value={education} onChange={e => setEducation(e.target.value)} />
                        </div>
                        <div>
                            <label className="block font-semibold text-on-surface-variant mb-1">Certifications / Awards</label>
                            <input type="text" className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 focus:outline-none" placeholder="e.g. Kutch Craft Guild Certificate" value={awards} onChange={e => setAwards(e.target.value)} />
                        </div>
                        <div>
                            <label className="block font-semibold text-on-surface-variant mb-1">Languages Spoken</label>
                            <input type="text" className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 focus:outline-none" placeholder="e.g. English, Hindi, Gujarati" value={languages} onChange={e => setLanguages(e.target.value)} required />
                        </div>
                        <div>
                            <label className="block font-semibold text-on-surface-variant mb-1">Preferred Teaching Language</label>
                            <input type="text" className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 focus:outline-none" placeholder="e.g. English" value={teachingLanguage} onChange={e => setTeachingLanguage(e.target.value)} required />
                        </div>
                        <div>
                            <label className="block font-semibold text-on-surface-variant mb-1">Availability (Hours/Week)</label>
                            <input type="text" className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 focus:outline-none" placeholder="e.g. 10 hours on weekends" value={availability} onChange={e => setAvailability(e.target.value)} required />
                        </div>
                        <div>
                            <label className="block font-semibold text-on-surface-variant mb-1">Preferred Class Format</label>
                            <select className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 focus:outline-none" value={classFormat} onChange={e => setClassFormat(e.target.value)}>
                                <option>Online Live</option>
                                <option>Pre-recorded Video</option>
                                <option>Hybrid Model</option>
                            </select>
                        </div>
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-4 bg-primary text-on-primary font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 shadow-sm text-xs disabled:opacity-50"
                >
                    {loading ? 'Submitting Application...' : 'Submit Application'}
                </button>
            </form>
        </main>
    );
}
