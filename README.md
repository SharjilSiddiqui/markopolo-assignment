Mini Image Gallery – Assignment Documentation
- How to Run the Backend

Go to backend folder:

 cd mini-image-gallery-backend


Install dependencies:

 npm install


Start the backend:

 npm run dev


Backend will run at:

http://localhost:4000

- How to Run the Frontend

Go to frontend folder:

 cd mini-image-gallery


Install dependencies:

  npm install


Start the frontend:

  npm run dev


Frontend will run at:

http://localhost:5173

- Notes on Design Choices

--Frontend

Implemented a clean UI using a single upload box and a gallery grid.

Added drag-and-drop upload, file validation, and a progress bar.

Used a responsive grid layout for displaying uploaded images.

Gallery auto-refreshes after each upload or delete.

-- Backend

Used Express server with in-memory storage (as required).

Processed image uploads using multer.

Generated thumbnails using Sharp.

Implemented routes for upload, list, thumbnail retrieval, and delete.

Added basic validation for file type and file size.
