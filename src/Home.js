import React, { useEffect, useState } from "react"; 
import axios from "axios";
import { Link } from "react-router-dom";

function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8081/") // Fetch users
      .then((res) => {
        setData(res.data.filter(user => user.isDeleted !== 1)); 
      })
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      axios.put(`http://localhost:8081/delete/${id}`) 
        .then(() => {
          setData(prevData => prevData.filter(user => user.id !== id)); 
          alert("User deleted successfully!");
        })
        .catch(err => {
          console.error("Error:", err);
          alert("Failed to delete user.");
        });
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center bg-dark min-vh-100 px-2">
      <div className="bg-white rounded p-4 m-3 shadow-lg w-100" style={{ maxWidth: "900px" }}>
        <h2 className="text-center mb-3">My CRUD App</h2>

        {/* Add User Button */}
        <div className="d-flex justify-content-between mb-3">
          <Link to="/create" className="btn btn-success">
            Add +
          </Link>
        </div>

        {/* Fully Responsive Table */}
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Address</th>
                <th>Gender</th>
                <th>Image</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((user,index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.phone}</td>
                  <td>{user.email}</td>
                  <td>{user.address}</td>
                  <td>{user.gender}</td>
                  <td>
                  <img src={`http://localhost:8081${user.image}`} alt="User" width="50" height="50" />
                  </td> 
                  <td>
                    <div className="d-flex flex-column flex-md-row gap-2">
                      <Link to={`/update/${user.id}`} className="btn btn-sm btn-primary">
                        Update
                      </Link>
                      <button onClick={() => handleDelete(user.id)} className="btn btn-sm btn-danger">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Home;
