export const environment = {
    production: true,
    api_url: window['env']?.API_URL || 'https://apptest.unicauca.edu.co:4413/api/',

    firebaseConfig: {
        apiKey: window['env']?.FIREBASE_API_KEY || '',
        authDomain: window['env']?.FIREBASE_AUTH_DOMAIN || '',
        projectId: window['env']?.FIREBASE_PROJECT_ID || '',
        storageBucket: window['env']?.FIREBASE_STORAGE_BUCKET || '',
        messagingSenderId: window['env']?.FIREBASE_MESSAGING_SENDER_ID || '',
        appId: window['env']?.FIREBASE_APP_ID || '',
    },
};

export const gestion_solicitudes = {
    production: true,
    api_url: window['env']?.GESTION_SOLICITUDES_API_URL || 'https://apptest.unicauca.edu.co:4412/msmaestriac',
};

export const gestion_autenticacion = {
    production: true,
    api_url: window['env']?.GESTION_AUTENTICACION_API_URL || 'https://apptest.unicauca.edu.co:4410/api/auth/google',
};

export const gestion_expertos = {
    production: true,
    api_url: window['env']?.GESTION_EXPERTOS_API_URL || 'https://apptest.unicauca.edu.co:4414/api/',
};

export const gestion_egresados = {
    production: true,
    api_url: window['env']?.GESTION_EGRESADOS_API_URL || 'https://apptest.unicauca.edu.co:4417/api/',
};

export const gestion_trabajo_grado = {
    production: true,
    api_url: window['env']?.GESTION_TRABAJO_GRADO_API_URL || 'https://apptest.unicauca.edu.co:4419/api/',
};

export const gestion_docentes_estudiantes = {
    production: true,
    api_url: window['env']?.GESTION_DOCENTES_ESTUDIANTES_API_URL || 'https://apptest.unicauca.edu.co:4414/api/',
};

export const matricula_academica = {
    production: true,
    api_url: window['env']?.MATRICULA_ACADEMICA_API_URL || 'http://localhost:8087/api/',
};

export const evaluacion_docente = {
    production: true,
    api_url: window['env']?.EVALUACION_DOCENTE_API_URL || 'https://apptest.unicauca.edu.co:4420/api/',
};

export const gestion_matricula_financiera = {
    production: true,
    api_url: window['env']?.GESTION_MATRICULA_FINANCIERA_API_URL || 'https://apptest.unicauca.edu.co:4421/api/v1/gestion-matricula-financiera/',
};

export const gestion_informacion_presupuestaria = {
    production: true,
    api_url: window['env']?.GESTION_INFORMACION_PRESUPUESTARIA_API_URL || 'https://apptest.unicauca.edu.co:4422/api/',
};
