import { ReactNode } from 'react';

interface FooterProps {
  children: ReactNode;
}

const Footer: React.FC<FooterProps> = ({ children }) => {
  return <footer>{children}</footer>;
}

export default Footer;
