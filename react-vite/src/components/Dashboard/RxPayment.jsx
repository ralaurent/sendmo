import React, { useState, useEffect, useRef, useContext } from 'react'
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
import { TxRxContext } from '../../context/TxRxContext';

function RxPayment(){
    const dispatch = useDispatch()
    const { setRx } = useContext(TxRxContext)
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

    const handleFromChange = (selectedOption) => {
        setFrom(selectedOption)
    }

    const handleAmountChange = (e) => {
        const newValue = e.target.value
        const parsedValue = parseFloat(newValue)
        if(containsOnlyDigits(parsedValue)){
            setAmount(parsedValue)
        }
    }

    const sendRx = async (e) => {
        let errors = {}

        if(!from.value){
            errors.from = "Invalid account, you are requesting from!" 
        }
        if(!amount || amount <= 0){
            errors.amount = "Invalid amount!"
        }

        if(Object.keys(errors).length === 0){
            const rx = {
                amount: amount,
                sender: from.value,
            }
            await dispatch(requestActions.addRx(rx))
            setRx(rx)
            clearInputs()
        }

       setErrors(errors)
    }

    const clearInputs = () => {
        setFrom("")
        setAmount("")
    }

    return(
        <>
            <div className='dropdown'>
                <label className='dropdown-label'>Request from <span className='errors'>{errors.from}</span></label>
                <Select 
                    // isClearable={true} 
                    options={requestFromOptions} 
                    value={from}
                    onChange={handleFromChange} 
                    />
            </div>
            <div className='dual-container'>
                <label className='amount-label'>Amount <span className='errors'>{errors.amount}</span></label>
                <div className='amount-container'>
                    <input 
                    className='amount-input' 
                    type="number"
                    value={amount}
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