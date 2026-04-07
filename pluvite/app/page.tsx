/* 
ESSA É A PÁGINA INICIAL, A DO MAPA.

Pra rodar o site abre o terminal do VS code (cntrl + ")
ESCREVER:
1. cd pluvite (Enter) - pra abrir a pasta
2. npm install (Enter) - pra instalar as depêndencias (Next.JS, Typescript, Tailwind CSS, etc)

DEPOIS, PRA RODAR O SITE:
npm run dev (abrir no seu localhost com o número que vai dar no seu terminal do vs code, normalmente http://localhost:3000/)
*/

import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold text-blue-600">Pluvite - Taubaté</h1>
      <p className="mt-4 text-lg">
        Sistema de gestão de riscos em desenvolvimento.
      </p>
    </main>
  );
}
