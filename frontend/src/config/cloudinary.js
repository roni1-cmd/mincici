export const cloudinaryConfig = {
  cloudName: 'dwnzxkata',
  apiKey: 'foxncici',
  apiSecret: 'RjFyDld3S1ZhXBenHhZgNIECCwo',
  uploadPreset: 'ml_default'
};

export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'ml_default');
  formData.append('cloud_name', cloudinaryConfig.cloudName);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    );
    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};
