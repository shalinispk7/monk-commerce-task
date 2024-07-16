import { createSlice } from '@reduxjs/toolkit'
import { act, useReducer } from 'react'

const productSlice = createSlice({
  name: 'productSlice',
  initialState: {
    productList: [],
    selectionList: [],
    searchTerm: '',
    apiResponse: [],
    isModalOpen: false,
    page: 1,
    prodIndex: 0,
  },
  reducers: {
    setProductList: (state, action) => {
      state.productList = action.payload
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload
    },
    setApiResponse: (state, action) => {
      state.apiResponse = action.payload
    },
    setPage: (state, action) => {
      state.page = action.payload
    },
    setIsModalOpen: (state, action) => {
      state.isModalOpen = action.payload
    },
    setSelectionList: (state, action) => {
      state.selectionList = action.payload
    },
    setProdIndex: (state, action) => {
      state.prodIndex = action.payload
    },
  },
})

export const {
  setProductList,
  setSearchTerm,
  setApiResponse,
  setPage,
  setIsModalOpen,
  setSelectionList,
  setProdIndex,
} = productSlice.actions

export default productSlice.reducer
