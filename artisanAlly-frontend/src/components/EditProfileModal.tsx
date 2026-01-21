import React, { useState, useRef, useEffect } from 'react';
import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '../stores/authStore';
import { State, City } from 'country-state-city';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateProfile, isLoading } = useAuthStore();

  // Helper to try parsing existing location
  const parseLocation = (loc: string) => {
    if (!loc) return { city: '', state: '' };
    const parts = loc.split(',').map(p => p.trim());
    if (parts.length >= 2) {
      // Best effort matching
      const stateName = parts[parts.length - 1];
      const cityName = parts[0];
      const state = State.getStatesOfCountry('IN').find(s => s.name.toLowerCase() === stateName.toLowerCase());
      return { city: cityName, state: state ? state.isoCode : '' };
    }
    return { city: '', state: '' };
  };

  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    category: user?.category || '',
    location: user?.location || '',
    mobile: user?.mobile || '',
    state: '',
    city: ''
  });

  // Init state/city from location when modal opens
  useEffect(() => {
    if (isOpen && user?.location) {
      const { city, state } = parseLocation(user.location);
      setFormData(prev => ({ ...prev, city, state }));
    }
  }, [isOpen, user]);

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string>(user?.profilePicture || '');
  const [backgroundImagePreview, setBackgroundImagePreview] = useState<string>(user?.backgroundPhoto || '');

  const profileImageRef = useRef<HTMLInputElement>(null);
  const backgroundImageRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stateCode = e.target.value;
    const state = State.getStatesOfCountry('IN').find(s => s.isoCode === stateCode);
    setFormData(prev => ({
      ...prev,
      state: stateCode,
      city: '',
      location: state ? `${state.name}` : ''
    }));
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityName = e.target.value;
    const state = State.getStatesOfCountry('IN').find(s => s.isoCode === formData.state);
    setFormData(prev => ({
      ...prev,
      city: cityName,
      location: state ? `${cityName}, ${state.name}` : cityName
    }));
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackgroundImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBackgroundImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackgroundImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'state' && key !== 'city' && value) formDataToSend.append(key, value as string);
    });

    if (profileImage) {
      formDataToSend.append('profilePicture', profileImage);
    }

    if (backgroundImage) {
      formDataToSend.append('backgroundPhoto', backgroundImage);
    }

    const success = await updateProfile(formDataToSend);
    if (success) {
      onClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: user?.name || '',
      bio: user?.bio || '',
      category: user?.category || '',
      location: user?.location || '',
      mobile: user?.mobile || '',
      state: '',
      city: ''
    });
    setProfileImage(null);
    setBackgroundImage(null);
    setProfileImagePreview(user?.profilePicture || '');
    setBackgroundImagePreview(user?.backgroundPhoto || '');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={handleClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-dark-900 shadow-xl rounded-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Edit Profile</h3>
            <button
              onClick={handleClose}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Images Section */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Profile Images</h4>

              {/* Background Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Background Photo
                </label>
                <div
                  className="relative h-32 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-lg cursor-pointer overflow-hidden group"
                  onClick={() => backgroundImageRef.current?.click()}
                >
                  {backgroundImagePreview && (
                    <img
                      src={backgroundImagePreview}
                      alt="Background preview"
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                    <PhotoIcon className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <input
                  ref={backgroundImageRef}
                  type="file"
                  accept="image/*"
                  onChange={handleBackgroundImageChange}
                  className="hidden"
                />
              </div>

              {/* Profile Picture */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Profile Picture
                </label>
                <div
                  className="w-24 h-24 bg-gray-100 dark:bg-dark-800 rounded-full cursor-pointer overflow-hidden flex items-center justify-center group relative"
                  onClick={() => profileImageRef.current?.click()}
                >
                  {profileImagePreview ? (
                    <img
                      src={profileImagePreview}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <PhotoIcon className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                    <PhotoIcon className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <input
                  ref={profileImageRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Basic Information</h4>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-700 rounded-md bg-white dark:bg-dark-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-700 rounded-md bg-white dark:bg-dark-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category {user?.role === 'artisan' && '*'}
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-700 rounded-md bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select category</option>
                    <option value="pottery">Pottery</option>
                    <option value="textiles">Textiles</option>
                    <option value="jewelry">Jewelry</option>
                    <option value="woodwork">Woodwork</option>
                    <option value="metalwork">Metalwork</option>
                    <option value="painting">Painting</option>
                    <option value="sculpture">Sculpture</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      State
                    </label>
                    <select
                      id="state"
                      name="state"
                      value={formData.state || ''}
                      onChange={handleStateChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-700 rounded-md bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select State</option>
                      {State.getStatesOfCountry('IN').map((state) => (
                        <option key={state.isoCode} value={state.isoCode}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      City
                    </label>
                    <select
                      id="city"
                      name="city"
                      value={formData.city || ''}
                      onChange={handleCityChange}
                      disabled={!formData.state}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-700 rounded-md bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Select City</option>
                      {formData.state ? (
                        City.getCitiesOfState('IN', formData.state).map((city) => (
                          <option key={city.name} value={city.name}>
                            {city.name}
                          </option>
                        ))
                      ) : null}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-700 rounded-md bg-white dark:bg-dark-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Your mobile number"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-md hover:bg-gray-200 dark:hover:bg-dark-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-dark-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
