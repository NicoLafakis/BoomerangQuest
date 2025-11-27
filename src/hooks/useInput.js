import { useCallback, useEffect, useRef, useState } from 'react';

export function useGameLoop(callback, fps = 60) {
  const requestRef = useRef();
  const previousTimeRef = useRef();
  const callbackRef = useRef(callback);
  
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  
  const animate = useCallback((time) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      const interval = 1000 / fps;
      
      if (deltaTime >= interval) {
        callbackRef.current(deltaTime);
        previousTimeRef.current = time - (deltaTime % interval);
      }
    } else {
      previousTimeRef.current = time;
    }
    requestRef.current = requestAnimationFrame(animate);
  }, [fps]);
  
  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [animate]);
}

export function useKeyboard() {
  const [keys, setKeys] = useState({});
  const keysRef = useRef({});
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'w', 'a', 's', 'd', 'Shift'].includes(e.key)) {
        e.preventDefault();
      }
      keysRef.current[e.key.toLowerCase()] = true;
      keysRef.current[e.code] = true;
      setKeys({ ...keysRef.current });
    };
    
    const handleKeyUp = (e) => {
      keysRef.current[e.key.toLowerCase()] = false;
      keysRef.current[e.code] = false;
      setKeys({ ...keysRef.current });
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  
  return keysRef;
}

export function useMouse() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mouseDown, setMouseDown] = useState(false);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const mouseDownRef = useRef(false);
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      const rect = e.target.closest('svg')?.getBoundingClientRect();
      if (rect) {
        const scaleX = 1200 / rect.width;
        const scaleY = 675 / rect.height;
        mousePosRef.current = {
          x: (e.clientX - rect.left) * scaleX,
          y: (e.clientY - rect.top) * scaleY
        };
        setMousePos(mousePosRef.current);
      }
    };
    
    const handleMouseDown = () => {
      mouseDownRef.current = true;
      setMouseDown(true);
    };
    
    const handleMouseUp = () => {
      mouseDownRef.current = false;
      setMouseDown(false);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);
  
  return { mousePos: mousePosRef, mouseDown: mouseDownRef };
}
