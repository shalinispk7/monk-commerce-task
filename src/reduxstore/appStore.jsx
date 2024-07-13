import { configureStore } from '@reduxjs/toolkit'
import productSlice from './productSlice'

const appStore = configureStore({
  reducer: {
    productSlice: productSlice,
  },
})

export default appStore
