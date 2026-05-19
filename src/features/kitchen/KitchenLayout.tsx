import { Outlet } from "react-router-dom";
import KitchenNavbar from "./components/KitchenNavbar";

function KitchenLayout() {
  return (
    <>
      <KitchenNavbar />
      <Outlet />
    </>
  );
}

export default KitchenLayout;