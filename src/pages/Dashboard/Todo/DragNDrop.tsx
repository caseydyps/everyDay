import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useReducer,
} from 'react';

import styled from 'styled-components/macro';
import AddItemForm from './AddItemForm';
import { todoReducer } from './Todo';
import { db } from '../../../config/firebase.config';
import firebase from 'firebase/app';
import 'firebase/firestore';
import {
  collection,
  updateDoc,
  addDoc,
  getDocs,
  getDoc,
  setDoc,
  writeBatch,
  deleteDoc,
  doc,
  query,
  where,
  arrayUnion,
} from 'firebase/firestore';
import { Item } from 'firebase/analytics';

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
  width: 80%;
  padding: 10px;
  margin: 20px;
  background-color: #f4f4f4;
  border-radius: 5px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.01);
`;

type DragNDropItemProps = {
  isDragging: boolean;
  item: DataItem;
};
const DragNDropItem = styled.div<DragNDropItemProps>`
  padding: 40px;
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
  font-size: 32px;
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

type DataItem = {
  id: number;
  name: string;
  description: string;
  groupIndex: number;
  itemIndex: number;
  done: boolean;
  title: string;
  items: Item[];
};

type Item = {
  id: number;
  title: string;
  description: string;
  due: Date | null | string;
  done: boolean;
  text: string;
  member: string;
};

type DragNDropProps = {
  data: DataItem[];
};

type DragNDropState = {
  list: DataItem[];
  dragging: boolean;
  sortOrder: 'ascending' | 'descending';
};

