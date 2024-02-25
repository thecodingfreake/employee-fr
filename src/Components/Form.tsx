import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
const Form = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [formdata, setFormdata] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const employeesPerPage = 5;

  useEffect(() => {
    axios.get("http://localhost:3000/get")
      .then(res => setFormdata(res.data))
      .catch(err => console.log(err));
  }, []);

  const submission = (data:any) => {
    console.log(currentPage)
    const newI = {
      "id": data.id,
      "ename": data.name,
      "dob": data.dob,
      "designation": data.designation,
      "salary": data.salary,
      "gender": data.gender,
      "department": data.department
    };
    axios.post("http://localhost:3000/entry", newI, {
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(res => {
        if (res.data === "id") {
          alert("OOPS id exists");
        } else if (res.data === "ok") {
          setFormdata([...formdata, newI]);
          alert("data inserted")
        }
      })
      .catch(err => console.log(err));
  };
// Calculate analysis report
const departmentReports = formdata.reduce((acc:any, employee:any) => {
  const department = employee.department;
  const gender = employee.gender;
  const salary = employee.salary;
  const designation = employee.designation;

  // Initialize the department if not present in the accumulator
  if (!acc[department]) {
    acc[department] = {
      totalEmployees: 0,
      totalMale: 0,
      totalFemale: 0,
      totalSalary: 0,
      totalDesignations: {}
    };
  }

  // Update department statistics
  acc[department].totalEmployees++;
  acc[department].totalSalary += salary;

  if (gender === "male") {
    acc[department].totalMale++;
  } else if (gender === "female") {
    acc[department].totalFemale++;
  }

  // Update designation statistics
  if (!acc[department].totalDesignations[designation]) {
    acc[department].totalDesignations[designation] = 1;
  } else {
    acc[department].totalDesignations[designation]++;
  }

  return acc;
}, {});
const today = new Date().toISOString().split('T')[0]

  const totalPageCount = Math.ceil(formdata.length / employeesPerPage);
 

  const handleDelete = (id: number) => {
    axios.delete(`http://localhost:3000/${id}`)
      .then((res:any) => {
        console.log(res)
        setFormdata((prevData:any) => prevData.filter((employee :any)=> employee.id !== id));
        alert("Data deleted successfully");
      })
      .catch(err => console.log(err));
  };
  const renderEmployees = formdata.map((item:any) => (
    <tr key={item.id}>
      <td>{item.id}</td>
      <td>{item.ename}</td>
      <td>{item.department}</td>
      <td>{item.dob}</td>
      <td>{item.gender}</td>
      <td>{item.designation}</td>
      <td>{item.salary}</td>
      <td>
        <button onClick={() => handleDelete(item.id)} style={{backgroundColor:"red",color:"white"}}>Delete</button>
      </td>
    </tr>
  ));

  const pageNumbers = [];
  for (let i = 1; i <= totalPageCount; i++) {
    pageNumbers.push(i);
  }

  const handlePageClick = (pageNumber:any) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <div>
        <form
          style={{
            background: 'white',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
          }}
          onSubmit={handleSubmit(submission)}
        >
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Employee Name:
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              {...register("name", { required: true, maxLength: 30, minLength: 1 })}
            />
            {errors.name?.type === "required" && <p style={{ color: "red" }}>name is required</p>}
            {errors.name?.type === "minLength" && <p style={{ color: "red" }}>min_length is required</p>}
            {errors.name?.type === "maxLength" && <p style={{ color: "red" }}>max_length is exceeded</p>}
          </div>
          <div className="mb-3">
            <label htmlFor="id" className="form-label">
              Employee ID:
            </label>
            <input
              type="number"
              className="form-control"
              id="id" {...register("id", { required: true })}
            />
            {errors.id?.type === "required" && <p style={{ color: "red" }}>ID is required</p>}
          </div>
          <div className="mb-3">
            <label htmlFor="department" className="form-label">
              Department:
            </label>
            <select
              className="form-select"
              id="department"
              {...register("department", { required: true })}
            >
              <option value="IT">IT</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="dob" className="form-label">
              Date of Birth:
            </label>
            <input
              type="date"
              max={today}
              className="form-control"
              id="dob"
              {...register("dob", { required: true })}
            />
            {errors.dob?.type === "required" && <p style={{ color: "red" }}>dob is required</p>}
          </div>
          <div className="mb-3">
            <label className="form-label">Gender:</label>
            <div className="form-check">
              <input
                type="radio"
                className="form-check-input"
                id="male"
                value="male"
                {...register("gender", { required: true })}
              />
              <label className="form-check-label" htmlFor="male">
                Male
              </label>
            </div>
            <div className="form-check">
              <input
                type="radio"
                className="form-check-input"
                id="female"
                value="female"
                {...register("gender", { required: true })}
              />
              <label className="form-check-label" htmlFor="female">
                Female
              </label>
            </div>
            {errors.gender?.type === "required" && <p style={{ color: "red" }}>gender is required</p>}
          </div>
          <div className="mb-3">
            <label htmlFor="designation" className="form-label">
              Designation:
            </label>
            <input
              type="text"
              className="form-control"
              id="designation"
              {...register("designation", { required: true })}
            />
            {errors.designation?.type === "required" && <p style={{ color: "red" }}>designation is required</p>}
          </div>
          <div className="mb-3">
            <label htmlFor="salary" className="form-label">
              Salary:
            </label>
            <input
              type="number"
              className="form-control"
              id="salary"
              {...register("salary", { required: true, min: 1000, max: 99999999 })}
            />
            {errors.salary?.type === "required" && <p style={{ color: "red" }}>salary is required</p>}
            {errors.salary?.type === "min" && <p style={{ color: "red" }}>min salary is required</p>}
            {errors.salary?.type === "max" && <p style={{ color: "red" }}>max salary is exceeded</p>}
          </div>
          <button type="submit" className="btn btn-success">
            Submit
          </button>
        </form>
      </div>

      <div>
        <table className="table table-striped">
          <thead className="thead-dark">
            <tr>
              <th>Department</th>
              <th>Total Employees</th>
              <th>Total Male</th>
              <th>Total Female</th>
              <th>Total Salary</th>
              <th>Total Designations</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(departmentReports).map(([department, data]:any) => (
              <tr key={department}>
                <td>{department}</td>
                <td>{data.totalEmployees}</td>
                <td>{data.totalMale}</td>
                <td>{data.totalFemale}</td>
                <td>{data.totalSalary}</td>
                <td>
                  <ul>
                    {Object.entries(data.totalDesignations).map(([designation, count]) => (
                      <li key={designation}>{`${designation}: ${count}`}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <table className="table table-striped">
          <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Department</th>
            <th>DOB</th>
            <th>Gender</th>
            <th>Designation</th>
            <th>Salary</th>
            <th>Delete</th>
          </tr>
          </thead>
          <tbody>
            {renderEmployees}
          </tbody>
        </table>
        <div>
          <ul className="pagination">
            {pageNumbers.map(number => (
              <li key={number} className="page-item">
                <button onClick={() => handlePageClick(number)} className="page-link">
                  {number}
                </button>
              </li>
            ))}
          </ul>
        </div>
       </div>
    </>
  );
};

export default Form;
