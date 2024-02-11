import React from 'react'
import { CopyAllOutlined, DeleteForever } from '@mui/icons-material';
const LinkCard = ({ contentColor, refOne, refTwo, iconOne, iconTwo, isStatus, isActive, content }) => {
    return (
        <>
            <div ref={refOne} className='share-link-card'>
                <span className='client-name' style={{ color: contentColor }}>{content}</span>
                {isStatus&& <span className={isActive?"active-link":"expired-link"} title={isActive?"Active link ":"Expired link"}></span>}
                {/* <span className='link-status' title='link status'></span> */}
                {iconOne}
                {iconTwo}
            </div>
        </>
    )
}

export default LinkCard