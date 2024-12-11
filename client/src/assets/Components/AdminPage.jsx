import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminPage = () => {
  //Main Userdetails State
  const [users, setUsers] = useState([]);

  //This State Creating a Search as Filter purpose
  const [userfilter, setUserFilter] = useState([]);

  //SetUserData
  const [userData, setUserData] = useState({ name: "", age: "", city: "" });

  //isModalOpen State

  const [isModalOpen, setisModalOpen] = useState(false);

  //Get Api Datas

  const getdata = async () => {
    try {
      const response = await axios.get("http://localhost:8000/users");
      setUsers(response.data);
      setUserFilter(response.data);
    } catch (err) {
      console.log("Fetching was a Error", err);
    }
  };

  useEffect(() => {
    getdata();
  }, []);

  //SearchUsers
  const handleSearchChanges = (e) => {
    const searchText = e.target.value.toLowerCase();
    const filterUsers = users.filter(
      (currUser) =>
        currUser.name.toLowerCase().includes(searchText) ||
        currUser.city.toLowerCase().includes(searchText)
    );
    setUserFilter(filterUsers);
  };

  //DeleteUsers

  const handleDelete = async (id) => {
    //Pop-Up Msg so Creating (isDeleting)
    const isDeleting = window.confirm("Are You Sure Deleting");

    if (isDeleting)
      try {
        await axios.delete(`http://localhost:8000/users/${id}`);
        const updatedUsers = users.filter((user) => user.id !== id);
        setUsers(updatedUsers);
        setUserFilter(updatedUsers);
      } catch (error) {
        console.error("Error deleting user:", error);
      }
  };

  //ModalOpen Function

  const ModalAdd = () => {
    setUserData({ name: "", age: "", city: "" });
    setisModalOpen(true);
  };

  //Close Function

  const CloseSymbol = () => {
    setisModalOpen(false);
    getdata();
  };

  //form Onchange function
  const handleData = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  //HandleSubmit

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:8000/users", userData).then((res) => {
      console.log(res);
    });
  };

  return (
    <div>
      <input
        onChange={handleSearchChanges}
        className="searchbox"
        type="text"
        placeholder="Search Text Here"
      ></input>
      <button onClick={ModalAdd} className="AddItem">
        AddItem
      </button>
      <table>
        <thead>
          <th>Name</th>
          <th>Age</th>
          <th>City</th>
          <th>Actions</th>
        </thead>
        <tbody>
          {userfilter &&
            userfilter.map((userdata) => {
              return (
                <tr key={userdata.id}>
                  <td>{userdata.name}</td>
                  <td>{userdata.age}</td>
                  <td>{userdata.city}</td>
                  <td>
                    <div>
                      <button className="Editbtn">Edit</button>
                      <button
                        onClick={() => handleDelete(userdata.id)}
                        className="Deletebtn"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={CloseSymbol}>
              &times;
            </span>
            <h2>User Record</h2>
            <form>
              <label>Name:</label>
              <input
                type="text"
                placeholder="name"
                value={userData.name}
                name="name"
                onChange={handleData}
              />
              <br />
              <div className="inputAge">
                <label>Age:</label>
                <input
                  type="number"
                  placeholder="age"
                  value={userData.age}
                  name="age"
                  onChange={handleData}
                />
              </div>
              <div className="inputCity">
                <label>City:</label>
                <input
                  type="text"
                  placeholder="city"
                  value={userData.city}
                  name="city"
                  onChange={handleData}
                />
              </div>
            </form>
            <button onClick={handleSubmit} className="Submitbtn">
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
