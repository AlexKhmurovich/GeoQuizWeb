import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

export default function ModeCard(props: any) {
   return (
      <Card className="flex flex-col items-center shadow-lg">
         <CardHeader>
            <CardTitle>{props.title}</CardTitle>
            <CardDescription>{props.description}</CardDescription>
         </CardHeader>
         <CardContent>
            <img src={props.img} className="w-60 h-32 rounded-lg" />
         </CardContent>
         <CardFooter>
            <a href={props.link}>
               <Button>Play Now</Button>
            </a>
         </CardFooter>
      </Card>
   );
}
//Photo by <a href="https://unsplash.com/@joey_csunyo?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Joey Csunyo</a> on <a href="https://unsplash.com/photos/map-of-australia-2EGuIR00UTk?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
//Photo by <a href="https://unsplash.com/@lemonvlad?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Vladislav Klapin</a> on <a href="https://unsplash.com/photos/assorted-flag-YeO44yVTl20?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
