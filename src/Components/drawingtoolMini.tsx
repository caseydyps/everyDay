import 'firebase/firestore';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components/macro';
import { db } from '../config/firebase.config';
import UserAuthData from './Login/Auth';

const Container = styled.div`
  width: 100%;
  height: 100%;
  margin-top: 0px;
`;

const CanvasContainer = styled.div`
  max-width: 733px;
  height: 240px;
`;

type StrokeData = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color: string;
  width: number;
};

const DrawingTool = () => {
  const [isPainting, setIsPainting] = useState<boolean>(false);
  const [color, setColor] = useState<string>('black');
  const [width, setWidth] = useState<number>(5);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [undoStack, setUndoStack] = useState<any[]>([]);
  const prevOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [strokes, setStrokes] = useState<any>([]);
  const { familyId } = UserAuthData();
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    console.log(
      canvas.width,
      canvas.height,
      canvas.style.width,
      canvas.style.height
    );
    const context = canvas.getContext('2d');
    if (!context) return;
    context.scale(1, 1);
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
    contextRef.current.beginPath();
    prevOffset.current = { x: offsetX, y: offsetY };
  };

  const endPaint = () => {
    if (!contextRef.current) return;
    contextRef.current.lineWidth = width;
    contextRef.current.closePath();
    setIsPainting(false);
  };

  useEffect(() => {
    const loadStrokes = async () => {
      const strokesCollectionRef = collection(
        db,
        'Family',
        familyId,
        'canva',
        familyId,
        'strokes'
      );
      try {
        const querySnapshot = await getDocs(strokesCollectionRef);
        const strokesData = querySnapshot.docs.map((doc) => doc.data().strokes);
        console.log('Strokes data retrieved from Firestore:', strokesData);

        strokesData.forEach((stroke, index) => {
          stroke.forEach((s: StrokeData) => {
            console.log(s);
            handleStrokeUpdate(s);
          });
        });
        loadCanvas();
        console.log('Canvas loaded successfully');
      } catch (error) {
        console.error('Error loading canvas:', error);
      }
    };

    loadStrokes();
  }, [familyId]);

  const stackLimit = 500;

  const paint = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPainting) {
      return;
    }
    const { offsetX, offsetY } = nativeEvent;
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        const startX = prevOffset.current.x;
        const startY = prevOffset.current.y;
        context.lineTo(offsetX, offsetY);
        context.stroke();
        const newStroke: StrokeData = {
          startX: prevOffset.current.x,
          startY: prevOffset.current.y,
          endX: offsetX,
          endY: offsetY,
          color,
          width,
        };
        setStrokes([...strokes, newStroke]);
        const state = context.getImageData(0, 0, canvas.width, canvas.height);
        setUndoStack((prevStack) => [...prevStack, state]);
        prevOffset.current = { x: offsetX, y: offsetY };
      }
    }
  };

  const handleStrokeUpdate = (strokeData: StrokeData) => {
    if (!canvasRef.current || !contextRef.current) return;
    const context = contextRef.current;
    console.log(strokeData);
    context.beginPath();
    context.moveTo(strokeData.startX, strokeData.startY);
    context.lineTo(strokeData.endX, strokeData.endY);
    context.lineWidth = strokeData.width;
    context.strokeStyle = strokeData.color;
    context.stroke();
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

    const strokesCollectionRef = collection(
      db,
      'Family',
      familyId,
      'canva',
      familyId,
      'strokes'
    );
    try {
      const querySnapshot = await getDocs(strokesCollectionRef);
      const strokesData = querySnapshot.docs.map((doc) => doc.data().strokes);
      console.log('Strokes data retrieved from Firestore:', strokesData);

      strokesData.forEach((stroke, index) => {
        stroke.forEach((s: StrokeData) => {
          console.log(s);
          handleStrokeUpdate(s);
        });
      });

      console.log('Canvas loaded successfully');
    } catch (error) {
      console.error('Error loading canvas:', error);
    }
  };

  if (undoStack.length < stackLimit) {
    undoStack.shift();
    undoStack.pop();
  }

  return (
    <Container>
      <CanvasContainer>
        <canvas
          id="canvas"
          ref={canvasRef}
          onMouseDown={startPaint}
          onMouseUp={endPaint}
          onMouseMove={paint}
          style={{
            height: 'auto',
            maxWidth: '733px',
            maxHeight: '240px',
            minHeight: '240px',
            width: '733px',
            borderRadius: '10px',
            backgroundColor: 'rgb(255, 255, 255)',
          }}
        />
      </CanvasContainer>
    </Container>
  );
};

export default DrawingTool;
