import React, { useState, useEffect } from 'react';
import axios from 'axios';


function ViewTheatersTable() {
    const [theaters, setTheaters] = useState([]);
    const [selectedTheater, setSelectedTheater] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchTheaters = async () => {
            try {
                const baseUrl = process.env.REACT_APP_BASE_URL;
                const response = await axios.get(`${baseUrl}/admin/viewTheaters`);
                setTheaters(response.data);
            } catch (error) {
                console.error('Error fetching theaters:', error);
            }
        };

        fetchTheaters();
    }, []);

    const handleEditClick = (theater) => {
        setSelectedTheater(theater);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTheater(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedTheater({ ...selectedTheater, [name]: value });
    };

    const handleSaveChanges = async () => {
        try {
            const baseUrl = process.env.REACT_APP_BASE_URL;
            await axios.put(`${baseUrl}/admin/editTheater/${selectedTheater._id}`, selectedTheater);
            const updatedTheaters = theaters.map(theater =>
                theater._id === selectedTheater._id ? selectedTheater : theater
            );
            setTheaters(updatedTheaters);
            handleCloseModal();
        } catch (error) {
            console.error('Error updating theater:', error);
        }
    };

    return (
        <div className="flex-grow p-4 overflow-auto">
            <h1 className="text-2xl font-bold mb-4">View Theaters</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b text-left">Name</th>
                            <th className="py-2 px-4 border-b text-left">Location</th>
                            <th className="py-2 px-4 border-b text-left">City</th>
                            <th className="py-2 px-4 border-b text-left">State</th>                            
                            <th className="py-2 px-4 border-b text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {theaters.map(theater => (
                            <tr key={theater._id}>
                                <td className="py-2 px-4 border-b">{theater.name}</td>
                                <td className="py-2 px-4 border-b">{theater.location}</td>
                                <td className="py-2 px-4 border-b">{theater.city}</td>
                                <td className="py-2 px-4 border-b">{theater.state}</td>                                
                                <td className="py-2 px-4 border-b">
                                    <button
                                        onClick={() => handleEditClick(theater)}
                                        className="text-blue-500 hover:text-blue-700"
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && selectedTheater && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Edit Theater</h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={selectedTheater.name}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Location</label>
                            <input
                                type="text"
                                name="location"
                                value={selectedTheater.location}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">City</label>
                            <input
                                type="text"
                                name="city"
                                value={selectedTheater.city}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">State</label>
                            <input
                                type="text"
                                name="state"
                                value={selectedTheater.state}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={handleCloseModal}
                                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700 mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveChanges}
                                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ViewTheatersTable;
