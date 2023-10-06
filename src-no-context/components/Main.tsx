import { ReactNode } from "react";

interface FooterProps {
  children: ReactNode;
}

const Main: React.FC<FooterProps> = ({ children }) => {
  return <main className="main">{children}</main>;
}

export default Main;