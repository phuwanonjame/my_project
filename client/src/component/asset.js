import React from "react";
import { Link } from "react-router-dom";
function Asset() {
  return (
    <div className="container">
      <div className="containerhome">
        <div className="contaner-Asset">
          <div className="window-pane">
            <Link to="/">หน้าแรก</Link>
            <p>/</p>
            <p>(ระบบจักการสินทรัพย์พนักงาน)</p>
          </div>
        </div>
        <div className="bodyasset">
          <div className="cardbody-asset">
            <div className="headerasset">
              <h2>ระบบจักการสินทรัพย์พนักงาน</h2>
            </div>
            <div className="body-input">
              <select>
                <option>แผนก</option>
                <option>Engineer</option>
                <option>AD</option>
              </select>
              <p style={{ marginTop: "1vw", paddingBottom: "1vw" }}>
                รายชื่อพนักงานที่ยังไม่ได้ลงทะเบียนบันทึกทรัพย์สิน
              </p>
            </div>
            <div className="tableasset">
              <table className="table-asset">
                <thead>
                  <tr>
                    <th>รหัสพนักงาน</th>
                    <th>ชื่อ</th>
                    <th>นามสกุล</th>
                    <th>แผนก</th>
                    <th>จัดการ</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>11111</td>
                    <td>ภูวนนท์</td>
                    <td>แก้วแดง</td>
                    <td>Engineer</td>
                    <td>
                      <button className="btn-assetedit">ลงทะเบียน</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div
              className="text"
              style={{ marginLeft: "2vw", paddingBottom: "1vw" }}
            >
              <p>ตารางรายชื่อพนักงานที่บันทึกข้อมูลทรัพย์สิน</p>
            </div>
            <div className="tableasset">
              <table className="table-asset">
                <thead>
                  <tr>
                    <th>รหัสพนักงาน</th>
                    <th>ชื่อ</th>
                    <th>นามสกุล</th>
                    <th>แผนก</th>
                    <th>จัดการ</th>
                  </tr>
                </thead>

                <tbody>
                  
                  
                  <tr>
                    <td>11111</td>
                    <td>ภูวนนท์</td>
                    <td>แก้วแดง</td>
                    <td>Engineer</td>
                    <td>
                      <button className="btn-assetedit" style={{background:"red"}}>แก้ไข</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Asset;
