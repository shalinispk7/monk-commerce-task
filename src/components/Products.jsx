import { faClose, faPencil } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Variants from './Variants'
import {
  setIsModalOpen,
  setProdIndex,
  setProductList,
} from '../reduxstore/productSlice'
import ProductModal from './ProductModal'

const Products = () => {
  const { productList, isModalOpen } = useSelector(
    (store) => store.productSlice
  )
  const dispatch = useDispatch()

  const onEdit = (index) => {
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

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-2xl font-medium mb-4'>Add Products</h1>
      <div className='flex gap-4 mb-6'>
        <div>
          <div className='text-md font-semibold mb-4 ms-4'>Product</div>
        </div>

        <div>
          <div className='text-md font-semibold mb-4 ms-4'>Discount</div>
        </div>
      </div>
      <ol className='list-decimal'>
        {productList?.length === 0 ? (
          <li>
            <div className='flex gap-4 mb-6'>
              <div>
                <div className='input-container'>
                  <input
                    className=' text-md font-normal border border-slate-200 py-1 px-6 ps-2 outline outline-none'
                    placeholder={'Select Product'}
                    disabled={true}
                  />
                  <FontAwesomeIcon
                    icon={faPencil}
                    className='icon'
                    onClick={() => onEdit(0)} //to add product at 0th position
                  />
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
          productList.map((product, index) => {
            return (
              <li>
                <div className='flex flex-col gap-4 mb-6' key={product.id}>
                  <div className='flex flex-row	'>
                    <div className='input-container'>
                      <input
                        className=' text-md font-normal border border-slate-200 py-1 px-6 ps-2 outline outline-none'
                        placeholder={product?.title ? '' : 'Select Product'}
                        value={product?.title ? product.title : ''}
                        disabled={true}
                      />
                      <FontAwesomeIcon
                        icon={faPencil}
                        className='icon'
                        onClick={() => onEdit(index)}
                      />
                    </div>

                    {product?.discType === '' && product.discAmount === '' ? (
                      <button
                        className='text-md font-medium border rounded-md text-white bg-green-800 py-1 px-6'
                        onClick={() => {
                          onDiscountTypeChg('discAmount', '', product.id)
                          onDiscountTypeChg('discType', 'flat off', product.id)
                        }}
                      >
                        Add Discount
                      </button>
                    ) : (
                      <div>
                        <input
                          className='w-1/3 boder-solid border-2'
                          type='text'
                          name='discAmount'
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
                    <FontAwesomeIcon
                      icon={faClose}
                      className=' w-[15%]'
                      onClick={() => onRemoveProduct(product.id)}
                    />
                  </div>
                  <div>
                    {/************ variants block *********************/}
                    <button
                      onClick={() => toggleVariants(product.id)}
                      className='ml-auto text-blue-500'
                    >
                      {product.variants.length > 0 &&
                        (product.showVariants
                          ? 'Hide variants'
                          : 'Show variants')}
                    </button>
                    {product.showVariants &&
                      product.variants.map((variant) => {
                        return (
                          <Variants
                            onDiscountTypeChg={onDiscountTypeChg}
                            product={product}
                            variant={variant}
                          />
                        )
                      })}
                  </div>
                </div>
              </li>
            )
          })
        )}
      </ol>
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