function DragNDrop({ data }: DragNDropProps) {
  // const [state, dispatch] = useReducer(todoReducer, []);
  console.log(data);

  const [list, setList] = useState<DataItem[]>(data);
  const [dragging, setDragging] = useState<boolean>(false);
  const [sortOrder, setSortOrder] = useState<'ascending' | 'descending'>(
    'ascending'
  );

  useEffect(() => {
    setList(data);
  }, [setList, data]);

  const dragItem = useRef<ItemType | null>(null);
  const dragItemNode = useRef<HTMLDivElement | null>(null);

  type ItemType = {
    id: number;
    name: string;
    description: string;
    groupIndex: number;
    itemIndex: number;
    done: boolean;
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    item: ItemType
  ) => {
    console.log('Starting to drag', item);

    dragItemNode.current = e.target as HTMLDivElement;
    dragItemNode.current.addEventListener('dragend', handleDragEnd);
    dragItem.current = item;

    setTimeout(() => {
      setDragging(true);
    }, 0);
  };
  const handleDragEnter = (
    e: React.DragEvent<HTMLDivElement>,
    targetItem: ItemType
  ) => {
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
  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    if (!dragItemNode.current) {
      return;
    }
    setDragging(false);
    dragItem.current = null;
    dragItemNode.current.removeEventListener('dragend', handleDragEnd);
    dragItemNode.current = null;
  };
  const [hideChecked, setHideChecked] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  type TodoItem = {
    title: string;
    due: Date;
    member: Member;
  };
  interface Member {
    name: string;
    avatarSrc: string;
  }

  const addItem = async (
    groupIndex: number,
    { title, due, member }: TodoItem
  ) => {
    const text = title;
    const dueDate = due ? due : null;
    const memberAvatarSrc = member.avatarSrc;
    if (text && memberAvatarSrc) {
      const newItem = {
        text,
        due: dueDate,
        member: memberAvatarSrc,
        done: false,
      };

      const todoRef = doc(
        db,
        'Family',
        'Nkl0MgxpE9B1ieOsOoJ9',
        'todo',
        list[groupIndex].title
      );
      try {
        // Get the existing items array from the todo document
        const todoDoc = await getDoc(todoRef);
        const items = todoDoc.exists() ? todoDoc.data().items : [];

        const updatedItems = [...items, newItem];

        // Update the items array in the todo document
        await setDoc(todoRef, {
          items: updatedItems,
          title: list[groupIndex].title,
        });

        setList((oldList) => {
          const newList = [...oldList];
          newList[groupIndex].items = updatedItems;
          return newList;
        });
      } catch (error) {
        console.error('Error saving item to Firestore: ', error);
      }
    }
  };

  type Item = {
    text: string;
    due: string | null;
    member: string;
    done: boolean;
  };

  type Group = {
    title: string;
    items: Item[];
  };
  type List = {
    items: ItemType[];
    title: string;
  };
  const deleteItem = (groupIndex: number, itemIndex: number): void => {
    const todoRef = doc(
      db,
      'Family',
      'Nkl0MgxpE9B1ieOsOoJ9',
      'todo',
      list[groupIndex].title
    );

    getDoc(todoRef)
      .then((doc) => {
        if (doc.exists()) {
          const data = doc.data();
          const items = data.items;
          items.splice(itemIndex, 1);
          updateDoc(todoRef, { items: items })
            .then(() => {
              console.log(itemIndex, 'Item has been deleted from Firestore!');
              setList((oldList) => {
                const newList = [...oldList];
                newList[groupIndex].items = items;
                return newList;
              });
            })
            .catch((error) =>
              console.error('Error deleting item from Firestore: ', error)
            );
        } else {
          console.error('No such document exists!');
        }
      })
      .catch((error) =>
        console.error('Error fetching document from Firestore: ', error)
      );
  };

  // const editItem = (groupIndex: number, itemIndex: number) => {
  //   setList((prevList: List) => {
  //     const newList = [...prevList];
  //     newList[groupIndex].items.splice(itemIndex, 1);
  //     localStorage.setItem('List', JSON.stringify(newList));
  //     return newList;
  //   });
  // };
  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    groupIndex: number,
    itemIndex: number,
    field: string
  ) => {
    const value = e.target.value;

    if (!value) return;

    const todoRef = doc(
      db,
      'Family',
      'Nkl0MgxpE9B1ieOsOoJ9',
      'todo',
      list[groupIndex].title
    );

    try {
      // Get the existing items array from the todo document
      const todoDoc = await getDoc(todoRef);
      const items = todoDoc.exists() ? todoDoc.data().items : [];

      // Update the specific item in the items array
      const updatedItems = [...items];
      updatedItems[itemIndex][field] = value;

      // Update the items array in the todo document
      await setDoc(todoRef, {
        items: updatedItems,
        title: list[groupIndex].title,
      });
      setList((oldList) => {
        const newList = [...oldList];
        const group = newList[groupIndex];
        group.items = group.items.map((item, index) => {
          if (index === itemIndex) {
            return { ...item, [field]: value };
          } else {
            return item;
          }
        });
        return newList;
      });
      console.log('Item has been updated in Firestore!');
    } catch (error) {
      console.error('Error updating item in Firestore: ', error);
    }
  };

  const handleDoneChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    groupIndex: number,
    itemIndex: number
  ) => {
    const checked = e.target.checked;
    console.log(checked);
    const group = list[groupIndex];
    console.log(group);
    if (!group) return; // exit early if group doesn't exist
    const item = group.items[itemIndex];
    console.log(item);
    console.log(list[groupIndex].title);
    if (!item) return; // exit early if item doesn't exist
    const newItem = { ...item, done: checked };

    try {
      const todoRef = doc(
        db,
        'Family',
        'Nkl0MgxpE9B1ieOsOoJ9',
        'todo',
        list[groupIndex].title
      );

      const todoDoc = await getDoc(todoRef);
      const items = todoDoc.exists() ? todoDoc.data().items : [];

      // update the entire items array with the new checked item
      const updatedItems = items.map((item: Item, index: number) =>
        index === itemIndex ? newItem : item
      );

      await setDoc(todoRef, {
        items: updatedItems,
        title: list[groupIndex].title,
      });
      setList((prevList) => {
        const newList = [...prevList];
        newList[groupIndex].items[itemIndex] = newItem;
        return newList;
      });
      console.log('Item has been updated on Firestore!');
    } catch (error) {
      console.error('Error updating item on Firestore: ', error);
    }
  };

  async function deleteList(listIndex: number) {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this list?'
    );
    if (confirmDelete) {
      try {
        const todoRef = doc(
          db,
          'Family',
          'Nkl0MgxpE9B1ieOsOoJ9',
          'todo',
          list[listIndex].title
        );

        // Delete the document corresponding to the list
        await deleteDoc(todoRef);

        setList((prevList) => {
          const newList = [...prevList];
          newList.splice(listIndex, 1);
          return newList;
        });

        console.log('List has been deleted from Firestore!');
      } catch (error) {
        console.error('Error deleting list from Firestore: ', error);
      }
    }
  }

  type GroupType = {
    id: number;
    title: string;
    items: ItemType[];
  };

  function getTotalTaskCount(group: DataItem): number {
    let count = 0;

    for (const item of group.items) {
      count++;
    }

    return count;
  }

  function getUnfinishedTaskCount(group: DataItem) {
    let count = 0;

    for (const item of group.items) {
      if (!item.done) {
        count++;
      }
    }

    return count;
  }

  function getfinishedTaskCount(group: DataItem) {
    let count = 0;

    for (const item of group.items) {
      if (item.done) {
        count++;
      }
    }

    return count;
  }

  function getListProgress(list: DataItem) {
    const totalTasks = getTotalTaskCount(list);
    const unfinishedTasks = getUnfinishedTaskCount(list);
    const finishedTasks = getfinishedTaskCount(list);
    const progress =
      totalTasks === 0 ? 0 : Math.round((finishedTasks / totalTasks) * 100);

    return (
      <div
        style={{
          width: '95%',
          backgroundColor: '#ddd',
          borderRadius: '5px',
          height: '10px',
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            backgroundColor: 'blue',
            borderRadius: '5px',
            height: '100%',
          }}
        />
      </div>
    );
  }

  if (list) {
    return (
      <DragNDropWrapper>
        <button
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
        </button>
        {list.map((group, groupIndex) => (
          <div>
            <h3>{group.title}</h3>
            <h4>Unfinished tasks: {getUnfinishedTaskCount(group)}</h4>
            <h4>Total tasks: {getTotalTaskCount(group)}</h4>
            <h4>
              {getfinishedTaskCount(group)}/{getTotalTaskCount(group)}
            </h4>
            {getListProgress(group)}
            <DeleteListButton onClick={() => deleteList(groupIndex)}>
              Delete List
            </DeleteListButton>
            <button
              onClick={() =>
                setSortOrder(
                  sortOrder === 'ascending' ? 'descending' : 'ascending'
                )
              }
            >
              Sort by due date
            </button>
            <DragNDropGroup
              key={group.title}
              onDragEnter={
                dragging && !group.items.length
                  ? (e) => handleDragEnter(e, { groupIndex, itemIndex: 0 })
                  : null
              }
            >
              {group.items
                .sort((a, b) => {
                  const aDueDate = a.due ? new Date(a.due) : null;
                  const bDueDate = b.due ? new Date(b.due) : null;
                  if (!aDueDate && !bDueDate) return 0;
                  if (!aDueDate) return sortOrder === 'ascending' ? 1 : -1;
                  if (!bDueDate) return sortOrder === 'ascending' ? -1 : 1;
                  if (sortOrder === 'ascending') {
                    return aDueDate.getTime() - bDueDate.getTime();
                  } else {
                    return bDueDate.getTime() - aDueDate.getTime();
                  }
                })
                .map((item, itemIndex: number) => {
                  console.log('Due date:', item.due);
                  console.log('Current date:', new Date());
                  const dueDate = new Date(item.due); // convert date string to Date object
                  const currentDate = new Date(); // get current date
                  const formattedDueDate = new Date(
                    dueDate.getFullYear(),
                    dueDate.getMonth(),
                    dueDate.getDate()
                  );
                  const formattedCurrentDate = new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    currentDate.getDate()
                  );
                  const isOverdue = formattedDueDate < formattedCurrentDate; // check if due date is before current date
                  const isToday = formattedDueDate === formattedCurrentDate;
                  console.log(formattedDueDate);
                  console.log(formattedCurrentDate);
                  console.log('Is overdue:', isOverdue);
                  console.log('Is today:', isToday);
                  return (
                    <DragNDropItem
                      draggable
                      key={item}
                      onDragStart={(e) =>
                        handleDragStart(e, { groupIndex, itemIndex })
                      }
                      onDragEnter={
                        dragging
                          ? (e) => handleDragEnter(e, { groupIndex, itemIndex })
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
                        <button
                          onClick={() => deleteItem(groupIndex, itemIndex)}
                        >
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
                        </button>
                      </ColumnWrap>
                    </DragNDropItem>
                  );
                })}

              <AddItemForm groupIndex={groupIndex} onAddItem={addItem} />

              {/* <button>My task only</button> */}
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
