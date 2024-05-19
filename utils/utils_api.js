const readData = (url) => {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudo cargar el archivo JSON');
                }
                return response.json();
            })
            .then(data => {
                resolve(data);
            })
            .catch(error => {
                reject(error);
            });
    });
}

const getData = () => {
    // const url = 'https://raw.githubusercontent.com/JSGPDev/AEC/main/temp.json';
    const url = '/temp.json';

    const getFromSessionStorage = () => {
        const storedData = sessionStorage.getItem('tempData');
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            return parsedData;
        }
        return null;
    };

    return new Promise((resolve, reject) => {
        const sessionData = getFromSessionStorage();
        if (sessionData) {
            resolve(sessionData);
        } else {
            readData(url)
                .then(data => {
                    const newData = { error: false, data };
                    console.log('Datos cargados:', data);
                    sessionStorage.setItem('tempData', JSON.stringify(newData));
                    resolve(newData);
                })
                .catch(error => {
                    const newData = { error: true, message: 'Error al cargar el archivo JSON: ' + error };
                    console.error('Error al cargar el archivo JSON:', error);
                    reject(newData);
                });
        }
    });
};

const login = (form) => {
    return new Promise(async (resolve, reject) => {
        try {
            const formData = new FormData(form);
            const user = formData.get('user');
            const password = formData.get('password');

            const response = await fetch("http://localhost:8080/session/log-in", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ user, password })
            });

            resolve(response);

        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};

export { getData, login }