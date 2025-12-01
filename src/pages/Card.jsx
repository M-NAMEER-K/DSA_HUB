


const Card=({title,para,icon,btnColor})=>{

        return(
            <div className="border flex flex-col items-center w-full gap-y-3 p-2 rounded border-orange-400">
                     <span>{icon}</span>
                     <h1 className="text-lg font-medium">{title}</h1>
                     <p>{para}</p>
                     <button className={`${btnColor} p-2 rounded-lg`}>{title}</button>
                      
            </div>
        )
}

export default Card;