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
import * as requestActions from '../../redux/request'
import * as usersActions from '../../redux/users'
import * as paymentMethodActions from '../../redux/payment'
import { getElapsedTime, getElapsedTimeInSeconds, formatPrice, capitalize, containsOnlyDigits } from '../../utils';
import TxPayment from './TxPayment';
import TxActivity from './TxActivity';
import RxActivity from './RxActivity';
import RxPayment from './RxPayment';
import { useNavigate } from 'react-router-dom';
import PublicTxActivity from './PublicTxActivity';
import { TxRxContext } from '../../context/TxRxContext';
import socket from './socket';

const Sendmo = () => {
    return(
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M1.15385 4.3172C1.06097 2.2251 2.61059 0.744122 5.4174 0.242978C9.11473 -0.417131 12.5605 1.07635 12.9376 3.5022C12.9856 3.81076 13.0352 3.99716 12.9654 4.10953C12.8472 4.3001 12.386 4.2779 10.9925 4.2779C9.52863 4.2779 9.1373 4.29853 8.99617 4.12066C8.92973 4.03696 8.91873 3.90926 8.87743 3.71476C8.5878 2.35421 5.3781 2.31236 5.3781 3.66933C5.3781 4.31336 5.79683 4.54403 7.76517 4.98366C11.0609 5.71983 12.0144 6.3608 12.3012 8.03416C12.7549 10.6797 10.2431 12.7613 6.43753 12.8933C2.59094 13.0267 0.036744 11.5577 0.0076551 9.19516L0 8.55699L2.10026 8.53606L4.20027 8.51516V8.7545C4.20027 9.74096 5.01983 10.3628 6.32017 10.3628C7.50923 10.3628 8.04737 10.0158 8.04737 9.24926C8.04737 8.5884 7.8037 8.4552 5.695 7.96296C2.28806 7.16813 1.24316 6.32916 1.15385 4.3172Z" fill="#008AFF"/>
        </svg>
    )
}

function Dashboard(){
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { tx, setTx, rx, setRx } = useContext(TxRxContext)
    const [strictMode, setStrictMode] = useState(''); 
    const [txTrace, setTxTrace] = useState(false);
    const [rxTrace, setRxTrace] = useState(false);
    const defaultOption = [{ value: 'sendmo', label: 'Sendmo balance' },]
    const [activity, setActivity] = useState(true)
    const [displayedTransactions, setDisplayedTransactions] = useState(true)
    const [payment, setPayment] = useState(true)
    const [paymentMethod, setPaymentMethod] = useState(defaultOption[0]); 
    const [errors, setErrors] = useState({})
    const [showMenu, setShowMenu] = useState(false);
    const currentUser = useSelector((store) => store.session.user)
    const transactions = useSelector((store) => store.txs)
    const requests = useSelector((store) => store.rxs)
    const users = useSelector((store) => store.users)
    const paymentMethods = useSelector((store) => store.paymentMethods)

    useEffect(() => {
        if(!currentUser?.id){
            navigate("/")
        }
    })

    useEffect(() => {
        dispatch(currentUserActions.thunkUpdate(currentUser?.id))
    }, [transactions])

    useEffect(() => {
        dispatch(currentUserActions.thunkUpdate(currentUser?.id))
    }, [requests])

    useEffect(() => {
        socket.emit('broadcast_tx', { payload: tx.recipient })
    }, [tx])

    socket.once('broadcasted_tx', function(data) {
        const payload = data.payload;
        if(currentUser?.id == payload){
            setTxTrace(!txTrace)
        }
    })

    useEffect(() => {
        dispatch(currentUserActions.thunkUpdate(currentUser?.id))
        dispatch(transactionActions.getCurrentUsersTxs())

        return () => 
        socket.off('broadcasted_tx')
    }, [txTrace])

    useEffect(() => {
        socket.emit('broadcast_rx', { payload: rx.sender })
    }, [rx])

    socket.once('broadcasted_rx', function(data) {
        const payload = data.payload;
        if(currentUser?.id == payload){
            setRxTrace(!rxTrace)
        }
    })

    useEffect(() => {
        dispatch(currentUserActions.thunkUpdate(currentUser?.id))
        dispatch(requestActions.getCurrentUsersRxs())

        return () => 
        socket.off('broadcasted_rx')
    }, [rxTrace])

    return(
        <div className='dashboard-container'>
            <div className='dashboard-content-container'>
                <div className='tx-activity'>
                    <div className='tx-header'>
                        <div className='tx-header-text'>Activity</div>
                        <div className='tx-activity-selector-container'>
                            <div onClick={() => setDisplayedTransactions(true)} className={displayedTransactions ? 'tx-activity-history selected clickable' : 'tx-activity-public clickable'}>
                                History
                                <History className='activity-icons'/>
                            </div>
                            <div onClick={() => setDisplayedTransactions(false)} className={!displayedTransactions ? 'tx-activity-history selected clickable' : 'tx-activity-public clickable'}>
                                Public
                                <Globe2 className='activity-icons'/>
                            </div>
                        </div>
                    </div>
                    {displayedTransactions?
                        <>
                        <div className='tab-container'>
                            <div className='tab-switch-container'>
                                <div onClick={() => setActivity(true)} className={activity ? 'tab-switch tab-selected clickable' : 'tab-switch clickable'}>Transactions</div>
                                <div onClick={() => setActivity(false)} className={!activity ? 'tab-switch tab-selected clickable' : 'tab-switch clickable'}>Requests</div>
                            </div>
                        </div>
                        <div className='divider'></div>

                        <div className='tx-feed'>
                            {activity ? <TxActivity/> : <RxActivity/>}
                        </div>
                        </>
                        :
                        <div className='tx-feed'>
                            <PublicTxActivity/>
                        </div>
                    }
                </div>
                <div className='tx-send'>
                    <div className='tx-header'>
                        <div className='tx-header-text'>Payment</div>
                    </div>
                    <div className='tab-container'>
                        <div className='tab-switch-container'>
                            <div onClick={() => setPayment(true)} className={payment ? 'tab-switch tab-selected clickable' : 'tab-switch clickable'}>Send</div>
                            <div onClick={() => setPayment(false)} className={!payment ? 'tab-switch tab-selected clickable' : 'tab-switch clickable'}>Request</div>
                        </div>
                    </div>
                    <div className='tx-send-content-container'>
                        <div className='tx-send-content'>
                            <div className='tx-send-content-text-container'>
                                <Sendmo/>
                                <div className='tx-send-content-text-balance'>Balance:</div>
                                {currentUser?.id && <div className='tx-send-content-text-amount'>${formatPrice(currentUser?.balance)}</div>}
                            </div>
                        </div>
                        {payment ? <TxPayment/> : <RxPayment/>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard