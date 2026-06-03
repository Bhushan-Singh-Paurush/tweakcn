import Sidebar from "@/components/sidebar/Sidebar";
import Topbar from "@/components/topbar/Topbar";

export default function ProtectedLaoyout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
   
      
      <div className="flex">
      
      
      <Sidebar />

      <div className=" w-full px-8 ">
        <Topbar />
        {children}
      </div>
    </div>  
   
  );
}
