import Articulosinf from './articulosinf';

export default function ArticlesSection() {
  return (
    <section className="py-12 px-4 md:px-8 bg-white">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
          Últimos artículos
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Articulosinf
            tituloArticulo="5 hábitos diarios para mejorar tu inglés"
            descripcionArticulo="Los errores son partes del proceso de aprendizaje Aprender ingles puede ser dificil y cometer errores"
            imgArticulo="1"
          />

          <Articulosinf
            tituloArticulo="Consejos para superar el miedo"
            descripcionArticulo="Los errores son partes del proceso de aprendizaje Aprender ingles puede ser dificil y cometer errores"
            imgArticulo="1"
          />

          <Articulosinf
            tituloArticulo="Técnicas de estudio efectivas"
            descripcionArticulo="Los errores son partes del proceso de aprendizaje Aprender ingles puede ser dificil y cometer errores"
            imgArticulo="1"
          />

          <Articulosinf
            tituloArticulo="Cómo mantener la motivación"
            descripcionArticulo="Los errores son partes del proceso de aprendizaje Aprender ingles puede ser dificil y cometer errores"
            imgArticulo="1"
          />
        </div>
      </div>
    </section>
  );
}