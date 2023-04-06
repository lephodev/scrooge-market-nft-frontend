import React from "react";
import logo from "../images/footer/logo.png";
function CloudWebsiteError() {
  return (
    <div className='cloudError-Page'>
      <img src={logo} className='errorPage-content' alt='errorPageImg' />
      <h2>
        This website is <span> currently not available </span> in your country
        or region .
      </h2>
    </div>
  );
}

export default CloudWebsiteError;
