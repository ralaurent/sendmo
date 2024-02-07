import React, { useState } from 'react'
import { convertStringToDate } from '../../utils'
import { useDispatch } from 'react-redux'
import * as paymentMethodActions from '../../redux/payment'
import {
    formatCreditCardNumber,
    formatCVC,
    formatExpirationDate
  } from '../../utils'
import { useModal } from '../../context/Modal'

function PaymentMethodFormModal({ paymentMethodId }){
    const dispatch = useDispatch()
    const [cardNum, setCardNum] = useState("")
    const [expDate, setExpDate] = useState("")
    const [cvc, setCVC] = useState("")
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal()

    const handleSubmit = async (e) => {
        e.preventDefault()
        let errors = {}

        if(cardNum.length < 19){
            errors.cardNum = "Invalid card number!"
        }
        if(convertStringToDate(expDate) < new Date() || convertStringToDate(expDate) > convertStringToDate("12/35")){
            errors.expDate = "Invalid expiration date!"
        }

        if(Object.keys(errors).length === 0){
            if(paymentMethodId){
                dispatch(paymentMethodActions.updatePaymentMethod(paymentMethodId, {
                    card: cardNum.substring(cardNum.length - 4),
                    exp: expDate,
                    cvc
                }))
                closeModal()
                return
            }
            dispatch(paymentMethodActions.addPaymentMethod({
                card: cardNum.substring(cardNum.length - 4),
                exp: expDate,
                cvc
            }))
            closeModal()
        }

        setErrors(errors)
    };

    return (
    <>
        <h3>{paymentMethodId ? "Update Payment" : "Add Payment"}</h3>
        {errors.server && <p>{errors.server}</p>}
        <form onSubmit={handleSubmit}>
        <label className='global-split-label'>
            Card Number
            <span className='errors'>{errors.cardNum}</span>
            <input
            type='tel'
            value={cardNum}
            pattern='[\d| ]{16,22}'
            className='global-input'
            maxLength='19'
            onChange={(e) => setCardNum(formatCreditCardNumber(e.target.value))}
            required
            />
        </label>
        {errors.card && <p>{errors.card}</p>}
        <div className='input-split'>
            <label className='global-split-label'>
                Expiry Date
                <span className='errors'>{errors.expDate}</span>
                <input
                type="tel"
                pattern='\d\d/\d\d'
                className='global-input'
                value={expDate}
                onChange={(e) => setExpDate(formatExpirationDate(e.target.value))}
                required
                />
            </label>
            {errors.exp && <p>{errors.exp}</p>}
            <label className='global-split-label'>
                CVC
                <span className='errors'>{errors.cvc}</span>
                <input
                type="text"
                className='global-input'
                value={cvc}
                onChange={(e) => setCVC(formatCVC(e.target.value))}
                maxLength={3}
                required
                />
            </label>
        </div>
        {<button className='global-button' type="submit">{paymentMethodId ? "update" : "submit"}</button>}
        </form>
    </>
      );
}

export default PaymentMethodFormModal