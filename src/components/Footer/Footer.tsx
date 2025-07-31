import React, { useEffect, useState } from 'react';
import styles from './Footer.module.scss';
import Link from 'next/link';
import { useExpandedPanels } from '@/contexts/ExpandedPanelsContext';

const Footer: React.FC = () => {
  const { expandedPanels } = useExpandedPanels();

  return (
    <div className={styles.footerStyle}>
      <footer className={`o-footer -minimal ${styles.footerStyle}`}>    
        <hr className="a-divider" />
        <div className="ml-16">
          <div className="o-footer__bottom">
            <div className="o-footer__copyright">
              <i
                className="a-icon boschicon-bosch-ic-copyright-frame"
                title="Lorem Ipsum"
              ></i>
              2021 Bosch.IO GmbH, all rights reserved
            </div>
          </div>
        </div>
      </footer>
    </div>
    
  );
};

export default Footer;
