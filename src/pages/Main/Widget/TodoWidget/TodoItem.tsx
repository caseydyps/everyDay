import 'firebase/firestore';
import React, {
  useEffect,
  useRef,
  useState
} from 'react';
import styled from 'styled-components/macro';

const DragNDropWrapper = styled.div`
  display: flex;
  overflow-y: scroll;
  height: 160px;
  width: 160px;
  flex-direction: column;
  border-radius: 5px;
  padding: 5px;
  gap: 0px;
  ::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: transparent;
    border-radius: 5px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: #666;
  }
`;


const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: auto;
  width: 160px;
  padding: 5px;
  margin: 0 auto;
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
  margin: 5px;
  padding: 5px 10px;
  font-weight: bold;
  height: 35px;
  color: #f5f5f5;
  width: 160px;
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
  const [list, setList] = useState<DataItem[]>(data);
  const [dragging, setDragging] = useState<boolean>(false);

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

  const handleDragEnd: any = (e: React.DragEvent<HTMLDivElement>) => {
    if (!dragItemNode.current) {
      return;
    }
    setDragging(false);
    dragItem.current = null;
    dragItemNode.current.removeEventListener('dragend', handleDragEnd);
    dragItemNode.current = null;
  };


  function getTotalTaskCount(group: DataItem): number {
    let count = 0;
    for (const item of group.items) {
      count++;
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

  if (list) {
    return (
      <Wrap>
        <DragNDropWrapper>
          {list.map((group, groupIndex) => (
            <List>
              <ListInfoWrap index={groupIndex}>
                <h5>{group.title}</h5>
                <h6>
                  {getfinishedTaskCount(group)}/{getTotalTaskCount(group)}
                </h6>
              </ListInfoWrap>
            </List>
          ))}
        </DragNDropWrapper>
      </Wrap>
    );
  } else {
    return null;
  }
}

const List = styled.div`
  width: 100%;
  background-color: transparent;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default DragNDrop;
