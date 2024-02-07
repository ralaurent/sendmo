import React, { useState, useEffect, useRef } from 'react'
import { History, Globe2, Timer, MoreHorizontal, Pencil, Trash2, CreditCard, X } from 'lucide-react';
import Select, { components } from 'react-select'
import './Dashboard.css'
import { useDispatch, useSelector } from 'react-redux';
import { PaymentMethodFormModal } from '../ModalComponents';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import * as currentUserActions from '../../redux/session'
import * as transactionActions from '../../redux/transaction'
import * as usersActions from '../../redux/users'
import * as paymentMethodActions from '../../redux/payment'
import * as requestActions from '../../redux/request'
import { getElapsedTime, getElapsedTimeInSeconds, formatPrice, capitalize, containsOnlyDigits } from '../../utils';

function RxPayment(){
    const dispatch = useDispatch()
    const [strictMode, setStrictMode] = useState(''); 
    const [amount, setAmount] = useState(''); 
    const [from, setFrom] = useState(''); 
    const defaultOption = [{ value: 'sendmo', label: 'Sendmo balance' },]
    const [paymentMethod, setPaymentMethod] = useState(defaultOption[0]); 
    const [errors, setErrors] = useState({})
    const [showMenu, setShowMenu] = useState(false);
    const currentUser = useSelector((store) => store.session.user)
    const transactions = useSelector((store) => store.txs)
    const users = useSelector((store) => store.users)
    const paymentMethods = useSelector((store) => store.paymentMethods)

    let usersData = Object.values(users)
    const requestFromOptions = usersData
    .filter(user => user.id !== currentUser?.id)
    .map((user) => ({
        value: user.id,
        label: "$" + user.username
    }))

    const handleToChange = (selectedOption) => {
        setFrom(selectedOption.value)
    }

    const handleAmountChange = (e) => {
        const newValue = e.target.value
        const parsedValue = parseFloat(newValue)
        if(containsOnlyDigits(parsedValue)){
            setAmount(parsedValue)
        }
    }

    const sendRx = () => {
        let errors = {}

        if(!from){
            errors.to = "Invalid account, you are requesting from!" 
        }
        if(!amount){
            errors.amount = "Invalid amount!"
        }

        if(Object.keys(errors).length === 0){
            dispatch(requestActions.addRx({
                amount: amount,
                sender: from,
            }))
        }

       setErrors(errors)
    }

    return(
        <>
            <div className='dropdown'>
                <label className='dropdown-label'>Request from <span className='errors'>{errors.from}</span></label>
                <Select 
                    // isClearable={true} 
                    options={requestFromOptions} 
                    onChange={handleToChange} 
                    />
            </div>
            <div className='dual-container'>
                <label className='amount-label'>Amount <span className='errors'>{errors.amount}</span></label>
                <div className='amount-container'>
                    <input 
                    className='amount-input' 
                    type="number"
                    onChange={(e) => handleAmountChange(e)}
                    required
                    ></input>
                    <div className='dollar-sign'>$</div>
                    <button onClick={sendRx} className='send-button'>Request</button>
                </div>
            </div>
        </>
    )
}

export default RxPayment