import Navbar from "@/components/common/Navbar";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}
const AutorizedLayout = ({ children }: Props) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default AutorizedLayout;
