import React, { useState } from 'react'

const FiltersCard = ({ applyFilterHandle, setHighToLow, setHideZeroBalance, setLowToHigh, hideZoreBalance, highToLow, lowToHigh }) => {
    return (
        <div className="filters-container">
            <h4 style={{ fontFamily: "jetBrains Mono" }}>Filters</h4>
            <hr />
            <label htmlFor="hzb"><input id='hzb' name='hideZero' checked={hideZoreBalance} value={hideZoreBalance} onChange={(e) => { setHideZeroBalance(!hideZoreBalance) }} type="checkbox" /> Hide 0 Balances</label>
            {!lowToHigh && <label htmlFor="htl"><input id='htl' name='highToLow' checked={highToLow} value={highToLow} onChange={(e) => setHighToLow(!highToLow)} type="checkbox" />Balance : High to Low</label>}
            {!highToLow && <label htmlFor="lth"><input id='lth' name='lowToHigh' checked={lowToHigh} value={lowToHigh} onChange={(e) => { setLowToHigh(!lowToHigh) }} type="checkbox" />Balance : Low to High</label>}
            <button onClick={applyFilterHandle}>apply </button>

        </div>
    )
}

export default FiltersCard 