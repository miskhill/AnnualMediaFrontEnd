import React from "react";

const PageNotFound = () => {

  return (
    <div className="pageNotFound">
      <h1 style={{textAlign: 'center', color: '#ff4500'}}>Page Not Found</h1>
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <img src="/vamp404.png" alt="404 Page Not Found" />
      </div>
      <p style={{textAlign: 'center', color: '#333'}}>
        <a href="/" style={{color: '#ff4500'}}>Go Back To Home</a>
      </p>
    </div>
  );
};

export default PageNotFound;



