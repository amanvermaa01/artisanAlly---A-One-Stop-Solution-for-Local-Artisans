import React, { useState, useRef } from 'react';
import { useAuthStore } from '../stores/authStore';
import {
  UserIcon,
  PencilIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  CameraIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user, updateProfile, isLoading } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    category: user?.category || '',
  });
  const [selectedFiles, setSelectedFiles] = useState<{
    profilePicture?: File;
    backgroundPhoto?: File;
  }>({});
  const profilePictureRef = useRef<HTMLInputElement>(null);
  const backgroundPhotoRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'profilePicture' | 'backgroundPhoto') => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFiles(prev => ({ ...prev, [type]: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Create FormData for file upload
    const formDataToSend = new FormData();

    // Add text fields
    Object.entries(formData).forEach(([key, value]) => {
      if (value) {
        formDataToSend.append(key, value);
      }
    });

    // Add files
    Object.entries(selectedFiles).forEach(([key, file]) => {
      if (file) {
        formDataToSend.append(key, file);
      }
    });

    const success = await updateProfile(formDataToSend);
    if (success) {
      setIsEditing(false);
      setSelectedFiles({});
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      bio: user?.bio || '',
      category: user?.category || '',
    });
    setSelectedFiles({});
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-950 flex items-center justify-center transition-colors duration-300">
        <div className="spinner dark:border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white dark:bg-dark-900 rounded-lg shadow-sm border border-gray-200 dark:border-dark-800 p-6 mb-8 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <UserIcon className="h-10 w-10 text-primary-600" />
                )}
                {isEditing && (
                  <>
                    <button
                      type="button"
                      onClick={() => profilePictureRef.current?.click()}
                      className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70 transition-all"
                    >
                      <CameraIcon className="h-6 w-6" />
                    </button>
                    <input
                      ref={profilePictureRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'profilePicture')}
                      className="hidden"
                    />
                  </>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
                <p className="text-gray-600 dark:text-gray-400 capitalize">{user.role}</p>
                {user.category && (
                  <span className="inline-block bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-sm px-3 py-1 rounded-full mt-1">
                    {user.category}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="btn-outline dark:text-gray-200 dark:border-gray-600 dark:hover:bg-dark-800 dark:hover:text-white flex items-center space-x-2"
          >
            <PencilIcon className="h-4 w-4" />
            <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-dark-900 rounded-lg shadow-sm border border-gray-200 dark:border-dark-800 p-6 transition-colors duration-300">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Profile Information</h2>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    className="input"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category {user?.role === 'artisan' ? '(Your Craft)' : '(Your Interests)'}
                  </label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="input"
                    placeholder="e.g., Pottery, Woodworking, Jewelry..."
                  />
                </div>

                {user?.role === 'artisan' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Background Photo
                    </label>
                    <div className="flex items-center space-x-4">
                      <button
                        type="button"
                        onClick={() => backgroundPhotoRef.current?.click()}
                        className="btn-outline dark:text-gray-200 dark:border-gray-600 dark:hover:bg-dark-800 dark:hover:text-white flex items-center space-x-2"
                      >
                        <CameraIcon className="h-4 w-4" />
                        <span>{selectedFiles.backgroundPhoto ? selectedFiles.backgroundPhoto.name : 'Choose Background Photo'}</span>
                      </button>
                      <input
                        ref={backgroundPhotoRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'backgroundPhoto')}
                        className="hidden"
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Background photo is only for artisans</p>
                  </div>
                )}

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary"
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn-outline dark:text-gray-200 dark:border-gray-600 dark:hover:bg-dark-800 dark:hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Bio</h3>
                  <p className="text-gray-900 dark:text-gray-200">
                    {user.bio || 'No bio available'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-3">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                      <p className="text-gray-900 dark:text-gray-200">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <PhoneIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Mobile</p>
                      <p className="text-gray-900 dark:text-gray-200">{user.mobile}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MapPinIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</p>
                      <p className="text-gray-900 dark:text-gray-200">{user.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Member Since</p>
                      <p className="text-gray-900 dark:text-gray-200">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="bg-white dark:bg-dark-900 rounded-lg shadow-sm border border-gray-200 dark:border-dark-800 p-6 transition-colors duration-300">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Followers</span>
                <span className="font-semibold text-gray-900 dark:text-white">{user.followers.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Following</span>
                <span className="font-semibold text-gray-900 dark:text-white">{user.following.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Gender</span>
                <span className="font-semibold capitalize text-gray-900 dark:text-white">{user.gender}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-dark-900 rounded-lg shadow-sm border border-gray-200 dark:border-dark-800 p-6 transition-colors duration-300">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link to="/dashboard" className="w-full btn-outline dark:text-gray-200 dark:border-gray-600 dark:hover:bg-dark-800 dark:hover:text-white text-left block text-center">
                Dashboard
              </Link>
              {user?.role === 'artisan' && (
                <Link to="/products" className="w-full btn-outline dark:text-gray-200 dark:border-gray-600 dark:hover:bg-dark-800 dark:hover:text-white text-left block text-center">
                  My Products
                </Link>
              )}
              <Link to="/posts" className="w-full btn-outline dark:text-gray-200 dark:border-gray-600 dark:hover:bg-dark-800 dark:hover:text-white text-left block text-center">
                Posts
              </Link>
              <Link to="/ai-tools" className="w-full btn-outline dark:text-gray-200 dark:border-gray-600 dark:hover:bg-dark-800 dark:hover:text-white text-left block text-center">
                AI Tools
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;