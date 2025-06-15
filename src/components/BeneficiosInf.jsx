import React from "react";

function Beneficios(props) {
    return (
    <div className="contenedorBeneficio">
     <div className="iconoBeneficio">
         <img 
             className="IconosBenecios"
             src={`/img/icono-${props.imgBeneficio}.png`} 
             alt="iconos" 
         />
     </div>
     <b className="">{props.tituloBeneficio}</b>
     <p className="">{props.descripcionBeneficio}</p>
    </div>
    );
}

export default Beneficios;

