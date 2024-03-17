import React, { useState } from 'react'
import TuneIcon from '@mui/icons-material/Tune';
import FiltersCard from './FiltersCard';
const FilterButton = ({ unFilteredData, setIsFiltersApplied, showFilters, setFilteredData, setShowFilters }) => {
    const [hideZoreBalance, setHideZeroBalance] = useState(false)
    const [highToLow, setHighToLow] = useState(false);
    const [lowToHigh, setLowToHigh] = useState(false);
    const applyFilterHandle = () => {
        let filteredData;
        let freshData = unFilteredData


        // if hide 0 balances check box is checked
        if (hideZoreBalance && !highToLow && !lowToHigh) {
            // to filter cliets which have none 0  balances
            const noneZero = unFilteredData?.filter((data) => data.balance !== 0)
            setIsFiltersApplied(true)
            filteredData = noneZero
            setFilteredData(filteredData)
            setShowFilters(false)
            return
        }


        // if hide 0 balaces and highToLow both check boxes checked
        if (highToLow && hideZoreBalance) {
            setIsFiltersApplied(true)
            filteredData = [...freshData]?.sort((first, second) => second?.balance - first?.balance);
            filteredData = filteredData?.filter((data) => data?.balance !== 0)
            setFilteredData(filteredData);
            setShowFilters(false);
            return;
        }


        // if 0 balaces are not hide
        if (highToLow && !hideZoreBalance) {
            setIsFiltersApplied(true)
            filteredData = [...freshData]?.sort((first, second) => second?.balance - first?.balance);
            setFilteredData(filteredData)
            setShowFilters(false)
            return
        }


        // short if low to high and hidezero both  boxes checked
        if (lowToHigh && hideZoreBalance) {
            setIsFiltersApplied(true)
            filteredData = [...freshData]?.sort((first, second) => first.balance - second.balance)
            filteredData = filteredData?.filter((data) => data.balance !== 0)
            setFilteredData(filteredData)
            setShowFilters(false)
            return
        }


        // if 0 balaces are not hide
        if (lowToHigh && !hideZoreBalance) {
            setIsFiltersApplied(true)
            filteredData = [...freshData]?.sort((first, second) => first?.balance - second?.balance);
            setFilteredData(filteredData)
            setShowFilters(false)
            return
        }


        // if all check boxes  unchecked
        if (!highToLow && !hideZoreBalance && !lowToHigh) {
            setIsFiltersApplied(false)
            setShowFilters(false)
            return
        }

        setShowFilters(false)
    }

    return (
        <>
            <div onClick={() => setShowFilters(current => !current)} className="sort-by">
                <TuneIcon />
            </div>
            {
                showFilters && <FiltersCard
                    setHideZeroBalance={setHideZeroBalance}
                    setHighToLow={setHighToLow}
                    setLowToHigh={setLowToHigh}
                    hideZoreBalance={hideZoreBalance}
                    highToLow={highToLow}
                    lowToHigh={lowToHigh}
                    setIsFiltersApplied={setIsFiltersApplied}
                    unFiltereData={unFilteredData}
                    setFilteredData={setFilteredData}
                    applyFilterHandle={applyFilterHandle}
                />

            }
        </>
    )
}

export default FilterButton