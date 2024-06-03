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
    const url = 'http://localhost:8080/archivo/ver-contenido/data';

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

const update = (cuerpo) => {
    sessionStorage.removeItem('tempData');
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch("http://localhost:8080/" + cuerpo.endpoint, {
                method: cuerpo.method,
                headers: cuerpo.headers,
                body: JSON.stringify(cuerpo.body)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error: ${response.status} - ${errorText}`);
            }

            // Verificar el tipo de contenido de la respuesta
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                // Si la respuesta es JSON, leemos el cuerpo como JSON
                const data = await response.json();
                resolve(data);
            } else {
                // Si no es JSON, leemos la respuesta como texto sin formato
                const text = await response.text();
                resolve(text);
            }
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};

const updateFormData = (endpoint, formData) => {
    sessionStorage.removeItem('tempData');

    fetch(`http://localhost:8080/${endpoint}`, {
        method: "POST",
        body: formData
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Error en la respuesta del servidor');
        }).then(data => {
            console.log('Respuesta del servidor:', data);
        }).catch(error => {
            console.error('Error al enviar los datos:', error);
        });
}

export { getData, login, update, updateFormData }