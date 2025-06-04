import React from "react";

function CursosInf(props) {
    return (
    <div className="contenedorCursosInf">
     <img 
        className="imagenCursos"
        src={`/img/nivel${props.imgCurso}.png`} 
        alt="imagen Cursos" 
     />
     <h3 className=""> {props.nombreNivelCurso} </h3>
     <p className=""> {props.descripcionNivelCurso} </p>
    </div>
    );
}

export default CursosInf;