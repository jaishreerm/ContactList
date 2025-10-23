# Contact List Application

A modern contact list application built with React, TypeScript, and Tailwind CSS. This project demonstrates best practices in frontend development, component design, and user experience.

## Features

- 👥 View a list of contacts with name, email, and phone number
- 🔍 Real-time search functionality with a clean, responsive UI
- ➕ Add new contacts through a modal dialog with form validation
- 🎨 Modern and responsive design with smooth animations
- 🖼️ Automatic avatar generation based on contact names
- 📱 Mobile-friendly and accessible interface

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS for utility-first styling
- **UI Components**: Headless UI for accessible components
- **Icons**: Heroicons for consistent design
- **Build Tool**: Vite for fast development and optimized builds
- **Type Safety**: TypeScript for better developer experience
- **Animations**: CSS transitions and Headless UI's Transition component

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd contact-list-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

Visit `http://localhost:5173` to view the application.

## Project Structure

```
src/
  ├── components/          # React components
  │   ├── AddContactModal # Modal for adding new contacts
  │   ├── ContactList     # List view of contacts
  │   └── SearchBar      # Search input component
  ├── types/             # TypeScript type definitions
  ├── App.tsx           # Main application component
  └── index.css        # Global styles and Tailwind imports
```

## Design Choices

- **UI/UX Decisions**:
  - Clean, minimalist design focusing on readability
  - Responsive grid layout adapting to different screen sizes
  - Smooth animations for better user feedback
  - Accessible components using Headless UI
  - Clear visual hierarchy and consistent spacing

- **Component Architecture**:
  - Modular components for better maintainability
  - TypeScript interfaces for type safety
  - Controlled components for form handling
  - Consistent prop naming conventions

- **Performance Considerations**:
  - Optimized re-renders using proper React patterns
  - Lazy loading for modal component
  - Debounced search functionality
  - Efficient CSS with Tailwind's JIT compiler

## Deployment

The application can be deployed to Vercel with the following steps:

1. Push your code to a GitHub repository
2. Visit [Vercel](https://vercel.com) and sign in with GitHub
3. Import your repository
4. Configure build settings if needed (usually automatic)
5. Deploy!

## Future Enhancements

- [ ] Persist contacts in local storage
- [ ] Add contact editing and deletion
- [ ] Implement contact categories/groups
- [ ] Add sorting and filtering options
- [ ] Add dark mode support
- [ ] Implement data synchronization
- [ ] Add contact details page
- [ ] Add import/export functionality

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
