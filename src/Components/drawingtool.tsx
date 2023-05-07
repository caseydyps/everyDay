import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components/macro';
import { db } from '../config/firebase.config';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { arrayUnion } from 'firebase/firestore';
import DefaultButton from './Button/Button';
import { ChromePicker } from 'react-color';
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
import UserAuthData from './Login/Auth';
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
  faFloppyDisk,
  faPencil,
  faCircle,
  faPaintRoller,
  faClockRotateLeft,
  faBroom,
  faPen,
} from '@fortawesome/free-solid-svg-icons';
const CanvasWrap = styled.div`
  canvas {
    border: 1px solid;
    width: 100%;
    height: 100%;
  }
`;

const ButtonWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: stretch;
  margin: 0 auto;
  border: 2px solid #d7dde2;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: rgba(142, 142, 142, 0.19) 0px 6px 15px 0px;
  -webkit-box-shadow: rgba(142, 142, 142, 0.19) 0px 6px 15px 0px;
  border-radius: 12px;
  -webkit-border-radius: 12px;
  color: rgba(255, 255, 255, 0.75);
  flex-direction: column;
  position: absolute;
  top: 40%;
  right: 2%;
  padding: 5px;

  @media screen and (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    top: 0%;
    right: 30px;
    position: absolute;
  }
`;

const Container = styled.div`
  width: 737px;
  height: 404px;
  margin-top: 50px;
`;

const CanvasButton = styled(DefaultButton)`
  border-radius: 50%;
  background-color: transparent;

  padding: 5px;
  color: #5981b0;
  margin-right: 5px;
  margin-left: 5px;
  border: none;
  // box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
