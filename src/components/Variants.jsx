import { useDispatch } from 'react-redux'
import { setProductList } from '../reduxstore/productSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose } from '@fortawesome/free-solid-svg-icons'
import { useSelector } from 'react-redux'

const Variants = (props) => {
  const { onDiscountTypeChg, product, variant } = props
  const { productList } = useSelector((store) => store.productSlice)
  const dispatch = useDispatch()

  const onRemoveVariant = (productId, variantId) => {
    //to remove variant on clicking X button

    let variantDeSelected = productList.map((el) => {
      if (el.id === productId) {
        return {
          ...el,
          variants: el.variants.filter((variant) => variant.id !== variantId),
        }
      }
      return el
    })
    dispatch(setProductList(variantDeSelected))
  }

  return (
    <div className='input-container flex gap-4 w-1/2'>
      <input
        className=' text-md font-normal border border-slate-200 py-1 px-6 ps-2 outline outline-none w-2/4 rounded-full'
        placeholder={variant?.title}
        value={variant?.title ? variant.title : ''}
        disabled={true}
      />

      <input
        className='w-[15%]	border-solid	border-2 rounded-full'
        type='text'
        name='discAmount'
        value={product?.discAmount}
        onChange={(e) =>
          onDiscountTypeChg('discAmount', e.target.value, product.id)
        }
      />
      <select
        className='w-1/5	border-solid	border-2  rounded-full'
        name='discType'
        value={product?.discType}
        onChange={(e) =>
          onDiscountTypeChg('discType', e.target.value, product.id)
        }
      >
        <option value={'flat off'}>flat off</option>
        <option value={'% off'}>% off</option>
      </select>
      <FontAwesomeIcon
        icon={faClose}
        className=' w-[15%]'
        onClick={() => onRemoveVariant(product.id, variant.id)}
      />
    </div>
  )
}

export default Variants
