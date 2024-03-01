import React, { useState, useEffect, useRef, useContext } from 'react'
import { History, Globe2, Timer, MoreHorizontal, Pencil, Trash2, CreditCard, X, UserPlus, UserMinus } from 'lucide-react';
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
import io from 'socket.io-client'
import { TxRxContext } from '../../context/TxRxContext';
import socket from './socket';
import { followUser, unfollowUser } from './apis';

function PublicTxActivity(){
    const dispatch = useDispatch()
    const { tx, setTx } = useContext(TxRxContext)
    const [strictMode, setStrictMode] = useState('');
    const [txTrace, setTxTrace] = useState(false);
    const [amount, setAmount] = useState(''); 
    const [submitted, setSubmitted] = useState(''); 
    const [to, setTo] = useState(''); 
    const [rerender, setRerender] = useState(0); 
    const defaultOption = [{ value: 'sendmo', label: 'Sendmo balance' },]
    const [paymentMethod, setPaymentMethod] = useState(defaultOption[0]); 
    const [errors, setErrors] = useState({})
    const [showMenu, setShowMenu] = useState(false);
    const currentUser = useSelector((store) => store.session.user)
    const transactions = useSelector((store) => store.txs)
    const users = useSelector((store) => store.users)
    const paymentMethods = useSelector((store) => store.paymentMethods)

    let transactionData = Object.values(transactions)

    useEffect(() => {
        dispatch(transactionActions.getCurrentUsersPublicTxs())
    }, [])

    useEffect(() => {
        dispatch(currentUserActions.thunkUpdate(currentUser?.id))
    }, [transactions])

    useEffect(() => {
        socket.emit('broadcast_tx', { payload: tx.recipient })
    }, [tx])

    socket.once('broadcasted_tx', function(data) {
        const payload = data.payload
        if(currentUser?.id == payload || currentUser?.following.includes(payload)){
            setTxTrace(!txTrace)
        }
    })

    useEffect(() => {
        dispatch(currentUserActions.thunkUpdate(currentUser?.id))
        dispatch(transactionActions.getCurrentUsersPublicTxs())

        return () => 
        socket.off('broadcasted_tx')
    }, [txTrace])

    useEffect(() => {
        const intervalId = setInterval(() => {
          setRerender(prevRerender => prevRerender + 1)
        }, 1000)

        return () => clearInterval(intervalId)
    }, [])

    return(
        <>
        {transactionData.sort((a,b) => b.id-a.id).map((transaction) => (
            
            <div key={transaction?.id} className='tx-content-container'>
                <div className='tx-content-body'>
                    <div className='tx-content-profile'>{transaction?.sender_name[0].toUpperCase()}</div>
                    <div className='tx-content-body-content'>
                        <i><div className='tx-log'>{transaction?.sender_id == currentUser?.id ? "You" : capitalize(transaction?.sender_name)} paid {transaction?.recipient_id == currentUser?.id ? "You" : capitalize(transaction?.recipient_name)} <span className='tx-log-amount'>${transaction?.amount}</span></div></i>
                        <div className='time-elapsed'>{getElapsedTime(transaction?.created_at)} <Timer className='time-elapsed-icon'/></div>
                        {transaction?.comment ? transaction?.comment : <MoreHorizontal className='horizontal'/> }
                    </div> 
                </div>
            </div>
        ))} 
        <div className='overflow-padding'></div>
        </>
    )
}

export default PublicTxActivity