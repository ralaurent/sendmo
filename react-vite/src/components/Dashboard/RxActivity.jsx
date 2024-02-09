import React, { useState, useEffect, useRef } from 'react'
import { History, Globe2, Timer, MoreHorizontal, Pencil, Trash2, CreditCard, X, Check, Divide, ArrowRight } from 'lucide-react';
import Select, { components } from 'react-select'
import './Dashboard.css'
import { useDispatch, useSelector } from 'react-redux';
import { PaymentMethodFormModal } from '../ModalComponents';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import * as currentUserActions from '../../redux/session'
import * as transactionActions from '../../redux/transaction'
import * as requestActions from '../../redux/request'
import * as usersActions from '../../redux/users'
import * as paymentMethodActions from '../../redux/payment' 
import { getElapsedTime, getElapsedTimeInSeconds, formatPrice, capitalize, containsOnlyDigits } from '../../utils';

function RxActivity(){
    const dispatch = useDispatch()
    const [strictMode, setStrictMode] = useState(''); 
    const [amount, setAmount] = useState(''); 
    const [updatedAmount, setUpdatedAmount] = useState(''); 
    const [submitted, setSubmitted] = useState(''); 
    const [to, setTo] = useState(''); 
    const [editing, setEditing] = useState(false); 
    const defaultOption = [{ value: 'sendmo', label: 'Sendmo balance' },]
    const [paymentMethod, setPaymentMethod] = useState(defaultOption[0]); 
    const [errors, setErrors] = useState({})
    const [showMenu, setShowMenu] = useState(false);
    const currentUser = useSelector((store) => store.session.user)
    const transactions = useSelector((store) => store.txs)
    const requests = useSelector((store) => store.rxs)
    const users = useSelector((store) => store.users)
    const paymentMethods = useSelector((store) => store.paymentMethods)

    let requestData = Object.values(requests)

    useEffect(() => {
        dispatch(currentUserActions.thunkUpdate(currentUser?.id))
    }, [requests])

    useEffect(() => {
        dispatch(requestActions.getCurrentUsersRxs())
    }, [])

    const updateRx = (rxId) => {
        dispatch(requestActions.updateRx(rxId, {
            amount: updatedAmount
        }))
        setEditing(false)
    }

    const deleteRx = (rxId) => {
        dispatch(requestActions.deleteRx(rxId))
    }

    const acceptRx = (rxId) => {
        dispatch(requestActions.acceptRx(rxId))
    }

    const declineRx = (rxId) => {
        dispatch(requestActions.declineRx(rxId))
    }

    const handleAmountChange = (e) => {
        const newValue = e.target.value
        const parsedValue = parseFloat(newValue)
        if(containsOnlyDigits(parsedValue)){
            setUpdatedAmount(parsedValue)
        }
    }

    return(
        <>
        {requestData.sort((a,b) => b.id-a.id).map((request) => (
            request?.requester_id == currentUser?.id ?
            <div key={request?.id} className='tx-content-container'>
                <div className='tx-content-body'>
                    <div className='tx-content-profile'>{request?.accepted || request?.declined ? request?.sender_name[0].toUpperCase() : request?.requester_name[0].toUpperCase()}</div>
                    <div className='tx-content-body-content'>
                        {request?.accepted ?
                        <i><div className='tx-log'>{capitalize(request?.sender_name)} accepted your request for <span className='tx-log-amount'>${request?.amount}</span></div></i>
                        : request?.declined ?
                        <i><div className='tx-log'>{capitalize(request?.sender_name)} declined your request for <span className='tx-log-amount'>${request?.amount}</span></div></i>
                        :
                        <i><div className='tx-log'>{"You"} requested <span className='tx-log-amount'>
                            ${editing && request?.id == editing ?
                            <div className='tx-log-block'>
                                <div className='tx-log-send-update-input-container'>
                                    <input className='tx-log-send-update-input' value={updatedAmount} onChange={(e) => handleAmountChange(e)} type="number" required></input>
                                    <div onClick={() => setEditing(false)} className='tx-log-exit-update-button'>
                                        <X onClick={() => setEditing(false)} className='tx-log-exit-update-button-icon clickable'/>    
                                    </div>
                                    <div className='tx-log-send-update-button'>
                                        <ArrowRight onClick={() => updateRx(request?.id)} className='tx-log-send-update-button-icon clickable'/>
                                    </div>
                                </div>
                            </div>
                            :
                            request?.amount
                            }
                            </span> from {capitalize(request?.sender_name)}</div></i>
                        }
                        <div className='time-elapsed'>{getElapsedTime(request?.created_at)} <Timer className='time-elapsed-icon'/></div>
                        {request?.comment ? request?.comment : <MoreHorizontal className='horizontal'/> }
                    </div> 
                </div>
                <div className='tx-change-content'>
                    {!request?.accepted && !request?.declined && <div className='tx-change-content-container'>
                        <Pencil onClick={() => {setEditing(request?.id), setUpdatedAmount(request?.amount)}} className='tx-change-content-icons clickable'/>
                        <Trash2 onClick={() => deleteRx(request?.id)} className='tx-change-content-icons clickable'/>
                    </div>}
                </div>
            </div>
            :
            !request?.accepted && !request?.declined && <div key={request?.id} className='tx-content-container'>
                <div className='tx-content-body'>
                    <div className='tx-content-profile'>{request?.requester_name[0].toUpperCase()}</div>
                    <div className='tx-content-body-content'>
                        <i><div className='tx-log'>{capitalize(request?.requester_name)} requested <span className='tx-log-amount'>${request?.amount}</span> from {"You"}</div></i>
                        <div className='time-elapsed'>{getElapsedTime(request?.created_at)} <Timer className='time-elapsed-icon'/></div>
                        {request?.comment ? request?.comment : <MoreHorizontal className='horizontal'/> }
                    </div> 
                </div>
                <div className='tx-change-content'>
                    {!request?.accepted && !request?.declined && <div className='tx-change-content-container'>
                        <div className='tx-change-decline'>
                            <X onClick={() => declineRx(request?.id)} className='tx-change-decline-icon clickable'/>
                        </div> 
                        <div className='tx-change-accept'>
                            <Check onClick={() => acceptRx(request?.id)} className='tx-change-accept-icon clickable'/>
                        </div>
                    </div>}
                </div>
            </div>
        ))}
        <div className='overflow-padding'></div>
        </>
    ) 
}

export default RxActivity