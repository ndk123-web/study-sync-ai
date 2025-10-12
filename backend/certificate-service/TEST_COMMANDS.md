# Certificate Service Test Commands

## 1. Generate Certificate and Upload to Cloudinary
```bash
curl "http://localhost:5001/generate-certificate?name=Nikhil%20Kamble&course=React%20Fundamentals"
```

## 2. List All Certificates
```bash
curl "http://localhost:5001/list-certificates"
```

## 3. Get Specific Certificate
```bash
curl "http://localhost:5001/get-certificate/certificates/Nikhil_Kamble_React_Fundamentals_1234567890"
```

## 4. Delete Certificate
```bash
curl -X DELETE "http://localhost:5001/delete-certificate/certificates/Nikhil_Kamble_React_Fundamentals_1234567890"
```

## Expected Response Format

### Generate Certificate Response:
```json
{
  "success": true,
  "message": "Certificate generated and uploaded successfully",
  "certificateUrl": "https://res.cloudinary.com/dmijbupsf/raw/upload/v1729123456/study-sync-certificates/certificates/Nikhil_Kamble_React_Fundamentals_1729123456.pdf",
  "publicId": "study-sync-certificates/certificates/Nikhil_Kamble_React_Fundamentals_1729123456",
  "courseName": "React Fundamentals",
  "studentName": "Nikhil Kamble",
  "issueDate": "10/12/2024",
  "fileName": "Nikhil_Kamble_React_Fundamentals_certificate.pdf"
}
```

### List Certificates Response:
```json
{
  "success": true,
  "count": 3,
  "certificates": [
    {
      "publicId": "study-sync-certificates/certificates/Nikhil_Kamble_React_Fundamentals_1729123456",
      "url": "https://res.cloudinary.com/dmijbupsf/raw/upload/v1729123456/study-sync-certificates/certificates/Nikhil_Kamble_React_Fundamentals_1729123456.pdf",
      "fileName": "Nikhil_Kamble_React_Fundamentals_certificate.pdf",
      "uploadedAt": "2024-10-12T12:34:56.000Z",
      "fileSize": 45678
    }
  ]
}
```

## Test with Browser:
1. Open: http://localhost:5001/generate-certificate?name=Test%20Student&course=JavaScript%20ES6
2. Open: http://localhost:5001/list-certificates

## Integration with Frontend:
```javascript
// Generate certificate
const response = await fetch('http://localhost:5001/generate-certificate?name=John&course=React');
const certificateData = await response.json();
console.log('Certificate URL:', certificateData.certificateUrl);

// List all certificates
const listResponse = await fetch('http://localhost:5001/list-certificates');
const certificates = await listResponse.json();
console.log('All certificates:', certificates.certificates);
```