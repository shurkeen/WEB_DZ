const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

// Создаем приложение Express
const app = express();
const port = 5000; 

app.use(cors());
app.use(express.json()); 

// Подключение к базе данных
const db = mysql.createConnection({
    host: 'localhost',       // Хост базы данных
    user: 'root',            // Имя пользователя базы данных
    password: 'root',    // Пароль пользователя базы данных
    database: 'billboards' // Название базы данных
});

db.connect((err) => {
    if (err) {
        console.error('Ошибка подключения к базе данных:', err);
        return;
    }
    console.log('Подключение к базе данных успешно!');
});

// Маршрут для проверки работы сервера
app.get('/', (req, res) => {
    res.send('Сервер работает!');
});

// Получение всех билбордов
app.get('/billboards', (req, res) => {
    const sql = `
        SELECT 
            b.billboard_id,
            b.location,
            b.billboard_code,
            ar.request_id,
            ar.company_name,
            ar.start_date,
            ar.end_date
        FROM Billboards b
        LEFT JOIN Ads_Requests ar ON b.billboard_id = ar.billboard_id
        ORDER BY b.billboard_id, ar.start_date;
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Ошибка при выполнении запроса:', err);
            return res.status(500).json({ error: 'Ошибка при получении данных', details: err });
        }

        const billboards = {};

        results.forEach(row => {
            const { billboard_id, location, billboard_code, request_id, company_name, start_date, end_date } = row;

            // Если билборд еще не создан в объекте, создаем его
            if (!billboards[billboard_id]) {
                billboards[billboard_id] = {
                    billboard_id,
                    location,
                    billboard_code,
                    ads_requests: []
                };
            }

            // Если есть заявки на аренду, добавляем их
            if (request_id) {
                billboards[billboard_id].ads_requests.push({
                    request_id,
                    company_name,
                    start_date,
                    end_date
                });
            }
        });

        // Преобразуем объект в массив и сортируем заявки для каждого билборда
        const response = Object.values(billboards).map(billboard => {
            // Сортируем заявки на аренду по дате начала и, если нужно, по дате окончания
            billboard.ads_requests.sort((a, b) => {
                const startA = new Date(a.start_date);
                const startB = new Date(b.start_date);

                if (startA < startB) return -1;
                if (startA > startB) return 1;

                // Если даты начала одинаковы, сравниваем по дате окончания
                const endA = new Date(a.end_date);
                const endB = new Date(b.end_date);

                return endA - endB; // сортировка по дате окончания, если даты начала совпадают
            });

            return billboard;
        });

        res.json(response);
    });
});

// Добавление билборда
app.post('/billboards/add', (req, res) => {
    const { location, billboard_code } = req.body;

    const sql = `
        INSERT INTO Billboards (location, billboard_code) 
        VALUES (?, ?);
    `;

    db.query(sql, [location, billboard_code], (err, result) => {
        if (err) {
            console.error('Ошибка при добавлении биллборда:', err);
            return res.status(500).json({ error: 'Ошибка при добавлении биллборда', details: err });
        }

        res.status(201).json({ message: 'Биллборд успешно добавлен', billboard_id: result.insertId });
    });
});

// Изменение билборда
app.put('/billboards/edit/:billboard_id', (req, res) => {
    const { billboard_id } = req.params;
    const { location, billboard_code } = req.body;


    const sql = `
        UPDATE Billboards 
        SET location = ?, billboard_code = ?
        WHERE billboard_id = ?;
    `;

    db.query(sql, [location, billboard_code, billboard_id], (err, result) => {
        if (err) {
            console.error('Ошибка при изменении биллборда:', err);
            return res.status(500).json({ error: 'Ошибка при изменении биллборда', details: err });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Биллборд не найден' });
        }

        res.json({ message: 'Биллборд успешно обновлен' });
    });
});

// Удаление билборда
app.delete('/billboards/delete/:billboard_id', (req, res) => {
    const { billboard_id } = req.params;

    const sql = `
        DELETE FROM Billboards 
        WHERE billboard_id = ?;
    `;

    db.query(sql, [billboard_id], (err, result) => {
        if (err) {
            console.error('Ошибка при удалении биллборда:', err);
            return res.status(500).json({ error: 'Ошибка при удалении биллборда', details: err });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Биллборд не найден' });
        }

        res.json({ message: 'Биллборд успешно удален' });
    });
});

// Добавление новой зявки на рекламу
app.post('/ads/add', (req, res) => {
    const { billboard_id, company_name, start_date, end_date } = req.body;

    const insertSql = `
        INSERT INTO Ads_Requests (company_name, start_date, end_date, billboard_id)
        VALUES (?, ?, ?, ?);
    `;

    db.query(insertSql, [company_name, start_date, end_date, billboard_id], (err, result) => {
        if (err) {
            console.error('Ошибка при добавлении заявки:', err);
            return res.status(500).json({ error: 'Ошибка при добавлении заявки', details: err });
        }

        res.json({ message: 'Заявка успешно добавлена', request_id: result.insertId });
    });
});

// Удаление зявки на рекламу
app.delete('/ads/delete/:request_id', (req, res) => {
    const { request_id } = req.params;

    const deleteSql = `
        DELETE FROM Ads_Requests 
        WHERE request_id = ?;
    `;

    db.query(deleteSql, [request_id], (err, result) => {
        if (err) {
            console.error('Ошибка при удалении заявки:', err);
            return res.status(500).json({ error: 'Ошибка при удалении заявки', details: err });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Заявка не найдена' });
        }

        res.json({ message: 'Заявка успешно удалена' });
    });
});

// Перенаправления зяавки на другой билборд
app.put('/ads/move/:request_id', (req, res) => {
    const { request_id } = req.params;
    const { new_billboard_id } = req.body;

    const updateSql = `
        UPDATE Ads_Requests 
        SET billboard_id = ? 
        WHERE request_id = ?;
    `;

    db.query(updateSql, [new_billboard_id, request_id], (err, result) => {
        if (err) {
            console.error('Ошибка при перемещении заявки:', err);
            return res.status(500).json({ error: 'Ошибка при перемещении заявки', details: err });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Заявка не найдена' });
        }

        res.json({ message: 'Заявка успешно перемещена на другой биллборд' });
    });
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});