import { ChildProps } from "@/types";

const Layout = ({ children }: ChildProps) => {
  return <div className="h-full">{children}</div>;
};

export default Layout;
