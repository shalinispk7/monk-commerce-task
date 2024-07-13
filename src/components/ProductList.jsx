import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setSelectionList } from '../reduxstore/productSlice'

const ProductList = ({ products, searchTerm }) => {
  const [selectedVariants, setSelectedVariants] = useState([])
  const { selectionList, apiResponse } = useSelector(
    (store) => store.productSlice
  )
  const dispatch = useDispatch()

  const toggleProductSelection = (productId, isProductSelected) => {
    if (isProductSelected) {
      const productObj = apiResponse.find((el) => el.id === productId)

      let prodList = selectionList
      const variantsList = productObj.variants.reduce((acc, curr) => {
        acc.push({
          id: curr.id,
          productId: curr.product_id,
          title: curr.title,
          stock: curr.inventory_quantity,
          price: curr.price,
        })
        return acc
      }, [])

      console.log('variantsList: ', variantsList)
      if (selectionList.some((el) => el.id === productId)) {
        prodList = selectionList.map((el) => {
          if (el.id === productId) {
            return {
              id: productObj.id,
              title: productObj.title,
              img: productObj.image?.src,
              variants: variantsList,
            }
          } else return el
        })
      } else {
        prodList = [
          ...prodList,
          {
            id: productObj.id,
            title: productObj.title,
            img: productObj.image?.src,
            variants: variantsList,
          },
        ]
      }
      console.log('prodList: ', prodList)
      dispatch(setSelectionList(prodList))
    } else {
      dispatch(
        setSelectionList(selectionList.filter((el) => el.id !== productId))
      )
    }
  }

  const toggleVariantSelection = (productId, variantId, isVariantSelected) => {
    const productObj = apiResponse.find((el) => el.id === productId)
    const variantObj = apiResponse
      .find((el) => el.id === productId)
      ?.variants?.find((el) => el.id === variantId)

    const selectedVariant = {
      id: variantObj.id,
      productId: variantObj.product_id,
      title: variantObj.title,
      stock: variantObj.inventory_quantity,
      price: variantObj.price,
    }

    let prodList = selectionList
    let updSelectionList = []
    const isProductSelected = selectionList.some((el) => el.id === productId)

    if (isVariantSelected) {
      if (isProductSelected) {
        //if product is already part of the selection list
        updSelectionList = selectionList.map((el) => {
          if (el.id === productId) {
            return {
              ...el,
              variants: [...el.variants, selectedVariant],
            }
          }
          return el
        })
        dispatch(setSelectionList(updSelectionList))
      } else {
        //if product is not part of the selection list
        prodList = [
          ...prodList,
          {
            id: productObj.id,
            title: productObj.title,
            img: productObj.image?.src,
            variants: [selectedVariant],
          },
        ]

        dispatch(setSelectionList(prodList))
      }
    } else {
      //if variant is de-selected, remove the variant from selection list
      let variantDeSelected = selectionList.map((el) => {
        if (el.id === productId) {
          return {
            ...el,
            variants: el.variants.filter((variant) => variant.id !== variantId),
          }
        }
        return el
      })

      //if all the variants from a product is de-selected, remove the product from the selection list
      variantDeSelected =
        variantDeSelected.find((product) => product.id === productId).variants
          .length === 0
          ? variantDeSelected.filter((product) => product.id !== productId)
          : variantDeSelected

      dispatch(setSelectionList(variantDeSelected))
    }
  }

  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.variants.some((variant) =>
        variant.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
  )

  useEffect(() => {
    console.log('selectedVariants: ', selectedVariants)
  }, [selectedVariants])
  return (
    <div className='max-h-96 overflow-y-auto'>
      {filteredProducts.map((product) => (
        <div key={product.id} className='mb-4'>
          <div className='flex items-center'>
            <input
              type='checkbox'
              checked={
                selectionList.some((el) => el.id === product.id) &&
                selectionList.find((el) => el.id === product.id)?.variants
                  ?.length ===
                  apiResponse.find((el) => el.id === product.id)?.variants
                    ?.length
              }
              onChange={(e) =>
                toggleProductSelection(product.id, e.target.checked)
              }
              className='h-5 w-5 text-green-800'
            />
            <span className='ml-2 font-semibold'>{product.title}</span>
          </div>
          <div className='ml-8'>
            {product.variants.map((variant) => (
              <div key={variant.id} className='flex items-center py-1'>
                <input
                  type='checkbox'
                  checked={selectionList
                    .find((el) => el.id === product.id)
                    ?.variants?.some((el) => el.id === variant.id)}
                  onChange={(e) =>
                    toggleVariantSelection(
                      product.id,
                      variant.id,
                      e.target.checked
                    )
                  }
                  className='h-5 w-5 text-green-800'
                />
                <span className='ml-2'>{variant.title}</span>
                {variant.inventory_quantity > 0 && (
                  <span className='ml-auto text-gray-600'>
                    {variant.inventory_quantity} available
                  </span>
                )}

                <span className='ml-4 text-gray-600'>${variant.price}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default ProductList
