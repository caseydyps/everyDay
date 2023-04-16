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
  onSnapshot,
  QuerySnapshot,
  setDoc,
  getDoc,
  writeBatch,
  startAfter,
  CollectionReference,
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

    // Add this line to start a new path when starting to draw
    contextRef.current.beginPath();

    prevOffset.current = { x: offsetX, y: offsetY };
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

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(
        db,
        'Family',
        'Nkl0MgxpE9B1ieOsOoJ9',
        'canva',
        'xoQi8suQkRBSHmELkazx',
        'strokes'
      ),
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            handleStrokeUpdate(change.doc.data() as StrokeData);
          }
        });
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

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
          const startX = prevOffset.current.x;
          const startY = prevOffset.current.y;
          context.lineTo(offsetX, offsetY);
          context.stroke();

          // Save the stroke to Firestore
          addStroke({
            startX,
            startY,
            endX: offsetX,
            endY: offsetY,
            color,
            width,
          });

          // Update the undo stack
          const state = context.getImageData(0, 0, canvas.width, canvas.height);
          setUndoStack((prevStack) => [...prevStack, state]);

          prevOffset.current = { x: offsetX, y: offsetY };
        }
      }
    },
    20
  );

  const addStroke = async (strokeData: StrokeData) => {
    const strokesCollectionRef = collection(
      db,
      'Family',
      'Nkl0MgxpE9B1ieOsOoJ9',
      'canva',
      'xoQi8suQkRBSHmELkazx',
      'strokes'
    );
    await addDoc(strokesCollectionRef, strokeData);
  };

  const handleStrokeUpdate = (strokeData: StrokeData) => {
    if (!canvasRef.current || !contextRef.current) return;
    const context = contextRef.current;

    context.beginPath();
    context.moveTo(strokeData.startX, strokeData.startY);
    context.lineTo(strokeData.endX, strokeData.endY);
    context.lineWidth = strokeData.width;
    context.strokeStyle = strokeData.color;
    context.stroke();
  };

  const handleChangeColor = (newColor: string) => {
    setColor(newColor);
  };

  const handleChangeLineWidth = (newWidth: number) => {
    setWidth(newWidth);
  };
  const clearCanvas = async () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context?.clearRect(0, 0, canvas.width, canvas.height);
    const strokesCollectionRef: CollectionReference = collection(
      db,
      'Family',
      'Nkl0MgxpE9B1ieOsOoJ9',
      'canva',
      'xoQi8suQkRBSHmELkazx',
      'strokes'
    );

    const deleteDocumentsInBatch:any = async (
      querySnapshot: QuerySnapshot<StrokeData>
    ) => {
      const batch = writeBatch(db);

      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
    };

    const deleteAllStrokes = async () => {
      let querySnapshot = await getDocs(strokesCollectionRef);

      while (!querySnapshot.empty) {
        // Process the documents in batches
        await deleteDocumentsInBatch(querySnapshot);

        // Get the next batch of documents
        const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
        const nextQuerySnapshot:any = await getDocs(
          query(strokesCollectionRef, startAfter(lastVisible))
        );
        querySnapshot = nextQuerySnapshot;
      }
    };

    await deleteAllStrokes();
    setUndoStack([]);
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
      'xoQi8suQkRBSHmELkazx',
      'strokes'
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

  if (undoStack.length < stackLimit) {
    undoStack.shift();
    undoStack.pop();
  }
  return (
    <>
      <ButtonWrap>
        <button onClick={() => handleChangeColor('black')}>Black</button>
        <button onClick={() => handleChangeColor('red')}>Red</button>
        <button onClick={() => handleChangeColor('green')}>Green</button>
        <button onClick={() => handleChangeColor('blue')}>Blue</button>
        <button onClick={() => handleChangeColor('white')}>Eraser</button>
        <button onClick={() => handleChangeLineWidth(5)}>Default</button>
        <button onClick={() => handleChangeLineWidth(1)}>Thin</button>
        <button onClick={() => handleChangeLineWidth(30)}>Wide</button>
        <button onClick={undoStroke}>Undo</button>
        <button onClick={clearCanvas}>Clear</button>
        {/* <button onClick={addStroke}>Save</button>
        <button onClick={loadCanvas}>load</button> */}
      </ButtonWrap>
      <div>{`Strokes: ${undoStack.length}`}</div>
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
