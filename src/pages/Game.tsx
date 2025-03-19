import { useParams, Navigate } from "react-router-dom";
import PlayView from "./PlayView";
import { gameModes } from "@/config/gameModes";

export default function Game(props: any) {
   const { modeId } = useParams<{ modeId: string }>();
   const gameMode = gameModes.find((mode) => mode.id === modeId);

   if (!gameMode) {
      return <Navigate to="/" replace />;
   }

   return (
      <PlayView
         mode={gameMode.title}
         questionString={gameMode.description}
         isMulti={props.isMulti}
      />
   );
}
