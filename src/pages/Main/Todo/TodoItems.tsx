import { format } from 'date-fns';
import 'firebase/firestore';
import { deleteDoc, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components/macro';
import { ThreeDButton } from '../../../Components/Button/Button';
import { AuthContext } from '../../../config/Context/authContext';
import { db } from '../../../config/firebase.config';
import { MembersSelector } from '../AI/SmartInput';
import {
  faArrowDownShortWide,
  faArrowDownWideShort,
  faCalendarDays,
  faEllipsis,
  faPencil,
  faTrashCan,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DefaultButton from '../../../Components/Button/Button';
const DragNDropWrapper = styled.div`
  display: flex;
  margin: 10px;
  flex-direction: row;
  overflow-x: scroll;
  height: 100%;
`;
const Button = styled(DefaultButton)`
  display: flex;
  background-color: transparent;
  margin: 20px;
  border-radius: 50%;
  flex-direction: column;
  font-size: 20px;
`;
const RowButton = styled(DefaultButton)`
  display: flex;
  justify-content: space-between;
  margin: 0px;
  flex-direction: column;
  width: 24px;
  height: 24px;
  background-color: transparent;
  box-shadow: none;
  color: #5981b0;
  font-size: 20px;
`;

const DragNDropGroup: any = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  height: auto;
  min-height: 100px;
  padding: 10px;
  margin: 10px;
  background-color: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  box-shadow: rgba(142, 142, 142, 0.19) 0px 6px 15px 0px;
  -webkit-box-shadow: rgba(142, 142, 142, 0.19) 0px 6px 15px 0px;
  border-radius: 20px;
  -webkit-border-radius: 12px;
  color: rgba(255, 255, 255, 0.75);
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
`;

type DragNDropItemProps = {
  isDragging: boolean;
  item: DataItem;
};
const DragNDropItem: any = styled.div<DragNDropItemProps>`
  height: 80px;
  margin: 25px;
  background-color: #5981b0;
  position: relative;
  border-radius: 20px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);
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

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  margin-right: 10px;
  flex-shrink: 0;
`;

const ColumnWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: auto;
  width: 100%;
`;
const ItemTextWrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  height: auto;
  width: 100%;
`;

const RowWrap = styled.div`
  display: flex;
  flex-direction: row;
  position: absolute;
  margin: 0 auto;
  top: 0px;
  z-index: 3;
`;

const ListRowWrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 0 auto;
  margin-top: 10px;
`;
const AvatarRowWrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

type ListInfo = {
  index: number;
};

const ListInfoWrap = styled.div<ListInfo>`
  background-color: #5981b0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);
  border-radius: 25px;
  margin: 10px;
  padding: 10px;
  font-weight: bold;
  height: 50px;
  color: #f5f5f5;
  text-shadow: 0px 0px 1px white;
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

function DragNDrop({ data }: any) {
  const { familyId, membersArray } = useContext(AuthContext);
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
    done: boolean;
    groupIndex: number;
    itemIndex: number;
  };

  const handleDragStart: any = (
    e: React.DragEvent<HTMLDivElement>,
    item: ItemType
  ) => {
    dragItemNode.current = e.target as HTMLDivElement;
    dragItemNode.current.addEventListener('dragend', handleDragEnd);
    dragItem.current = item;
    setTimeout(() => {
      setDragging(true);
    }, 0);
  };
  const handleDragEnter: any = (
    e: React.DragEvent<HTMLDivElement>,
    targetItem: ItemType
  ) => {
    if (dragItemNode.current !== e.target) {
      setList((oldList) => {
        let newList = JSON.parse(JSON.stringify(oldList));
        if (dragItem.current) {
          newList[targetItem.groupIndex].items.splice(
            targetItem.itemIndex,
            0,
            newList[dragItem.current.groupIndex].items.splice(
              dragItem.current.itemIndex,
              1
            )[0]
          );
          dragItem.current = targetItem;
        }
        return newList;
      });
    }
  };
  const handleDragEnd: any = (e: React.DragEvent<HTMLDivElement>) => {
    if (!dragItemNode.current) {
      return;
    }
    setDragging(false);
    dragItem.current = null;
    dragItemNode.current.removeEventListener('dragend', handleDragEnd);
    dragItemNode.current = null;
  };
  const [hideChecked, setHideChecked] = useState(false);
  const [showMembersSelector, setShowMembersSelector] = useState(false);

  interface Member {
    name: string;
    avatarSrc: string;
    role: string;
  }

  type Item = {
    text: string;
    due: string | null;
    member: string;
    done: boolean;
    title: string;
  };

  const deleteItem = (groupIndex: number, itemIndex: number): void => {
    const todoRef = doc(db, 'Family', familyId, 'todo', list[groupIndex].title);

    getDoc(todoRef)
      .then((doc) => {
        if (doc.exists()) {
          const data = doc.data();
          const items = data.items;
          items.splice(itemIndex, 1);
          updateDoc(todoRef, { items: items })
            .then(() => {
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
  const handleChange: any = async (
    e: React.ChangeEvent<HTMLInputElement>,
    groupIndex: number,
    itemIndex: number,
    field: string
  ) => {
    const value = e.target.value;

    if (!value) return;

    const todoRef = doc(db, 'Family', familyId, 'todo', list[groupIndex].title);

    try {
      const todoDoc = await getDoc(todoRef);
      const items = todoDoc.exists() ? todoDoc.data().items : [];
      const updatedItems = [...items];
      updatedItems[itemIndex][field] = value;
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
    } catch (error) {
      console.error('Error updating item in Firestore: ', error);
    }
  };

  const handleMemberChange: any = async (
    member: string,
    groupIndex: number,
    itemIndex: number,
    field: string
  ) => {
    const getMemberAvatar = (memberName: string | string[]) => {
      const member = membersArray.find((m: any) => m.role === memberName);
      return member ? member.avatar : null;
    };

    const memberAvatar = getMemberAvatar(member);
    const todoRef = doc(db, 'Family', familyId, 'todo', list[groupIndex].title);

    try {
      const todoDoc = await getDoc(todoRef);
      const items = todoDoc.exists() ? todoDoc.data().items : [];
      const updatedItems = [...items];
      updatedItems[itemIndex][field] = memberAvatar;
      await setDoc(todoRef, {
        items: updatedItems,
        title: list[groupIndex].title,
      });
      setList((oldList) => {
        const newList = [...oldList];
        const group = newList[groupIndex];
        group.items = group.items.map((item, index) => {
          if (index === itemIndex) {
            return { ...item, [field]: memberAvatar };
          } else {
            return item;
          }
        });
        return newList;
      });
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
    const group = list[groupIndex];
    if (!group) return; 
    const item = group.items[itemIndex];
    if (!item) return; 
    const newItem = { ...item, done: checked };
    try {
      const todoRef = doc(
        db,
        'Family',
        familyId,
        'todo',
        list[groupIndex].title
      );

      const todoDoc = await getDoc(todoRef);
      const items = todoDoc.exists() ? todoDoc.data().items : [];
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
          familyId,
          'todo',
          list[listIndex].title
        );
        await deleteDoc(todoRef);
        setList((prevList) => {
          const newList = [...prevList];
          newList.splice(listIndex, 1);
          return newList;
        });
      } catch (error) {
        console.error('Error deleting list from Firestore: ', error);
      }
    }
  }

  function getTotalTaskCount(group: DataItem): number {
    let count = 0;
    if (Array.isArray(group.items)) {
      for (const item of group.items) {
        count++;
      }
    }
    return count;
  }
  function getfinishedTaskCount(group: DataItem) {
    let count = 0;
    if (Array.isArray(group.items)) {
      for (const item of group.items) {
        if (item.done) {
          count++;
        }
      }
    }
    return count;
  }

  function getListProgress(list: DataItem) {
    const totalTasks = getTotalTaskCount(list);
    const finishedTasks = getfinishedTaskCount(list);
    const progress =
      totalTasks === 0 ? 0 : Math.round((finishedTasks / totalTasks) * 100);

    return (
      <div
        style={{
          width: '95%',
          backgroundColor: '#ddd',
          borderRadius: '5px',
          height: '7px',
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            backgroundColor: 'rgba(52, 103, 161, 0.6)',
            borderRadius: '5px',
            height: '100%',
          }}
        />
      </div>
    );
  }
  const [showMore, setShowMore] = useState(false);
  function formatDate(dueDate: string | Date) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const formattedDate = format(new Date(dueDate), 'MMM d, yyyy');

    if (new Date(dueDate).toDateString() === today.toDateString()) {
      return 'Today';
    } else if (new Date(dueDate).toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else if (new Date(dueDate) < today) {
      return 'Overdue';
    } else {
      return formattedDate;
    }
  }

  if (list) {
    return (
      <ColumnWrap>
        <HideButton onClick={() => setHideChecked(!hideChecked)}>
          {hideChecked ? 'Show Done' : 'Hide Done'}
        </HideButton>
        <DragNDropWrapper>
          {list.map((group, groupIndex) => (
            <List>
              <ListInfoWrap index={groupIndex}>
                <h4>{group.title}</h4>
                <h4>
                  {getfinishedTaskCount(group)}/{getTotalTaskCount(group)}
                </h4>
              </ListInfoWrap>
              {getListProgress(group)}
              <ListRowWrap style={{ height: '80px', margin: '0px' }}>
                <Button onClick={() => deleteList(groupIndex)}>
                  <FontAwesomeIcon icon={faTrashCan}></FontAwesomeIcon>
                </Button>
                <Button
                  onClick={() =>
                    setSortOrder(
                      sortOrder === 'ascending' ? 'descending' : 'ascending'
                    )
                  }
                >
                  {sortOrder === 'ascending' ? (
                    <FontAwesomeIcon icon={faArrowDownShortWide} />
                  ) : (
                    <FontAwesomeIcon icon={faArrowDownWideShort} />
                  )}
                </Button>
              </ListRowWrap>
              <DragNDropGroup
                key={group.title}
                onDragEnter={
                  dragging && !group.items.length
                    ? (e: React.DragEvent) =>
                        handleDragEnter(e, { groupIndex, itemIndex: 0 })
                    : null
                }
              >
                {group.items &&
                  group.items
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
                      const dueDate = item.due ? new Date(item.due) : null; // convert date string to Date object
                      const currentDate = new Date(); // get current date
                      const formattedDueDate = dueDate
                        ? new Date(
                            dueDate.getFullYear(),
                            dueDate.getMonth(),
                            dueDate.getDate()
                          )
                        : null;
                      const formattedCurrentDate = new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth(),
                        currentDate.getDate()
                      );
                      const isOverdue = formattedDueDate
                        ? formattedDueDate < formattedCurrentDate
                        : false;
                      const filteredMembers = membersArray.filter(
                        (member: Member) => member.role === item.member
                      );

                      let matchingMemberAvatar = '';
                      if (filteredMembers.length > 0) {
                        matchingMemberAvatar = filteredMembers[0].avatar;
                      }

                      return (
                        <>
                          <DragNDropItem
                            draggable
                            key={item}
                            onDragStart={(e: React.DragEvent<HTMLDivElement>) =>
                              handleDragStart(e, { groupIndex, itemIndex })
                            }
                            onDragEnter={
                              dragging
                                ? (e: React.DragEvent<HTMLDivElement>) =>
                                    handleDragEnter(e, {
                                      groupIndex,
                                      itemIndex,
                                    })
                                : null
                            }
                            style={{
                              display:
                                hideChecked && item.done ? 'none' : 'block',
                              backgroundColor: item.done
                                ? 'rgba(128, 128, 128, 0.5)'
                                : isOverdue
                                ? '#1E3D6B'
                                : '#1E3D6B',
                              color: item.done ? '#737373' : '#F6F8F8',
                            }}
                          >
                            <ColumnWrap>
                              <AvatarRowWrap>
                                <Avatar
                                  src={matchingMemberAvatar}
                                  alt="Member Avatar"
                                ></Avatar>

                                <CheckboxContainer>
                                  <CheckboxInput
                                    type="checkbox"
                                    id={`checkbox-${groupIndex}-${itemIndex}`}
                                    checked={item.done}
                                    onChange={(e) =>
                                      handleDoneChange(e, groupIndex, itemIndex)
                                    }
                                  />
                                </CheckboxContainer>
                              </AvatarRowWrap>
                              <ItemTextWrap>
                                {item.due ? (
                                  <DueText
                                    style={{
                                      display:
                                        hideChecked && item.done
                                          ? 'none'
                                          : 'block',
                                      backgroundColor: item.done
                                        ? 'rgba(128, 128, 128, 0.5)'
                                        : isOverdue
                                        ? 'rgba(232, 55, 55, 0.522)'
                                        : '#1E3D6B',
                                      border: item.done
                                        ? '1px solid #737373'
                                        : '1px solid #F6F8F8',

                                      color: item.done ? '#737373' : '#F6F8F8',
                                    }}
                                  >
                                    {formatDate(item.due)}
                                  </DueText>
                                ) : (
                                  <DueText>No due</DueText>
                                )}
                                <MoreButton
                                  onClick={() => setShowMore(!showMore)}
                                >
                                  <FontAwesomeIcon icon={faEllipsis} />
                                </MoreButton>

                                <EventTitle
                                  style={{
                                    textDecoration: item.done
                                      ? 'line-through'
                                      : 'none',
                                  }}
                                >
                                  {item.text}
                                </EventTitle>
                              </ItemTextWrap>

                              {showMore && (
                                <RowWrap>
                                  <RowButton
                                    onClick={() =>
                                      deleteItem(groupIndex, itemIndex)
                                    }
                                  >
                                    <FontAwesomeIcon icon={faTrashCan} />
                                  </RowButton>
                                  <RowButton
                                    onClick={() => {
                                      const newText = prompt('更改事件');
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
                                    <FontAwesomeIcon icon={faPencil} />
                                  </RowButton>
                                  <RowButton
                                    onClick={() =>
                                      setShowMembersSelector(
                                        !showMembersSelector
                                      )
                                    }
                                  >
                                    <FontAwesomeIcon icon={faUsers} />
                                  </RowButton>
                                  <RowButton
                                    onClick={() => {
                                      const newDue = prompt('更改到期日期');
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
                                    <FontAwesomeIcon icon={faCalendarDays} />
                                  </RowButton>
                                </RowWrap>
                              )}
                            </ColumnWrap>
                          </DragNDropItem>
                          {showMembersSelector && (
                            <MembersSelector
                              onSelectMember={(selectedMember) => {
                                setShowMembersSelector(false);
                                handleMemberChange(
                                  selectedMember,
                                  groupIndex,
                                  itemIndex,
                                  'member'
                                );
                              }}
                            />
                          )}
                        </>
                      );
                    })}
              </DragNDropGroup>
            </List>
          ))}
        </DragNDropWrapper>
      </ColumnWrap>
    );
  } else {
    return null;
  }
}

const HideButton = styled(ThreeDButton)`
  height: auto;
  color: #5981b0;
  border: 2px solid #5981b0;
  margin-top: 10px;
  padding: 10px;
  max-width: 120px;
  font-size: 16px;
`;

const List = styled.div`
  width: 300px;
  background-color: transparent;
  height: 100%;
`;

const EventTitle = styled.div`
  font-size: 20px;
  margin-top: -10px;
  margin-bottom: 5px;
  margin-right: 10px;
`;

const DueText = styled.div`
  font-size: 12px;
  margin-top: -10px;
  margin-bottom: 5px;
  margin-left: 5px;
  border: 1px solid #f6f8f8;
  border-radius: 5px;
  color: #f6f8f8;
`;

const CheckboxContainer = styled.div`
  width: 20px;
  height: 20px;
  margin-left: auto;
`;

const MoreButton = styled(DefaultButton)`
  width: 20px;
  height: 20px;
  box-shadow: none;
  background-color: transparent;
  color: white;
  position: absolute;
  top: -10px;
  right: 20px;
`;

const CheckboxInput = styled.input`
  width: 2rem;
  height: 2rem;
  color: dodgerblue;
  vertical-align: middle;
  -webkit-appearance: none;
  appearance: none;
  background: none;
  border: 0;
  outline: 0;
  flex-grow: 0;
  border-radius: 50%;
  background-color: #ffffff;
  transition: background 300ms;
  cursor: pointer;
  &:before {
    content: '';
    color: transparent;
    display: block;
    width: inherit;
    height: inherit;
    border-radius: inherit;
    border: 0;
    background-color: transparent;
    background-size: contain;
    box-shadow: inset 0 0 0 3px #3467a1;
  }
  &:checked {
    background-color: lightgray;
    &:before {
      box-shadow: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E %3Cpath d='M15.88 8.29L10 14.17l-1.88-1.88a.996.996 0 1 0-1.41 1.41l2.59 2.59c.39.39 1.02.39 1.41 0L17.3 9.7a.996.996 0 0 0 0-1.41c-.39-.39-1.03-.39-1.42 0z' fill='%23fff'/%3E %3C/svg%3E");
    }
  }
`;

export default DragNDrop;
