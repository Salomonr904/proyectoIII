import React from "react";

function Beneficios(props) {
    return (
    <div className="contenedorBeneficio">
    <img 
        className="IconosBenecios"
        src="" 
        alt="iconos" 
    />
    <b className="">{props.tituloBeneficio}</b>
    <p className="">{props.descripcionBeneficio}</p>
    </div>
    );
}

export default Beneficios;

