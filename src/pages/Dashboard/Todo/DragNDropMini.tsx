import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components/macro';
import AddItemForm from './AddItemForm';

const DragNDropWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 20px;
  flex:direction: column;
  width: auto;
`;

const DeleteListButton = styled.button`
  display: flex;
  // justify-content: space-between;
  margin: 20px;
  flex:direction: column;
`;

const DragNDropGroup: any = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  padding: 5px;
  margin: 0px;
  background-color: #f4f4f4;
  border-radius: 5px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.01);
`;

type DragNDropItemProps = {
  isDragging: boolean;
  item: Item;
};

const DragNDropItem: any = styled.div<DragNDropItemProps>`
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

type CheckmarkProps = {
  checked: boolean;
};
const Checkmark = styled.div<CheckmarkProps>`
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

const Avatar = styled.img`
  width: 100px;
  height: 100px;
`;

const ColumnWrap = styled.div`
  display: flex;
  flex-direction: column;
`;

const RowWrap = styled.div`
  display: flex;
  flex-direction: row;
`;

type DataType = {
  id: number;
  name: string;
  items: ItemType[];
  title: string;
  groupIndex: number;
  itemIndex: number;
};

type Item = {
  id: number;
  title: string;
  description: string;
  due: Date | null;
  done: boolean;
  text: string;
};

type ItemType = {
  text: string;
  done: boolean;
  member: string;
  due: string | null | number;
};

