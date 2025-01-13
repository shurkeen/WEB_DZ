import { useState } from "react"
import { deleteAds, moveAds} from "../../requests";
import { formatDate } from "../../functions";

export default function InnerCard({data, allData, parentData, isTimeSlotAvailable}) {
    const { request_id, company_name, start_date, end_date} = data;
    const { billboard_id } = parentData;
    const [shown, setShown] = useState(false);
    const [newData, setNewData] = useState({
        new_billboard_id: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setNewData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if(isTimeSlotAvailable(newData.new_billboard_id, start_date, end_date)){
            const res = await moveAds(request_id, newData);
            if (res === 200) {
                setShown(false);
                window.location.reload();
            }
        }
    };

    const handleChancel = (e) => {
        e.preventDefault();
        setShown(false);
    }

    const handleDelete = async () => {
        if (window.confirm(`Вы уверены, что хотите удалить заявку от "${company_name}"?`)) {
            const res = await deleteAds(request_id);
            if(res){
                alert(res.message);
                window.location.reload();
            }
            
        }
    };

    

    return (
        <div className="inner-card-block">
            <div className="inner-card-block-title">
                <div className="inner-card-block-title-inner">
                    <span className="inner-card-block-name">
                        {company_name}
                    </span>
                    <div className="inner-card-block-buttons">
                        {!shown && (<img src="/images/icon-change.png" alt="Перенаправить" onClick={() => setShown(true)}/>)}
                        <img className="inner-card-block-buttons-delete" src="/images/icon-delete.png" alt="Удалить" onClick={handleDelete}/>
                    </div>
                </div>
                <span className="inner-card-block-description">
                    с {formatDate(start_date)} по {formatDate(end_date)}
                </span>
                {shown?(
                    <>
                        <form onSubmit={handleSubmit} className="form-block inner">
                            <div className="form-input-block">
                                <label htmlFor="new_billboard_id">Новый билборд:</label>
                                <select
                                    name="new_billboard_id"
                                    value={newData.new_billboard_id}
                                    onChange={(e) => handleChange(e)}
                                    required
                                >
                                    <option value="" disabled>
                                        Выберите билборд
                                    </option>
                                    {allData.filter((element) => {return element.billboard_id !== billboard_id}).map((element) => (
                                        <option key={element.billboard_id} value={element.billboard_id}>
                                            {element.billboard_code}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="buttons-block">
                                <button className="grey-button" type="chancel" onClick={(e) => handleChancel(e)}>Отменить</button>
                                <button className="filed-button" type="submit">Сохранить</button>
                            </div>
                        </form>
                    </>
                ):("")}
            </div>
        </div>
    )
}