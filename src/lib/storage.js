import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

/**
 * Uploads a single file to Firebase Storage
 * @param {File} file - The file to upload
 * @param {string} path - The folder path (e.g., 'payments' or 'maintenance')
 * @returns {Promise<string>} - The download URL of the uploaded file
 */
export const uploadFile = async (file, path) => {
    if (!file) return null;
    
    try {
        // Create a unique filename: timestamp_random_originalName
        const uniqueName = `${Date.now()}_${Math.floor(Math.random() * 1000)}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const storageRef = ref(storage, `${path}/${uniqueName}`);
        
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        return url;
    } catch (error) {
        console.error("Error uploading file:", error);
        throw error;
    }
};

/**
 * Uploads multiple files to Firebase Storage
 * @param {File[]} files - Array of files to upload
 * @param {string} path - The folder path
 * @returns {Promise<string[]>} - Array of download URLs
 */
export const uploadFiles = async (files, path) => {
    if (!files || files.length === 0) return [];
    
    // Allow passing FileList directly or converting to array
    const fileArray = Array.isArray(files) ? files : Array.from(files);
    
    try {
        const uploadPromises = fileArray.map(file => uploadFile(file, path));
        const urls = await Promise.all(uploadPromises);
        return urls.filter(url => url !== null);
    } catch (error) {
        console.error("Error uploading files:", error);
        throw error;
    }
};
