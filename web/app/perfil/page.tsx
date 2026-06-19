"use client";

import { useState } from "react";
import Sidebar from "../components/sidebar";
import { UserRound } from "lucide-react";

export default function Perfil() {
  const [sidebarExpandida, setSidebarExpandida] = useState(false);

  return (
    <main className="h-screen w-full flex overflow-hidden bg-zinc-100">
      <div onClick={() => setSidebarExpandida(!sidebarExpandida)}>
        <Sidebar />
      </div>

      <div
        className="flex p-10 gap-8 items-start flex-1 h-full overflow-y-auto transition-all duration-300 ease-in-out"
        style={{
          marginLeft: sidebarExpandida ? "244px" : "88px",
        }}
      >
        <div className="p-6 flex flex-col bg-zinc-200 rounded-2xl  w-fit h-[650px] w-[500px] shrink-0 shadow-sm">
          <div className="flex items-center mt-20 mb-6 p-20 ml-40 rounded-xl bg-zinc-200 shadow-sm">
            <UserRound size={50} className="text-blue-500" />
          </div>
        </div>
        <div className="flex flex-col gap-6 flex-1 max-w-[700px]">
          <div className="p-6 flex flex-col bg-zinc-200 rounded-2xl h-[313px] w-full shadow-sm"></div>
          <div className="p-6 flex flex-col bg-zinc-200 rounded-2xl h-[313px] w-full shadow-sm"></div>
        </div>
      </div>
    </main>
  );
}
