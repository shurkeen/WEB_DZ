import { useState } from "react";
import { getCurrDateHtml, isDurationWithinLimits } from "../../functions";

export default function AddAds({ setShown, requestFunction, parentData, isTimeSlotAvailable}) {
    const {billboard_id} = parentData;
    const [newData, setNewData] = useState({
        billboard_id: billboard_id,
        company_name: '',
        start_date: '',
        end_date: '',
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

        if(isDurationWithinLimits(newData.start_date, newData.end_date) && isTimeSlotAvailable(billboard_id, newData.start_date, newData.end_date)){
            const res = await requestFunction(newData);
            if (res === 200) {
                setShown(false);
                window.location.reload();
            }
        }
    };

    return (
        <div className="form-block">
            <h3>Добавление заявки на рекламу</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-input-block">
                    <label htmlFor="company_name">Заказчик</label>
                    <input
                        name="company_name"
                        type="text"
                        placeholder="Название компании"
                        value={newData.company_name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-input-block">
                    <label htmlFor="start_date">Дата начала</label>
                    <input
                        name="start_date"
                        type="date"
                        min={getCurrDateHtml()}
                        value={newData.start_date}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-input-block">
                    <label htmlFor="end_date">Дата завершения</label>
                    <input
                        name="end_date"
                        type="date"
                        min={getCurrDateHtml()}
                        value={newData.end_date}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="buttons-block">
                    <button className="grey-button" type="button" onClick={() => setShown(false)}>Отменить</button>
                    <button className="filed-button" type="submit">Добавить</button>
                </div>
            </form>
        </div>
    );
}