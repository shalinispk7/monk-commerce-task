import React, { useEffect, useRef, useState } from 'react'
import Modal from 'react-modal'
import { XIcon, SearchIcon } from '@heroicons/react/outline'
import ProductList from './ProductList'
import useDebounce from '../customhooks/useDebounce'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useSelector, useDispatch } from 'react-redux'
import { apiURL, xApiKey } from '../constants'
import {
  setApiResponse,
  setIsModalOpen,
  setLoading,
  setPage,
  setProductList,
  setSearchTerm,
  setSelectionList,
} from '../reduxstore/productSlice'
import Loader from './Loader'

const ProductModal = ({}) => {
  const dispatch = useDispatch()
  const {
    searchTerm,
    apiResponse,
    page,
    isModalOpen,
    prodIndex,
    productList,
    selectionList,
    loading,
  } = useSelector((store) => store.productSlice)

  const debouncedSearchTerm = useDebounce(searchTerm, 500) // 500ms debounce delay

  const fetchProducts = async () => {
    console.log(
      `Fetching products for page: ${page}, searchTerm: ${debouncedSearchTerm}`
    )

    try {
      dispatch(setLoading(true))
      const response = await fetch(
        `${apiURL}?search=${debouncedSearchTerm}&page=${page}&limit=10`,
        {
          method: 'GET',
          headers: {
            'x-api-key': xApiKey,
          },
        }
      )
      const data = await response.json()

      Array.isArray(data)
        ? dispatch(setApiResponse(data))
        : dispatch(setApiResponse([]))
      dispatch(setLoading(false))
    } catch (e) {
      console.error('Fetch error:', error)
      dispatch(setLoading(false))
      dispatch(setApiResponse([]))
    }
  }

  const addProduct = () => {
    if (selectionList.length) {
      const updatedList = [...productList]
      updatedList.splice(prodIndex, 1, ...selectionList)
      dispatch(setProductList(updatedList))
      dispatch(setIsModalOpen(false))
      dispatch(setSelectionList([]))
    }
  }

  const onModalClose = () => {
    dispatch(setIsModalOpen(false))
    dispatch(setSelectionList([]))
  }

  useEffect(() => {
    dispatch(setApiResponse([])) // Reset products when searchTerm changes
    dispatch(setPage(1)) // Reset page number
    fetchProducts()
  }, [debouncedSearchTerm])

  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={() => onModalClose()}
      className='fixed z-10 inset-0 overflow-y-auto'
      overlayClassName='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity'
    >
      <div className='flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
        <div className='inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6'>
          <div>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-lg font-semibold'>Select Products</h2>
              <button onClick={() => onModalClose()}>
                <XIcon className='h-6 w-6 text-gray-600' />
              </button>
            </div>
            <div className='relative mb-4'>
              <input
                type='text'
                placeholder='Search product'
                value={searchTerm}
                onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                className='w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
              <SearchIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' />
            </div>

            {loading ? (
              <Loader />
            ) : apiResponse.length > 0 ? (
              <ProductList products={apiResponse} searchTerm={searchTerm} />
            ) : (
              <div>No Products Found</div>
            )}

            <div className='flex justify-between align-center mt-4'>
              <h2>{selectionList.length} Product added</h2>
              <div className='flex justify-end '>
                <button
                  onClick={() => onModalClose()}
                  className='px-4 py-1 text-gray-600 border border-gray-300 rounded-md mr-2'
                >
                  Cancel
                </button>
                <button
                  className='px-4 py-1 text-white bg-green-600 rounded-md'
                  onClick={() => addProduct()}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ProductModal
