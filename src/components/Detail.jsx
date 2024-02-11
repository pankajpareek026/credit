import React from 'react'
import CustomModal from '../mui_comps/CustomModal'

export default function Detail({amount,date,dis,type}) {



    return (
        // <div className="details">
        //     <h2>{amount}</h2>
        //     <div className='details-date'> <span>Date :</span> <span> {date}</span></div>
        //     <div className='details-discryption'> <span>Discryption  :</span>  <span>  {dis}</span> </div>
        //     <div className='details-discryption'> <span>Type  :</span>  <span>  {type}</span> </div>
        //     <div className='details-button-container'> <button>close</button> </div>
        // </div>
        <CustomModal
        isFirstButton={true}
        firstButtonName={"OK"}
        isSecondButton={true}
        secondButtonName={"Edit"}
        />
    )
}

