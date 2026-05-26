import { ReactNode } from "react";
import HeaderBanner from "./BannerHeader";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <HeaderBanner />
      <main>{children}</main>
    </>
  );
};

export default Layout;
