// ---------- Константы ----------

export const MIN = 7;
export const MAX = 60;

// ---------- Адрес сервера ----------

const URL = "http://localhost:5000";

// ---------- Запрос на получение всех билбордов и их заявок ----------

export const fetchAllData = async (setData) => {
    try {
      const response = await fetch(`${URL}/billboards`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
      if (!response.ok) {
        throw new Error('Ошибка при получении данных');
      }

      const data = await response.json();
      
      setData(data);
    } catch (error) {
      console.error('Ошибка при первичной загрузке данных:', error.message);
      alert('Ошибка при первичной загрузке данных: ' + error.message);
    }
  };

// ---------- Запрос на добавление билборда ----------

export const addBillboard = async (data) => {
  try {

    const response = await fetch(`${URL}/billboards/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Ошибка при добавлении билборда');
    }

    alert('Билборд успешно добавлен!');
    return 200;

  } catch (error) {
    console.error('Ошибка:', error.message);
    alert('Ошибка при добавлении билборда: ' + error.message);
  }
};

// ---------- Запрос на удаление билборда ----------

export const deleteBillboard = async (id) => {
    try {
        const response = await fetch(`${URL}/billboards/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Ошибка при удалении билборда');
        }

        const result = await response.json();
        return result; 
    } catch (error) {
        console.error('Ошибка:', error.message);
        alert('Ошибка при удалении билборда: ' + error.message);
    }
};

// ---------- Запрос на изменение билборда ----------

export const updateBillboard = async (data, id) => {
  try {

    const response = await fetch(`${URL}/billboards/edit/${id}`, {
      method: 'PUT', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Ошибка при обновлении данных');
    }

    alert('Данные успешно обновлены!');
    return 200;

  } catch (error) {
    console.error('Ошибка:', error.message);
    alert('Ошибка при обновлении данных: ' + error.message);
  }
};


// ---------- Запрос на добавление заявки на рекламу ----------

export const addAds = async (data) => {
  try {

    const response = await fetch(`${URL}/ads/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Ошибка при добавлении заявки на рекламу');
    }

    alert('Заявка на рекламу успешно добавлена!');
    return 200;

  } catch (error) {
    console.error('Ошибка:', error.message);
    alert('Ошибка при добавлении заявки на рекламу: ' + error.message);
  }
};

// ---------- Запрос на удаление заявки на рекламу ----------

export const deleteAds = async (id) => {
  try {
      const response = await fetch(`${URL}/ads/delete/${id}`, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
          },
      });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Ошибка при удалении заявки на рекламу');
      }

      const result = await response.json();
      return result; 
  } catch (error) {
      console.error('Ошибка:', error.message);
      alert('Ошибка при удалении заявки на рекламу: ' + error.message);
  }
};

// ---------- Запрос на перенаправление заявки на рекламу ----------

export const moveAds = async (id, data) => {
  try {

    const response = await fetch(`${URL}/ads/move/${id}`, {
      method: 'PUT', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Ошибка при перенаправлении заявки на рекламу');
    }

    alert('Заявка на рекламу успешно перенаправлена!');
    return 200;

  } catch (error) {
    console.error('Ошибка:', error.message);
    alert('Ошшибка при перенаправлении заявки на рекламу: ' + error.message);
  }
};