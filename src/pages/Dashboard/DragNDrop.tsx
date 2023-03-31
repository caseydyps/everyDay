import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components/macro';

const DragNDropWrapper = styled.div`
  display: flex;
  // justify-content: space-between;
  margin: 20px;
  flex:direction: column;
`;

const DragNDropGroup = styled.div`
  width: 200px;
  padding: 10px;
  margin: 20px;
  background-color: #f4f4f4;
  border-radius: 5px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);
`;

const DragNDropItem = styled.div`
  padding: 30px;
  background-color: ${(props) => (props.isDragging ? '#c7d9ff' : '#fff')};
  border: 1px solid #ccc;
  border-radius: 3px;
  box-shadow: ${(props) =>
    props.isDragging ? '0px 2px 5px rgba(0, 0, 0, 0.3)' : 'none'};
  cursor: move;
`;

function DragNDrop({ data }) {
  const [list, setList] = useState(data);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    setList(data);
  }, [setList, data]);

  const dragItem = useRef();
  const dragItemNode = useRef();

  const handletDragStart = (e, item) => {
    console.log('Starting to drag', item);

    dragItemNode.current = e.target;
    dragItemNode.current.addEventListener('dragend', handleDragEnd);
    dragItem.current = item;

    setTimeout(() => {
      setDragging(true);
    }, 0);
  };
  const handleDragEnter = (e, targetItem) => {
    console.log('Entering a drag target', targetItem);
    if (dragItemNode.current !== e.target) {
      console.log('Target is NOT the same as dragged item');
      setList((oldList) => {
        let newList = JSON.parse(JSON.stringify(oldList));
        newList[targetItem.groupIndex].items.splice(
          targetItem.itemIndex,
          0,
          newList[dragItem.current.groupIndex].items.splice(
            dragItem.current.itemIndex,
            1
          )[0]
        );
        dragItem.current = targetItem;
        localStorage.setItem('List', JSON.stringify(newList));
        return newList;
      });
    }
  };
  const handleDragEnd = (e) => {
    setDragging(false);
    dragItem.current = null;
    dragItemNode.current.removeEventListener('dragend', handleDragEnd);
    dragItemNode.current = null;
  };
  const getStyles = (item) => {
    if (
      dragItem.current.groupIndex === item.groupIndex &&
      dragItem.current.itemIndex === item.itemIndex
    ) {
      return 'dnd-item current';
    }
    return 'dnd-item';
  };

  const addItem = (groupIndex) => {
    const item = prompt('Enter item text');
    if (item) {
      setList((prevList) => {
        const newList = [...prevList];
        newList[groupIndex].items.push(item);
        localStorage.setItem('List', JSON.stringify(newList));
        return newList;
      });
    }
  };

  const deleteItem = (groupIndex, itemIndex) => {
    setList((prevList) => {
      const newList = [...prevList];
      newList[groupIndex].items.splice(itemIndex, 1);
      localStorage.setItem('List', JSON.stringify(newList));
      return newList;
    });
  };

  if (list) {
    return (
      <DragNDropWrapper>
        {list.map((group, groupIndex) => (
          <div>
            <h3>{group.title}</h3>
            <DragNDropGroup
              key={group.title}
              onDragEnter={
                dragging && !group.items.length
                  ? (e) => handleDragEnter(e, { groupIndex, itemIndex: 0 })
                  : null
              }
            >
              {group.items.map((item, itemIndex) => (
                <DragNDropItem
                  draggable
                  key={item}
                  onDragStart={(e) =>
                    handletDragStart(e, { groupIndex, itemIndex })
                  }
                  onDragEnter={
                    dragging
                      ? (e) => {
                          handleDragEnter(e, { groupIndex, itemIndex });
                        }
                      : null
                  }
                  className={
                    dragging ? getStyles({ groupIndex, itemIndex }) : 'dnd-item'
                  }
                >
                  {item}
                  <button onClick={() => deleteItem(groupIndex, itemIndex)}>
                    Delete
                  </button>
                </DragNDropItem>
              ))}
              <button onClick={() => addItem(groupIndex)}>Add New Item</button>
            </DragNDropGroup>
          </div>
        ))}
      </DragNDropWrapper>
    );
  } else {
    return null;
  }
}

export default DragNDrop;
