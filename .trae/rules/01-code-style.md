# Code Style Rules

## Indentation
- Tab: 4 spaces
- Max line: 120 chars
- Line ending: LF
- File end: newline

## Formatting
- Strings: single quotes
- No semicolons
- Object braces: spaces inside

## Naming
| Type | Convention | Example |
|------|------------|---------|
| Vue | PascalCase | `DashboardPage.vue` |
| CSS | kebab-case | `dashboard-page.css` |
| JS | camelCase | `dashboardDataLoader.js` |
| API | +Api | `AttendanceApi.js` |
| Config | +Config | `Config.js` |
| Utils | +Utils | `Utils.js` |

## Structure
```
src/
├── api/          # API files
├── assets/       # Static assets
├── components/   # Common components
├── composables/  # Vue composables
├── config/       # Config files
├── router/       # Router config
├── stores/       # Pinia stores
└── views/        # Page components
    └── [PageName]/
        ├── *.vue         # Main entry
        ├── *Desktop.vue  # Desktop page
        ├── *Mobile.vue   # Mobile page
        ├── forms/        # Form components
        ├── css/          # Styles
        ├── js/           # Logic scripts
        └── ts/           # TypeScript scripts
```
