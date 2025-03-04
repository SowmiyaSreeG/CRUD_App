


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function Update() {
    const { id } = useParams();
    const navigate = useNavigate();

    // State variables
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [gender, setGender] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [errors, setErrors] = useState({});

    // Load existing user data
    useEffect(() => {
        axios.get(`http://localhost:8081/update/${id}`)
            .then(res => {
                const userData = res.data;
                setName(userData.name);
                setPhone(userData.phone);
                setEmail(userData.email);
                setAddress(userData.address);
                setGender(userData.gender);
                if (userData.image) {
                    setPreview(userData.image); // Set existing image as preview
                }
            })
            .catch(err => console.error("Error fetching user:", err));
    }, [id]);

    // Handle image selection
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file)); // Show preview
        }
    };

    // Validate form
    const validateForm = () => {
        let validationErrors = {};

        if (!name.trim()) validationErrors.name = "Please enter a name!";
        if (!phone.trim()) {
            validationErrors.phone = "Please enter a phone number!";
        } else if (!/^\d{10}$/.test(phone)) {
            validationErrors.phone = "Phone number must be 10 digits!";
        }
        if (!email.trim()) {
            validationErrors.email = "Please enter an email!";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            validationErrors.email = "Enter a valid email!";
        }
        if (!address.trim()) validationErrors.address = "Please enter an address!";
        if (!gender) validationErrors.gender = "Please select a gender!";

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) return; // Stop submission if validation fails

        const formData = new FormData();
        formData.append("name", name);
        formData.append("phone", phone);
        formData.append("email", email);
        formData.append("address", address);
        formData.append("gender", gender);
        if (image) {
            formData.append("image", image);
        }

        try {
            await axios.put(`http://localhost:8081/update/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            alert("User updated successfully!");
            navigate("/");
        } catch (err) {
            console.error("Error updating user:", err);
            alert("Failed to update user");
        }
    };

    return (
        <div className='d-flex bg-primary justify-content-center align-items-center'>
            <div className='w-50 bg-white rounded m-3 p-4 shadow'>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <h2 className="text-center mb-3">Update User</h2>

                    {/* Name */}
                    <div className='mb-3'>
                        <label className="form-label">Name</label>
                        <input type='text' value={name}
                            className={`form-control ${errors.name ? "is-invalid" : ""}`}
                            onChange={e => setName(e.target.value)} />
                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>

                    {/* Phone */}
                    <div className='mb-3'>
                        <label className="form-label">Phone</label>
                        <input type='text' value={phone}
                            className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                            maxLength={10}
                            onChange={e => setPhone(e.target.value)} />
                        {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                    </div>

                    {/* Email */}
                    <div className='mb-3'>
                        <label className="form-label">Email</label>
                        <input type='email' value={email}
                            className={`form-control ${errors.email ? "is-invalid" : ""}`}
                            onChange={e => setEmail(e.target.value)} />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>

                    {/* Address */}
                    <div className='mb-3'>
                        <label className="form-label">Address</label>
                        <textarea className={`form-control ${errors.address ? "is-invalid" : ""}`}
                            value={address} onChange={e => setAddress(e.target.value)} />
                        {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                    </div>

                    {/* Gender */}
                    <div className='mb-3'>
                        <label className="form-label">Gender</label>
                        <div>
                            <input type="radio" id="male" name="gender" value="Male"
                                checked={gender === "Male"}
                                onChange={e => setGender(e.target.value)} />
                            <label htmlFor="male" className="ms-2 me-3"> Male </label>

                            <input type="radio" id="female" name="gender" value="Female"
                                checked={gender === "Female"}
                                onChange={e => setGender(e.target.value)} />
                            <label htmlFor="female" className="ms-2 me-3"> Female </label>

                            <input type="radio" id="other" name="gender" value="Other"
                                checked={gender === "Other"}
                                onChange={e => setGender(e.target.value)} />
                            <label htmlFor="other" className="ms-2"> Other </label>
                        </div>
                        {errors.gender && <div className="text-danger">{errors.gender}</div>}
                    </div>

                    {/* Image Upload */}
                    <div className='mb-3'>
                        <label className="form-label">Upload Image</label>
                        <input type='file' className='form-control' accept='image/*' onChange={handleImageChange} />
                        {preview && <img src={preview} alt="Preview" className="mt-2 rounded" style={{ width: "100px", height: "100px", objectFit: "cover" }} />}
                    </div>

                    {/* Submit Button */}
                    <button className='btn btn-success float-end' type='submit'>Update</button>
                </form>
            </div>
        </div>
    );
}

export default Update;
