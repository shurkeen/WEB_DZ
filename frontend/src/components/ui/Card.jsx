import { useState } from "react"
import { updateBillboard, deleteBillboard, addAds} from "../../requests";

import AddAds from "../forms/AddAds";
import AddBillboard from "../forms/AddBillboard";
import InnerCard from "./InnerCard";

export default function Card({data, allData, isTimeSlotAvailable}) {
    const {billboard_id, billboard_code, location, ads_requests = []} = data;
    const parentData = {
        billboard_id: billboard_id,
    };
    const[edit, setEdit] = useState(false);
    const [shown, setShown] = useState(false);

    const handleDelete = async () => {
        if (window.confirm(`Вы уверены, что хотите удалить билборд "${billboard_code}"?`)) {
            const res = await deleteBillboard(billboard_id);
            if(res){
                alert(res.message);
                window.location.reload();
            }
            
        }
    };

    return (
        <div className="card-block">
            {edit?(
                <AddBillboard setShown={setEdit} requestFunction={updateBillboard} initialData={data} isTimeSlotAvailable={isTimeSlotAvailable}/>
            ):(
                <>
                    <div className="card-block-title">
                        <h2 className="card-block-title-name">
                            #{billboard_code}
                        </h2>
                        <div>
                            <img src="/images/icon-edit.png" onClick={() => setEdit(true)} className="card-block-title-edit-button" alt="Изменить" />
                            <img src="/images/icon-delete.png" onClick={() => handleDelete()} className="card-block-title-delete-button" alt="Удалить" />
                        </div>
                    </div>
                    <div className="card-block-content">
                        <div className="card-block-subtitle">
                            {location}
                        </div>
                        {ads_requests.length > 0?(
                            <>
                                <h3>Заявки</h3>
                                <div className="card-block-content-tasks-list">
                                    {ads_requests.map((element, index) => {
                                        return (
                                            <InnerCard key={index} data={element} parentData={parentData} allData={allData} isTimeSlotAvailable={isTimeSlotAvailable}/>
                                        )
                                    })}

                                </div>
                            </>
                        ):(
                            <h3 className="card-block-content-tasks-title">Нет заявок</h3>
                        )}
                        {shown?(
                            <AddAds setShown={setShown} parentData={parentData} requestFunction={addAds} isTimeSlotAvailable={isTimeSlotAvailable}/>
                        ):(
                            <div className="buttons-block">
                                <button className="unfiled-button" onClick={() => setShown(true)}>Добавить заявку</button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}