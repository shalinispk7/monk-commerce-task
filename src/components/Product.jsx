import React from 'react'
import { Draggable } from 'react-beautiful-dnd'

const Product = ({ product, index, onDragEnd }) => {
  const { id, title, variants } = product

  const handleVariantToggle = () => {
    // Handle logic for showing/hiding variants (if applicable)
  }
  return (
    <Draggable draggableId={id.toString()} index={index.toString()}>
      {(provided) => (
        <li
          className='flex items-center justify-between border rounded-md mb-4 p-4 hover:bg-gray-100'
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <div className='flex flex-col w-full'>
            <h3 className='text-lg font-medium mb-2'>{title}</h3>
          </div>
          <div className='flex items-center'>
            {variants?.length && (
              <button
                className='text-blue-500 hover:underline'
                onClick={handleVariantToggle}
              >
                {variants?.length ? 'Hide variants' : 'Show variants'}
              </button>
            )}
            <button className='ml-4 text-blue-500 hover:underline'>
              Add Product
            </button>
          </div>
        </li>
      )}
    </Draggable>
  )
}

export default Product
