import React from "react";

function Articulosinf(props) {
    return (
    <div className="contenedorArticulo">
        <p className="">{props.tituloArticulo}</p>
        <p className="">{props.descripcionArticulo}</p>
     <div className="imagenArticulo">
         <img 
             className="IconosArticulo"
             src={`/img/art${props.imgArticulo}.jpg`} 
             alt="img-art" 
         />
     </div>
    </div>
    );
}

export default Articulosinf;