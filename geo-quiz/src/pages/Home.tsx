import Card from "./Card.tsx";

export default function Home() {
   return (
      <div className="App">
         <h1 className="font-bold">Welcome to GeoQuiz</h1>
         <div className="flex">
            <Card
               title="Flags"
               description="Guess the flags of the world's countries."
               img="asdf"
               link="/flags"
            ></Card>
            <Card
               title="Capitals"
               description="Guess the capitals of the world's countries."
               img="asdf"
               link="/capitals"
            ></Card>
         </div>
      </div>
   );
}
