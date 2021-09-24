import React from 'react';
import './Footer.style.less';

export const FooterView = () => {
  const backTop = () => {
    document.querySelector('.home').scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
  };

  return (
    <div className="home-footer">
      <div className="home-footer-content">
        <div className="main-divider">
          <div className="divider left"></div>
          <span className="link">Join our Discord community</span>
          <div className="divider right"></div>
        </div>
        <div className="container">
          <div className="footer flex-center">
            <div className="text">
              Ship&IsLand is a registered trademark of Polaris Studios.
              <br /> ©2021 Polaris Studios. All rights reserved.
            </div>
            <span className="back-to-top" onClick={backTop}>
              Back to top
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterView;
