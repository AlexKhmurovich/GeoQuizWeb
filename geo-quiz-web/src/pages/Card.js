function Card(props) {
    return (
      <div className="border-sky-600 border-2 p-2 m-2">
        <img src={props.img}/>
        <h1>{props.title}</h1>
        <p>{props.description}</p>
        <a href={props.link}>Play</a>
      </div>
    );
  }
  
export default Card;