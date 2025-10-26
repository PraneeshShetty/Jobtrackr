# JobTrackr - Job Application Tracking Board

A modern, interactive job application tracking web app built with React and Tailwind CSS. Track your job applications using a beautiful Kanban board interface with drag-and-drop functionality.

![JobTrackr Screenshot](https://img.shields.io/badge/React-19.2.0-blue) ![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.x-38bdf8)

## ✨ Features

- **📋 Kanban Board Interface**: Organize job applications across different stages (Applied, Interviewing, Offer, Rejected)
- **🎯 Drag and Drop**: Easily move job cards between columns using react-beautiful-dnd
- **📝 Job Details Modal**: Click on any job card to view complete details including company name, role, URL, and notes
- **🎨 Clean, Professional UI**: Built with Tailwind CSS for a modern, responsive design
- **📱 Fully Responsive**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

- **React** (v19) - Frontend framework with functional components and Hooks
- **Tailwind CSS** (v3) - Utility-first CSS framework for styling
- **react-beautiful-dnd** - Drag-and-drop library for the Kanban board
- **Create React App** - Project bootstrapping and build configuration

## 🚀 Getting Started

### Installation

1. Navigate to the project directory:
   ```bash
   cd jobtrackr
   ```

2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
   *Note: The `--legacy-peer-deps` flag is needed due to React 19 compatibility with react-beautiful-dnd*

### Running the App

Start the development server:
Start the development server:

```bash
npm start
```

The app will open automatically in your browser at [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── App.js              # Main application component with header
├── Board.js            # Kanban board with drag-and-drop logic
├── Column.js           # Individual column component (droppable)
├── JobCard.js          # Draggable job card component
├── JobDetailModal.js   # Modal for viewing full job details
├── data.js             # Initial board state and sample data
├── index.js            # Application entry point
└── index.css           # Tailwind CSS imports
```

## 🎮 How to Use

1. **View Jobs**: The board displays job applications organized into four columns
2. **Move Jobs**: Click and drag any job card to move it between columns
3. **View Details**: Click on a job card to see complete information in a modal
4. **Close Modal**: Click the X button or outside the modal to close it

## 🎨 Customization

### Adding New Columns

Edit `src/data.js` to add new column sections:

```javascript
'column-5': {
  id: 'column-5',
  title: 'Your New Column',
  tasks: []
}
```

### Adding New Jobs

Add jobs to the appropriate column in `src/data.js`:

```javascript
{
  id: 'task-8',
  company: 'Company Name',
  role: 'Position Title',
  url: 'https://example.com/job-posting',
  notes: 'Your notes here'
}
```

### Color Scheme

The app uses a professional color palette defined with Tailwind CSS utilities:
- Background: `bg-gray-100`
- Columns: `bg-gray-200`
- Cards: `bg-white` with `hover:shadow-lg`
- Primary Accent: `bg-blue-600`
- Text: `text-gray-900` (primary) and `text-gray-600` (secondary)

## 📜 Available Scripts

### `npm start`

Runs the app in development mode.

Runs the app in development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

## 🔮 Future Enhancements

- [ ] Add ability to create new job applications
- [ ] Edit existing job applications inline
- [ ] Delete job applications
- [ ] Persist data to localStorage or a backend API
- [ ] Add filtering and search functionality
- [ ] Export data to CSV/PDF
- [ ] Add application deadlines and reminders
- [ ] Statistics and analytics dashboard
- [ ] Dark mode toggle

## 📝 Component Details

### App.js
Main application shell with a blue header displaying "JobTrackr" and the main board component.

### Board.js
The core component managing:
- Board state (initialized from data.js)
- Modal state for job details
- Drag-and-drop logic for moving cards between columns
- DragDropContext wrapper

### Column.js
Represents a droppable column with:
- Column title
- Droppable area for job cards
- Visual feedback when dragging over

### JobCard.js
Individual draggable job card showing:
- Company name (bold)
- Role title
- Hover effects for better UX

### JobDetailModal.js
Full-screen modal overlay displaying:
- Complete job information
- Link to job posting
- Personal notes
- Close button

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## 📄 License

This project is open source and available under the MIT License.

---

Built with ❤️ using React and Tailwind CSS

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
