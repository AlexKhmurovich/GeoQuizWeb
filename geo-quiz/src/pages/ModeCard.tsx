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
      <Card className="flex flex-col items-center">
         <CardHeader>
            <CardTitle>{props.title}</CardTitle>
            <CardDescription>{props.description}</CardDescription>
         </CardHeader>
         <CardContent>
            <img src={props.img} alt="" className="w-20" />
         </CardContent>
         <CardFooter>
            <Button>Play Now</Button>
         </CardFooter>
      </Card>
   );
}

//Photo by <a href="https://unsplash.com/@filipovsky?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Filip Gielda</a> on <a href="https://unsplash.com/photos/low-angle-photo-of-temple-QKrLdkoYDrc?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
//Photo by <a href="https://unsplash.com/@joey_csunyo?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Joey Csunyo</a> on <a href="https://unsplash.com/photos/map-of-australia-2EGuIR00UTk?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
