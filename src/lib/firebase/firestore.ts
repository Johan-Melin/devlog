import { getFirestore, doc, getDoc, setDoc, updateDoc, collection, query, getDocs, deleteDoc } from 'firebase/firestore';
import { app } from './config'; 
import { Project } from '@/types/project';

// Initialize Firestore
const db = getFirestore(app);

// Project functions
export async function createProject(userId: string, projectData: Omit<Project, 'id' | 'createdAt'>) {
  try {
    // Generate a new document reference with auto-ID
    const projectRef = doc(collection(db, 'users', userId, 'projects'));
    
    // Project with complete data
    const newProject = {
      ...projectData,
      id: projectRef.id,
      createdAt: new Date(),
    };
    
    // Save to Firestore
    await setDoc(projectRef, newProject);
    
    // Return the complete project
    return newProject;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
}

export async function getProject(userId: string, projectId: string) {
  try {
    const projectDoc = await getDoc(doc(db, 'users', userId, 'projects', projectId));
    
    if (projectDoc.exists()) {
      return projectDoc.data() as Project;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting project:', error);
    throw error;
  }
}

export async function updateProject(userId: string, projectId: string, data: Partial<Omit<Project, 'id' | 'createdAt'>>) {
  try {
    await updateDoc(doc(db, 'users', userId, 'projects', projectId), data);
    return true;
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
}

export async function deleteProject(userId: string, projectId: string) {
  try {
    await deleteDoc(doc(db, 'users', userId, 'projects', projectId));
    return true;
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
}

export async function getUserProjects(userId: string) {
  try {
    const projectsQuery = query(collection(db, 'users', userId, 'projects'));
    const querySnapshot = await getDocs(projectsQuery);
    
    const projects: Project[] = [];
    querySnapshot.forEach(doc => {
      projects.push(doc.data() as Project);
    });
    
    return projects;
  } catch (error) {
    console.error('Error getting user projects:', error);
    throw error;
  }
}

// Export Firestore instance
export { db };