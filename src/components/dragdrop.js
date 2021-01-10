import React, { useState, useCallback } from "react";
import './style/dragdrop.css'
const arr = [];

const Drag = () => {
  const [v, setV] = useState(1);
  const [list, setList] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

  const cancelDefault = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const dragStart = useCallback(
    (dragStartIndex) => (e) => {
      e.dataTransfer.setData("dragStartIndex", dragStartIndex);
    },
    []
  );

  const dropped = useCallback(
    (dropEndIndex) => (e) => {
      cancelDefault(e);

      const dragStartIndex = Number(e.dataTransfer.getData("dragStartIndex"));

      const dragData = list[dragStartIndex];

      const newList = [
        ...list.slice(0, dragStartIndex),
        ...list.slice(dragStartIndex + 1),
      ];
      newList.splice(dropEndIndex, 0, dragData);
      console.log(newList);
      setList(newList);
    },[]);

  return (
    <div>
      <ul id="items-list" className="moveable">
        {list.map((data, i) => (
          <li className='item'
            onDragStart={dragStart(i)}
            onDrop={dropped(i)}
            onDragOver={cancelDefault}
            draggable
          >
            {data}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Drag
