import React from "react";

function CursosInf(props) {
    return (
    <div className="contenedorCursosInf">
     <img 
        className="imagenCursos"
        src={`/img/nivel${props.imgCurso}.png`} 
        alt="imagen Cursos" 
     />
     <h3 className=""> <img src="/img/iconoCheck.png" alt="" />{props.nombreNivelCurso} </h3>
     <p className=""> {props.descripcionNivelCurso} </p>
     <a href={`${props.LinkCurso}`} className='contacto'><button>Ver mas &gt;</button></a>
    </div>
    );
}

export default CursosInf;