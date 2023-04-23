import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components/macro';
import { db } from '../config/firebase.config';
import firebase from 'firebase/app';
import 'firebase/firestore';
import DefaultButton from './Button/Button';
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFilter,
  faPlus,
  faCirclePlus,
  faPlusCircle,
  faPenToSquare,
  faTrashCan,
  faCircleXmark,
  faMagnifyingGlass,
  faRotateLeft,
  faEraser,
  faPencil,
  faCircle,
  faPaintRoller,
  faClockRotateLeft,
  faBroom,
  faPen,
} from '@fortawesome/free-solid-svg-icons';
const CanvasWrap = styled.div`
  canvas {
    border: 1px solid #;
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
  position: absolute;
  top: 0;
  right: 50%;
  transform: translate(50%, 0);

  @media screen and (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    top: 0%;
    right: 30px;
    position: absolute;
  }
`;

const Container = styled.div`
  max-width: 100%;
  height: 100%;
`;

const CanvasButton = styled(DefaultButton)`
  border-radius: 50%;
  background-color: ${({ color }) => color};
  margin-top: 20px;
  color: white;
  margin-right: 5px;
  margin-left: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
`;

const CanvasContainer = styled.div`
  max-width: 100%;
  height: auto;
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
    canvas.height = 600 * 2;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${600}px`;
    console.log(
      canvas.width,
      canvas.height,
      canvas.style.width,
      canvas.style.height
    );
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

    const deleteDocumentsInBatch: any = async (
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
        const nextQuerySnapshot: any = await getDocs(
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
    <Container>
      {/* <div>{`Strokes: ${undoStack.length}`}</div> */}
      <CanvasContainer>
        <canvas
          id="canvas"
          ref={canvasRef}
          onMouseDown={startPaint}
          onMouseUp={endPaint}
          onMouseMove={paint}
          style={{
            height: 'auto',
            maxWidth: '100%',
            maxHeight: '600px',
            border: '2px solid transparent',
            boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.75)',
            borderRadius: '25px',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
          }}
        />
      </CanvasContainer>
      <ButtonWrap>
        <CanvasButton
          color="black"
          onClick={() => handleChangeColor('black')}
        ></CanvasButton>
        <CanvasButton
          color="red"
          onClick={() => handleChangeColor('red')}
        ></CanvasButton>
        <CanvasButton
          color="green"
          onClick={() => handleChangeColor('green')}
        ></CanvasButton>
        <CanvasButton
          color="blue"
          onClick={() => handleChangeColor('blue')}
        ></CanvasButton>
        <CanvasButton
          color="transparent"
          onClick={() => handleChangeColor('white')}
        >
          <FontAwesomeIcon icon={faEraser} />
        </CanvasButton>
        <CanvasButton
          color="transparent"
          onClick={() => handleChangeLineWidth(5)}
        >
          <FontAwesomeIcon icon={faPen} />
        </CanvasButton>
        <CanvasButton
          color="transparent"
          onClick={() => handleChangeLineWidth(1)}
        >
          <FontAwesomeIcon icon={faPencil} />
        </CanvasButton>
        <CanvasButton
          color="transparent"
          onClick={() => handleChangeLineWidth(30)}
        >
          <FontAwesomeIcon icon={faPaintRoller} />
        </CanvasButton>
        <CanvasButton color="transparent" onClick={undoStroke}>
          <FontAwesomeIcon icon={faClockRotateLeft} />
        </CanvasButton>
        <CanvasButton color="transparent" onClick={clearCanvas}>
          <FontAwesomeIcon icon={faBroom} />
        </CanvasButton>
        {/* <button onClick={addStroke}>Save</button>
    <button onClick={loadCanvas}>load</button> */}
      </ButtonWrap>
    </Container>
  );
};

export default DrawingTool;
