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
  margin: 10px 0;
  padding: 10px;
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
        newList[targetItem.grpI].items.splice(
          targetItem.itemI,
          0,
          newList[dragItem.current.grpI].items.splice(
            dragItem.current.itemI,
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
      dragItem.current.grpI === item.grpI &&
      dragItem.current.itemI === item.itemI
    ) {
      return 'dnd-item current';
    }
    return 'dnd-item';
  };

  if (list) {
    return (
      <DragNDropWrapper>
        {list.map((grp, grpI) => (
          <DragNDropGroup
            key={grp.title}
            onDragEnter={
              dragging && !grp.items.length
                ? (e) => handleDragEnter(e, { grpI, itemI: 0 })
                : null
            }
          >
            {grp.items.map((item, itemI) => (
              <DragNDropItem
                draggable
                key={item}
                onDragStart={(e) => handletDragStart(e, { grpI, itemI })}
                onDragEnter={
                  dragging
                    ? (e) => {
                        handleDragEnter(e, { grpI, itemI });
                      }
                    : null
                }
                className={dragging ? getStyles({ grpI, itemI }) : 'dnd-item'}
              >
                {item}
              </DragNDropItem>
            ))}
          </DragNDropGroup>
        ))}
      </DragNDropWrapper>
    );
  } else {
    return null;
  }
}

export default DragNDrop;
