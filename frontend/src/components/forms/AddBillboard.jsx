import React, { useState } from 'react';

export default function AddBillboard({ setShown, requestFunction, initialData={}}) {
    const {billboard_id, billboard_code, location } = initialData;

    const [newData, setNewData] = useState({
        billboard_code: billboard_code || '',
        location: location || '',
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

        const res = await requestFunction(newData, billboard_id);
        if (res === 200) {
            setShown(false);
            window.location.reload();
        }
    };

    return (
        <div className="form-block">
            <h3>{billboard_id ? "Редактирование билборда" : "Добавление билборда"}</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-input-block">
                    <label htmlFor="billboard_code">Код</label>
                    <input
                        name="billboard_code"
                        type="text"
                        placeholder="Например: BB011"
                        value={newData.billboard_code}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-input-block">
                    <label htmlFor="location">Улица</label>
                    <input
                        name="location"
                        type="text"
                        placeholder="ул. Никольская, 15/1"
                        value={newData.location}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="buttons-block">
                    <button className="grey-button" type="button" onClick={() => setShown(false)}>Отменить</button>
                    <button className="filed-button" type="submit">{billboard_id ? "Сохранить" : "Добавить"}</button>
                </div>
            </form>
        </div>
    );
}