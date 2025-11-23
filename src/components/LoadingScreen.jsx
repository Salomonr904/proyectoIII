import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoadingScreen = ({ redirectTo }) => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  const images = [
    '/img/Imagin1.png',
    '/img/Imagin2.png',
    '/img/Imagin3.png',
    '/img/Imagin4.png'
  ];

  useEffect(() => {
    if (index < images.length - 1) {
      const timer = setTimeout(() => {
        setIndex(prev => prev + 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      const redirectTimer = setTimeout(() => {
        navigate(redirectTo);
      }, 1000);
      return () => clearTimeout(redirectTimer);
    }
  }, [index, images.length, navigate, redirectTo]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <img 
        src={images[index]} 
        alt={`Imagen ${index + 1}`} 
        className="w-50 h-50 object-contain max-w-4xl max-h-4xl" 
      />
    </div>
  );
};

export default LoadingScreen;




