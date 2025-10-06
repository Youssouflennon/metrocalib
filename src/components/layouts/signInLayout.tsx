import { Outlet } from "react-router-dom";

const SignInLayout = () => {
  return (
    <div className="h-screen w-screen flex bg-white text-500">
      <main className="flex flex-col flex-grow overflow-y-auto">
        <div className="flex-grow bg-[#F5F6FA] overflow-y-scroll">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
export default SignInLayout;
