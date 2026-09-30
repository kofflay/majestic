import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval;

    const handleStart = () => {
      setLoading(true);
      setProgress(0);
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 15;
        });
      }, 200);
    };

    const handleComplete = () => {
      setProgress(100);
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 300);
      clearInterval(interval);
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
      clearInterval(interval);
    };
  }, [router]);

  return (
    <>
      {loading && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(10,10,26,0.97)', zIndex: 99999,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ perspective: '800px', marginBottom: '40px' }}>
            <div style={{
              width: '70px', height: '70px',
              transformStyle: 'preserve-3d',
              animation: 'cubeRotate 2s infinite linear'
            }}>
              <style>{`
                @keyframes cubeRotate {
                  from { transform: rotateX(0deg) rotateY(0deg); }
                  to { transform: rotateX(360deg) rotateY(360deg); }
                }
              `}</style>
              <div style={{ position:'absolute',width:'100%',height:'100%',border:'2px solid #5865F2',background:'rgba(88,101,242,0.15)',transform:'rotateY(0deg) translateZ(35px)' }} />
              <div style={{ position:'absolute',width:'100%',height:'100%',border:'2px solid #4CAF50',background:'rgba(76,175,80,0.15)',transform:'rotateY(90deg) translateZ(35px)' }} />
              <div style={{ position:'absolute',width:'100%',height:'100%',border:'2px solid #FF9800',background:'rgba(255,152,0,0.15)',transform:'rotateY(180deg) translateZ(35px)' }} />
              <div style={{ position:'absolute',width:'100%',height:'100%',border:'2px solid #FF69B4',background:'rgba(255,105,180,0.15)',transform:'rotateY(-90deg) translateZ(35px)' }} />
              <div style={{ position:'absolute',width:'100%',height:'100%',border:'2px solid #00BCD4',background:'rgba(0,188,212,0.15)',transform:'rotateX(90deg) translateZ(35px)' }} />
              <div style={{ position:'absolute',width:'100%',height:'100%',border:'2px solid #9C27B0',background:'rgba(156,39,176,0.15)',transform:'rotateX(-90deg) translateZ(35px)' }} />
            </div>
          </div>

          <div style={{ color: 'white', fontSize: '20px', fontWeight: 700, marginBottom: '20px', letterSpacing: '2px' }}>
            LSPD FORMS
          </div>

          <div style={{ width: '250px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{
              width: `${Math.min(progress, 100)}%`, height: '100%',
              background: 'linear-gradient(90deg, #5865F2, #4CAF50, #FF9800)',
              borderRadius: '3px', transition: 'width 0.3s ease'
            }} />
          </div>
          <div style={{ color: '#8b8ba7', fontSize: '14px', marginTop: '10px' }}>
            {Math.min(Math.floor(progress), 100)}%
          </div>
        </div>
      )}

      <style jsx global>{`
        * { 
          margin: 0; 
          padding: 0; 
          box-sizing: border-box; 
        }
        
        html {
          font-size: 16px;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #0a0a1a;
          color: white;
          font-feature-settings: 'cv11', 'ss01';
          line-height: 1.5;
        }

        input, textarea, button, select {
          font-family: inherit;
        }

        /* Цифры и код — моноширинный */
        code, .mono, [data-mono] {
          font-family: 'JetBrains Mono', 'SF Mono', Monaco, monospace;
        }

        /* Курсор */
        a, button, input, textarea, select, [onclick], .card, .back-btn, .submit-btn, .logout-btn, .copy-btn {
          cursor: pointer;
        }

        /* Скроллбар */
        ::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 5px;
          border: 2px solid transparent;
          background-clip: content-box;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
          background-clip: content-box;
        }

        /* Селекты */
        select option {
          background: #1a1a3e;
          color: white;
        }

        /* Убираем синее выделение */
        ::selection {
          background: rgba(88, 101, 242, 0.4);
        }

        /* Кнопки */
        button {
          transition: all 0.2s ease;
        }

        button:active:not(:disabled) {
          transform: scale(0.98);
        }

        /* Inputs */
        input:focus, textarea:focus, select:focus {
          outline: none;
        }
      `}</style>
      <Component {...pageProps} />
    </>
  );
}
