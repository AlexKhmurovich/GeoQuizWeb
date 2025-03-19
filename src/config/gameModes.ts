import FlagsImg from "../assets/flags.jpg";
import CapitalsImg from "../assets/capitals.jpg";
import ShapesImg from "../assets/shapes.jpg";
import DomainsImg from "../assets/domains.jpg";
import AnthemsImg from "../assets/anthems.jpg";
import ComboImg from "../assets/combo.jpg";

export interface GameMode {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  path: string;
}

export const gameModes: GameMode[] = [
  {
    id: "flags",
    title: "Flags",
    description: "Guess the flags of the world's countries.",
    imageSrc: FlagsImg,
    path: "/flags"
  },
  {
    id: "capitals",
    title: "Capitals",
    description: "Guess the capitals of the world's countries.",
    imageSrc: CapitalsImg,
    path: "/capitals"
  },
  {
    id: "shapes",
    title: "Shapes",
    description: "Guess the shapes of the world's countries.",
    imageSrc: ShapesImg,
    path: "/shapes"
  },
  {
    id: "domains",
    title: "Domains",
    description: "Guess the TLDs of the world's countries.",
    imageSrc: DomainsImg,
    path: "/domains"
  },
  {
    id: "anthems",
    title: "Anthems",
    description: "Guess the anthems of the world's countries.",
    imageSrc: AnthemsImg,
    path: "/anthems"
  },
  {
    id: "combo",
    title: "Combo",
    description: "Guess anything about the world's countries.",
    imageSrc: ComboImg,
    path: "/combo"
  },
];