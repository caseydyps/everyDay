import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components/macro';
const CanvasWrap = styled.div`
  width: 80%;
  height: auto;
  border: 2px solid black;
`;

const DrawingTool = () => {
  const [isPainting, setIsPainting] = useState(false);
  const [color, setColor] = useState('black');
  const [width, setWidth] = useState(5);
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
    context.lineWidth = width;
    context.strokeStyle = color;
    contextRef.current = context;
  }, []);

  const startPaint = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.strokeStyle = color;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsPainting(true);
  };

  const endPaint = () => {
    contextRef.current.lineWidth = width;
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

  const handleChangeColor = (newColor) => {
    setColor(newColor);
  };

  const handleChangeLineWidth = (newWidth) => {
    setWidth(newWidth);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <CanvasWrap>
      <button onClick={() => handleChangeColor('black')}>Black</button>
      <button onClick={() => handleChangeColor('red')}>Red</button>
      <button onClick={() => handleChangeColor('green')}>Green</button>
      <button onClick={() => handleChangeColor('blue')}>Blue</button>
      <button onClick={() => handleChangeLineWidth(5)}>Default</button>
      <button onClick={() => handleChangeLineWidth(1)}>Thin</button>
      <button onClick={() => handleChangeLineWidth(30)}>Wide</button>
      <button onClick={clearCanvas}>Clear</button>
      <canvas
        id="canvas"
        ref={canvasRef}
        onMouseDown={startPaint}
        onMouseUp={endPaint}
        onMouseMove={paint}
      />
    </CanvasWrap>
  );
};

export default DrawingTool;
