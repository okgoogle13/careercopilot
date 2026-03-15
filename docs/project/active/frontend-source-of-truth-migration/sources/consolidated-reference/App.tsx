import { RouterProvider } from "react-router";
import { router } from "./routes.tsx";

export default function App() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,100..900,0..100,0..1;1,9..144,100..900,0..100,0..1&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap');

        :root {
          font-optical-sizing: auto;
          background-color: #0F0F0F;
        }
      `}</style>
      <RouterProvider router={router} />
    </>
  );
}
