import React, { useState } from 'react'
import { convertStringToDate } from '../../utils'
import { useDispatch } from 'react-redux'
import * as transactionActions from '../../redux/transaction'
import { useModal } from '../../context/Modal'

function AddCommentModal({ txId }){
    const dispatch = useDispatch()
    const [content, setContent] = useState("")
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal()

    const handleSubmit = async (e) => {
        e.preventDefault()
        let errors = {}

        if(content.length < 5){
            errors.content = "Must be at least 5 char long!"
        }

        if(Object.keys(errors).length === 0){
            dispatch(transactionActions.addTxComment(txId, {content}))
            closeModal()
        }

        setErrors(errors)
    };

    return (
    <>
        <h3>Add Comment to Tx #{txId}</h3>
        <form onSubmit={handleSubmit}>
        <label className='global-label'>
            Comment
            <span className='errors'>{errors.content}</span>
            <textarea
            type='tel'
            value={content}
            className='global-textarea'
            maxLength='250'
            onChange={(e) => setContent(e.target.value)}
            required
            />
        </label>
        {<button className='global-button' type="submit">comment</button>}
        </form>
    </>
      );
}

export default AddCommentModal