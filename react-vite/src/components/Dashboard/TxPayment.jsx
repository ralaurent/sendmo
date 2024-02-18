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
import { getElapsedTime, getElapsedTimeInSeconds, formatPrice, capitalize, containsOnlyDigits } from '../../utils';
import { TxRxContext } from '../../context/TxRxContext';

function TxPayment(){
    const dispatch = useDispatch()
    const { setTx } = useContext(TxRxContext)
    const [strictMode, setStrictMode] = useState(''); 
    const [amount, setAmount] = useState(''); 
    const [to, setTo] = useState(''); 
    const defaultOption = [{ value: 'sendmo', label: 'Sendmo balance' },]
    const [paymentMethod, setPaymentMethod] = useState(defaultOption[0]); 
    const [errors, setErrors] = useState({})
    const [showMenu, setShowMenu] = useState(false);
    const currentUser = useSelector((store) => store.session.user)
    const transactions = useSelector((store) => store.txs)
    const users = useSelector((store) => store.users)
    const paymentMethods = useSelector((store) => store.paymentMethods)

    let usersData = Object.values(users)
    const toOptions = usersData
    .filter(user => user.id !== currentUser?.id)
    .map((user) => ({
        value: user.id,
        label: "$" + user.username
    }))

    const handleToChange = (selectedOption) => {
        setTo(selectedOption)
    }

    let paymentMethodData = Object.values(paymentMethods)
    const paymentMethodOptions = [
        ...defaultOption,
        ...paymentMethodData.map((payment) => ({
            value: payment.id,
            label: `**** ${payment.last_4_digits} ${payment.exp_date} ${payment.cvc}`
        }))
    ]

    const handlePaymentMethodChange = (selectedOption) => {
        setPaymentMethod(selectedOption)
    }

    const handleAmountChange = (e) => {
        const newValue = e.target.value
        const parsedValue = parseFloat(newValue)
        if(containsOnlyDigits(parsedValue)){
            setAmount(parsedValue)
        }
    }

    const handleRadioClick = (event) => {
        if(strictMode === "strict"){
            return setStrictMode("laxed");
        }
        setStrictMode(event.target.value)
    }

    useEffect(() => {
        setPaymentMethod(defaultOption[0])
    }, [paymentMethods])

    useEffect(() => {
        dispatch(usersActions.getUsers())
        dispatch(paymentMethodActions.getPaymentMethod())
    }, [])

    
    const sendTx = async (e) => {
        let errors = {}

        if(!to){
            errors.to = "Invalid recipient!" 
        }
        if(!amount || amount <= 0){
            errors.amount = "Invalid amount!"
        }
        if(paymentMethod.value == "sendmo" && amount > currentUser?.balance){
            errors.amount = "Insufficient funds!"
        }
        if(paymentMethod.value != "sendmo" && amount > 10_000){
            errors.amount = "Txs can't exceed $10,000!"
        }

        if(Object.keys(errors).length === 0){
            const tx = {
                amount: amount,
                type: paymentMethod.value === "sendmo",
                recipient: to.value,
                strict: strictMode === "strict"
            }
            await dispatch(transactionActions.addTx(tx))
            setTx(tx)
            clearInputs()
        }

       setErrors(errors)
    }

    const clearInputs = () => {
        setTo("")
        setAmount("")
    }

    const CustomOption = ({ innerRef, innerProps, data }) => {
        const handleClickDelete = (e) => {
            e.stopPropagation()
            dispatch(paymentMethodActions.deletePaymentMethod(data.value))
        };

        const index = paymentMethodOptions.findIndex(pay => pay.value === data.value)
        const paymentMethodData = paymentMethodOptions[index].label.split(" ")
      
        return (
          <div className='select-content-container' {...innerProps} style={{ backgroundColor: paymentMethod.value == data.value ? '#008AFF' : 'white', color: paymentMethod == data.value ? 'white' : 'black' }}>
            <span>{data.label}</span>
              
            {data.value !== "sendmo" &&
                <div className='select-content-icons-container'>
                    <OpenModalButton
                    onButtonClick={() => {}}
                    modalComponent={<PaymentMethodFormModal paymentMethodId={data.value} data={{ last4Digits: paymentMethodData[1], expDate: paymentMethodData[2], cvc: paymentMethodData[3] }}/>}
                    buttonComponent={
                        <div style={{padding: "5px", display: "flex"}}>
                            <CreditCard className='select-content-icons'/>
                        </div>
                    }
                    />
                    <div style={{padding: "5px", display: "flex",}} onClick={handleClickDelete}>
                        <X className='select-content-icons' />
                    </div>    
                </div>
            }
          </div>
        );
    }

    const closeMenu = () => setShowMenu(false);

    return(
        <>
            <div className='dropdown'>
                <label className='dropdown-label'>Send to <span className='errors'>{errors.to}</span></label>
                <Select 
                    options={toOptions} 
                    value={to}
                    onChange={handleToChange} 
                    />
            </div>
            <div className='dropdown'>
                <label className='dropdown-label'>Payment Method</label>
                <Select 
                    isSearchable={false} 
                    options={paymentMethodOptions}
                    value={paymentMethod}
                    onChange={handlePaymentMethodChange} 
                    components={{ Option: CustomOption }}
                    />
                {<OpenModalMenuItem
                    textComponent={<div className='add-payment clickable'><u>Add payment method</u></div>}
                    onItemClick={closeMenu}
                    modalComponent={<PaymentMethodFormModal />}
                />}
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
                    <button onClick={sendTx} className='send-button'>Send</button>
                </div>
            </div>
            <div className='strict-mode'>
                <div>strict mode</div>
                <input 
                className='strict-input clickable'
                type="radio" 
                value="strict"
                checked={strictMode === "strict"}
                onChange={()=>{}} 
                onClick={handleRadioClick}
                />
            </div>
        </>
    )
}

export default TxPayment