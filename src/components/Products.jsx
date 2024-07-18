import {
  faClose,
  faPencil,
  faAngleDown,
  faAngleUp,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import Variants from './Variants'
import {
  setIsModalOpen,
  setProdIndex,
  setProductList,
  setSearchTerm,
} from '../reduxstore/productSlice'
import ProductModal from './ProductModal'

const Products = () => {
  const { productList, isModalOpen } = useSelector(
    (store) => store.productSlice
  )
  const dispatch = useDispatch()

  const onEdit = (index) => {
    dispatch(setSearchTerm(''))
    dispatch(setProdIndex(index))
    dispatch(setIsModalOpen(true))
  }

  const onDiscountTypeChg = (type, value, productId) => {
    if (productId) {
      const updatedList = productList.map((item) => {
        if (item.id === productId) {
          return { ...item, [type]: value }
        } else return item
      })
      dispatch(setProductList(updatedList))
    }
  }

  const addEmptyProduct = () => {
    const updatedList = [...productList]
    updatedList.splice(productList.length === 0 ? 1 : productList.length, 1, {
      id: '',
      title: '',
      img: '',
      discAmount: '',
      discType: '',
      variants: [],
    })
    dispatch(setProductList(updatedList))
  }

  const onRemoveProduct = (productId) => {
    dispatch(setProductList(productList.filter((el) => el.id !== productId)))
  }

  const toggleVariants = (id) => {
    dispatch(
      setProductList(
        productList.map((product) =>
          product.id === id
            ? { ...product, showVariants: !product.showVariants }
            : product
        )
      )
    )
  }

  const onDragEnd = (result) => {
    if (!result.destination) {
      return
    }

    const updatedList = Array.from(productList)
    const [movedProduct] = updatedList.splice(result.source.index, 1)
    updatedList.splice(result.destination.index, 0, movedProduct)

    dispatch(setProductList(updatedList))
  }

  return (
    <div className='container m-auto py-8 px-20'>
      <h1 className='text-2xl font-medium mb-4'>Add Products</h1>
      <div className='flex gap-4'>
        <div>
          <div className='text-md font-semibold mb-4 ms-4 pr-[160px]'>
            Product
          </div>
        </div>

        <div>
          <div className='text-md font-semibold mb-4 ms-20'>Discount</div>
        </div>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='products'>
          {(provided) => (
            <ol
              className='list-decimal'
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {productList?.length === 0 ? (
                <li>
                  <div className='flex gap-4 mb-6'>
                    <div>
                      <div className='relative w-72'>
                        <input
                          className=' text-md font-normal border border-slate-200 py-1 px-6 ps-4 outline outline-none w-full pr-8'
                          placeholder={'Select Product'}
                          disabled={true}
                        />

                        <div className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer'>
                          <FontAwesomeIcon
                            icon={faPencil}
                            onClick={() => onEdit(0)} //to add product at 0th position
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <button className='text-md font-medium border rounded-md text-white bg-green-800 py-1 px-6'>
                        Add Discount
                      </button>
                    </div>
                  </div>
                </li>
              ) : (
                productList.map((product, index) => (
                  <Draggable
                    key={index + product.id}
                    draggableId={String(product.id)}
                    index={index}
                  >
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <div className='flex flex-col gap-4 mb-6'>
                          <div className='flex flex-row items-center gap-3'>
                            <div className='relative w-72'>
                              <input
                                className=' text-md font-normal border-solid border-2 py-1 px-6 ps-4 outline outline-none w-full pr-8 shadow-lg'
                                placeholder={
                                  product?.title ? '' : 'Select Product'
                                }
                                value={product?.title ? product.title : ''}
                                disabled={true}
                              />
                              <div>
                                <FontAwesomeIcon
                                  icon={faPencil}
                                  className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer'
                                  onClick={() => onEdit(index)}
                                />
                              </div>
                            </div>

                            {product?.discType === '' &&
                            product.discAmount === '' ? (
                              <button
                                className='text-md font-medium border rounded-md text-white bg-green-800 py-1 px-6'
                                onClick={() => {
                                  onDiscountTypeChg(
                                    'discAmount',
                                    '',
                                    product.id
                                  )
                                  onDiscountTypeChg(
                                    'discType',
                                    'flat off',
                                    product.id
                                  )
                                }}
                              >
                                Add Discount
                              </button>
                            ) : (
                              <div className='w-[190px]'>
                                <input
                                  className='w-1/3 border-solid border-2 p-1 px-3 shadow-lg outline outline-none'
                                  type='text'
                                  name='discAmount'
                                  autoComplete='off'
                                  value={product?.discAmount}
                                  onChange={(e) =>
                                    onDiscountTypeChg(
                                      'discAmount',
                                      e.target.value,
                                      product.id
                                    )
                                  }
                                />
                                <select
                                  name='discType'
                                  value={product?.discType}
                                  className='ms-5 border-solid border-2 p-1 px-3 shadow-lg outline outline-none'
                                  onChange={(e) =>
                                    onDiscountTypeChg(
                                      'discType',
                                      e.target.value,
                                      product.id
                                    )
                                  }
                                >
                                  <option value={'flat off'}>flat off</option>
                                  <option value={'% off'}>% off</option>
                                </select>
                              </div>
                            )}
                            {productList.length > 1 && (
                              <FontAwesomeIcon
                                icon={faClose}
                                className='text-center cursor-pointer'
                                onClick={() => onRemoveProduct(product.id)}
                              />
                            )}
                          </div>
                          <div>
                            {/************ variants block *********************/}
                            {product.variants.length > 1 && (
                              <button
                                onClick={() => toggleVariants(product.id)}
                                className='ml-[360px] text-blue-500 pb-2'
                              >
                                {product.variants.length > 1 &&
                                  (product.showVariants ? (
                                    <>
                                      <span className='me-2 underline'>
                                        Hide variants
                                      </span>
                                      <FontAwesomeIcon icon={faAngleUp} />
                                    </>
                                  ) : (
                                    <>
                                      <span className='me-2'>
                                        Show variants
                                      </span>
                                      <FontAwesomeIcon icon={faAngleDown} />
                                    </>
                                  ))}
                              </button>
                            )}
                            {(product.showVariants ||
                              product.variants.length === 1) && (
                              <Variants product={product} />
                            )}
                          </div>
                        </div>
                      </li>
                    )}
                  </Draggable>
                ))
              )}
              {provided.placeholder}
            </ol>
          )}
        </Droppable>
      </DragDropContext>
      <button
        className='text-md font-medium border-2 border-green-700 rounded-md text-green-700 p-2 px-12 ms-[170px] '
        onClick={() => addEmptyProduct()}
      >
        Add Product
      </button>

      <ProductModal isOpen={isModalOpen} />
    </div>
  )
}

export default Products
