import { useEffect, useState } from "react"
import { fetchAllData, addBillboard } from "../requests";

import Card from "./ui/Card";
import AddBillboard from "./forms/AddBillboard";

export default function Main() {
    const [data, setData] = useState([]);
    const [shown, setShown] = useState(false);

    useEffect(() => {
        fetchAllData(setData);
    }, [])

    function isTimeSlotAvailable(billboard_id, newStartDate, newEndDate) {
        const billboard = data.find(b => b.billboard_id === parseInt(billboard_id));
    
        const newStart = new Date(newStartDate).getTime();
        const newEnd = new Date(newEndDate).getTime();
    
        if (newStart >= newEnd) {
            alert('Дата начала аренды не может быть позже или равна дате окончания.');
            return false;
        }
    
        for (const request of billboard.ads_requests) {
            const existingStart = new Date(request.start_date).getTime();
            const existingEnd = new Date(request.end_date).getTime();
    
            if (
                (newStart >= existingStart && newStart <= existingEnd) ||
                (newEnd >= existingStart && newEnd <= existingEnd) ||
                (newStart <= existingStart && newEnd >= existingEnd)
            ) {
                alert("Новая заявка на рекламу пересекается с существующими, необходимо изменить временной промежуток.");
                return false;
            }
        }
    
        return true;
    }

    return (
        <main className="main-block">
            {(shown)? (
                <div className="main-block-form">
                    <AddBillboard setShown={setShown} requestFunction={addBillboard}/>
                </div>
            ):(
                <div className="main-block-menu">
                    {!shown && (<button className="filed-button" onClick={() => {setShown(true); window.scrollTo(0,0);}}>Добавить билборд</button>)}
                </div>
            )}

            <div className="main-block-list">
                {data.map((element, index) => {
                    return (
                        <Card key={index} data={element} allData={data} isTimeSlotAvailable={isTimeSlotAvailable}/>
                    )
                })}
            </div>
        </main>
    )
}