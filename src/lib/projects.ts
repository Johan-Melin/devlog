import { db } from './firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  Timestamp,
  DocumentReference,
  CollectionReference
} from 'firebase/firestore';
import { User } from 'firebase/auth';

// Project interface
export interface Project {
  id: string;
  name: string;
  slug: string;
  owner: string;
  ownerUid: string;
  isPublic: boolean;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
  details?: string;
  estimatedTime?: string;
  availableTime?: string;
  timeline?: string;
  archived?: boolean;
  archiveReason?: string;
}

// Create a new Project object
export const createProjectObject = (
  id: string,
  name: string,
  owner: string,
  ownerUid: string,
  isPublic: boolean,
  details?: string,
  estimatedTime?: string,
  availableTime?: string,
  timeline?: string
): Omit<Project, 'slug'> & { slug?: string } => {
  // Default values for new projects
  return {
    id,
    name,
    slug: createSlug(name),
    owner,
    ownerUid,
    isPublic,
    createdAt: null, // Will be set by serverTimestamp() when saved
    updatedAt: null, // Will be set by serverTimestamp() when saved
    details: details || '',
    estimatedTime: estimatedTime || '',
    availableTime: availableTime || '',
    timeline: timeline || '',
    archived: false
  };
};

// Create a URL-friendly slug from a project name
export const createSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

// Create a unique slug for a project
const createUniqueSlug = async (uid: string, name: string): Promise<string> => {
  // Create the base slug
  const baseSlug = createSlug(name);
  
  // Check if the slug already exists for this user
  const projectsRef = getUserProjectsRef(uid);
  const q = query(projectsRef, where('slug', '==', baseSlug));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    // Slug is unique, return it
    return baseSlug;
  }
  
  // Slug already exists, check for slugs with this base plus a number
  const q2 = query(
    projectsRef, 
    where('slug', '>=', `${baseSlug}-`), 
    where('slug', '<=', `${baseSlug}-\uf8ff`)
  );
  const querySnapshot2 = await getDocs(q2);
  
  // Extract all numeric suffixes and find the highest
  const existingSlugs = querySnapshot2.docs.map(doc => doc.data().slug);
  let maxNumber = 0;
  
  existingSlugs.forEach(slug => {
    const match = slug.match(new RegExp(`^${baseSlug}-(\\d+)$`));
    if (match && match[1]) {
      const num = parseInt(match[1], 10);
      if (num > maxNumber) maxNumber = num;
    }
  });
  
  // Return baseSlug-{next number}
  return `${baseSlug}-${maxNumber + 1}`;
};

// Error handler wrapper
const handleProjectError = async <T>(operation: () => Promise<T>): Promise<{ data: T | null; error: Error | null }> => {
  try {
    const result = await operation();
    return { data: result, error: null };
  } catch (error) {
    console.error('Project operation failed:', error);
    return { data: null, error: error as Error };
  }
};

// Get projects collection reference for a user
const getUserProjectsRef = (uid: string): CollectionReference => {
  return collection(db, 'users', uid, 'projects');
};

// Get project document reference
const getProjectRef = (uid: string, projectId: string): DocumentReference => {
  return doc(db, 'users', uid, 'projects', projectId);
};

