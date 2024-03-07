import React from "react";

import loader from "../../images/loader.gif";
import "./loader.css";

function PageLoader() {
  return (
    <div className="new-page-loader">
      <div className="new-pageImgContainer">
        <img
          src={loader}
          alt="Scrooge Hat"
          className="img-fluid"
          loading="lazy"
        />
      </div>
    </div>
  );
}
export default PageLoader;
