# Mini Image Gallery – Full Stack Assignment

This project is a simple full-stack application where users can upload one image at a time, view uploaded images instantly in a gallery grid, and delete them.  
Images are stored in backend memory only (as required in the assignment).

---

## 🚀 How to Run the Backend

### 1. Go to backend folder
```bash
cd backend
2. Install dependencies
bash
Copy code
npm install
3. Start the backend
bash
Copy code
npm run dev
Backend will run at:

arduino
Copy code
http://localhost:4000
API Endpoints
Method	Endpoint	Description
POST	/upload	Upload one image (JPEG/PNG, max 3MB)
GET	/images	Get list of uploaded images
GET	/images/:id/thumbnail	Get generated thumbnail
DELETE	/images/:id	Delete image

💻 How to Run the Frontend
1. Go to frontend folder
bash
Copy code
cd frontend
2. Install dependencies
bash
Copy code
npm install
3. Start the frontend
bash
Copy code
npm run dev
Frontend runs at:

arduino
Copy code
http://localhost:5173
📝 Notes on Design Choices
1. Memory Storage (as required)
Images are stored in backend memory using an array of:

id

filename

mime type

binary buffer data

Thumbnail images are generated using sharp for faster loading.

2. Simple & Clean UI
The frontend uses a simple grid layout and clean components:

Upload zone

Progress bar

Responsive gallery

Delete button on each image

The design focuses on clarity and working functionality as instructed in the PDF.

3. Validation on Both Ends
Checked file type (JPEG/PNG)

Checked file size (≤ 3 MB)

Frontend + backend validation for safety

4. Immediate Gallery Refresh
After upload/delete, the frontend listens for a custom event (galleryUpdate) to refresh the gallery instantly without a full reload.

5. Single Image Upload
Only one file is handled at a time (as per requirement).
