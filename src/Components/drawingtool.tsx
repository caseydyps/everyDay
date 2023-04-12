import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components/macro';
import { db } from '../config/firebase.config';
import firebase from 'firebase/app';
import 'firebase/firestore';
import {
  collection,
  updateDoc,
  getDocs,
  doc,
  addDoc,
  deleteDoc,
  setDoc,
  getDoc,
  query,
  where,
} from 'firebase/firestore';
const CanvasWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: stretch;
  margin: 0 auto;
  max-width: 1200px;
  overflow: hidden;

  canvas {
    border: 1px solid #ccc;
    width: 100%;
    height: 100%;
  }
`;

const ButtonWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: stretch;
  margin: 0 auto;
  width: 100%;
  max-width: 800px;
`;

const DrawingTool = () => {
  const [isPainting, setIsPainting] = useState<boolean>(false);
  const [color, setColor] = useState<string>('black');
  const [width, setWidth] = useState<number>(5);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [undoStack, setUndoStack] = useState<any[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth * 2;
    canvas.height = window.innerHeight * 2;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    const context = canvas.getContext('2d');
    if (!context) return;
    context.scale(2, 2);
    context.lineCap = 'round';
    context.lineWidth = width;
    context.strokeStyle = color;
    contextRef.current = context;
  }, []);

  const startPaint = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = nativeEvent;
    if (!contextRef.current) return;
    contextRef.current.strokeStyle = color;
    contextRef.current.lineWidth = width;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsPainting(true);
    // undoStack.push(
    //   contextRef.current.getImageData(
    //     0,
    //     0,
    //     canvasRef.current.width,
    //     canvasRef.current.height
    //   )
    // );
  };

  const endPaint = () => {
    if (!contextRef.current) return;
    contextRef.current.lineWidth = width;
    contextRef.current.closePath();
    setIsPainting(false);
    // const canvas = canvasRef.current;
    // const context = canvas.getContext('2d');
  };

  const throttle = <T extends any[]>(
    callback: (...args: T) => void,
    delay: number
  ) => {
    let previousCall = new Date().getTime();
    return (...args: T) => {
      const time = new Date().getTime();

      if (time - previousCall >= delay) {
        previousCall = time;
        callback.apply(null, args);
      }
    };
  };

  const stackLimit = 500; // maximum stack size

  const paint = throttle(
    ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isPainting) {
        return;
      }
      const { offsetX, offsetY } = nativeEvent;
      const canvas = canvasRef.current;
      if (canvas) {
        const context = canvas.getContext('2d');
        if (context) {
          context.lineTo(offsetX, offsetY);
          context.stroke();
          console.log(undoStack.length);
          if (undoStack.length < stackLimit) {
            undoStack.push(
              context.getImageData(0, 0, canvas.width, canvas.height)
            ); // save the current state
          } else {
            alert("You've reached the maximum number of strokes!");
            setUndoStack([]);
          }
        }
      }
    },
    20
  );

  const handleChangeColor = (newColor: string) => {
    setColor(newColor);
  };

  const handleChangeLineWidth = (newWidth: number) => {
    setWidth(newWidth);
  };
  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context?.clearRect(0, 0, canvas.width, canvas.height);
  };

  const undoStroke = () => {
    const canvas = canvasRef.current;
    const context = canvas ? canvas.getContext('2d') : null;
    console.log(undoStack);
    const lastState = undoStack.pop(); // get the last saved state from the stack
    if (lastState && context) {
      context.putImageData(lastState, 0, 0); // restore the last saved state
      setUndoStack(undoStack.slice(0, undoStack.length - 1)); // remove the last state from the stack
    }
  };

  const saveCanvas = async () => {
    const canvas = canvasRef.current;
    const dataURL = canvas ? canvas.toDataURL() : null;
    if (dataURL) {
      const canvaDocRef = doc(
        db,
        'Family',
        'Nkl0MgxpE9B1ieOsOoJ9',
        'canva',
        'xoQi8suQkRBSHmELkazx'
      );
      try {
        await setDoc(canvaDocRef, { dataURL });
        console.log('Canvas data has been saved to Firestore!');
      } catch (error) {
        console.error('Error saving canvas data to Firestore: ', error);
      }
    }
  };
  const loadCanvas = async () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    const familyDocRef = doc(
      db,
      'Family',
      'Nkl0MgxpE9B1ieOsOoJ9',
      'canva',
      'xoQi8suQkRBSHmELkazx'
    );
    try {
      const docSnapshot = await getDoc(familyDocRef);
      if (docSnapshot.exists()) {
        const dataURL = docSnapshot.data().dataURL;
        console.log(dataURL);
        const image = new Image();
        image.onload = () => {
          canvas.width = image.width;
          canvas.height = image.height;
          context.drawImage(image, 0, 0);

          // Set context properties
          contextRef.current = context;
          contextRef.current.scale(2, 2);
          contextRef.current.lineCap = 'round';
          contextRef.current.lineWidth = width;
          contextRef.current.strokeStyle = color;
        };
        image.src = dataURL;
      }
    } catch (error) {
      console.error('Error loading canvas data from Firestore: ', error);
    }
  };

  return (
    <>
      <ButtonWrap>
        <button onClick={() => handleChangeColor('black')}>Black</button>
        <button onClick={() => handleChangeColor('red')}>Red</button>
        <button onClick={() => handleChangeColor('green')}>Green</button>
        <button onClick={() => handleChangeColor('blue')}>Blue</button>
        <button onClick={() => handleChangeLineWidth(5)}>Default</button>
        <button onClick={() => handleChangeLineWidth(1)}>Thin</button>
        <button onClick={() => handleChangeLineWidth(30)}>Wide</button>
        <button onClick={undoStroke}>Undo</button>
        <button onClick={clearCanvas}>Clear</button>
        <button onClick={saveCanvas}>Save</button>
        <button onClick={loadCanvas}>load</button>
      </ButtonWrap>

      <CanvasWrap>
        <canvas
          id="canvas"
          ref={canvasRef}
          onMouseDown={startPaint}
          onMouseUp={endPaint}
          onMouseMove={paint}
        />
      </CanvasWrap>
    </>
  );
};

export default DrawingTool;
