export const followUser = async (userId) => {
    const response = await fetch(`/api/follow/${userId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
    })

    if(response.ok){
        return
    }else{
        const errors = await response.json()
        return errors
    }
}

export const unfollowUser = async (userId) => {
    const response = await fetch(`/api/follow/${userId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
    })

    if(response.ok){
        return
    }else{
        const errors = await response.json()
        return errors
    }
}
