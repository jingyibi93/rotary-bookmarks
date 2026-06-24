export interface Project {
  id: string;
  title: string;
  category: 'Design' | 'Art' | 'Tech' | 'Notes';
  year: string;
  client: string;
  description: string;
  fullDetails: string;
  thumbnail: string;
  gallery: string[];
  tags: string[];
  accentColor: string;
  videoUrl?: string;
  
  // Custom Portfolio Dossier Fields
  subtitle?: string;
  projectType?: string;
  areaDetails?: string;
  role?: string;
  dateRange?: string;
  location?: string;
  contribution?: string;
  designStatementEN?: string;
  designStatementCN?: string;

  // Gallery URL Base resolving helper properties
  galleryBaseUrl?: string; // e.g., "/works/project-id" or "https://domain.com/project-id"
  imageCount?: number;     // e.g., 5, to generate "1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg"
}

export function resolveProjectImages(project: Project): Project {
  if (project.galleryBaseUrl) {
    const baseUrl = project.galleryBaseUrl.endsWith('/') 
      ? project.galleryBaseUrl 
      : `${project.galleryBaseUrl}/`;
    
    // Auto-resolve thumbnail to cover.jpg if not explicitly specified or placeholder
    const hasCustomThumbnail = project.thumbnail && !project.thumbnail.includes('placeholder') && !project.thumbnail.startsWith('https://images.unsplash.com') && project.thumbnail.trim() !== "";
    const resolvedThumbnail = hasCustomThumbnail
      ? project.thumbnail 
      : `${baseUrl}cover.jpg`;
    
    // Auto-resolve gallery to sequential 1.jpg, 2.jpg...
    const count = project.imageCount || 0;
    const resolvedGallery = count > 0 
      ? Array.from({ length: count }, (_, i) => `${baseUrl}${i + 1}.jpg`)
      : (project.gallery && project.gallery.length > 0 ? project.gallery : []);

    return {
      ...project,
      thumbnail: resolvedThumbnail,
      gallery: resolvedGallery
    };
  }
  return project;
}

export interface ProfileInfo {
  name: string;
  englishName: string;
  role: string;
  bio: string;
  avatar: string;
  contactEmail: string;
  socials: {
    github?: string;
    instagram?: string;
    dribbble?: string;
    twitter?: string;
  };
}

export type CarouselAxis = 'Y' | 'X' | 'Z';
