import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components/macro';

const DragNDropWrapper = styled.div`
  display: flex;
  // justify-content: space-between;
  margin: 20px;
  flex:direction: column;
`;

const DeleteListButton = styled.button`
  display: flex;
  // justify-content: space-between;
  margin: 20px;
  flex:direction: column;
`;

const DragNDropGroup = styled.div`
  display: flex;
  flex-direction: column;
  width: 400px;
  padding: 5px;
  margin: 10px;
  background-color: #f4f4f4;
  border-radius: 5px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.01);
`;

const DragNDropItem = styled.div`
  padding: 20px;
  margin: 10px;
  background-color: ${(props) => (props.isDragging ? '#c7d9ff' : '#fff')};
  border: 2px solid ${(props) => (props.isDragging ? '#c7d9ff' : '#ccc')};
  border-radius: 5px;
  box-shadow: ${(props) =>
    props.isDragging ? '0px 2px 5px rgba(0, 0, 0, 0.3)' : 'none'};
  cursor: move;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  font-weight: 500;

  &:hover {
    background-color: #f0f0f0;
  }

  .drag-handle {
    margin-right: 10px;
    cursor: grab;
  }

  .drag-handle:active {
    cursor: grabbing;
  }

  .checkbox-label {
    display: flex;
    align-items: center;
  }

  .checkbox-label input[type='checkbox'] {
    margin-right: 10px;
  }
`;

const CheckContainer = styled.label`
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 8px;
  position: relative;
  cursor: pointer;
`;

const Checkmark = styled.div`
  display: inline-block;
  width: 25px;
  height: 25px;
  margin-right: 10px;
  border: 1px solid black;
  border-radius: 3px;
  background-color: ${(props) => (props.checked ? 'green' : 'white')};

  &:after {
    content: '';
    display: block;
    width: 6px;
    height: 11px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
    margin: 2px;
    visibility: ${(props) => (props.checked ? 'visible' : 'hidden')};
  }
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
`;

const Task = styled.div`
  margin: 1rem 0;
  padding: 1rem;
  border: 2px solid #ccc;
  border-radius: 5px;
  height: 25px;
  h3 {
    margin-top: 0;
  }
`;

function DragNDropMini({ data }) {
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

  const editItem = (groupIndex, itemIndex) => {
    setList((prevList) => {
      const newList = [...prevList];
      newList[groupIndex].items.splice(itemIndex, 1);
      localStorage.setItem('List', JSON.stringify(newList));
      return newList;
    });
  };
  const handleChange = (e, groupIndex, itemIndex, field) => {
    const value = e.target.value;
    setList((prevList) => {
      const newList = [...prevList];
      newList[groupIndex].items[itemIndex] = {
        ...newList[groupIndex].items[itemIndex],
        [field]: value,
      };
      localStorage.setItem('List', JSON.stringify(newList));
      return newList;
    });
  };

  const handleDoneChange = (e, groupIndex, itemIndex) => {
    const checked = e.target.checked;
    setList((prevList) => {
      const newList = [...prevList];
      newList[groupIndex].items[itemIndex] = {
        ...newList[groupIndex].items[itemIndex],
        done: checked,
      };
      localStorage.setItem('List', JSON.stringify(newList));
      return newList;
    });
  };

  function deleteList(listIndex) {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this list?'
    );
    if (confirmDelete) {
      setList((prevList) => {
        const newList = [...prevList];
        newList.splice(listIndex, 1);
        localStorage.setItem('List', JSON.stringify(newList));
        return newList;
      });
    }
  }

  if (list) {
    return (
      <DragNDropWrapper>
        {list.map(
          (group, groupIndex) =>
            group.title === 'Due Today' && (
              <Task key={groupIndex}>
                <h3>{group.title}</h3>
                {/* <DeleteListButton onClick={() => deleteList(groupIndex)}>
              Delete List
            </DeleteListButton> */}
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
                    >
                      {item.text}

                      <div>Due: {item.due}</div>
                      <div>Member: {item.member}</div>
                      <div>Done: {item.done ? 'Done' : 'Not yet'}</div>
                      <CheckContainer>
                        <Checkbox
                          checked={item.done}
                          onChange={(e) =>
                            handleDoneChange(e, groupIndex, itemIndex)
                          }
                        />
                        <Checkmark checked={item.done}></Checkmark>
                      </CheckContainer>
                      {/* <button onClick={() => deleteItem(groupIndex, itemIndex)}>
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      const newText = prompt('Enter new text');
                      if (newText) {
                        handleChange(
                          { target: { value: newText } },
                          groupIndex,
                          itemIndex,
                          'text'
                        );
                      }
                    }}
                  >
                    Edit Task
                  </button>

                  <button
                    onClick={() => {
                      const newMember = prompt('Enter new member');
                      if (newMember) {
                        handleChange(
                          { target: { value: newMember } },
                          groupIndex,
                          itemIndex,
                          'member'
                        );
                      }
                    }}
                  >
                    Edit Member
                  </button>
                  <button
                    onClick={() => {
                      const newDue = prompt('Enter new due date');
                      if (newDue) {
                        handleChange(
                          { target: { value: newDue } },
                          groupIndex,
                          itemIndex,
                          'due'
                        );
                      }
                    }}
                  >
                    Edit Due Date
                  </button> */}
                    </DragNDropItem>
                  ))}
                  {/* <button onClick={() => addItem(groupIndex)}>Add New Item</button>
              <button>My task only</button> */}
                </DragNDropGroup>
              </Task>
            )
        )}
      </DragNDropWrapper>
    );
  } else {
    return null;
  }
}

export default DragNDropMini;
