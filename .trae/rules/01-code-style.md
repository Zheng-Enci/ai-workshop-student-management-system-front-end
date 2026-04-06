# Code Style Rules

## Indentation and Formatting

- Use Tab for indentation, with 4 spaces per level
- Maximum line width: 120 characters
- Line ending: LF (Unix)
- File must end with a newline
- Use single quotes for strings
- No semicolons at the end of statements
- Spaces on both sides inside object curly braces

## File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Vue Component | PascalCase | `DashboardPage.vue` |
| CSS/SCSS | kebab-case | `dashboard-page.css` |
| JavaScript | camelCase | `dashboardDataLoader.js` |
| API File | Function+Api | `AttendanceApi.js` |
| Config File | Config suffix | `Config.js` |
| Utility File | Utils suffix | `Utils.js` |
| Type File | TypeScript types | `types/index.ts` |

## Directory Structure

```
src/
├── api/
│   ├── ts/
│   └── *.js
├── assets/
│   └── styles/
├── components/
├── composables/
│   └── admin/
├── config/
├── router/
├── stores/
└── views/
    └── [PageName]/
        ├── *.vue
        ├── *Desktop.vue
        ├── *Mobile.vue
        ├── forms/
        │   ├── desktop/
        │   └── mobile/
        ├── css/
        │   ├── desktop/
        │   └── mobile/
        ├── js/
        └── ts/
```
