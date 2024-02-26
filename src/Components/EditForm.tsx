import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const EditForm = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [selectedField, setSelectedField] = useState('');
  const [updatedValue, setUpdatedValue] = useState('');

  const navigate=useNavigate()
  const handleEditSubmit = () => {
    if (!employeeId || !selectedField || !updatedValue) {
      alert('Please enter ID, select a field, and enter a value for editing.');
      return;
    }

    const updatedData = {
      id: employeeId,
      updatef:[selectedField],
      value: updatedValue,
    };

    axios.put(`https://employee-bk.onrender.com/edit/${employeeId}`, updatedData, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        if (res.data === 'ok') {
          alert('Data updated successfully');
          navigate('/')
          // You can perform any additional actions after a successful update
        }
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Edit Form</h2>
      <div className="mb-3">
        <label htmlFor="updateId" className="form-label">Enter Employee ID:</label>
        <input
          type="number"
          id="updateId"
          className="form-control"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="selectField" className="form-label">Select Field to Edit:</label>
        <select
          id="selectField"
          className="form-select"
          onChange={(e) => setSelectedField(e.target.value)}
          value={selectedField}
        >
          <option value="" disabled>Select Field</option>
          <option value="ename">Name</option>
          <option value="department">Department</option>
          <option value="dob">DOB</option>
          <option value="gender">Gender</option>
          <option value="designation">Designation</option>
          <option value="salary">Salary</option>
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="updateValue" className="form-label">Enter Updated Value:</label>
        <input
          type="text"
          id="updateValue"
          className="form-control"
          value={updatedValue}
          onChange={(e) => setUpdatedValue(e.target.value)}
        />
      </div>

      <button onClick={handleEditSubmit} className="btn btn-primary">Update</button>
    </div>
  );
};

export default EditForm;
