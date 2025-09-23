import React from "react";

function Beneficios(props) {
    return (
    <div className={`rounded-lg p-5 h-43 flex flex-col transition-all duration-300 ${props.colorClass}`}>
     <div className="flex items-center mb-4">
         <div className=" rounded-full shadow-sm mr-4">
             <img 
                 className="w-7 h-7 object-contain"
                 src={`/img/icono-${props.imgBeneficio}.png`} 
                 alt={props.tituloBeneficio}
             />
         </div>
         <b className="text-xl font-semibold text-gray-800">{props.tituloBeneficio}</b>
     </div>
     <p className="text-gray-600 leading-relaxed pl-16">{props.descripcionBeneficio}</p>
    </div>
    );
}

export default Beneficios;