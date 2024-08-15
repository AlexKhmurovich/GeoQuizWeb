function Card(props: any) {
   return (
      <div className="border-sky-600 border-2 p-2 m-2 rounded-lg flex flex-col gap-1">
         <img src={props.img} />
         <h1 className="font-bold text-lg">{props.title}</h1>
         <p className="mb-2">{props.description}</p>
         <a
            className="bg-sky-600 text-sky-50 p-2 rounded-lg w-fit"
            href={props.link}
         >
            Play
         </a>
      </div>
   );
}

export default Card;
