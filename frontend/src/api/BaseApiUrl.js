const AI_SERVICE_URL = import.meta.env.VITE_AI_SERVICE_URL
const AUTH_SERVICE_URL = import.meta.env.VITE_AUTH_SERVICE_URL
const NOTIFICATION_SERVICE_URL = import.meta.env.VITE_NOTIFICATION_SERVICE_URL
const CERTIFICATE_SERVICE_URL = import.meta.env.VITE_CERTIFICATE_SERVICE_URL

// Debugging purpose
// console.log('Base API URL:', BaseUrl)
console.log('AI Service URL:', AI_SERVICE_URL)
console.log('Auth Service URL:', AUTH_SERVICE_URL)
console.log('Notification Service URL:', NOTIFICATION_SERVICE_URL)
console.log('Certificate Service URL:', CERTIFICATE_SERVICE_URL)

export {
    AI_SERVICE_URL,
    AUTH_SERVICE_URL,
    NOTIFICATION_SERVICE_URL,
    CERTIFICATE_SERVICE_URL
}