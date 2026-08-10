// app/Feed/page.tsx

import { AlertTriangle, Eye, Wrench } from "lucide-react";

export default function FeedPage() {
    return (
        <div className="bg-white h-fulll">
            <div className="flex flex-col items-start justify-start px-[30%]">
                <h1 className="text-3xl font-bold mt-12">Feed de Ocorrências</h1>
                <p className="text-md mt-2 text-zinc-800 mb-10">Acompanhe e reporte problemas em tempo real</p>
            </div>

        </div>
    );
}