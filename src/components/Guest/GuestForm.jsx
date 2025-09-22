import React from 'react';

/**
 * GuestForm Component
 * A reusable form for adding or editing guest details.
 *
 * Props:
 * - guest: The guest being edited (null for adding a new guest).
 * - setGuest: Function to update or clear the guest being edited.
 * - onSave: Function to save the guest (add or update).
 * - theme: Current theme ('dark' or 'light') for dynamic styling.
 */
const GuestForm = ({ guest, setGuest, onSave, theme }) => {
    // Initialize or copy the guest object
    const guestData = guest || { firstName: '', lastName: '', email: '', phone: '' };

    /**
     * Handle changes to input fields.
     * Dynamically updates the guest data being edited.
     * @param {string} field - The field name to update (e.g., 'firstName').
     * @param {string} value - The new value for the field.
     */
    const handleChange = (field, value) => {
        setGuest({ ...guestData, [field]: value });
    };

    /**
     * Submit the guest data to the onSave callback.
     * Includes basic error handling in case onSave fails.
     */
    const handleSubmit = () => {
        try {
            onSave(guestData); // Pass guest data to the parent component
        } catch (error) {
            console.error('Error in GuestForm:', error.message); // Log concise error message
        }
    };

    // Determine if the form is in "edit" or "add" mode
    const isEditing = !!guest?.guestId;

    return (
        <div className="mb-6">
            {/* Form title changes dynamically based on mode */}
            <h2 className="text-xl font-semibold mb-2">
                {isEditing ? 'Edit Guest' : 'Add New Guest'}
            </h2>

            {/* Input fields for guest details */}
            <input
                type="text"
                placeholder="First Name"
                value={guestData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                className={`border p-2 rounded w-full mb-2 ${
                    theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'
                }`}
            />
            <input
                type="text"
                placeholder="Last Name"
                value={guestData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                className={`border p-2 rounded w-full mb-2 ${
                    theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'
                }`}
            />
            <input
                type="email"
                placeholder="Email"
                value={guestData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={`border p-2 rounded w-full mb-2 ${
                    theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'
                }`}
            />
            <input
                type="tel"
                placeholder="Phone"
                value={guestData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className={`border p-2 rounded w-full mb-4 ${
                    theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'
                }`}
            />

            {/* Submit button for saving the guest */}
            <button
                onClick={handleSubmit}
                className={`p-2 rounded w-full mb-2 ${
                    theme === 'dark'
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
            >
                {isEditing ? 'Update Guest' : 'Add Guest'}
            </button>

            {/* Cancel button (only shown in edit mode) */}
            {isEditing && (
                <button
                    onClick={() => setGuest(null)} // Clears the editing guest
                    className={`p-2 rounded w-full ${
                        theme === 'dark'
                            ? 'bg-gray-700 hover:bg-gray-600 text-white'
                            : 'bg-gray-300 hover:bg-gray-400 text-black'
                    }`}
                >
                    Cancel
                </button>
            )}
        </div>
    );
};

export default GuestForm;