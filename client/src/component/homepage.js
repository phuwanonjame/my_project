import React from 'react';
import { Link } from 'react-router-dom';

function Homepage() {
  return (
    <div className='container'>
      <div className='containerhome'> 
        <div className='body-hame'>
          <div className='header-home'>
            <h1>การบริหารงานด้านบุคคล</h1>
          </div>
          <div className='body-homepage'>
          <div className='body-bodyhome'>
            <Link to="/personal">
              <div className='card'>
                <div className='headercard'>
                  <p>ระบบทะเบียนพนักงาน (Personal Base System)</p>
                </div>
                <div className='icon-card'>
                  <i className="fa-solid fa-user" style={{ color: '#ee1717' }}></i>
                </div>
              </div>
            </Link>
            </div>
            <div className='body-bodyhome'>
              <Link to="/asset">
              <div class='card' style={{background: 'linear-gradient(to right, rgba(111, 221, 163, 0.993), rgba(111, 111, 111, 0.993)'}}>

                <div className='headercard'>
                  <p>ระบบจักการสินทรัพย์พนักงาน (Employee asset )</p>
                </div>
                <div className='icon-card'>
                <i class="fa-solid fa-bag-shopping" style={{color: "#1f1f1f"}}></i>
                </div>
              </div>
            </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
