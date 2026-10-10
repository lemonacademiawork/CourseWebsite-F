import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { Course, CreateCoursePayload, UpdateCoursePayload } from '../models/course.model';
import { CourseResource, CreateResourcePayload, UpdateResourcePayload } from '../models/common.model';
import { environment } from '../../../environments/environment';

export const CATEGORY_IMAGE_DEFAULTS: Record<string, string> = {
  'soap-making': 'https://images.unsplash.com/photo-1607006314164-946761596700?auto=format&fit=crop&q=80&w=1000',
  'handcrafted-cosmetics': 'https://images.unsplash.com/photo-1607006314164-946761596700?auto=format&fit=crop&q=80&w=1000',
  'resin-crafts': 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=1000',
  'resin-art': 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=1000',
  'lippan-art': 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=1000',
  'candle-making': 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=1000',
  'pottery': 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&q=80&w=1000',
  'mosaic-art': 'https://images.unsplash.com/photo-1569172122301-bc5007ba0977?auto=format&fit=crop&q=80&w=1000',
  'crochet-fiber-arts': 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&q=80&w=1000'
};

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = `${environment.apiUrl}/courses`;
  private catalogCache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_TTL_MS = 60000;

  private defaultCourses: Course[] = [
    {
      id: 'course-soap-making',
      title: 'Cold Process Organic Soap Making & Botanical Skincare',
      slug: 'cold-process-organic-soap-making-botanical-skincare',
      category: 'Handcrafted Cosmetics',
      categorySlug: 'soap-making',
      instructor: 'Priya Nair',
      description: 'Master cold-process soap formulation with natural oils, botanical infusions, and safe saponification ratios. From beginner safety to luxury swirl bars.',
      shortDescription: 'Master cold-process soap formulation with natural oils and botanicals.',
      imageUrl: 'https://images.unsplash.com/photo-1607006314164-946761596700?auto=format&fit=crop&q=80&w=1000',
      thumbnailUrl: 'https://images.unsplash.com/photo-1607006314164-946761596700?auto=format&fit=crop&q=80&w=1000',
      previewImage: 'https://images.unsplash.com/photo-1607006314164-946761596700?auto=format&fit=crop&q=80&w=1000',
      previewVideoUrl: 'https://www.youtube.com/embed/s3jE05Y_p0U',
      price: 2499,
      discountedPrice: 1999,
      discountPrice: 1999,
      level: 'BEGINNER',
      durationHours: 12,
      isPublished: true,
      studentsCount: 86,
      materialsKitTitle: 'Organic Cold-Process Soap Starter Kit',
      materialsKitDescription: 'Pure virgin coconut oil, olive pomace, raw shea butter, food-grade silicone loaf mold, certified lye crystals, and pure botanical essential oils.',
      materialsPartnerName: 'Botanical Craft Labs',
      materialsPartnerUrl: 'https://lemonhousecraft.in',
      materialsList: [
        { name: 'Pure Botanical Oils & Butters', description: 'Certified virgin coconut, olive pomace & raw unrefined shea butter', included: true },
        { name: 'Cosmetic Lye & Safety Gear', description: 'Pre-measured sodium hydroxide, chemical-splash goggles & nitrile gloves', included: true },
        { name: 'Silicone Loaf Mold & Steel Cutter', description: '1.2kg silicone loaf mold with hardwood support box & wavy blade', included: true },
        { name: 'Natural Clays & Essential Oils', description: 'French green clay, activated charcoal & pure French lavender oil', included: true }
      ],
      learningObjectives: [
        'Saponification chemistry, lye safety ratios & water-discount calculations',
        'Mastering light-to-thick trace emulsion and temperature control',
        'Creating natural botanical swirls, layers & herb embeds',
        'Unmolding, beveling, pH testing, 4-week curing & cosmetic labeling'
      ],
      curriculumModules: [
        {
          title: 'Module 1: Chemistry Foundations & Studio Safety',
          lessonsCount: 4,
          duration: '2h 30m',
          lessons: [
            { title: 'Understanding Lye Safety, PPE & Studio Setup', duration: '25:00' },
            { title: 'The Chemistry of Saponification & Fatty Acid Profiles', duration: '35:00' },
            { title: 'Formulating Balanced Lather vs Conditioning Recipes', duration: '40:00' },
            { title: 'Water Ratios & Temperature Control', duration: '30:00' }
          ]
        },
        {
          title: 'Module 2: Cold Process Studio Formulation & Pouring',
          lessonsCount: 8,
          duration: '5h 15m',
          lessons: [
            { title: 'Measuring & Melting Hard Oils with Precision', duration: '30:00' },
            { title: 'Mixing the Lye Solution Safely', duration: '20:00' },
            { title: 'Achieving Light Trace and Emulsification', duration: '45:00' },
            { title: 'Natural Botanical Clays & Essential Oil Infusions', duration: '50:00' }
          ]
        },
        {
          title: 'Module 3: Cutting, 4-Week Curing & Artisanal Packaging',
          lessonsCount: 6,
          duration: '3h 45m',
          lessons: [
            { title: 'Safe Unmolding Timing & Loaf Slicing Techniques', duration: '35:00' },
            { title: 'The Curing Process & pH Neutrality Verification', duration: '30:00' },
            { title: 'Eco-Friendly Paper Sleeves, Branding & Selling Guidelines', duration: '45:00' }
          ]
        }
      ],
      reviewsList: [
        {
          name: 'Ananya Rao',
          rating: 5,
          title: 'Foolproof guide to cold-process soap!',
          comment: 'The soap formulation guide and lye safety instructions made my very first batch foolproof! My lavender oat soap bars turned out silky smooth and lathered beautifully.',
          date: '1 week ago'
        },
        {
          name: 'Devendra K.',
          rating: 5,
          title: 'Zero fluff, practical artisan science',
          comment: 'Incredible masterclass. Explains trace, temperatures, and botanical infusions without fluff. Already selling custom batches to friends and family!',
          date: '3 weeks ago'
        }
      ]
    },
    {
      id: 'course-resin-geode',
      title: 'Resin Art & Geode Wall Clock Masterclass',
      slug: 'resin-art-geode-wall-clock-masterclass',
      category: 'Resin Crafts',
      categorySlug: 'resin-crafts',
      instructor: 'Manishi Nigam',
      description: 'Learn epoxy resin mixing ratios, bubble-free pouring, pigment swirls, crystal placements, and clock machine fittings to create luxury wall art.',
      shortDescription: 'Learn epoxy resin mixing, pigments, and crystal placement.',
      imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=1000',
      thumbnailUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=1000',
      previewImage: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=1000',
      previewVideoUrl: 'https://www.youtube.com/embed/dFzWtz4iLMc',
      price: 1999,
      discountedPrice: 299,
      discountPrice: 299,
      level: 'BEGINNER',
      durationHours: 10,
      isPublished: true,
      studentsCount: 142,
      materialsKitTitle: 'Geode Wall Clock Resin Starter Kit',
      materialsKitDescription: 'Ultra-clear 2:1 ratio epoxy resin, genuine crushed quartz crystals, metallic pigment powders, gold leaf foil, and a silent quartz clock movement with hands.',
      materialsPartnerName: 'Lemon House Craft Studios',
      materialsPartnerUrl: 'https://lemonhousecraft.in',
      materialsList: [
        { name: 'Ultra-Clear 2:1 Epoxy Resin & Hardener', description: 'Non-yellowing, bubble-release formulation with 45-min working time', included: true },
        { name: 'Raw Crushed Quartz & Fire Glass', description: 'Assorted clear and champagne sparkling quartz crystal stones', included: true },
        { name: 'Metallic Mica Powders & Gold Leaf', description: 'Deep ocean teal, emerald, rich gold & reflective leaf sheets', included: true },
        { name: 'Silent Clock Mechanism & Hands', description: 'High-torque sweep clock movement with gold hour, minute, and second hands', included: true }
      ],
      learningObjectives: [
        'Epoxy resin safety, precise mixing ratios & bubble elimination techniques',
        'Blending alcohol inks, mica powders & creating realistic stone veins',
        'Arranging crystal clusters and adhering 3D textures seamlessly',
        'Drilling, clock movement fitting & applying ultra-gloss clear topcoats'
      ],
      curriculumModules: [
        {
          title: 'Module 1: Resin Chemistry, Safety & Clock Substrate Prep',
          lessonsCount: 4,
          duration: '2h 00m',
          lessons: [
            { title: 'Epoxy Safety, Working Environments & PPE', duration: '20:00' },
            { title: 'Substrate Priming & Center Hole Positioning', duration: '30:00' },
            { title: 'Color Theory for Realistic Agate & Geode Slices', duration: '35:00' },
            { title: 'Resin Weighing Ratios & Stirring Mechanics', duration: '35:00' }
          ]
        },
        {
          title: 'Module 2: Pouring, Color Gradients & Crystal Placement',
          lessonsCount: 7,
          duration: '4h 30m',
          lessons: [
            { title: 'Dirty Pour vs Layered Flow Techniques', duration: '40:00' },
            { title: 'Creating Cell Lacing & Heat Gun Flow Control', duration: '45:00' },
            { title: 'Embedding Crushed Quartz & Glass Fractures', duration: '50:00' },
            { title: 'Detailing with Liquid Gold Pigment Pens', duration: '35:00' }
          ]
        },
        {
          title: 'Module 3: Flood Coating, Clock Assembly & Hanging Hardware',
          lessonsCount: 5,
          duration: '3h 30m',
          lessons: [
            { title: 'Bubble-Free Flood Coat for Mirror Glass Finish', duration: '40:00' },
            { title: 'Mounting Clock Movement & Alignment', duration: '35:00' },
            { title: 'Attaching Heavy-Duty Sawtooth Wall Mounts', duration: '30:00' }
          ]
        }
      ],
      reviewsList: [
        {
          name: 'Radhika Menon',
          rating: 5,
          title: 'Stunning geode clock outcome!',
          comment: 'Made a 16-inch geode clock for our living room and everyone thinks I bought it from a luxury boutique! The bubble removal and quartz placement instructions were so clear.',
          date: '2 weeks ago'
        },
        {
          name: 'Karan Verma',
          rating: 5,
          title: 'Crystal clear glass finish with zero stickiness',
          comment: 'The mixing ratio tips and heat gun cell techniques were game changers. Zero sticky residue, flawless crystal clear glass finish. Highly recommended!',
          date: '1 month ago'
        }
      ]
    },
    {
      id: 'lippan-art',
      title: 'The Art of Lippan: Traditional Mud & Mirror Work',
      slug: 'lippan-art',
      category: 'Lippan Art',
      categorySlug: 'lippan-art',
      instructor: 'Shivani',
      description: 'Master the ancient Gujarati art form of Lippan Kaam. Create stunning, intricate murals using modern clay and mirrors while preserving traditional cultural motifs.',
      shortDescription: 'Master the ancient Gujarati art form of Lippan Kaam.',
      imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=1000',
      thumbnailUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=1000',
      previewImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=1000',
      previewVideoUrl: 'https://www.youtube.com/embed/fD3QzJq5b8E',
      price: 2499,
      discountedPrice: 1499,
      discountPrice: 1499,
      level: 'BEGINNER',
      durationHours: 15,
      isPublished: true,
      studentsCount: 210,
      materialsKitTitle: 'Authentic Lippan Kaam DIY Craft Kit',
      materialsKitDescription: 'Engineered laser-cut MDF wooden base, assorted precision cut mirrors (round, diamond, teardrop), clay moulding paste, and acrylic chalk paint.',
      materialsPartnerName: 'Lemon House Craft',
      materialsPartnerUrl: 'https://lemonhousecraft.in',
      materialsList: [
        { name: '12x12 Engineered MDF Base Board', description: 'Laser-cut, smooth pre-primed wood panel ready for clay bonding', included: true },
        { name: 'Assorted Precision Glass Mirrors', description: 'Diamond, teardrop, round and eye shape reflection pieces (300+ pcs)', included: true },
        { name: 'Smooth Clay Dough & Adhesive Paste', description: 'Non-cracking, flexible modelling compound designed for relief work', included: true },
        { name: 'Carving Tools & Acrylic Chalk Finish', description: 'Detail sculpting tools, chalk white base paint & moisture seal spray', included: true }
      ],
      learningObjectives: [
        'Origins of Kutch mud-mirror craft and modern dough formulation',
        'Rolling consistent clay coils, borders and sculpted relief petals',
        'Symmetrical sacred geometry grid planning and mirror affixing',
        'Chalk paint finishing, antiquing washes & long-lasting waterproof sealing'
      ],
      curriculumModules: [
        {
          title: 'Module 1: History, Tooling & Geometry Foundations',
          lessonsCount: 4,
          duration: '2h 15m',
          lessons: [
            { title: 'The Cultural Roots of Lippan Kaam in Kutch', duration: '20:00' },
            { title: 'Preparing the MDF Base and Radial Grid Layout', duration: '35:00' },
            { title: 'Formulating Crack-Resistant Sculpting Dough', duration: '40:00' }
          ]
        },
        {
          title: 'Module 2: Clay Coiling, Relief Sculpting & Mirror Mosaic',
          lessonsCount: 8,
          duration: '5h 30m',
          lessons: [
            { title: 'Rolling Perfect Uniform Clay Coils', duration: '35:00' },
            { title: 'Creating Borders, Floral Medallions & Peacock Motifs', duration: '50:00' },
            { title: 'Precision Mirror Insertion & Spacing Alignment', duration: '45:00' }
          ]
        },
        {
          title: 'Module 3: Textured Color Finishes, Waterproof Sealing & Framing',
          lessonsCount: 8,
          duration: '4h 15m',
          lessons: [
            { title: 'Applying Traditional Chalk White Base Coats', duration: '35:00' },
            { title: 'Subtle Antiquing Washes & Accent Pigments', duration: '40:00' },
            { title: 'Protective Matte Sealer Application & Wall Mounting', duration: '30:00' }
          ]
        }
      ],
      reviewsList: [
        {
          name: 'Pooja Patel',
          rating: 5,
          title: 'Brilliant step-by-step masterclass!',
          comment: 'The instructor explained the mirror placement geometry and clay preparation so clearly. My final Lippan frame came out stunning and holds pride of place in my home!',
          date: '2 weeks ago'
        },
        {
          name: 'Rohit Mehra',
          rating: 5,
          title: 'High quality tutorials and materials guide',
          comment: 'Got the exact materials from lemonhousecraft.in and followed every lesson. The certification and technique guidance was top tier. Highly recommend!',
          date: '1 month ago'
        }
      ]
    }
  ];

  constructor(private http: HttpClient) {}

  // --- DELETED COURSES PERSISTENCE HELPERS ---
  public getDeletedCourseKeys(): string[] {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(localStorage.getItem('lemon_deleted_courses') || '[]');
    } catch {
      return [];
    }
  }

  public isCourseDeleted(c: { id?: string; slug?: string; title?: string } | null | undefined): boolean {
    if (!c) return false;
    const deleted = this.getDeletedCourseKeys();
    if (!deleted || deleted.length === 0) return false;

    const norm = (s?: string) => (s || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '');
    const cId = norm(c.id);
    const cSlug = norm(c.slug);
    const cTitle = norm(c.title);

    return deleted.some(del => {
      const dNorm = norm(del);
      if (!dNorm) return false;
      return (cId && cId === dNorm) || 
             (cSlug && cSlug === dNorm) || 
             (cTitle && cTitle === dNorm);
    });
  }

  public recordCourseDeleted(id: string, info?: { slug?: string; title?: string }): void {
    if (typeof window === 'undefined') return;
    try {
      const deleted = this.getDeletedCourseKeys();
      const toAdd: string[] = [id];
      if (info?.slug) toAdd.push(info.slug);
      if (info?.title) toAdd.push(info.title);

      // Check default courses to also add their identifiers so they won't resurface
      const defMatch = this.defaultCourses.find(d => 
        d.id === id || 
        d.slug === id || 
        (info?.slug && d.slug === info.slug) ||
        (info?.title && d.title?.toLowerCase() === info.title?.toLowerCase())
      );
      if (defMatch) {
        if (defMatch.id) toAdd.push(defMatch.id);
        if (defMatch.slug) toAdd.push(defMatch.slug);
        if (defMatch.title) toAdd.push(defMatch.title);
      }

      // Check local storage overrides and purge matching entries
      const keys = Object.keys(localStorage).filter(k => k.startsWith('course_override_'));
      for (const k of keys) {
        try {
          const item = JSON.parse(localStorage.getItem(k) || '{}');
          if (item.id === id || (info?.slug && item.slug === info.slug) || (info?.title && item.title === info.title)) {
            localStorage.removeItem(k);
            if (item.id) toAdd.push(item.id);
            if (item.slug) toAdd.push(item.slug);
            if (item.title) toAdd.push(item.title);
          }
        } catch {}
      }

      toAdd.forEach(item => {
        if (item && !deleted.includes(item)) {
          deleted.push(item);
        }
      });

      localStorage.setItem('lemon_deleted_courses', JSON.stringify(deleted));
      localStorage.removeItem(`course_override_${id}`);
      localStorage.removeItem(`course_modules_${id}`);
    } catch (e) {
      console.error('Error recording deleted course:', e);
    }
  }

  public clearDeletedCourse(idOrSlugOrTitle: string): void {
    if (typeof window === 'undefined' || !idOrSlugOrTitle) return;
    try {
      const deleted = this.getDeletedCourseKeys();
      const norm = (s?: string) => (s || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '');
      const target = norm(idOrSlugOrTitle);
      const filtered = deleted.filter(d => norm(d) !== target);
      localStorage.setItem('lemon_deleted_courses', JSON.stringify(filtered));
    } catch {}
  }

  public restoreDefaultCourses(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem('lemon_deleted_courses');
      window.dispatchEvent(new Event('courses_updated'));
    } catch {}
  }

  /** Merge any locally created or updated courses from localStorage and defaults */
  public mergeLocalCourses(mappedList: Course[]): Course[] {
    // 0. Exclude any courses that were marked as deleted
    let list = mappedList.filter(c => !this.isCourseDeleted(c));

    // 1. Merge default courses if not present AND not deleted
    for (const def of this.defaultCourses) {
      if (this.isCourseDeleted(def)) {
        continue;
      }
      const exists = list.some((c: any) =>
        (def.id && c.id === def.id) ||
        (def.slug && c.slug === def.slug) ||
        (def.title && c.title?.toLowerCase() === def.title?.toLowerCase())
      );
      if (!exists) {
        list.push(def);
      }
    }

    // 2. Merge local storage courses created / edited in Admin Panel
    if (typeof window !== 'undefined') {
      try {
        const localKeys = Object.keys(localStorage).filter(k => k.startsWith('course_override_'));
        localKeys.forEach(k => {
          const item = JSON.parse(localStorage.getItem(k) || '{}');
          if (item && (item.id || item.title)) {
            if (this.isCourseDeleted(item)) {
              return;
            }
            const existingIdx = list.findIndex((c: any) => 
              (item.id && c.id === item.id) || 
              (item.slug && c.slug === item.slug) || 
              (item.title && c.title?.toLowerCase() === item.title?.toLowerCase())
            );
            if (existingIdx >= 0) {
              list[existingIdx] = this.mapCourse({ ...list[existingIdx], ...item });
            } else {
              list.unshift(this.mapCourse(item));
            }
          }
        });
      } catch {}
    }
    return list.filter(c => !this.isCourseDeleted(c));
  }


  public clearCatalogCache(): void {
    this.catalogCache.clear();
  }

  /** GET /api/v1/courses — Get paginated courses list with pagination metadata (merged with local updates and cached for instant first paint) */
  getCoursesPaginated(params?: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    level?: string;
    isPublished?: boolean;
  }): Observable<{
    courses: Course[];
    pagination: { page: number; limit: number; total: number; totalPages: number; hasMore?: boolean };
  }> {
    const cacheKey = JSON.stringify(params || {});
    const cached = this.catalogCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp < this.CACHE_TTL_MS)) {
      return of(cached.data);
    }

    let httpParams = new HttpParams();
    const page = params?.page || 1;
    const limit = params?.limit || 5;
    httpParams = httpParams.set('page', String(page));
    httpParams = httpParams.set('limit', String(limit));
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.categoryId) httpParams = httpParams.set('categoryId', params.categoryId);
    if (params?.level) httpParams = httpParams.set('level', params.level);

    return this.http.get<any>(this.apiUrl, { params: httpParams }).pipe(
      map(json => {
        const raw = json.data || json;
        const apiList = Array.isArray(raw) ? raw : (raw.courses || []);
        const mappedList = apiList.map((c: any) => this.mapCourse(c));

        // Merge locally created and updated courses so newly created courses are immediately visible to students
        const mergedList = this.mergeLocalCourses(mappedList);

        // Filter: for students, only show published courses by default
        let filtered = mergedList;
        if (params?.isPublished !== undefined) {
          filtered = filtered.filter(c => c.isPublished === params.isPublished);
        } else {
          filtered = filtered.filter(c => c.isPublished !== false);
        }

        if (params?.search) {
          const q = params.search.toLowerCase().trim();
          filtered = filtered.filter(c => 
            c.title?.toLowerCase().includes(q) || 
            c.category?.toLowerCase().includes(q) || 
            c.instructor?.toLowerCase().includes(q) ||
            c.description?.toLowerCase().includes(q)
          );
        }

        if (params?.categoryId) {
          const cat = params.categoryId.toLowerCase().trim();
          filtered = filtered.filter(c => 
            (c.categoryId && c.categoryId.toLowerCase() === cat) || 
            (c.categorySlug && c.categorySlug.toLowerCase() === cat) ||
            (c.category && c.category.toLowerCase().replace(/[^a-z0-9]+/g, '-') === cat) ||
            (c.category && c.category.toLowerCase() === cat)
          );
        }

        if (params?.level) {
          const lvl = params.level.toUpperCase().trim();
          filtered = filtered.filter(c => c.level?.toUpperCase() === lvl);
        }

        const total = filtered.length;
        const totalPages = Math.max(1, Math.ceil(total / limit));
        const startIndex = (page - 1) * limit;
        const paginatedSlice = filtered.slice(startIndex, startIndex + limit);

        const result = {
          courses: paginatedSlice,
          pagination: {
            page,
            limit,
            total,
            totalPages,
            hasMore: page < totalPages
          }
        };

        this.catalogCache.set(cacheKey, { data: result, timestamp: Date.now() });
        return result;
      }),
      catchError(() => {
        const localList = this.mergeLocalCourses([]);
        let filtered = localList;
        if (params?.isPublished !== undefined) {
          filtered = filtered.filter(c => c.isPublished === params.isPublished);
        } else {
          filtered = filtered.filter(c => c.isPublished !== false);
        }

        if (params?.search) {
          const q = params.search.toLowerCase().trim();
          filtered = filtered.filter(c => 
            c.title?.toLowerCase().includes(q) || 
            c.category?.toLowerCase().includes(q) || 
            c.instructor?.toLowerCase().includes(q) ||
            c.description?.toLowerCase().includes(q)
          );
        }

        if (params?.categoryId) {
          const cat = params.categoryId.toLowerCase().trim();
          filtered = filtered.filter(c => 
            (c.categoryId && c.categoryId.toLowerCase() === cat) || 
            (c.categorySlug && c.categorySlug.toLowerCase() === cat) ||
            (c.category && c.category.toLowerCase().replace(/[^a-z0-9]+/g, '-') === cat) ||
            (c.category && c.category.toLowerCase() === cat)
          );
        }

        if (params?.level) {
          const lvl = params.level.toUpperCase().trim();
          filtered = filtered.filter(c => c.level?.toUpperCase() === lvl);
        }

        const total = filtered.length;
        const totalPages = Math.max(1, Math.ceil(total / limit));
        const startIndex = (page - 1) * limit;
        const paginatedSlice = filtered.slice(startIndex, startIndex + limit);

        return of({
          courses: paginatedSlice,
          pagination: {
            page,
            limit,
            total,
            totalPages,
            hasMore: page < totalPages
          }
        });
      })
    );
  }

  /** GET /api/v1/courses — List published courses with filters & pagination */
  getCourses(params?: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    level?: string;
    isPublished?: boolean;
  }): Observable<Course[]> {
    let httpParams = new HttpParams();
    if (params) {
      if (params.page) httpParams = httpParams.set('page', String(params.page));
      if (params.limit) httpParams = httpParams.set('limit', String(params.limit));
      if (params.search) httpParams = httpParams.set('search', params.search);
      if (params.categoryId) httpParams = httpParams.set('categoryId', params.categoryId);
      if (params.level) httpParams = httpParams.set('level', params.level);
      if (params.isPublished !== undefined) httpParams = httpParams.set('isPublished', String(params.isPublished));
    }

    return this.http.get<any>(this.apiUrl, { params: httpParams }).pipe(
      map(json => {
        const raw = json.data || json;
        const list = Array.isArray(raw) ? raw : (raw.courses || []);
        const mappedList = list.map((c: any) => this.mapCourse(c));
        return this.mergeLocalCourses(mappedList);
      }),
      catchError(() => {
        return of(this.mergeLocalCourses([]));
      })
    );
  }

  /** GET /api/v1/courses/:id — Get course details by ID or slug */
  getCourse(id: string): Observable<Course | null> {
    if (this.isCourseDeleted({ id, slug: id })) {
      return of(null);
    }

    // 1. Search ALL local overrides by id OR slug (handles course-{timestamp} IDs)
    const localById = this.getLocalCourseOverride(id);
    let localBySlug: any = null;
    if (typeof window !== 'undefined') {
      try {
        const keys = Object.keys(localStorage).filter(k => k.startsWith('course_override_'));
        for (const k of keys) {
          const item = JSON.parse(localStorage.getItem(k) || '{}');
          if (item && (item.slug === id || item.id === id)) {
            localBySlug = item;
            break;
          }
        }
      } catch {}
    }

    // 2. Also check default courses list
    const defaultMatch = this.defaultCourses.find(c => c.id === id || c.slug === id) || null;

    const localFallback = localById || localBySlug || defaultMatch || null;
    if (localFallback && this.isCourseDeleted(localFallback)) {
      return of(null);
    }

    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(res => {
        const data = res.data || res;
        if (data && (data.id || data._id)) {
          const mapped = this.mapCourse(data);
          return this.isCourseDeleted(mapped) ? null : mapped;
        }
        return localFallback ? this.mapCourse(localFallback) : null;
      }),
      catchError(() => {
        // If the id looks like a slug (no UUID format), try the slug endpoint
        if (localFallback) {
          return of(this.mapCourse(localFallback));
        }
        const isLikelySlug = !id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
        if (isLikelySlug) {
          return this.getCourseBySlug(id);
        }
        return of(null);
      })
    );
  }

  /** GET /api/v1/courses/slug/:slug — Get course details by URL slug */
  getCourseBySlug(slug: string): Observable<Course | null> {
    if (this.isCourseDeleted({ slug, id: slug })) {
      return of(null);
    }

    let localFound: any = null;
    if (typeof window !== 'undefined') {
      try {
        const localKeys = Object.keys(localStorage).filter(k => k.startsWith('course_override_'));
        for (const k of localKeys) {
          const item = JSON.parse(localStorage.getItem(k) || '{}');
          if (item.slug === slug || item.id === slug) {
            localFound = item;
            break;
          }
        }
      } catch {}
    }

    if (localFound && this.isCourseDeleted(localFound)) {
      localFound = null;
    }

    return this.http.get<any>(`${this.apiUrl}/slug/${slug}`).pipe(
      map(res => {
        const data = res.data || res;
        if (data && (data.id || data._id)) {
          const mapped = this.mapCourse(data);
          return this.isCourseDeleted(mapped) ? null : mapped;
        }
        return localFound ? this.mapCourse(localFound) : null;
      }),
      catchError(() => of(localFound ? this.mapCourse(localFound) : null))
    );
  }

  /** POST /api/v1/courses — Create a new course (Trainer / Admin) */
  createCourse(payload: CreateCoursePayload): Observable<any> {
    if (payload.title) this.clearDeletedCourse(payload.title);
    if (payload.slug) this.clearDeletedCourse(payload.slug);
    const formattedPayload: any = {
      title: payload.title,
      slug: payload.slug || payload.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description: payload.description || payload.shortDescription || `${payload.title} masterclass`,
      shortDescription: payload.shortDescription || payload.description?.slice(0, 120) || `${payload.title} masterclass`,
      price: Number(payload.price) || 99,
      discountPrice: payload.discountPrice !== undefined ? Number(payload.discountPrice) : Number(payload.discountedPrice || payload.price || 99),
      discountedPrice: payload.discountPrice !== undefined ? Number(payload.discountPrice) : Number(payload.discountedPrice || payload.price || 99),
      level: payload.level || 'BEGINNER',
      durationHours: Number(payload.durationHours) || 10,
      thumbnailUrl: payload.thumbnailUrl || payload.imageUrl || 'https://images.unsplash.com/photo-1584992236310-6edddc08acff',
      imageUrl: payload.imageUrl || payload.thumbnailUrl || 'https://images.unsplash.com/photo-1584992236310-6edddc08acff',
      previewVideoUrl: payload.previewVideoUrl || null,
      liveClassLink: payload.liveClassLink || null,
      liveScheduleText: payload.liveScheduleText || null,
      youtubePlaylistUrl: payload.youtubePlaylistUrl || null,
      startDate: payload.startDate || null,
      endDate: payload.endDate || null,
      isPublished: payload.isPublished ?? true
    };

    if (payload.categoryId) formattedPayload.categoryId = payload.categoryId;
    if (payload.category) formattedPayload.category = payload.category;
    if (payload.trainerId && payload.trainerId.length > 10) formattedPayload.trainerId = payload.trainerId;
    if (payload.trainer) formattedPayload.trainer = payload.trainer;
    if (payload.instructor) formattedPayload.instructor = payload.instructor;

    return this.http.post<any>(this.apiUrl, formattedPayload).pipe(
      map(res => {
        const created = res.data || res;
        const id = created?.id || created?._id || 'course-' + Date.now();
        this.saveLocalCourseOverride(id, { ...formattedPayload, id });
        return created;
      }),
      catchError((err) => {
        const fakeId = 'course-' + Date.now();
        const localCourse = {
          id: fakeId,
          ...formattedPayload,
          studentsCount: 0,
          createdAt: new Date().toISOString()
        };
        this.saveLocalCourseOverride(fakeId, localCourse);
        return of({ success: true, data: localCourse, message: 'Saved locally' });
      })
    );
  }

  /** PUT /api/v1/courses/:id — Update course details (Trainer / Admin) */
  updateCourse(id: string, payload: UpdateCoursePayload): Observable<any> {
    this.saveLocalCourseOverride(id, payload);

    return this.http.put<any>(`${this.apiUrl}/${id}`, payload).pipe(
      map(res => {
        window.dispatchEvent(new Event('courses_updated'));
        return res.data || res;
      }),
      catchError(() => {
        window.dispatchEvent(new Event('courses_updated'));
        return of({ success: true, message: 'Updated locally' });
      })
    );
  }

  /** DELETE /api/v1/courses/:id — Delete course (Trainer / Admin) */
  deleteCourse(id: string, info?: { slug?: string; title?: string }): Observable<any> {
    this.recordCourseDeleted(id, info);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`course_override_${id}`);
      localStorage.removeItem(`course_modules_${id}`);
      window.dispatchEvent(new Event('courses_updated'));
    }
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      map(res => {
        window.dispatchEvent(new Event('courses_updated'));
        return res.data || res;
      }),
      catchError(() => {
        window.dispatchEvent(new Event('courses_updated'));
        return of({ success: true, message: 'Deleted successfully' });
      })
    );
  }

  /** PATCH /api/v1/courses/:id/publish — Toggle course published state */
  togglePublishCourse(id: string): Observable<any> {
    const existing = this.getLocalCourseOverride(id);
    if (existing) {
      this.saveLocalCourseOverride(id, { ...existing, isPublished: !existing.isPublished });
    }
    return this.http.patch<any>(`${this.apiUrl}/${id}/publish`, {}).pipe(
      map(res => {
        window.dispatchEvent(new Event('courses_updated'));
        return res.data || res;
      }),
      catchError(() => {
        window.dispatchEvent(new Event('courses_updated'));
        return of({ success: true, message: 'Toggled locally' });
      })
    );
  }

  /** GET /api/v1/courses/:courseId/enrollment-status — Check if student is enrolled */
  getCourseEnrollmentStatus(courseId: string): Observable<{ enrolled: boolean; enrollment?: any }> {
    return this.http.get<any>(`${this.apiUrl}/${courseId}/enrollment-status`).pipe(
      map(res => res.data || res || { enrolled: false }),
      catchError(() => of({ enrolled: false }))
    );
  }

  /** GET /api/v1/courses/:courseId/progress — Get student completion progress */
  getCourseProgress(courseId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${courseId}/progress`).pipe(
      map(res => res.data || res || null),
      catchError(() => of(null))
    );
  }

  /** GET /api/v1/courses/:id/content — Get full protected classroom curriculum */
  getCourseContent(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/content`).pipe(
      map(res => res.data || res),
      catchError(() => of(null))
    );
  }

  /** GET /api/v1/courses/:id/full — Alias for full content */
  getCourseFull(id: string): Observable<any> {
    return this.getCourseContent(id);
  }

  // --- SUB-RESOURCES ---

  /** GET /api/v1/courses/:courseId/modules */
  getModules(courseId: string): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/${courseId}/modules`).pipe(
      map(res => res.data || res || []),
      catchError(() => of([]))
    );
  }

  /** POST /api/v1/courses/:courseId/modules */
  createModule(courseId: string, payload: { title: string; sortOrder?: number }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${courseId}/modules`, payload);
  }

  /** GET /api/v1/courses/:courseId/procedures */
  getProcedures(courseId: string): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/${courseId}/procedures`).pipe(
      map(res => res.data || res || []),
      catchError(() => of([]))
    );
  }

  /** POST /api/v1/courses/:courseId/procedures */
  addProcedure(courseId: string, payload: { stepNumber: number; title: string; instructions: string; imageUrl?: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${courseId}/procedures`, payload);
  }

  /** GET /api/v1/courses/:courseId/resources */
  getResources(courseId: string): Observable<CourseResource[]> {
    return this.http.get<any>(`${this.apiUrl}/${courseId}/resources`).pipe(
      map(res => res.data || res || []),
      catchError(() => of([]))
    );
  }

  /** POST /api/v1/courses/:courseId/resources */
  addResource(courseId: string, resource: CreateResourcePayload): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${courseId}/resources`, resource);
  }

  /** PUT /api/v1/courses/:courseId/resources/:resourceId */
  updateResource(courseId: string, resourceId: string, payload: UpdateResourcePayload): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${courseId}/resources/${resourceId}`, payload);
  }

  /** DELETE /api/v1/courses/:courseId/resources/:resourceId */
  deleteResource(courseId: string, resourceId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${courseId}/resources/${resourceId}`);
  }

  /** GET /api/v1/courses/:courseId/guidance */
  getGuidance(courseId: string): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/${courseId}/guidance`).pipe(
      map(res => res.data || res || []),
      catchError(() => of([]))
    );
  }

  /** POST /api/v1/courses/:courseId/guidance */
  addGuidance(courseId: string, payload: { title: string; content: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${courseId}/guidance`, payload);
  }

  // --- TRAINER REQUEST SHORTCUT ---
  applyTrainer(data: any): Observable<any> {
    const payload = {
      name: data.name || data.fullName,
      email: data.email,
      phone: data.phone || '+910000000000',
      course: data.course || data.expertise || 'Artisan Craft',
      experience: String(data.experience || '1'),
      runningDates: data.runningDates || 'Flexible Schedule',
      bio: data.bio || `Trainer application for ${data.course || 'Craft'}`
    };
    return this.http.post(`${environment.apiUrl}/trainer-requests`, payload);
  }

  // --- PERSISTENCE OVERRIDES HELPER ---
  public saveLocalCourseOverride(id: string, updates: any): void {
    if (typeof window === 'undefined' || !id) return;
    try {
      this.clearDeletedCourse(id);
      if (updates?.slug) this.clearDeletedCourse(updates.slug);
      if (updates?.title) this.clearDeletedCourse(updates.title);
      const existing = localStorage.getItem(`course_override_${id}`);
      const parsed = existing ? JSON.parse(existing) : {};
      const merged = { ...parsed, ...updates, updatedAt: new Date().toISOString() };
      localStorage.setItem(`course_override_${id}`, JSON.stringify(merged));
      window.dispatchEvent(new Event('courses_updated'));
    } catch {}
  }

  private getLocalCourseOverride(id: string): any {
    if (typeof window === 'undefined' || !id) return null;
    try {
      const stored = localStorage.getItem(`course_override_${id}`);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  // --- HELPER MAPPER ---
  public mapCourse(c: any): Course {
    const id = c.id || c._id || '';
    const override = this.getLocalCourseOverride(id);

    const merged = { ...c, ...(override || {}) };

    const trainerName = merged.trainer?.user?.name || merged.trainer?.name || merged.instructor || (typeof merged.trainer === 'string' ? merged.trainer : 'Artisan Master');
    const priceVal = Number(merged.price) || 0;
    const discountVal = merged.discountPrice !== undefined ? Number(merged.discountPrice) : (merged.discountedPrice !== undefined ? Number(merged.discountedPrice) : priceVal);
    const enrolled = merged._count?.enrollments || merged.studentsCount || merged.enrolledStudents || 0;

    const rawCat = merged.category?.name || merged.category || 'Artisan Craft';
    const catSlug = (merged.categorySlug || merged.category?.slug || rawCat).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');

    // 1. Enforce category-validated preview image (resolves yarn-on-soap data leak)
    let categoryImg = CATEGORY_IMAGE_DEFAULTS[catSlug];
    if (!categoryImg) {
      if (catSlug.includes('soap') || catSlug.includes('cosmetic')) categoryImg = CATEGORY_IMAGE_DEFAULTS['soap-making'];
      else if (catSlug.includes('resin')) categoryImg = CATEGORY_IMAGE_DEFAULTS['resin-crafts'];
      else if (catSlug.includes('lippan') || catSlug.includes('mud')) categoryImg = CATEGORY_IMAGE_DEFAULTS['lippan-art'];
      else if (catSlug.includes('candle') || catSlug.includes('wax')) categoryImg = CATEGORY_IMAGE_DEFAULTS['candle-making'];
      else if (catSlug.includes('pottery') || catSlug.includes('ceramic')) categoryImg = CATEGORY_IMAGE_DEFAULTS['pottery'];
      else if (catSlug.includes('mosaic')) categoryImg = CATEGORY_IMAGE_DEFAULTS['mosaic-art'];
      else if (catSlug.includes('crochet') || catSlug.includes('fiber')) categoryImg = CATEGORY_IMAGE_DEFAULTS['crochet-fiber-arts'];
      else categoryImg = 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=1000';
    }

    let finalImageUrl = merged.previewImage || merged.imageUrl || merged.thumbnailUrl || merged.image || '';
    if (!finalImageUrl || (!catSlug.includes('crochet') && finalImageUrl.includes('photo-1584992236310-6edddc08acff'))) {
      finalImageUrl = categoryImg;
    }

    // 2. Enforce preview video URL
    let finalVideoUrl = merged.previewVideoUrl || '';
    if (!finalVideoUrl) {
      if (catSlug.includes('soap')) finalVideoUrl = 'https://www.youtube.com/embed/s3jE05Y_p0U';
      else if (catSlug.includes('resin')) finalVideoUrl = 'https://www.youtube.com/embed/dFzWtz4iLMc';
      else if (catSlug.includes('lippan')) finalVideoUrl = 'https://www.youtube.com/embed/fD3QzJq5b8E';
      else if (catSlug.includes('candle')) finalVideoUrl = 'https://www.youtube.com/embed/7Vn9rP7W1R4';
      else if (catSlug.includes('pottery')) finalVideoUrl = 'https://www.youtube.com/embed/v9Y7gq6pD_s';
      else if (catSlug.includes('mosaic')) finalVideoUrl = 'https://www.youtube.com/embed/4yV7kH3qJxE';
      else finalVideoUrl = 'https://www.youtube.com/embed/fD3QzJq5b8E';
    }

    // 3. Category-tailored Materials Kit (never fall back to Lippan on soap/resin)
    let kitTitle = merged.materialsKitTitle;
    let kitDesc = merged.materialsKitDescription;
    let materialsList = merged.materialsList;
    let learningObjectives = merged.learningObjectives;
    let curriculumModules = merged.curriculumModules;
    let reviewsList = merged.reviewsList;

    if (!materialsList || materialsList.length === 0) {
      if (catSlug.includes('soap')) {
        kitTitle = kitTitle || 'Organic Cold-Process Soap Starter Kit';
        kitDesc = kitDesc || 'Virgin coconut & olive oils, unrefined shea butter, silicone loaf mold, certified lye crystals, and pure botanical essential oils.';
        materialsList = [
          { name: 'Pure Botanical Oils & Butters', description: 'Certified virgin coconut, olive pomace & raw unrefined shea butter', included: true },
          { name: 'Cosmetic Lye & Safety Gear', description: 'Pre-measured sodium hydroxide, chemical-splash goggles & nitrile gloves', included: true },
          { name: 'Silicone Loaf Mold & Steel Cutter', description: '1.2kg silicone loaf mold with hardwood support box & wavy blade', included: true },
          { name: 'Natural Clays & Essential Oils', description: 'French green clay, activated charcoal & pure French lavender oil', included: true }
        ];
      } else if (catSlug.includes('resin')) {
        kitTitle = kitTitle || 'Geode Wall Clock Resin Starter Kit';
        kitDesc = kitDesc || 'Ultra-clear 2:1 ratio epoxy resin, genuine crushed quartz crystals, metallic pigment powders, gold leaf foil, and a silent quartz clock movement with hands.';
        materialsList = [
          { name: 'Ultra-Clear 2:1 Epoxy Resin & Hardener', description: 'Non-yellowing, bubble-release formulation with 45-min working time', included: true },
          { name: 'Raw Crushed Quartz & Fire Glass', description: 'Assorted clear and champagne sparkling quartz crystal stones', included: true },
          { name: 'Metallic Mica Powders & Gold Leaf', description: 'Deep ocean teal, emerald, rich gold & reflective leaf sheets', included: true },
          { name: 'Silent Clock Mechanism & Hands', description: 'High-torque sweep clock movement with gold hour, minute, and second hands', included: true }
        ];
      } else if (catSlug.includes('candle')) {
        kitTitle = kitTitle || 'Hand-Poured Botanical Candle Kit';
        kitDesc = kitDesc || 'Golden soy wax flakes, cotton braided wicks, amber glass jars, premium therapeutic fragrances, and a wax melting pitcher.';
        materialsList = [
          { name: '100% Pure Golden Soy Wax Flakes', description: 'Clean burning, natural soy wax with smooth tops', included: true },
          { name: 'Lead-Free Braided Cotton Wicks', description: 'Pre-waxed wicks with metal sustainers & wick centering tools', included: true },
          { name: 'Therapeutic Fragrance Oils', description: 'Phthalate-free lavender, vanilla amber & cedarwood oils', included: true },
          { name: 'Amber Glass Vessels & Metal Lids', description: 'Heat-resistant 200ml jars with airtight wooden lids', included: true }
        ];
      } else {
        kitTitle = kitTitle || 'Authentic Lippan Kaam DIY Craft Kit';
        kitDesc = kitDesc || 'Engineered laser-cut MDF wooden base, assorted precision cut mirrors, clay moulding paste, and acrylic chalk paint.';
        materialsList = [
          { name: '12x12 Engineered MDF Base Board', description: 'Laser-cut, smooth pre-primed wood panel ready for clay bonding', included: true },
          { name: 'Assorted Precision Glass Mirrors', description: 'Diamond, teardrop, round and eye shape reflection pieces (300+ pcs)', included: true },
          { name: 'Smooth Clay Dough & Adhesive Paste', description: 'Non-cracking, flexible modelling compound designed for relief work', included: true },
          { name: 'Carving Tools & Acrylic Chalk Finish', description: 'Detail sculpting tools, chalk white base paint & moisture seal spray', included: true }
        ];
      }
    }

    if (!learningObjectives || learningObjectives.length === 0) {
      if (catSlug.includes('soap')) {
        learningObjectives = [
          'Saponification chemistry, lye safety ratios & water-discount calculations',
          'Mastering light-to-thick trace emulsion and temperature control',
          'Creating natural botanical swirls, layers & herb embeds',
          'Unmolding, beveling, pH testing, 4-week curing & cosmetic labeling'
        ];
      } else if (catSlug.includes('resin')) {
        learningObjectives = [
          'Epoxy resin safety, precise mixing ratios & bubble elimination techniques',
          'Blending alcohol inks, mica powders & creating realistic stone veins',
          'Arranging crystal clusters and adhering 3D textures seamlessly',
          'Drilling, clock movement fitting & applying ultra-gloss clear topcoats'
        ];
      } else {
        learningObjectives = [
          'Foundations of craft studio setup, material safety & surface preparation',
          'Hands-on artisan techniques, tool handling & step-by-step composition',
          'Advanced texturing, pigmentation, layering & color gradients',
          'Sealing, durability protection & packaging for commercial markets'
        ];
      }
    }

    if (!reviewsList || reviewsList.length === 0) {
      if (catSlug.includes('soap')) {
        reviewsList = [
          {
            name: 'Ananya Rao',
            rating: 5,
            title: 'Foolproof guide to cold-process soap!',
            comment: 'The soap formulation guide and lye safety instructions made my very first batch foolproof! My lavender oat soap bars turned out silky smooth and lathered beautifully.',
            date: '1 week ago'
          },
          {
            name: 'Devendra K.',
            rating: 5,
            title: 'Zero fluff, practical artisan science',
            comment: 'Incredible masterclass. Explains trace, temperatures, and botanical infusions without fluff. Already selling custom batches to friends and family!',
            date: '3 weeks ago'
          }
        ];
      } else if (catSlug.includes('resin')) {
        reviewsList = [
          {
            name: 'Radhika Menon',
            rating: 5,
            title: 'Stunning geode clock outcome!',
            comment: 'Made a 16-inch geode clock for our living room and everyone thinks I bought it from a luxury boutique! The bubble removal and quartz placement instructions were so clear.',
            date: '2 weeks ago'
          },
          {
            name: 'Karan Verma',
            rating: 5,
            title: 'Crystal clear glass finish with zero stickiness',
            comment: 'The mixing ratio tips and heat gun cell techniques were game changers. Zero sticky residue, flawless crystal clear glass finish. Highly recommended!',
            date: '1 month ago'
          }
        ];
      } else {
        reviewsList = [
          {
            name: 'Pooja Patel',
            rating: 5,
            title: 'Brilliant step-by-step masterclass!',
            comment: 'The instructor explained the mirror placement geometry and clay preparation so clearly. My final Lippan frame came out stunning and holds pride of place in my home!',
            date: '2 weeks ago'
          },
          {
            name: 'Rohit Mehra',
            rating: 5,
            title: 'High quality tutorials and materials guide',
            comment: 'Got the exact materials from lemonhousecraft.in and followed every lesson. The certification and technique guidance was top tier. Highly recommend!',
            date: '1 month ago'
          }
        ];
      }
    }

    return {
      id: id,
      title: merged.title || merged.name || 'Untitled Course',
      slug: merged.slug || '',
      category: rawCat,
      categorySlug: catSlug,
      categoryId: merged.category?.id || merged.categoryId || '',
      instructor: trainerName,
      trainer: merged.trainer,
      description: merged.description || merged.shortDescription || '',
      shortDescription: merged.shortDescription || '',
      imageUrl: finalImageUrl,
      thumbnailUrl: finalImageUrl,
      previewImage: finalImageUrl,
      previewVideoUrl: finalVideoUrl,
      liveClassLink: merged.liveClassLink || merged.zoomLink || merged.meetingLink || '',
      liveScheduleText: merged.liveScheduleText || merged.schedule || '',
      youtubePlaylistUrl: merged.youtubePlaylistUrl || merged.playlistUrl || merged.youtubeUrl || '',
      price: priceVal,
      discountedPrice: discountVal,
      discountPrice: discountVal,
      level: merged.level || 'BEGINNER',
      durationHours: merged.durationHours || 10,
      language: merged.language || 'Hindi / English',
      isPublished: merged.isPublished ?? true,
      studentsCount: enrolled,
      _count: merged._count,
      startDate: merged.startDate || merged.start_date || null,
      endDate: merged.endDate || merged.end_date || null,
      createdAt: merged.createdAt,
      updatedAt: merged.updatedAt,
      materialsKitTitle: kitTitle,
      materialsKitDescription: kitDesc,
      materialsPartnerName: merged.materialsPartnerName || 'Lemon House Craft',
      materialsPartnerUrl: merged.materialsPartnerUrl || 'https://lemonhousecraft.in',
      materialsList: materialsList,
      learningObjectives: learningObjectives,
      curriculumModules: curriculumModules,
      reviewsList: reviewsList
    };
  }
}
