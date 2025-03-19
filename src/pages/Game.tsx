import { useParams, Navigate } from "react-router-dom";
import PlayView from "./PlayView";
import { gameModes } from "@/config/gameModes";

export default function Game() {
   const { modeId } = useParams<{ modeId: string }>();
   const gameMode = gameModes.find((mode) => mode.id === modeId);

   if (!gameMode) {
      return <Navigate to="/" replace />;
   }

   return (
      <PlayView mode={gameMode.title} questionString={gameMode.description} />
   );
}
