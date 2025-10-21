export const cloudinaryConfig = {
  cloudName: 'dwnzxkata',
  uploadPreset: 'foxncici'
};

export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', cloudinaryConfig.uploadPreset);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/auto/upload`,
      {
        method: 'POST',
        body: formData
      }
    );
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('Cloudinary error:', errorData);
      throw new Error('Upload failed. Please try again.');
    }
    
    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};
