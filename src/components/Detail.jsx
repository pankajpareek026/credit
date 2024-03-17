import React from 'react'
import CustomModal from '../mui_comps/CustomModal'

export default function Detail({amount,date,dis,type}) {



    return (
        <CustomModal
        isFirstButton={true}
        firstButtonName={"OK"}
        isSecondButton={true}
        secondButtonName={"Edit"}
        />
    )
}

