import styled from 'styled-components/macro';
import { useState, useEffect } from 'react';
import DragNDrop from './DragNDropDashboard';
import Todo from './Todo';
const Block = styled.div`
  height: 200px;
  width: 250px;
  border: 2px solid black;
  margin: 10px;
  cursor: move;
  opacity: ${(props) => (props.isDragging ? 0.5 : 1)};
  background-color: ${(props) => (props.isDragging ? 'grey' : 'white')};
  box-shadow: ${(props) =>
    props.isDragging ? '2px 2px 8px rgba(0, 0, 0, 0.5)' : 'none'};
`;

const Calendar = ({ onDragStart, onDragEnd }) => {
  return (
    <Block
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      isDragging={false}
    >
      Calendar
    </Block>
  );
};

const Whiteboard = ({ onDragStart, onDragEnd }) => {
  return (
    <Block
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      isDragging={false}
    >
      Whiteboard
    </Block>
  );
};

// const Todo = ({ onDragStart, onDragEnd }) => {
//   return (
//     <Block
//       draggable
//       onDragStart={onDragStart}
//       onDragEnd={onDragEnd}
//       isDragging={false}
//     >
//       Todo
//     </Block>
//   );
// };

const Financial = ({ onDragStart, onDragEnd }) => {
  return (
    <Block
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      isDragging={false}
    >
      Financial
    </Block>
  );
};

const Album = ({ onDragStart, onDragEnd }) => {
  return (
    <Block
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      isDragging={false}
    >
      Album
    </Block>
  );
};

const Milestone = ({ onDragStart, onDragEnd }) => {
  return (
    <Block
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      isDragging={false}
    >
      Milestone
    </Block>
  );
};

const defaultData = [
  { title: 'row 1', items: ['Calendar', 'Sticker'] },
  { title: 'row 2', items: ['Todo', 'Album', 'Financial'] },
  { title: 'row 3', items: ['Milestone'] },
];

const Wrapper = styled.div`
  width: 100vw;
  height: auto;
  border: 2px solid black;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
`;

const WrapperBottom = styled.div`
  width: 100vw;
  height: 300px;
  border: 2px solid black;
  display: flex;
  flex-wrap: wrap;
`;

function Dashboard() {
  const [draggingBlock, setDraggingBlock] = useState(null);

  const handleDragStart = (event, block) => {
    setDraggingBlock(block);
  };

  const handleDragEnd = (event) => {
    setDraggingBlock(null);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event, block) => {
    event.preventDefault();
    if (block !== draggingBlock) {
      // Swap the positions of the two blocks
      const parent = event.target.parentNode;
      const dropZoneIndex = Array.from(parent.children).indexOf(event.target);
      const draggingBlockIndex = Array.from(parent.children).indexOf(
        draggingBlock
      );
      parent.insertBefore(draggingBlock, event.target);
      parent.insertBefore(event.target, parent.children[draggingBlockIndex]);
    }
  };

  const [data, setData] = useState();
  useEffect(() => {
    if (localStorage.getItem('List')) {
      console.log(localStorage.getItem('List'));
      setData(JSON.parse(localStorage.getItem('List')));
    } else {
      setData(defaultData);
    }
  }, [setData]);

  return (
    <>
      <Wrapper>
        <DragNDrop data={data} />
      </Wrapper>
      <Wrapper>
        <Calendar
          onDragStart={(event) => handleDragStart(event, 'calendar')}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDrop={(event) => handleDrop(event, 'calendar')}
        />
        <Whiteboard
          onDragStart={(event) => handleDragStart(event, 'whiteboard')}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDrop={(event) => handleDrop(event, 'whiteboard')}
        />
        <Financial
          onDragStart={(event) => handleDragStart(event, 'financial')}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDrop={(event) => handleDrop(event, 'financial')}
        />
        <Todo
          onDragStart={(event) => handleDragStart(event, 'todo')}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDrop={(event) => handleDrop(event, 'todo')}
        />
        <Album
          onDragStart={(event) => handleDragStart(event, 'album')}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDrop={(event) => handleDrop(event, 'album')}
        />
        <Milestone
          onDragStart={(event) => handleDragStart(event, 'milestone')}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDrop={(event) => handleDrop(event, 'milestone')}
        />
      </Wrapper>
      <WrapperBottom></WrapperBottom>
    </>
  );
}

export default Dashboard;