interface DragNDropMiniProps {
  data: any; // Consider using a more specific type instead of 'any'
  onItemAdd: (listIndex: number) => void;
  selectedItemIndex: number | null;
  setSelectedItemIndex: React.Dispatch<React.SetStateAction<number | null>>;
}
const DragNDropMini: React.FC<DragNDropMiniProps> = ({
  data,
  onItemAdd,
  selectedItemIndex,
  setSelectedItemIndex,
}) => {
  const [list, setList] = useState<DataType[]>(data);
  const [dragging, setDragging] = useState(false);
  const [sortOrder, setSortOrder] = useState('ascending');

  useEffect(() => {
    setList(data);
  }, [setList, data]);

  const dragItem = useRef<DataType | null>(null);
  const dragItemNode: any = useRef<HTMLDivElement>(null);

  const handleDragStart: any = (
    e: React.DragEvent<HTMLDivElement>,
    item: DataType
  ) => {
    console.log('Starting to drag', item);
    dragItemNode.current = e.target as HTMLDivElement;
    if (dragItemNode.current) {
      dragItemNode.current.addEventListener('dragend', handleDragEnd);
    }
    dragItem.current = item;

    setTimeout(() => {
      setDragging(true);
    }, 0);
  };

  const handleDragEnter: any = (
    e: React.DragEvent<HTMLDivElement>,
    targetItem: any
  ) => {
    console.log('Entering a drag target', targetItem);
    if (dragItemNode.current !== e.target) {
      console.log('Target is NOT the same as dragged item');
      setList((oldList) => {
        if (dragItem.current !== null) {
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
          //localStorage.setItem('List', JSON.stringify(newList));
          return newList;
        }
        return oldList;
      });
    }
  };
  const handleDragEnd: any = (e: React.DragEvent<HTMLDivElement>) => {
    setDragging(false);
    dragItem.current = null;
    if (dragItemNode.current) {
      dragItemNode.current.removeEventListener('dragend', handleDragEnd);
      const updatedDragItemNode: any = dragItemNode.current;
      updatedDragItemNode.current = null;
    }
  };
  const [hideChecked, setHideChecked] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  // const handleDateChange = (event) => {
  //   setSelectedDate(event.target.value);
  // };

  // const addItem = (groupIndex, { title, due, member }) => {
  //   const text = title;
  //   console.log(due);
  //   const dueDate = due ? due : null;
  //   console.log(dueDate);
  //   const memberAvatarSrc = member.avatarSrc;
  //   if (text && memberAvatarSrc) {
  //     console.log('adding item');
  //     setList((prevList) => {
  //       const newList = [...prevList];
  //       newList[groupIndex].items.push({
  //         text,
  //         due: dueDate,
  //         member: memberAvatarSrc,
  //         done: false,
  //       });
  //       localStorage.setItem('List', JSON.stringify(newList));
  //       return newList;
  //     });
  //   }
  // };

  // const addNoDueItem = (groupIndex) => {
  //   const text = prompt('Enter item text');

  //   const member = prompt('Enter member name');

  //   if (text && member) {
  //     console.log('adding No due item');
  //     setList((prevList) => {
  //       const newList = [...prevList];
  //       newList[groupIndex].items.push({ text, member, done: false });
  //       localStorage.setItem('List', JSON.stringify(newList));
  //       return newList;
  //     });
  //   }
  // };

  // const deleteItem = (groupIndex: number, itemIndex) => {
  //   setList((prevList) => {
  //     const newList = [...prevList];
  //     newList[groupIndex].items.splice(itemIndex, 1);
  //     localStorage.setItem('List', JSON.stringify(newList));
  //     return newList;
  //   });
  // };

  // const editItem = (groupIndex, itemIndex) => {
  //   setList((prevList) => {
  //     const newList = [...prevList];
  //     newList[groupIndex].items.splice(itemIndex, 1);
  //     localStorage.setItem('List', JSON.stringify(newList));
  //     return newList;
  //   });
  // };
  // const handleChange = (e, groupIndex, itemIndex, field) => {
  //   const value = e.target.value;
  //   setList((prevList) => {
  //     const newList = [...prevList];
  //     newList[groupIndex].items[itemIndex] = {
  //       ...newList[groupIndex].items[itemIndex],
  //       [field]: value,
  //     };
  //     localStorage.setItem('List', JSON.stringify(newList));
  //     return newList;
  //   });
  // };

  const handleDoneChange: any = (
    e: React.DragEvent<HTMLDivElement>,
    groupIndex: number,
    itemIndex: number
  ) => {
    const checked = (e.target as HTMLInputElement).checked;
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

  // function deleteList(listIndex) {
  //   const confirmDelete = window.confirm(
  //     'Are you sure you want to delete this list?'
  //   );
  //   if (confirmDelete) {
  //     setList((prevList) => {
  //       const newList = [...prevList];
  //       newList.splice(listIndex, 1);
  //       localStorage.setItem('List', JSON.stringify(newList));
  //       return newList;
  //     });
  //   }
  // }

  // function getTotalTaskCount(group) {
  //   let count = 0;

  //   for (const item of group.items) {
  //     count++;
  //   }

  //   return count;
  // }

  // function getUnfinishedTaskCount(group) {
  //   let count = 0;

  //   for (const item of group.items) {
  //     if (!item.done) {
  //       count++;
  //     }
  //   }

  //   return count;
  // }

  // function getfinishedTaskCount(group) {
  //   let count = 0;

  //   for (const item of group.items) {
  //     if (item.done) {
  //       count++;
  //     }
  //   }

  //   return count;
  // }

  // function getListProgress(list) {
  //   const totalTasks = getTotalTaskCount(list);
  //   const unfinishedTasks = getUnfinishedTaskCount(list);
  //   const finishedTasks = getfinishedTaskCount(list);
  //   const progress =
  //     totalTasks === 0 ? 0 : Math.round((finishedTasks / totalTasks) * 100);

  //   return (
  //     <div
  //       style={{
  //         width: '95%',
  //         backgroundColor: '#ddd',
  //         borderRadius: '5px',
  //         height: '10px',
  //       }}
  //     >
  //       <div
  //         style={{
  //           width: `${progress}%`,
  //           backgroundColor: 'blue',
  //           borderRadius: '5px',
  //           height: '100%',
  //         }}
  //       />
  //     </div>
  //   );
  // }

  if (list) {
    return (
      <DragNDropWrapper>
        {/* <button
          onClick={() => setHideChecked(!hideChecked)}
          style={{
            backgroundColor: 'blue',
            color: 'white',
            borderRadius: '5px',
            padding: '5px 10px',
            cursor: 'pointer',
            height: '50px',
          }}
        >
          {hideChecked ? 'Show Completed' : 'Hide Completed'}
        </button> */}

        {list.map((group: DataType, groupIndex: number) => (
          <div>
            <h3>{group.title}</h3>
            {/* <h4>Unfinished tasks: {getUnfinishedTaskCount(group)}</h4>
            <h4>Total tasks: {getTotalTaskCount(group)}</h4>
            <h4>
              {getfinishedTaskCount(group)}/{getTotalTaskCount(group)}
            </h4>
            {getListProgress(group)} */}
            {/* <DeleteListButton onClick={() => deleteList(groupIndex)}>
              Delete List
            </DeleteListButton> */}
            {/* <button
              onClick={() =>
                setSortOrder(
                  sortOrder === 'ascending' ? 'descending' : 'ascending'
                )
              }
            >
              Sort by due date
            </button> */}
            <DragNDropGroup
              key={group.title}
              onDragEnter={
                dragging && !group.items.length
                  ? (e: React.DragEvent<HTMLDivElement>) =>
                      handleDragEnter(e, { groupIndex, itemIndex: 0 })
                  : null
              }
            >
              {group.items
                .sort((a: any, b: any) => {
                  if (sortOrder === 'ascending') {
                    return (new Date(a.due) as any) - (new Date(b.due) as any);
                  } else {
                    return (new Date(b.due) as any) - (new Date(a.due) as any);
                  }
                })
                .map((item: any, itemIndex: number) => {
                  console.log('Due date:', item.due);
                  console.log('Current date:', new Date());
                  const dueDate = new Date(item.due); // convert date string to Date object
                  const currentDate = new Date(); // get current date
                  const formattedDueDate = dueDate.toLocaleDateString();
                  const formattedCurrentDate = currentDate.toLocaleDateString();
                  const isOverdue = formattedDueDate < formattedCurrentDate; // check if due date is before current date
                  const isToday = formattedDueDate === formattedCurrentDate;
                  console.log('Is overdue:', isOverdue);
                  console.log('Is today:', isToday);
                  return (
                    <DragNDropItem
                      draggable
                      key={item}
                      onDragStart={(e: React.DragEvent<HTMLDivElement>) =>
                        handleDragStart(e, { groupIndex, itemIndex })
                      }
                      onDragEnter={
                        dragging
                          ? (e: React.DragEvent<HTMLDivElement>) =>
                              handleDragEnter(e, { groupIndex, itemIndex })
                          : null
                      }
                      style={{
                        display: hideChecked && item.done ? 'none' : 'block',
                        border:
                          item.due === null
                            ? '2px solid gray'
                            : isOverdue
                            ? '2px solid red'
                            : 'none',
                        backgroundColor:
                          item.due === null
                            ? 'lightgray'
                            : isToday
                            ? 'yellow'
                            : 'transparent',
                      }}
                    >
                      <ColumnWrap>
                        <Avatar src={item.member} alt="Member Avatar"></Avatar>
                        <RowWrap>
                          <CheckContainer>
                            <Checkbox
                              checked={item.done}
                              onChange={(e) =>
                                handleDoneChange(e, groupIndex, itemIndex)
                              }
                            />
                            <Checkmark checked={item.done}></Checkmark>
                          </CheckContainer>
                          <div
                            style={{
                              textDecoration: item.done
                                ? 'line-through'
                                : 'none',
                            }}
                          >
                            {item.text}
                          </div>

                          <div>{item.due && `${item.due}`}</div>
                        </RowWrap>
                      </ColumnWrap>

                      <ColumnWrap>
                        {/* <button
                          onClick={() => deleteItem(groupIndex, itemIndex)}
                        >
                          Delete
                        </button> */}
                        {/* <button
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
                        </button> */}

                        {/* <button
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
                      </ColumnWrap>
                    </DragNDropItem>
                  );
                })}

              {/* <AddItemForm groupIndex={0} onAddItem={addItem} /> */}

              {/* <button>My task only</button> */}
            </DragNDropGroup>
          </div>
        ))}
      </DragNDropWrapper>
    );
  } else {
    return null;
  }
};

export default DragNDropMini;
