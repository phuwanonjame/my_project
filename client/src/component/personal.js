import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "sweetalert2/src/sweetalert2.scss";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

function Personal() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageEdit, setSelectedImageEdit] = useState(null);
  const [IDcard, setIDcard] = useState("");
  const fileInputRef = useRef(null);
  const [inputID, setInputID] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [department, setDepartment] = useState("");
  const [area, setArea] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [users, setUsers] = useState([]); // Store all user data
  const [filteredUsers, setFilteredUsers] = useState([]); // Create state to store filtered data
  const [opencardeedit, setOpencardEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [inputimage, setInputimage] = useState(false);
  const [updatedData, setUserData] = useState([]);
  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  };

  const MAX_IMAGE_SIZE = 100 * 2500 * 2050; // 10MB

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size <= MAX_IMAGE_SIZE) {
        try {
          const base64Image = await convertImageToBase64(file);
          if (!inputimage) {
        
            setSelectedImage(base64Image);
            setInputimage(false);
            console.log(inputimage);
            
          }else{
            setSelectedImageEdit(base64Image);
            console.log("PPPP base64");
          }

          
        } catch (error) {
          console.error("Error converting image to base64", error);
        }
      } else {
        console.error("Image size is too large");
      }
    } else {
      setSelectedImageEdit(null);
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleInputChange = (value) => {
    if (/^[0-9]*$/.test(value) && value.length <= 13) {
      setIDcard(value);
    }
  };

  const handleInputID = (value) => {
    if (/^[0-9]*$/.test(value) && value.length <= 5) {
      setInputID(value);
    }
  };

  const handleSearch = (searchText) => {
    const filtered = users.filter((user) => {
      return (
        user.EmployeeID.includes(searchText) ||
        user.Fname.includes(searchText) ||
        user.Lname.includes(searchText) ||
        user.Department.includes(searchText) ||
        user.IDcard.includes(searchText) ||
        user.Area.includes(searchText) ||
        user.Email.includes(searchText) ||
        user.Phone.includes(searchText)
      );
    });
    setFilteredUsers(filtered);
  };

  const handleSearchInputChange = (e) => {
    const searchText = e.target.value;
    handleSearch(searchText);
  };

  const inputPersonal = () => {
    const data = {
      ID: inputID,
      fname: fname,
      lname: lname,
      IDcard: IDcard,
      Department: department,
      Area: area,
      Email: email,
      Phone: phone,
      ImageBase64: selectedImage,
    };

    const isDataValid = Object.values(data).every((value) => value !== "");

    if (isDataValid) {
      Swal.fire({
        title: "ตรวจสอบข้อมูลถูกต้อง?",
        showCancelButton: true,
        confirmButtonText: "Save",
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .post("http://localhost:3001/personal", data)
            .then((response) => {
              console.log(response);
              console.log("Data sent successfully");
              setArea("");
              setDepartment("");
              setEmail("");
              setFname("");
              setLname("");
              setPhone("");
              setIDcard("");
              setInputID("");
              setSelectedImage(null);
              Swal.fire("บันทึกสำเร็จ!", "", "success");
              updateUserData();
            })
            .catch((error) => {
              console.error("Error sending data", error);
            });
        } else if (result.isDenied) {
          Swal.fire("Changes are not saved", "", "info");
        }
      });
    } else {
      Swal.fire("กรุณากรอกข้อมูลให้ครบถ้วน", "", "info");
    }
  };
  // กำหนดค่าเริ่มต้นเป็น 0

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setOpencardEdit(true);
    setInputimage(true);  
    setSelectedImageEdit(user.Image);
    console.log("รูป",selectedImageEdit);

    axios
      .get(`http://localhost:3001/getupdateuser/${user.EmployeeID}`)
      .then((response) => {
        console.log("Received response:", response.data); // Debugging statement
        setUserData(response.data);
        console.log("ข้อมูล", updatedData.EmployeeID);
        
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const handleDeleteUser = () => {
    if (selectedUser) {
      Swal.fire({
        title: "ยืนยันการลบข้อมูล?",
        showCancelButton: true,
        confirmButtonText: "ลบ",
      }).then((result) => {
        if (result.isConfirmed) {
          // Implement the code to delete the selected user
          console.log("ไอดี", selectedUser.EmployeeID);
          axios
            .delete(`http://localhost:3001/personal/${selectedUser.EmployeeID}`)
            .then((response) => {
              console.log(response);
              Swal.fire("ลบข้อมูลสำเร็จ!", "", "success");
              setSelectedUser(null);
              setOpencardEdit(false);
              updateUserData();
            })
            .catch((error) => {
              console.error("Error deleting user", error);
            });
        } else if (result.isDenied) {
          Swal.fire("Deletion canceled", "", "info");
        }
      });
    }
  };

  const isDataValid = Object.values(updatedData).every((value) => value !== "");
const updatePersonal = () => {
  if (isDataValid) {
    // Send the updated data to your backend and update the database
    axios
      .post(
        `http://localhost:3001/updateuser/${updatedData.EmployeeID}`,updatedData)
      .then((response) => {
        console.log(response);
        console.log("Data updated successfully");
        setArea("");
        setDepartment("");
        setEmail("");
        setFname("");
        setLname("");
        setPhone("");
        setIDcard("");
        setInputID("");
        setSelectedImage(null);
        Swal.fire("บันทึกการแก้ไขสำเร็จ!", "", "success");
        setOpencardEdit(false);
        setSelectedUser(null);
        updateUserData();
      })
      .catch((error) => {
        console.error("Error updating data", error);
      });
  } else {
    Swal.fire("กรุณากรอกข้อมูลให้ครบถ้วน", "", "info");
  }
};

  const updateUserData = () => {
    axios
      .get("http://localhost:3001/Userlist")
      .then((response) => {
        setUsers(response.data);
        setFilteredUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  };

  useEffect(() => {
    updateUserData();
  }, []);

  return (
    <div className="container">
      <div className="containerhome">
        <div className="window-pane">
          <Link to="/">หน้าแรก</Link>
          <p>/</p>
          <p>(การบริหารงานด้านบุคคล)</p>
        </div>

        <div className="body-personal">
          <div className="headerpersonal">
            <h2>การบริหารงานด้านบุคคล</h2>
          </div>
          <div className="btn-listper">
            <h1>ลงทะเบียน</h1>
            <div className="input-col1">
              <p>รหัสพนักงาน</p>
              <input
                type="text"
                value={inputID}
                onChange={(e) => handleInputID(e.target.value)}
                placeholder="กรอกรหัสพนักงาน"
              />
              <p>ชื่อ</p>
              <input
                type="text"
                placeholder="ชื่อ"
                value={fname}
                onChange={(e) => setFname(e.target.value)}
              />
              <p>นามสกุล</p>
              <input
                value={lname}
                placeholder="นามสกุล"
                onChange={(e) => setLname(e.target.value)}
              />
              <p>ตำแหน่ง</p>
              <input
                type="text"
                value={department}
                placeholder="ตำแหน่ง"
                onChange={(e) => setDepartment(e.target.value)}
              />
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
                style={{ display: "none" }}
              />
              <img
                className="img-ss"
                src={
                  selectedImage || 
                  "https://t3.ftcdn.net/jpg/02/18/21/86/360_F_218218632_jF6XAkcrlBjv1mAg9LJrhygH.jpg"
                }
                alt=""
                onClick={handleImageClick}
                style={{ cursor: "pointer" }}
              />
            </div>
            <div className="input-col1">
              <p>เลขบัตรประชาชน</p>
              <input
                type="text"
                value={IDcard}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="กรอกรหัสบัตรประชาชน"
              />
              <p>ที่อยู่</p>
              <textarea
                className="textarea"
                rows="4"
                cols="50"
                value={area}
                onChange={(e) => setArea(e.target.value)}
              />
              <p>Email</p>
              <input
                value={email}
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <p>เบอร์โทรติดต่อ</p>
              <input
                type="text"
                value={phone}
                placeholder="เบอร์โทร"
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="btn-prosonal">
              <button className="btn-pro" onClick={inputPersonal}>
                บันทึก
              </button>
            </div>
            <hr />

            <div className="table">
              <div className="header-table">
                <h2>รายชื่อพนักงาน</h2>
              </div>

              <div className="search-container">
                <i className="fas fa-search"></i>
                <input
                  className="search"
                  type="text"
                  placeholder="ค้นหา..."
                  onChange={handleSearchInputChange}
                />
              </div>

              <table>
                <thead>
                  <tr>
                    <th>รหัสพนักงาน</th>
                    <th>ชื่อ</th>
                    <th>นามสกุล</th>
                    <th>แผนก</th>
                    <th>เลขบัตรประชาชน</th>
                    <th>ที่อยู่</th>
                    <th>Email</th>
                    <th>เบอร์โทรติดต่อ</th>

                    <th>จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr key={index}>
                      <td>{user.EmployeeID}</td>
                      <td>{user.Fname}</td>
                      <td>{user.Lname}</td>
                      <td>{user.Department}</td>
                      <td>{user.IDcard}</td>
                      <td>{user.Area}</td>
                      <td>{user.Email}</td>
                      <td>{user.Phone}</td>

                      <td>
                        <button
                          className="btn-edit"
                          onClick={() => handleEditClick(user)}
                        >
                          แก้ไข
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {opencardeedit && selectedUser && (
        <div className="cardprosonal">
          <div className="card-prosonal">
            <div className="body-personal">
              <div className="headerpersonal"></div>
              <div className="btn-listper">
                <h1>แก้ไขข้อมูลพนักงาน</h1>
                <div className="img-ssedit">
                  <input
                    type="file"
                    id="imageUpload"
                    accept="image/*"
                    onChange={handleImageChange}
                    ref={fileInputRef}
                    style={{ display: "none" }}
                  />
                  <img
                    className="img-ss2"
                    src={
                      selectedImageEdit ||
                       
                      "https://t3.ftcdn.net/jpg/02/18/21/86/360_F_218218632_jF6XAkcrlBjv1mAg9LJrhygH.jpg"
                    }
                    alt=""
                    onClick={handleImageClick}
                    style={{ cursor: "pointer" }}
                  />
                </div>
                <div className="input-col1">
                  <p>รหัสพนักงาน</p>
                  <input
                    type="number"
                    value={updatedData.EmployeeID}
                    onChange={(e) =>
                      setUserData({
                        ...updatedData,
                        EmployeeID: e.target.value,
                      })
                    }
                    placeholder="กรอกรหัสพนักงาน"
                  />

                  <p>ชื่อ</p>
                  <input
                    type="text"
                    placeholder="ชื่อ"
                    value={updatedData.Fname}
                    onChange={(e) =>
                      setUserData({ ...updatedData, Fname: e.target.value })
                    }
                  />

                  <p>นามสกุล</p>
                  <input
                    value={updatedData.Lname}
                    placeholder="นามสกุล"
                    onChange={(e) =>
                      setUserData({ ...updatedData, Lname: e.target.value })
                    }
                  />

                  <p>ตำแหน่ง</p>
                  <input
                    type="text"
                    value={updatedData.Department}
                    placeholder="ตำแหน่ง"
                    onChange={(e) =>
                      setUserData({
                        ...updatedData,
                        Department: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="input-col1">
                  <p>เลขบัตรประชาชน</p>
                  <input
                    type="text"
                    value={updatedData.IDcard}
                    onChange={(e) =>
                      setUserData({ ...updatedData, IDcard: e.target.value })
                    }
                    placeholder="กรอกรหัสบัตรประชาชน"
                  />
                  <p>ที่อยู่</p>
                  <textarea
                    className="textarea"
                    rows="4"
                    cols="50"
                    value={updatedData.Area}
                    onChange={(e) =>
                      setUserData({ ...updatedData, Area: e.target.value })
                    }
                  />
                  <p>Email</p>
                  <input
                    value={updatedData.Email}
                    type="email"
                    placeholder="Email"
                    onChange={(e) =>
                      setUserData({ ...updatedData, Email: e.target.value })
                    }
                  />
                  <p>เบอร์โทรติดต่อ</p>
                  <input
                    type="text"
                    value={updatedData.Phone}
                    placeholder="เบอร์โทร"
                    onChange={(e) =>
                      setUserData({ ...updatedData, Phone: e.target.value })
                    }
                  />
                </div>
                <div className="btn-prosonal">
                  <button className="btn-pro" onClick={updatePersonal}>
                    บันทึกการแก้ไข
                  </button>
                  <button className="btn-prodel" onClick={handleDeleteUser}>
                    ลบข้อมูล
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div
            className="close"
            onClick={() => {
              setOpencardEdit(false);
              window.location.reload();
            }}
          ></div>
        </div>
      )}
    </div>
  );
}
export default Personal;
