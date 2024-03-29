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

function TxActivity(){
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
        dispatch(transactionActions.getCurrentUsersTxs())
    }, [])

    useEffect(() => {
        const intervalId = setInterval(() => {
          setRerender(prevRerender => prevRerender + 1)
        }, 1000)

        return () => clearInterval(intervalId)
    }, [])

    const deleteTx = async (tx) => {
        await dispatch(transactionActions.deleteTx(tx.id))
        socket.emit('broadcast_tx', { payload: tx.recipient_id })
    }

    const handleFollow = async (userId) => {
        await followUser(userId)
        dispatch(currentUserActions.thunkUpdate(currentUser?.id))
    }

    const handleUnfollow = async (userId) => {
        await unfollowUser(userId)
        dispatch(currentUserActions.thunkUpdate(currentUser?.id))
    }

    return(
        <>
        {transactionData.sort((a,b) => b.id-a.id).map((transaction) => (
            transaction?.sender_id == currentUser?.id ?
            <div key={transaction?.id} className='tx-content-container'>
                <div className='tx-content-body'>
                    <div className='tx-content-profile'>{transaction?.sender_name[0].toUpperCase()}</div>
                    <div className='tx-content-body-content'>
                        <i><div className='tx-log'>{"You"} paid {capitalize(transaction?.recipient_name)} <span className='tx-log-amount'>${transaction?.amount}</span></div></i>
                        <div className='time-elapsed'>{getElapsedTime(transaction?.created_at)} <Timer className='time-elapsed-icon'/></div>
                        {transaction?.comment ? transaction?.comment : <MoreHorizontal className='horizontal'/> }
                    </div> 
                </div>
                <div className='tx-change-content'>
                    {(transaction?.strict_mode && getElapsedTimeInSeconds(transaction?.created_at) <= 30) || !transaction?.strict_mode ? <div className='tx-change-content-container'>
                        <Pencil className='tx-change-content-icons disabled-icon'/>
                        <Trash2 onClick={() => deleteTx(transaction)} className='tx-change-content-icons clickable'/>
                    </div>:null}
                    {transaction?.strict_mode && getElapsedTimeInSeconds(transaction?.created_at) <= 30 && <div className='tx-timer'>
                        <div className='tx-timer-overlay' style={{width: `${(getElapsedTimeInSeconds(transaction?.created_at)/30) * 100}%`}}></div>
                    </div>}
                </div>
            </div>
            :
            <div key={transaction?.id} className='tx-content-container'>
                <div className='tx-content-body'>
                    <div className='tx-content-profile'>{transaction?.sender_name[0].toUpperCase()}
                    {currentUser?.following.includes(transaction?.sender_id) ?
                        <div onClick={() => handleUnfollow(transaction?.sender_id)} className={'un followed'}>
                            <UserMinus className='following-icon'/> 
                        </div>
                        :
                        <div onClick={() => handleFollow(transaction?.sender_id)} className='followed'>
                            <UserPlus className='following-icon'/>  
                        </div> 
                    }
                    </div>
                    <div className='tx-content-body-content'>
                        <i><div className='tx-log'>{capitalize(transaction?.sender_name)} paid {"You"} <span className='tx-log-amount'>${transaction?.amount}</span></div></i>
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
export default TxActivity