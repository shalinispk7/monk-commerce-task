import { useDispatch } from 'react-redux'
import { setProductList } from '../reduxstore/productSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose } from '@fortawesome/free-solid-svg-icons'
import { useSelector } from 'react-redux'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

const Variants = ({ product }) => {
  const { productList } = useSelector((store) => store.productSlice)
  const dispatch = useDispatch()

  const onRemoveVariant = (productId, variantId) => {
    const variantDeSelected = productList.map((el) => {
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

  const onVariantDiscTypeChg = (type, value, variantId) => {
    const updProductList = productList.map((product) => {
      if (product.id === product.id) {
        return {
          ...product,
          variants: product.variants.map((variant) => {
            if (variant.id === variantId)
              return {
                ...variant,
                [type]: value,
              }
            else return variant
          }),
        }
      }
      return product
    })
    dispatch(setProductList(updProductList))
  }

  const onDragEnd = (result) => {
    if (!result.destination) return

    const reorderedVariants = Array.from(product.variants)
    const [movedVariant] = reorderedVariants.splice(result.source.index, 1)
    reorderedVariants.splice(result.destination.index, 0, movedVariant)

    const updatedList = productList.map((el) => {
      if (el.id === product.id) {
        return { ...el, variants: reorderedVariants }
      }
      return el
    })

    dispatch(setProductList(updatedList))
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId={`droppable-${product.id}`} type='variant'>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {product.variants.map((variant, index) => (
              <Draggable
                key={index + variant.id}
                draggableId={String(variant.id)}
                index={index}
              >
                {(provided) => (
                  <div
                    className='input-container flex items-center gap-4 w-1/3  mb-2'
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <input
                      className='text-md font-normal border border-slate-200 py-1 px-6 ps-2 outline outline-none w-2/4 rounded-full'
                      placeholder={variant?.title}
                      value={variant?.title ? variant.title : ''}
                      disabled={true}
                    />
                    <input
                      className='w-[15%]	border-solid	border-2 rounded-full'
                      type='text'
                      name='discAmount'
                      autoComplete='off'
                      value={variant?.discAmount}
                      onChange={(e) =>
                        onVariantDiscTypeChg(
                          'discAmount',
                          e.target.value,
                          variant.id
                        )
                      }
                    />
                    <select
                      className='w-1/5	border-solid	border-2  rounded-full'
                      name='discType'
                      value={variant?.discType}
                      onChange={(e) =>
                        onVariantDiscTypeChg(
                          'discType',
                          e.target.value,
                          variant.id
                        )
                      }
                    >
                      <option value={'flat off'}>flat off</option>
                      <option value={'% off'}>% off</option>
                    </select>
                    <FontAwesomeIcon
                      className='cursor-pointer'
                      icon={faClose}
                      onClick={() => onRemoveVariant(product.id, variant.id)}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

export default Variants
