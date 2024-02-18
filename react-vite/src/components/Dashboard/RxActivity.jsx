import React, { useState, useEffect, useRef, useContext } from 'react'
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
import { TxRxContext } from '../../context/TxRxContext';
import socket from './socket';

function RxActivity(){
    const dispatch = useDispatch()
    const { rx, setRx } = useContext(TxRxContext)
    const [strictMode, setStrictMode] = useState(''); 
    const [rxTrace, setRxTrace] = useState(false);
    const [amount, setAmount] = useState(''); 
    const [updatedAmount, setUpdatedAmount] = useState(''); 
    const [submitted, setSubmitted] = useState(''); 
    const [to, setTo] = useState(''); 
    const [editing, setEditing] = useState(false); 
    const defaultOption = [{ value: 'sendmo', label: 'Sendmo balance' },]
    const [paymentMethod, setPaymentMethod] = useState(defaultOption[0]); 
    const [errors, setErrors] = useState({})
    const [showMenu, setShowMenu] = useState(false);
    const [rerender, setRerender] = useState(0); 
    const currentUser = useSelector((store) => store.session.user)
    const transactions = useSelector((store) => store.txs)
    const requests = useSelector((store) => store.rxs)
    const users = useSelector((store) => store.users)
    const paymentMethods = useSelector((store) => store.paymentMethods)

    let requestData = Object.values(requests)

    useEffect(() => {
        dispatch(requestActions.getCurrentUsersRxs())
    }, [])

    useEffect(() => {
        const intervalId = setInterval(() => {
          setRerender(prevRerender => prevRerender + 1)
        }, 1000)

        return () => clearInterval(intervalId)
    }, [])

    const updateRx = async (rx) => {
        dispatch(requestActions.updateRx(rx.id, {
            amount: updatedAmount
        }))
        setEditing(false)
        socket.emit('broadcast_rx', { payload: rx.sender_id })
    }

    const deleteRx =  async (rx) => {
        await dispatch(requestActions.deleteRx(rx.id))
        socket.emit('broadcast_rx', { payload: rx.sender_id })
    }

    const acceptRx = async (rx) => {
        await dispatch(requestActions.acceptRx(rx.id))
        socket.emit('broadcast_rx', { payload: rx.requester_id })
        socket.emit('broadcast_tx', { payload: rx.requester_id })
    }

    const declineRx = async (rx) => {
        await dispatch(requestActions.declineRx(rx.id))
        socket.emit('broadcast_rx', { payload: rx.requester_id })
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
                                        <ArrowRight onClick={() => updateRx(request)} className='tx-log-send-update-button-icon clickable'/>
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
                        <Trash2 onClick={() => deleteRx(request)} className='tx-change-content-icons clickable'/>
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
                            <X onClick={() => declineRx(request)} className='tx-change-decline-icon clickable'/>
                        </div> 
                        <div className='tx-change-accept'>
                            <Check onClick={() => acceptRx(request)} className='tx-change-accept-icon clickable'/>
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