// Project service with CRUD operations
export const projectService = {
  // Create a new project
  createProject: async (user: User, projectData: Omit<Project, 'id' | 'ownerUid' | 'owner' | 'createdAt' | 'updatedAt'>): Promise<{ data: Project | null; error: Error | null }> => {
    return handleProjectError(async () => {
      if (!user) throw new Error('User not authenticated');
      
      const projectsRef = getUserProjectsRef(user.uid);
      const projectRef = doc(projectsRef);
      
      // Generate a unique slug
      const uniqueSlug = await createUniqueSlug(user.uid, projectData.name);
      
      const newProject: Project = {
        ...projectData,
        id: projectRef.id,
        owner: user.displayName || user.email || user.uid,
        ownerUid: user.uid,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        slug: uniqueSlug
      };
      await setDoc(projectRef, newProject);
      
      // Convert timestamp to a serializable format
      return {
        ...newProject,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };
    });
  },
  
  // Get all projects for a user
  getUserProjects: async (uid: string): Promise<{ data: Project[] | null; error: Error | null }> => {
    return handleProjectError(async () => {
      const projectsRef = getUserProjectsRef(uid);
      const q = query(projectsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const projects: Project[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Project;
        projects.push({
          ...data,
          id: doc.id
        });
      });
      
      return projects;
    });
  },
  
  // Get public projects for a user by username
  getPublicProjects: async (username: string): Promise<{ data: Project[] | null; error: Error | null }> => {
    return handleProjectError(async () => {
      // First get the user ID from the username
      const usernameDoc = await getDoc(doc(db, 'usernames', username));
      if (!usernameDoc.exists()) {
        throw new Error('Username not found');
      }
      
      const uid = usernameDoc.data().uid;
      const projectsRef = getUserProjectsRef(uid);
      const q = query(
        projectsRef, 
        where('isPublic', '==', true),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      
      const projects: Project[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Project;
        projects.push({
          ...data,
          id: doc.id
        });
      });
      
      return projects;
    });
  },
  
  // Get a project by ID
  getProject: async (uid: string, projectId: string): Promise<{ data: Project | null; error: Error | null }> => {
    return handleProjectError(async () => {
      const projectRef = getProjectRef(uid, projectId);
      const projectSnap = await getDoc(projectRef);
      
      if (!projectSnap.exists()) {
        throw new Error('Project not found');
      }
      
      return {
        ...projectSnap.data() as Project,
        id: projectSnap.id
      };
    });
  },
  
  // Get a project by user and project slug
  getProjectBySlug: async (username: string, projectSlug: string): Promise<{ data: Project | null; error: Error | null }> => {
    return handleProjectError(async () => {
      // First get the user ID from the username
      const usernameDoc = await getDoc(doc(db, 'usernames', username));
      if (!usernameDoc.exists()) {
        throw new Error('Username not found');
      }
      
      const uid = usernameDoc.data().uid;
      const projectsRef = getUserProjectsRef(uid);
      const q = query(projectsRef, where('slug', '==', projectSlug));
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        throw new Error('Project not found');
      }
      
      const projectDoc = querySnapshot.docs[0];
      return {
        ...projectDoc.data() as Project,
        id: projectDoc.id
      };
    });
  },
  
  // Update a project
  updateProject: async (uid: string, projectId: string, projectData: Partial<Project>): Promise<{ data: Project | null; error: Error | null }> => {
    return handleProjectError(async () => {
      const projectRef = getProjectRef(uid, projectId);
      
      // Get the current project for comparison
      const currentProject = await getDoc(projectRef);
      const currentData = currentProject.data() as Project;
      
      // If name is being updated and it's different from the current name, update the slug
      if (projectData.name && projectData.name !== currentData.name) {
        projectData.slug = await createUniqueSlug(uid, projectData.name);
      }
      
      const updateData = {
        ...projectData,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(projectRef, updateData);
      
      // Get the updated project
      const updatedProject = await getDoc(projectRef);
      return {
        ...updatedProject.data() as Project,
        id: updatedProject.id
      };
    });
  },
  
  // Delete a project
  deleteProject: async (uid: string, projectId: string): Promise<{ success: boolean; error: Error | null }> => {
    return handleProjectError(async () => {
      const projectRef = getProjectRef(uid, projectId);
      await deleteDoc(projectRef);
      return true;
    }).then(result => ({
      success: result.data !== null,
      error: result.error
    }));
  },
  
  // Archive a project
  archiveProject: async (uid: string, projectId: string, archiveReason: string): Promise<{ data: Project | null; error: Error | null }> => {
    return handleProjectError(async () => {
      const projectRef = getProjectRef(uid, projectId);
      
      const updateData = {
        archived: true,
        archiveReason,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(projectRef, updateData);
      
      // Get the updated project
      const updatedProject = await getDoc(projectRef);
      return {
        ...updatedProject.data() as Project,
        id: updatedProject.id
      };
    });
  },
  
  // Unarchive a project
  unarchiveProject: async (uid: string, projectId: string): Promise<{ data: Project | null; error: Error | null }> => {
    return handleProjectError(async () => {
      const projectRef = getProjectRef(uid, projectId);
      
      const updateData = {
        archived: false,
        archiveReason: '',
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(projectRef, updateData);
      
      // Get the updated project
      const updatedProject = await getDoc(projectRef);
      return {
        ...updatedProject.data() as Project,
        id: updatedProject.id
      };
    });
  }
}; 