`;

const CanvasContainer = styled.div`
  max-width: 741px;
  height: 244px;
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
  const [currentColor, setCurrentColor] = useState('#000000'); // Default color is black
  const [strokes, setStrokes] = useState<any>([]);
  //const [lineWidth, setLineWidth] = useState(5);
  const {
    user,
    userName,
    googleAvatarUrl,
    userEmail,
    hasSetup,
    familyId,
    setHasSetup,
    membersArray,
    memberRolesArray,
  } = UserAuthData();
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

  //   callback: (...args: T) => void,
  //   delay: number
  // ) => {
  //   let previousCall = new Date().getTime();
  //   return (...args: T) => {
  //     const time = new Date().getTime();

  //     if (time - previousCall >= delay) {
  //       previousCall = time;
  //       callback.apply(null, args);
  //     }
  //   };
  // };
  useEffect(() => {
    const loadStrokes = async () => {
      // Retrieve the strokes from Firestore when the component mounts
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

        // Load the canvas
        loadCanvas();

        console.log('Canvas loaded successfully');
      } catch (error) {
        console.error('Error loading canvas:', error);
      }
    };

    loadStrokes();
  }, [familyId]);

  const stackLimit = 500; // maximum stack size

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

        // Save the stroke to Firestore
        // addStroke({
        //   startX,
        //   startY,
        //   endX: offsetX,
        //   endY: offsetY,
        //   color,
        //   width,
        // });

        const newStroke: StrokeData = {
          startX: prevOffset.current.x,
          startY: prevOffset.current.y,
          endX: offsetX,
          endY: offsetY,
          color,
          width,
        };
        setStrokes([...strokes, newStroke]);

        // Update the undo stack
        const state = context.getImageData(0, 0, canvas.width, canvas.height);
        setUndoStack((prevStack) => [...prevStack, state]);

        prevOffset.current = { x: offsetX, y: offsetY };
      }
    }
  };

  const addStroke = async (strokeData: StrokeData) => {
    console.log('Adding stroke to Firestore:', strokeData);
    const strokesCollectionRef = collection(
      db,
      'Family',
      familyId,
      'canva',
      familyId,
      'strokes'
    );
    console.log(strokes);

    const strokeObject = { strokes };

    try {
      const docRef = await addDoc(strokesCollectionRef, strokeObject);
      console.log('Stroke added to Firestore with ID:', docRef.id);
      //handleStrokeUpdate(strokes);
    } catch (error) {
      console.error('Error adding stroke to Firestore:', error);
    }
  };

  // const loadCanvas = async () => {
  //   const strokesCollectionRef = collection(
  //     db,
  //     'Family',
  //     familyId,
  //     'canva',
  //     familyId,
  //     'strokes'
  //   );

  //   try {
  //     const querySnapshot = await getDocs(strokesCollectionRef);
  //     const strokesData = querySnapshot.docs.map((doc) => doc.data().strokes);
  //     console.log('Strokes data retrieved from Firestore:', strokesData);

  //     strokesData.forEach((stroke) => {
  //       // redraw the stroke on the canvas
  //       // you will need to implement this part based on your specific canvas implementation
  //     });

  //     console.log('Canvas loaded successfully');
  //   } catch (error) {
  //     console.error('Error loading canvas:', error);
  //   }
  // };
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

  const handleChangeColor = (newColor: string) => {
    //addStroke(strokes);
    setColor(newColor);
  };

  const handleChangeLineWidth = (newWidth: number) => {
    //addStroke(strokes);
    setWidth(newWidth);
  };
  const clearCanvas = async () => {
    const collectionRef = collection(
      db,
      'Family',
      familyId,
      'canva',
      familyId,
      'strokes'
    );

    const querySnapshot = await getDocs(collectionRef);

    querySnapshot.forEach(async (doc) => {
      try {
        await deleteDoc(doc.ref);
        console.log(`Document ${doc.id} deleted successfully`);
      } catch (error) {
        console.error(`Error deleting document ${doc.id}:`, error);
      }
    });
    setStrokes([]);
    console.log('Strokes array cleared');

    window.location.reload();
  };

  const undoStroke = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      if (context && undoStack.length > 0) {
        // Restore the previous state from the undo stack
        const prevState = undoStack[undoStack.length - 1];
        context.putImageData(prevState, 0, 0);

        // Update the undo stack to remove the previous state
        setUndoStack(undoStack.slice(0, -1));
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

  const [isAdding, setIsAdding] = useState(false);

  const handleClick = async () => {
    setIsAdding(true);
    const strokeData = {
      /* populate stroke data here */
    };
    try {
      console.log(strokes);
      await addStroke(strokes);
      console.log('Stroke added successfully');
    } catch (error) {
      console.error('Error adding stroke:', error);
    }
    setIsAdding(false);
  };

  return (
    <Container>
      {/* <div>{`Strokes: ${undoStack.length}`}</div> */}
      <CanvasContainer>
        <ButtonWrap>
          <CanvasButton onClick={handleClick}>
            <FontAwesomeIcon icon={faFloppyDisk} />
          </CanvasButton>
          <CanvasButton onClick={loadCanvas}>load</CanvasButton>
          <CanvasButton>
            <input
              type="color"
              onChange={(event) => handleChangeColor(event.target.value)}
              style={{
                width: '2em',
                height: '2em',
                borderRadius: '50%',
                padding: 0,
                margin: 0,
                appearance: 'none',
                border: 'none',
                backgroundColor: 'transparent',
                outline: 'none',
              }}
            />
          </CanvasButton>
          {/* <CanvasButton
          color="black"
          onClick={() => handleChangeColor('black')}
          type="button"
        ></CanvasButton>
        <CanvasButton
          color="red"
          onClick={() => handleChangeColor('red')}
          type="button"
        ></CanvasButton>
        <CanvasButton
          color="green"
          onClick={() => handleChangeColor('green')}
          type="button"
        ></CanvasButton>
        <CanvasButton
          color="blue"
          onClick={() => handleChangeColor('blue')}
          type="button"
        ></CanvasButton> */}
          <CanvasButton
            color="transparent"
            onClick={() => handleChangeColor('white')}
            type="button"
          >
            <FontAwesomeIcon icon={faEraser} />
          </CanvasButton>
          {/* <input
            type="range"
            id="lineWidth"
            min="1"
            max="50"
            value={width}
            onChange={handleLineWidthChange}
            style={{
              WebkitAppearance: 'none',
              appearance: 'none',
              width: '100%',
              height: '10px',
              background: '#d3d3d3',
              outline: 'none',
              opacity: '0.7',
              transition: 'opacity .2s',
              borderRadius: '10px',
            }}
          /> */}
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
          {/* <CanvasButton color="transparent" onClick={undoStroke}>
            <FontAwesomeIcon icon={faClockRotateLeft} />
          </CanvasButton> */}
          <CanvasButton color="transparent" onClick={clearCanvas}>
            <FontAwesomeIcon icon={faBroom} />
          </CanvasButton>
          {/* <button onClick={addStroke}>Save</button>
    <button onClick={loadCanvas}>load</button> */}
        </ButtonWrap>
        <canvas
          id="canvas"
          ref={canvasRef}
          onMouseDown={startPaint}
          onMouseUp={endPaint}
          onMouseMove={paint}
          style={{
            height: 'auto',
            maxWidth: '741px',
            maxHeight: '242px',
            minHeight: '242px',
            width: '741px',
            border: '2px solid transparent',
            boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.75)',
            borderRadius: '25px',
            backgroundColor: 'rgb(255, 255, 255)',
          }}
        />
      </CanvasContainer>
    </Container>
  );
};

export default DrawingTool;
