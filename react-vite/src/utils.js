import Payment from 'payment'

function clearNumber (value = '') {
  return value.replace(/\D+/g, '')
}

export function formatCreditCardNumber (value) {
  if (!value) {
    return value
  }

  const issuer = Payment.fns.cardType(value)
  const clearValue = clearNumber(value)
  let nextValue

  switch (issuer) {
    case 'amex':
      nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
        4,
        10
      )} ${clearValue.slice(10, 15)}`
      break
    case 'dinersclub':
      nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
        4,
        10
      )} ${clearValue.slice(10, 14)}`
      break
    default:
      nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
        4,
        8
      )} ${clearValue.slice(8, 12)} ${clearValue.slice(12, 19)}`
      break
  }

  return nextValue.trim()
}

export function formatCVC (value, prevValue, allValues = {}) {
  const clearValue = clearNumber(value)
  let maxLength = 3

  if (allValues.number) {
    const issuer = Payment.fns.cardType(allValues.number)
  }

  return clearValue.slice(0, maxLength)
}

export function formatExpirationDate (value) {
  const clearValue = clearNumber(value)

  if (clearValue.length >= 3) {
    return `${clearValue.slice(0, 2)}/${clearValue.slice(2, 4)}`
  }

  return clearValue
}

export function getElapsedTime(startDate) {
    const start = new Date(startDate).getTime()
    const now = new Date().getTime()
    const second = 1000
    const minute = 1000*60
    const hour = 1000*60*60
    const day = 1000*60*60*24
    const elapsed = (now - start)
    if(elapsed >= 0 && elapsed < minute){
        const newElapse = Math.floor(elapsed / second)
        return newElapse + "s"
    }else if(elapsed > minute && elapsed < hour){
        const newElapse = Math.floor(elapsed / minute)
        return newElapse + "m"
    }else if(elapsed > hour && elapsed < day){
        const newElapse = Math.floor(elapsed / hour)
        return newElapse + "h"
    }else{
        const newElapse = Math.floor(elapsed / day)
        return newElapse + "d"
    }

}

export function getElapsedTimeInSeconds(startDate) {
    const start = new Date(startDate).getTime()
    const now = new Date().getTime()
    const second = 1000
    return Math.floor((now - start) / 1000)
}

export function formatPrice(number) {
    return number.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
}

export function capitalize(word){
    return word[0].toUpperCase() + word.slice(1)
}

export function convertStringToDate(date) {
    const [month, year] = date.split('/')

    const currentDate = new Date(parseInt(`20${year}`, 10), parseInt(month, 10) - 1, 1)
  
    return currentDate;
}
export const containsOnlyDigits = (input) => {
    for (let i = 0; i < input.length; i++) {
      const charCode = input.charCodeAt(i);
      if (charCode < 48 || charCode > 57) {
        return false;
      }
    }
    return true;
}