import React from 'react';

const RecursoListening = ({ tipo, nivel }) => {
  const titulo = `Nivel ${nivel} - ${tipo.toUpperCase()}`;

  const renderContenido = () => {
    switch (tipo) {
      case 'video':
        return (
          <video controls className="w-full max-w-2xl mx-auto mt-6 rounded-md shadow">
            <source src={`/media/listening${nivel}.mp4`} type="video/mp4" />
            Tu navegador no soporta video.
          </video>
        );
      case 'audio':
        return (
          <audio controls className="w-full max-w-xl mx-auto mt-6">
            <source src={`/media/listening${nivel}.mp3`} type="audio/mp3" />
            Tu navegador no soporta audio.
          </audio>
        );
      case 'pdf':
        return (
          <iframe
            src={`/media/listening${nivel}.pdf`}
            className="w-full h-[600px] mt-6 rounded-md shadow"
            title={`PDF Listening ${nivel}`}
          />
        );
      default:
        return <p className="text-gray-600">Recurso no disponible.</p>;
    }
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{titulo}</h2>
      {renderContenido()}
    </div>
  );
};

export default RecursoListening;