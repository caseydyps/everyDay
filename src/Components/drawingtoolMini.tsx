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
  height: 240px;
`;

const CanvasButton = styled(DefaultButton)`
  border-radius: 50%;
  background-color: ${({ color }) => color};

  padding: 5px;
  color: #5981b0;
  margin-right: 5px;
  margin-left: 5px;
  border: none;
  // box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
`;

const CanvasContainer = styled.div`
  max-width: 737px;
  height: 404px;
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
  }, [color, width]);

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

  // const throttle = <T extends any[]>(
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
    // Retrieve the strokes from Firestore when the component mounts
    const canvasRef = collection(
      db,
      'Family',
      familyId,
      'canva',
      familyId,
      'strokes'
    );
    getDocs(canvasRef).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        handleStrokeUpdate(doc.data() as StrokeData);
      });
    });

    // Subscribe to Firestore data changes
    const unsubscribe = onSnapshot(canvasRef, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          handleStrokeUpdate(change.doc.data() as StrokeData);
        }
      });
    });

    return () => {
      unsubscribe();
    };
  }, [familyId, color, width]);

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
    try {
      const docRef = await addDoc(strokesCollectionRef, strokeData);
      console.log('Stroke added to Firestore with ID:', docRef.id);
    } catch (error) {
      console.error('Error adding stroke to Firestore:', error);
    }
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
          style={{
            height: 'auto',
            maxWidth: '737px',
            maxHeight: '240px',
            minHeight: '240px',
            width: '737px',
            border: '2px solid transparent',
            //boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.75)',
            borderRadius: '25px',
            backgroundColor: 'transparent',
          }}
        />
      </CanvasContainer>
    </Container>
  );
};

export default DrawingTool;
