

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Create() {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [gender, setGender] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
            setErrors(prev => ({ ...prev, image: "" })); // Clear error when user selects an image
        }
    };

    // ✅ Improved Validation Function
    const validateForm = () => {
        let validationErrors = {};

        if (!name.trim()) {
            validationErrors.name = "Please enter name";
        }

        if (!phone.trim()) {
            validationErrors.phone = "Please enter phone number";
        } else if (!/^\d{10}$/.test(phone)) {
            validationErrors.phone = "Phone number must be 10 digits";
        }

        if (!email.trim()) {
            validationErrors.email = "Kindly enter email";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            validationErrors.email = "Enter a valid email";
        }

        if (!address.trim()) {
            validationErrors.address = "Enter address";
        }

        if (!gender) {
            validationErrors.gender = "Please select a gender";
        }

        if (!image) {
            validationErrors.image = "Please upload an image";
        }

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return; // Stop submission if validation fails
        }

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
            const res = await axios.post("http://localhost:8081/create", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("Response:", res.data);
            alert("User created successfully!");
            navigate("/");
        } catch (err) {
            console.error("Error:", err);
            alert("Failed to create user!");
        }
    };

    return (
        <div className='d-flex bg-primary justify-content-center align-items-center vh-100'>
            <div className='w-50 m-3 bg-white rounded p-3'>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <h2>Add User</h2>

                    <div className='mb-2'>
                        <label htmlFor='name'>Name</label>
                        <input 
                            type='text' 
                            placeholder='Enter Name' 
                            className={`form-control ${errors.name ? "is-invalid" : ""}`}
                            onChange={e => {
                                setName(e.target.value);
                                setErrors(prev => ({ ...prev, name: "" }));
                            }} 
                        />
                        {errors.name && <div className="text-danger">{errors.name}</div>}
                    </div>

                    <div className='mb-2'>
                        <label htmlFor='phone'>Phone</label>
                        <input 
                            type='text' 
                            placeholder='Enter Phone Number' 
                            className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                            maxLength={10}
                            onChange={e => {
                                setPhone(e.target.value);
                                setErrors(prev => ({ ...prev, phone: "" }));
                            }} 
                        />
                        {errors.phone && <div className="text-danger">{errors.phone}</div>}
                    </div>

                    <div className='mb-2'>
                        <label htmlFor='email'>Email</label>
                        <input 
                            type='email' 
                            placeholder='Enter Email' 
                            className={`form-control ${errors.email ? "is-invalid" : ""}`}
                            onChange={e => {
                                setEmail(e.target.value);
                                setErrors(prev => ({ ...prev, email: "" }));
                            }} 
                        />
                        {errors.email && <div className="text-danger">{errors.email}</div>}
                    </div>
                    
                    <div className='mb-2'>
                        <label htmlFor='address'>Address</label>
                        <textarea 
                            placeholder='Enter Address' 
                            className={`form-control ${errors.address ? "is-invalid" : ""}`}
                            onChange={e => {
                                setAddress(e.target.value);
                                setErrors(prev => ({ ...prev, address: "" }));
                            }} 
                        ></textarea>
                        {errors.address && <div className="text-danger">{errors.address}</div>}
                    </div>
                    
                    <div className='mb-2'>
                        <label>Gender</label>
                        <div>
                            <input className='m-2'
                                type="radio" 
                                id="male" 
                                name="gender" 
                                value="Male"
                                onChange={e => {
                                    setGender(e.target.value);
                                    setErrors(prev => ({ ...prev, gender: "" }));
                                }} 
                            />
                            <label htmlFor="male"> Male </label>

                            <input className='m-2'
                                type="radio" 
                                id="female" 
                                name="gender" 
                                value="Female"
                                onChange={e => {
                                    setGender(e.target.value);
                                    setErrors(prev => ({ ...prev, gender: "" }));
                                }} 
                            />
                            <label htmlFor="female"> Female </label>

                            <input className='m-2'
                                type="radio" 
                                id="other" 
                                name="gender" 
                                value="Other"
                                onChange={e => {
                                    setGender(e.target.value);
                                    setErrors(prev => ({ ...prev, gender: "" }));
                                }} 
                            />
                            <label htmlFor="other"> Other </label>
                        </div>
                        {errors.gender && <div className="text-danger">{errors.gender}</div>}
                    </div>

                    <div className='mb-2'>
                        <label htmlFor='image'>Upload Image</label>
                        <input 
                            type='file' 
                            className={`form-control ${errors.image ? "is-invalid" : ""}`} 
                            accept='image/*' 
                            onChange={handleImageChange} 
                        />
                        {preview && <img src={preview} alt="Preview" className="mt-2" style={{ width: "100px", height: "100px", objectFit: "cover" }} />}
                        {errors.image && <div className="text-danger">{errors.image}</div>}
                    </div>

                    <button className='btn btn-success float-end' type='submit'>Submit</button>
                </form>
            </div>
        </div>
    );
}

export default Create;
