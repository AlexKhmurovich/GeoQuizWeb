"use client";

import type * as React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { User, Users, Settings } from "lucide-react";

interface MenuItem {
   icon: React.ReactNode;
   label: string;
   href: string;
   gradient: string;
   iconColor: string;
}

const menuItems: MenuItem[] = [
   {
      icon: <User className="h-5 w-5" />,
      label: "Singleplayer",
      href: "#",
      gradient:
         "radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(37,99,235,0.06) 50%, rgba(29,78,216,0) 100%)",
      iconColor: "text-blue-500",
   },
   {
      icon: <Users className="h-5 w-5" />,
      label: "Multiplayer",
      href: "#",
      gradient:
         "radial-gradient(circle, rgba(34,197,94,0.15) 0%, rgba(22,163,74,0.06) 50%, rgba(21,128,61,0) 100%)",
      iconColor: "text-green-500",
   },
   {
      icon: <Settings className="h-5 w-5" />,
      label: "Settings",
      href: "#",
      gradient:
         "radial-gradient(circle, rgba(107,114,128,0.15) 0%, rgba(75,85,99,0.06) 50%, rgba(55,65,81,0) 100%)",
      iconColor: "text-gray-500",
   },
];

const itemVariants = {
   initial: { rotateX: 0, opacity: 1 },
   hover: { rotateX: -90, opacity: 0 },
};

const backVariants = {
   initial: { rotateX: 90, opacity: 0 },
   hover: { rotateX: 0, opacity: 1 },
};

const glowVariants = {
   initial: { opacity: 0, scale: 0.8 },
   hover: {
      opacity: 1,
      scale: 2,
      transition: {
         opacity: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
         scale: { duration: 0.5, type: "spring", stiffness: 300, damping: 25 },
      },
   },
};

const navGlowVariants = {
   initial: { opacity: 0 },
   hover: {
      opacity: 1,
      transition: {
         duration: 0.5,
         ease: [0.4, 0, 0.2, 1],
      },
   },
};

const sharedTransition = {
   type: "spring",
   stiffness: 100,
   damping: 20,
   duration: 0.5,
};

interface MenuBarProps {
   onModeChange?: (mode: string) => void;
}

export function MenuBar({ onModeChange }: MenuBarProps) {
   const [selectedItem, setSelectedItem] = useState("Singleplayer"); // Default selection

   return (
      <motion.nav
         className="p-2 mb-2 rounded-2xl bg-gradient-to-b from-background/80 to-background/40 backdrop-blur-lg border border-border/40 shadow-lg relative overflow-hidden"
         initial="initial"
         whileHover="hover"
      >
         <motion.div
            className="absolute -inset-2 bg-gradient-radial from-transparent via-blue-400/20 via-30% via-purple-400/20 via-60% via-red-400/20 via-90% to-transparent rounded-3xl z-0 pointer-events-none"
            variants={navGlowVariants}
         />
         <ul className="flex items-center gap-2 relative z-10">
            {menuItems.map((item) => {
               const isSelected = selectedItem === item.label;

               // Create a brighter version of the gradient for selected items
               const selectedGradient = item.gradient
                  .replace(
                     /rgba\((\d+),(\d+),(\d+),0\.15\)/g,
                     "rgba($1,$2,$3,0.3)"
                  )
                  .replace(
                     /rgba\((\d+),(\d+),(\d+),0\.06\)/g,
                     "rgba($1,$2,$3,0.15)"
                  );

               return (
                  <motion.li key={item.label} className="relative">
                     <motion.div
                        className="block rounded-xl overflow-visible group relative"
                        style={{ perspective: "600px" }}
                        whileHover="hover"
                        initial="initial"
                     >
                        <motion.div
                           className="absolute inset-0 z-0 pointer-events-none"
                           variants={isSelected ? undefined : glowVariants}
                           animate={
                              isSelected
                                 ? { opacity: 1, scale: 1.2 }
                                 : undefined
                           }
                           style={{
                              background: isSelected
                                 ? selectedGradient
                                 : item.gradient,
                              opacity: isSelected ? 0.5 : 0,
                              borderRadius: "16px",
                           }}
                        />
                        <motion.a
                           href={item.href}
                           className={`flex items-center gap-2 px-4 py-2 relative z-10 bg-transparent ${
                              isSelected
                                 ? "text-foreground font-medium"
                                 : "text-muted-foreground"
                           } group-hover:text-foreground transition-colors rounded-xl`}
                           variants={itemVariants}
                           transition={sharedTransition}
                           style={{
                              transformStyle: "preserve-3d",
                              transformOrigin: "center bottom",
                           }}
                           onClick={(e) => {
                              e.preventDefault();
                              setSelectedItem(item.label);
                              if (onModeChange) {
                                 onModeChange(item.label);
                              }
                           }}
                        >
                           <span
                              className={`transition-colors duration-300 ${
                                 isSelected ? item.iconColor : "text-foreground"
                              } group-hover:${item.iconColor}`}
                           >
                              {item.icon}
                           </span>
                           <span>{item.label}</span>
                        </motion.a>
                        <motion.a
                           href={item.href}
                           className={`flex items-center gap-2 px-4 py-2 absolute inset-0 z-10 bg-transparent ${
                              isSelected
                                 ? "text-foreground font-medium"
                                 : "text-muted-foreground"
                           } group-hover:text-foreground transition-colors rounded-xl`}
                           variants={backVariants}
                           transition={sharedTransition}
                           style={{
                              transformStyle: "preserve-3d",
                              transformOrigin: "center top",
                              rotateX: 90,
                           }}
                           onClick={(e) => {
                              e.preventDefault();
                              setSelectedItem(item.label);
                              if (onModeChange) {
                                 onModeChange(item.label);
                              }
                           }}
                        >
                           <span
                              className={`transition-colors duration-300 ${
                                 isSelected ? item.iconColor : "text-foreground"
                              } group-hover:${item.iconColor}`}
                           >
                              {item.icon}
                           </span>
                           <span>{item.label}</span>
                        </motion.a>
                     </motion.div>
                  </motion.li>
               );
            })}
         </ul>
      </motion.nav>
   );
}
