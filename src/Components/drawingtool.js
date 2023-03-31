import React, { useState, useRef, useEffect } from 'react';

const DrawingTool = () => {
  const [isPainting, setIsPainting] = useState(false);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * 2;
    canvas.height = window.innerHeight * 2;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    const context = canvas.getContext('2d');
    context.scale(2, 2);
    context.lineCap = 'round';
    context.strokeStyle = 'black';
    context.lineWidth = 5;
    contextRef.current = context;
  }, []);

  const startPaint = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsPainting(true);
  };

  const endPaint = () => {
    contextRef.current.closePath();
    setIsPainting(false);
  };

  const paint = ({ nativeEvent }) => {
    if (!isPainting) {
      return;
    }
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <>
      <canvas
        id="canvas"
        ref={canvasRef}
        onMouseDown={startPaint}
        onMouseUp={endPaint}
        onMouseMove={paint}
      />
      <button onClick={clearCanvas}>Clear</button>
    </>
  );
};

export default DrawingTool;
