import { useState } from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import ProductModal from './components/ProductModal'
import '../src/app.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil } from '@fortawesome/free-solid-svg-icons'
import { Provider } from 'react-redux'
import appStore from './reduxstore/appStore'
import { useSelector } from 'react-redux'
import {
  setIsModalOpen,
  setProdIndex,
  setProductList,
} from './reduxstore/productSlice'
import { useDispatch } from 'react-redux'

function App() {
  const { isModalOpen, productList } = useSelector(
    (store) => store.productSlice
  )

  const dispatch = useDispatch()

  const onDragEnd = (result) => {
    if (!result.destination) return
    const reorderedData = [...data] // Avoid mutating original data
    const [removed] = reorderedData.splice(result.source.index, 1)
    reorderedData.splice(result.destination.index, 0, removed)
    setData(reorderedData)
    console.log('reorderedData: ', reorderedData)
  }

  const onEdit = (index) => {
    dispatch(setProdIndex(index))
    dispatch(setIsModalOpen(true))
  }

  const addEmptyProduct = () => {
    const updatedList = [...productList]
    updatedList.splice(productList.length === 0 ? 1 : productList.length, 1, {
      id: '',
      title: '',
      img: '',
      variants: [],
    })
    dispatch(setProductList(updatedList))
  }
  /*
head
  1. id, title, img, price, inventory_quantity

  */

  return (
    <>
      <div className='container mx-auto px-4 py-8'>
        <h1 className='text-2xl font-medium mb-4'>Add Products</h1>
        {productList?.length === 0 ? (
          <div className='flex gap-4 mb-6'>
            <div>
              <div className='text-md font-semibold mb-4 ms-4'>Product</div>

              <div className='input-container'>
                <input
                  className=' text-md font-normal border border-slate-200 py-1 px-6 ps-2 outline outline-none'
                  placeholder={'Select Product'}
                  disabled={true}
                />
                <FontAwesomeIcon
                  icon={faPencil}
                  className='icon'
                  onClick={() => onEdit(0)}
                />
              </div>
            </div>

            <div>
              <div className='text-md font-semibold mb-4 ms-4'>Discount</div>
              <button className='text-md font-medium border rounded-md text-white bg-green-800 py-1 px-6'>
                Add Discount
              </button>
            </div>
          </div>
        ) : (
          productList.map((el, index) => {
            return (
              <div className='flex gap-4 mb-6' key={el.id}>
                <div>
                  {index === 0 && (
                    <div className='text-md font-semibold mb-4 ms-4'>
                      Product
                    </div>
                  )}

                  <div className='input-container'>
                    <input
                      className=' text-md font-normal border border-slate-200 py-1 px-6 ps-2 outline outline-none'
                      placeholder={el?.title ? '' : 'Select Product'}
                      value={el?.title ? el.title : ''}
                      disabled={true}
                    />
                    <FontAwesomeIcon
                      icon={faPencil}
                      className='icon'
                      onClick={() => onEdit(index)}
                    />
                  </div>
                </div>

                <div>
                  {index === 0 && (
                    <div className='text-md font-semibold mb-4 ms-4'>
                      Discount
                    </div>
                  )}

                  <button className='text-md font-medium border rounded-md text-white bg-green-800 py-1 px-6'>
                    Add Discount
                  </button>
                  <div>
                    <input type='text' value={''} />
                    <select>
                      <option value={'flat-off'}>flat off</option>
                      <option value={'prct-off'}>% off</option>
                    </select>
                  </div>
                </div>
              </div>
            )
          })
        )}
        <button
          className='text-md font-medium border-2 border-green-700 rounded-md text-green-700 p-2 px-12 ms-[170px] '
          onClick={() => addEmptyProduct()}
        >
          Add Product
        </button>
        <ProductModal isOpen={isModalOpen} />
      </div>
    </>
  )
}

export default App
