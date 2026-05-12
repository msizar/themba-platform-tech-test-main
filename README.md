# TalentDesk Platform Tech Test

## Setup

```
cp .env.example .env
npm i
npm run start-backend
npm run start-frontend
```

## Running Tests

```
npm test              # Runs all tests
npm run test:backend  # Runs backend tests only
npm run test:frontend # Runs frontend tests only
```

## Linting

```
npm run lint  # Run ESLint
npm run lint:fix  # Auto-fix lint issues
```

## Completed Assignment

### 1. Styling
- Implemented modern, minimal design inspired by Dribbble and Awwwards
- Used Tailwind CSS v4 with Vite integration
- Clean, typographic design with underline inputs
- Responsive layout centered on screen
- Success state with proper visual feedback

### 2. File Upload with Drag & Drop
- FileInput component supports drag-and-drop file selection
- Files stored in `backend/uploads/` directory with timestamp-based names
- File path returned to frontend and displayed to user
- File size display and proper file handling
- Maximum file size: 10MB

### 3. Form Validation
**Frontend Validation:**
- Real-time validation with error messages below each field
- Name: 2-100 characters required
- Message: 10-1000 characters required
- File: Required, must be under 10MB
- Error states with red borders and text
- Errors clear when user starts typing

**Backend Validation:**
- Server-side validation of all fields
- Returns validation errors in structured format
- File name validation (alphanumeric, dots, hyphens, spaces only)
- Prevents invalid submissions at API level

### 4. Linting (AirBnB Style)
- ESLint configured with AirBnB-inspired rules
- AirBnB config with project-specific overrides where needed
- 2-space indentation, single quotes, semicolons required
- React-specific rules enabled

### 5. Testing
**Backend Tests:**
- Unit tests for validation function using Node's built-in `test` module
- 6 test cases covering valid/invalid submissions

**Frontend Tests:**
- Component tests using Vitest and React Testing Library
- Tests for form rendering, validation, and error handling
- Setup with proper JSX/React support

## Libraries & Choices

### Frontend
- **Tailwind CSS v4**: Utility-first CSS with minimal config, modern design
- **@tailwindcss/vite**: Direct Vite integration for CSS processing
- **Vitest**: Fast unit testing with great React support
- **@testing-library/react**: Best practices for component testing

### Backend
- **Express 5**: Latest Express with improved async support
- **Node.js built-in test module**: No external dependencies for basic testing
- **dotenv**: Environment variable management
- **fs & path**: Built-in Node modules for file handling

## Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── index.js          # Main server with validation
│   │   └── index.test.js     # Backend tests
│   └── uploads/              # File storage directory
├── frontend/
│   ├── src/
│   │   ├── App.jsx           # Main form component
│   │   ├── App.test.jsx      # Frontend tests
│   │   ├── Components/
│   │   │   └── FileInput.jsx # File upload component
│   │   ├── main.jsx          # React entry point
│   │   └── index.css         # Global styles
│   ├── index.html            # HTML entry point
│   ├── vite.config.js        # Vite configuration
│   ├── vitest.config.js      # Vitest configuration
│   └── tailwind.config.js    # Tailwind configuration
├── .eslintrc.json            # ESLint configuration
├── .claude/
│   └── commands/
│       └── lint-fix.md       # AI agent lint + auto-fix method
└── package.json              # Dependencies and scripts
```

## Bonus

Added an AI agent method to run linting and auto-fix issues:

- Claude command file: `.claude/commands/lint-fix.md`
- Uses the script: `npm run lint:fix`

Suggested Claude Code usage:

1. Open command palette in Claude Code.
2. Run the custom command from `.claude/commands/lint-fix.md`.
3. The command executes lint, applies fixes, re-validates, and reports remaining issues.
